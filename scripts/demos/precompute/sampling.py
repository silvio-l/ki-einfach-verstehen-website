"""Precompute the real next-token scores for the SamplingDemo (Baustein output-head).

For each prompt, runs Qwen3-0.6B-Base once (CPU, bfloat16 -- the setup of the
documented experiment the first Baustein quotes, docs/content-plan/versuche/
was-ein-ki-modell-naechstes-token.md: Paris 47.5 %) and keeps the scores
(logits) of the last position. bfloat16 matters: in float32 the same model
gives Paris 48.8 %; tokenization (no BOS, no trailing space) is identical.
Softmax runs in float64 on the bfloat16 scores, as the demo does it:

- the 200 highest scores with their token text, rounded to 0.0001 (the demo
  shows the top 12 as bars; the others give a draw outside them a name);
- every other score of the 151,936-row board folded into a histogram
  (bins of 0.05), so the demo can compute the share of "all other tokens"
  at any temperature without shipping the full board. Each bin stands for
  its rows at one representative score, their log-mean-exp (exact at
  temperature 1, off by far less than 0.01 points at other temperatures),
  stored as an offset above the bin's lower edge in units of 0.00001.

Writes src/scripts/demos/data/sampling.json with model ID and revision.

Run from packages/website:
  HF_HUB_OFFLINE=1 uv run --with torch --with transformers python -I scripts/demos/precompute/sampling.py
"""
import json
import math
import pathlib
import platform

import torch
import transformers
from transformers import AutoModelForCausalLM, AutoTokenizer

MODEL = "Qwen/Qwen3-0.6B-Base"
TOP = 12  # rows the demo shows
KEEP = 200  # tokens kept by name, so a draw outside the top 12 can still show the real token
BIN = 0.05
OFFSET_UNIT = 0.00001

# Prompt keys are stable IDs (used by the demo and its tests). The first DE
# and EN entry is the Baustein's own example; the EN version quotes the same
# German prompt, so it is offered there too.
PROMPTS = [
    {"key": "paris-de", "text": "Die Hauptstadt von Frankreich ist", "lang": "de"},
    {"key": "hund-de", "text": "Der Hund jagt die", "lang": "de"},
    {"key": "paris-hauptstadt-de", "text": "Paris ist die Hauptstadt von", "lang": "de"},
    {"key": "katze-de", "text": "Die Katze sitzt auf dem", "lang": "de"},
    {"key": "capital-en", "text": "The capital of France is", "lang": "en"},
    {"key": "dog-en", "text": "The dog chased the", "lang": "en"},
    {"key": "cat-en", "text": "The cat sat on the", "lang": "en"},
]

OUT = pathlib.Path(__file__).resolve().parents[3] / "src/scripts/demos/data/sampling.json"


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
        "top": TOP,
        "keep": KEEP,
        "bin": BIN,
        "offsetUnit": OFFSET_UNIT,
        "prompts": [],
    }
    for p in PROMPTS:
        ids = tok(p["text"], return_tensors="pt").input_ids
        with torch.no_grad():
            logits = model(ids).logits[0, -1].double()
        out["vocab"] = int(logits.shape[0])
        probs = torch.softmax(logits, -1)
        order = torch.argsort(logits, descending=True, stable=True)  # bfloat16 scores tie often; ties keep token-ID order
        top = order[:KEEP]
        rest = logits[order[KEEP:]]
        # Histogram of the remaining scores: bin index = floor(score / BIN).
        idx = torch.floor(rest / BIN).long()
        lo = int(idx.min())
        n_bins = int(idx.max()) - lo + 1
        counts = torch.bincount(idx - lo, minlength=n_bins)
        edge = (torch.arange(n_bins, dtype=torch.float64) + lo) * BIN
        # Sum of e^(score - lower edge) per bin -> log-mean-exp offset in OFFSET_UNIT.
        sums = torch.zeros(n_bins, dtype=torch.float64).index_add_(0, idx - lo, torch.exp(rest - edge[idx - lo]))
        offsets = [round(math.log(float(sm) / int(c)) / OFFSET_UNIT) if int(c) > 0 else 0 for sm, c in zip(sums, counts)]
        counts = counts.tolist()
        out["prompts"].append(
            {
                **p,
                # [text, score, exact share in % over the whole board at temperature 1]
                "tokens": [[tok.decode([int(i)]), round(float(logits[i]), 4), round(float(probs[i]) * 100, 3)] for i in top],
                "restBins": {"start": lo, "counts": counts, "offsets": offsets},
                # Exact share of everything outside the top 12 at temperature 1 (for the tests).
                "otherP": round(float(probs[order[TOP:]].sum()) * 100, 3),
            }
        )
        shown = ", ".join(f"{t[0]!r} {t[1]} ({t[2]} %)" for t in out["prompts"][-1]["tokens"][:5])
        print(p["text"], "->", shown, "| outside top", TOP, out["prompts"][-1]["otherP"], "%")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print("wrote", OUT, OUT.stat().st_size, "bytes")


if __name__ == "__main__":
    main()
