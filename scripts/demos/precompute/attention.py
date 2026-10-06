"""Precompute real attention weights for the AttentionDemo.

Baustein: transformerbloecke-und-attention (EN transformer-blocks-and-attention).
Runs the example sentences of the text through Qwen/Qwen3-0.6B-Base with the
eager attention implementation and output_attentions=True, and stores the
softmax weights of every layer and every query head (28 x 16) for every
token pair the causal mask allows.

Run from packages/website:
    HF_HUB_OFFLINE=1 uv run --with torch --with transformers \
        python scripts/demos/precompute/attention.py

Writes src/scripts/demos/data/attention-de.json and attention-en.json (one
file per language, so a page only loads its own sentences).

Storage: each weight row (one query position, all visible key positions) is
quantised to integers 0..255 that sum to exactly 255 (largest-remainder
rounding), so every stored row still adds up to 100 %. The bytes are laid out
[layer][head][query row][key col <= row] and base64 encoded. Weights above
the diagonal are not stored; the model gives them exactly 0 (checked below).
"""

import base64
import json
import sys
from pathlib import Path

import torch
from huggingface_hub import snapshot_download
from transformers import AutoModelForCausalLM, AutoTokenizer

MODEL_ID = "Qwen/Qwen3-0.6B-Base"
QUANT = 255

# Qwen3 adds no beginning-of-text token, and in pretraining documents are
# separated by <|endoftext|>. Each sentence therefore starts after that real
# token, the way a fresh text starts for the model. It carries no meaning
# and collects much of the weight (attention sink, section 6 of the text);
# the demo shows it as "text start" instead of filtering it out. Without it,
# the sink lands on the first word ("Ich", "Anna"), which then looks
# meaningful when it is not.
PREFIX = "<|endoftext|>"

# Sentences from the text. `focus` is the token whose spotlight the demo
# opens with; `target` the word the "clearest head" button looks for (the
# head that puts the most weight from `focus` on all pieces of `target`).
SENTENCES = {
    "de": [
        {"id": "park", "text": "Ich sitze auf der Bank im Park", "focus": "Bank", "target": "sitze"},
        {"id": "geld", "text": "Ich zahle Geld bei der Bank ein", "focus": "Bank", "target": "Geld"},
        {"id": "park-first", "text": "Im Park sitze ich auf der Bank", "focus": "Bank", "target": "Park"},
        {"id": "anna", "text": "Anna rief Tom an, weil sie", "focus": "sie", "target": "Anna"},
    ],
    "en": [
        {"id": "park", "text": "I sit on the bank in the park", "focus": "bank", "target": "sit"},
        {"id": "geld", "text": "I pay money into the bank", "focus": "bank", "target": "money"},
        {"id": "park-first", "text": "In the park, I sit on the bank", "focus": "bank", "target": "park"},
        {"id": "anna", "text": "Anna called Tom because she", "focus": "she", "target": "Anna"},
    ],
}

OUT_DIR = Path(__file__).resolve().parents[3] / "src" / "scripts" / "demos" / "data"


def quantise(row):
    """Integers 0..QUANT proportional to `row` that sum to exactly QUANT."""
    total = float(sum(row))
    scaled = [v / total * QUANT for v in row]
    ints = [int(s) for s in scaled]
    rest = QUANT - sum(ints)
    order = sorted(range(len(row)), key=lambda i: scaled[i] - ints[i], reverse=True)
    for i in order[:rest]:
        ints[i] += 1
    return ints


def word_tokens(pieces, word):
    """Indices of the tokens that make up the first occurrence of `word`
    after the prefix."""
    text = ""
    spans = []
    for p in pieces:
        spans.append((len(text), len(text) + len(p)))
        text += p
    start = text.find(word, len(pieces[0]))
    if start < 0:
        raise ValueError(f"{word!r} not in {text!r}")
    end = start + len(word)
    return [i for i, (a, b) in enumerate(spans) if a < end and b > start]


def main():
    revision = Path(snapshot_download(MODEL_ID, local_files_only=True)).name
    tok = AutoTokenizer.from_pretrained(MODEL_ID, revision=revision)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_ID, revision=revision, attn_implementation="eager", dtype=torch.float32
    )
    model.eval()
    cfg = model.config
    layers, heads = cfg.num_hidden_layers, cfg.num_attention_heads

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for lang, sentences in SENTENCES.items():
        out = []
        for s in sentences:
            enc = tok(PREFIX + s["text"], return_tensors="pt")
            ids = enc["input_ids"][0].tolist()
            pieces = [tok.decode([i]) for i in ids]
            assert pieces[0] == PREFIX and "".join(pieces) == PREFIX + s["text"], pieces
            with torch.no_grad():
                res = model(**enc, output_attentions=True)
            att = torch.stack(res.attentions)[:, 0]  # layers, heads, q, k
            n = len(ids)
            assert att.shape == (layers, heads, n, n), att.shape
            upper = torch.triu(torch.ones(n, n, dtype=torch.bool), diagonal=1)
            assert float(att[:, :, upper].abs().max() if upper.any() else 0) == 0.0, "mask leak"
            data = bytearray()
            for l in range(layers):
                for h in range(heads):
                    for q in range(n):
                        data.extend(quantise(att[l, h, q, : q + 1].tolist()))
            focus = word_tokens(pieces, s["focus"])[-1]
            target = word_tokens(pieces, s["target"])
            share = att[:, :, focus, target].sum(-1)  # layers, heads
            best = int(share.argmax())
            best_layer, best_head = divmod(best, heads)
            out.append(
                {
                    "id": s["id"],
                    "text": s["text"],
                    "tokens": pieces,
                    "focus": focus,
                    "target": target,
                    "best": {"layer": best_layer, "head": best_head, "share": round(float(share.max()), 4)},
                    "weights": base64.b64encode(bytes(data)).decode("ascii"),
                }
            )
            print(
                lang, s["id"], n, pieces,
                f"best L{best_layer + 1} H{best_head + 1} {float(share.max()):.2f}",
                f"first-token mean {float(att[:, :, focus, 0].mean()):.2f}",
                file=sys.stderr,
            )
        doc = {
            "model": MODEL_ID,
            "revision": revision,
            "attnImplementation": "eager",
            "prefix": PREFIX,
            "layers": layers,
            "heads": heads,
            "kvHeads": cfg.num_key_value_heads,
            "quant": QUANT,
            "layout": "base64 uint8 [layer][head][query][key<=query], each row sums to quant",
            "sentences": out,
        }
        path = OUT_DIR / f"attention-{lang}.json"
        path.write_text(json.dumps(doc, ensure_ascii=False, separators=(",", ":")) + "\n")
        print(path, path.stat().st_size, "bytes", file=sys.stderr)


if __name__ == "__main__":
    main()
