"""Precompute the per-token loss of whole sentences for the SatzLossDemo (Baustein forward-pass-und-loss).

For each sentence, runs Qwen3-0.6B-Base (CPU, bfloat16, the setup of the
documented experiment behind "Paris" 47.5 %, see sampling.py) like one
training sequence: every position predicts the token that really follows it. The first token has no prediction (Qwen adds no
BOS token), so a sentence of n tokens gives n - 1 positions. Softmax runs in
float64 on the bfloat16 scores.

Per position the JSON keeps:
- the target token (the one that really follows) with its probability in %
  and its loss, the natural-log penalty -ln p (as PyTorch CrossEntropyLoss);
- the model's own favourite at that position with its probability, so the
  demo can show what the model expected instead.
Per sentence it keeps the mean loss over its positions (PyTorch's default
"mean" reduction).

DE sentences for the DE page, EN sentences for the EN page (user decision
2026-10-10, 5b). The first sentence of each language is the Baustein's own
example.

Writes src/scripts/demos/data/satzloss.json with model ID and revision.

Run from packages/website:
  HF_HUB_OFFLINE=1 uv run --with torch --with transformers python -I scripts/demos/precompute/satzloss.py
"""
import json
import math
import pathlib
import platform

import torch
import transformers
from transformers import AutoModelForCausalLM, AutoTokenizer

MODEL = "Qwen/Qwen3-0.6B-Base"

# Sentence keys are stable IDs (used by the demo and its tests).
SENTENCES = [
    {"key": "hund-de", "text": "Der Hund jagt die Katze", "lang": "de"},
    {"key": "paris-de", "text": "Die Hauptstadt von Frankreich ist Paris", "lang": "de"},
    {"key": "zuerich-de", "text": "Die Hauptstadt von Frankreich ist Zürich", "lang": "de"},
    {"key": "katze-de", "text": "Die Katze sitzt auf dem Sofa", "lang": "de"},
    {"key": "dog-en", "text": "The dog chases the cat", "lang": "en"},
    {"key": "paris-en", "text": "The capital of France is Paris", "lang": "en"},
    {"key": "zurich-en", "text": "The capital of France is Zurich", "lang": "en"},
    {"key": "cat-en", "text": "The cat sat on the sofa", "lang": "en"},
]

OUT = pathlib.Path(__file__).resolve().parents[3] / "src/scripts/demos/data/satzloss.json"


def revision_of(name):
    """Commit hash of the cached snapshot (works offline)."""
    from huggingface_hub import snapshot_download

    path = pathlib.Path(snapshot_download(name, local_files_only=True))
    return path.name


def main():
    rev = revision_of(MODEL)
    tok = AutoTokenizer.from_pretrained(MODEL, revision=rev)
    model = AutoModelForCausalLM.from_pretrained(MODEL, revision=rev, dtype=torch.bfloat16).eval()
    out = {
        "model": MODEL,
        "revision": rev,
        "setup": f"CPU, bfloat16, python {platform.python_version()}, torch {torch.__version__}, transformers {transformers.__version__}",
        "vocab": None,
        "sentences": [],
    }
    for s in SENTENCES:
        ids = tok(s["text"], return_tensors="pt").input_ids
        ids = ids[0].tolist()
        # One run per prefix, keeping its last position. With the causal mask
        # this is the same prediction as position i of one run over the whole
        # sentence; in bfloat16 the whole-sentence run drifts a little (Paris
        # 46.2 instead of 47.5 %), the prefix run reproduces the documented
        # 47.5 % the text quotes.
        rows = []
        for i in range(len(ids) - 1):
            with torch.no_grad():
                rows.append(model(torch.tensor([ids[: i + 1]])).logits[0, -1].double())
        logits = torch.stack(rows)
        out["vocab"] = int(logits.shape[-1])
        probs = torch.softmax(logits, -1)
        positions = []
        for i in range(len(ids) - 1):
            target = ids[i + 1]
            p = float(probs[i, target])
            best = int(torch.argmax(logits[i]))
            positions.append(
                {
                    "context": tok.decode(ids[: i + 1]),
                    "target": tok.decode([target]),
                    "p": round(p * 100, 3),
                    "loss": round(-math.log(p), 3),
                    "top": tok.decode([best]),
                    "topP": round(float(probs[i, best]) * 100, 3),
                }
            )
        mean = sum(-math.log(float(probs[i, ids[i + 1]])) for i in range(len(ids) - 1)) / (len(ids) - 1)
        out["sentences"].append(
            {**s, "first": tok.decode([ids[0]]), "positions": positions, "mean": round(mean, 3)}
        )
        row = " | ".join(f"{q['target']!r} {q['p']} % -> {q['loss']} (top {q['top']!r} {q['topP']} %)" for q in positions)
        print(s["text"], "->", row, "| mean", round(mean, 3))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print("wrote", OUT, OUT.stat().st_size, "bytes")


if __name__ == "__main__":
    main()
