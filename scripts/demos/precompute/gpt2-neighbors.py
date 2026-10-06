"""Precompute the data of the NeighborsDemo (Baustein embeddings).

For a fixed list of English words, look up their rows in GPT-2's input
embedding matrix (wte) and find the 8 nearest neighbors by cosine
similarity. Only whole-word tokens with a leading space (" apple", " Apple",
letters only) are allowed as candidates, the same filter the text's
neighbor lists were computed with. Also stored: the tokens whose IDs sit
directly next to each word's ID (with their cosine), the cosine of every
pair of listed words, and the random-pair baseline (20,000 random token
pairs, as in the text).

Run from packages/website:
    HF_HUB_OFFLINE=1 uv run --with torch --with transformers \
        python scripts/demos/precompute/gpt2-neighbors.py
Writes src/scripts/demos/data/gpt2-neighbors.json.
"""

import json
import re
from pathlib import Path

import torch
from transformers import GPT2Model, GPT2TokenizerFast

MODEL = "openai-community/gpt2"
REVISION = "607a30d783dfa663caf39e06633721c8d4cfcd7e"
K = 8
RANDOM_PAIRS = 20_000
RANDOM_SEED = 0

# The words of the demo, all single GPT-2 tokens with a leading space.
# The first ones are those the text uses (apple, Apple, pear, laptop, bank,
# king, queen, man, woman, dog); the rest give readers more to explore.
WORDS = [
    "apple", "Apple", "pear", "banana", "peach", "lemon", "fruit",
    "laptop", "computer", "phone", "iPhone", "Microsoft", "Google",
    "dog", "dogma", "cat", "horse", "bark",
    "bank", "river", "money",
    "king", "queen", "man", "woman", "doctor", "teacher",
    "eat", "drink", "run", "walk",
    "Paris", "Berlin", "London", "Germany", "France",
    "red", "blue", "green", "happy", "sad", "good", "bad", "big", "small",
    "car", "train", "house", "school",
    "water", "coffee", "bread", "cheese",
    "Monday", "January", "three", "music",
]

OUT = Path(__file__).resolve().parents[3] / "src/scripts/demos/data/gpt2-neighbors.json"


def shown(text: str) -> str:
    """Token text as the page shows it: the leading space as ␣."""
    return text.replace(" ", "␣")


def main() -> None:
    tok = GPT2TokenizerFast.from_pretrained(MODEL, revision=REVISION)
    model = GPT2Model.from_pretrained(MODEL, revision=REVISION)
    wte = model.wte.weight.detach().float()
    unit = torch.nn.functional.normalize(wte, dim=1)
    pieces = tok.convert_ids_to_tokens(list(range(wte.shape[0])))
    whole = torch.tensor([re.fullmatch(r"Ġ[A-Za-z]+", p) is not None for p in pieces])

    ids = []
    for w in WORDS:
        enc = tok.encode(" " + w)
        assert len(enc) == 1, f"' {w}' is not a single token: {enc}"
        ids.append(enc[0])

    words = []
    for w, i in zip(WORDS, ids):
        sims = unit @ unit[i]
        cand = sims.clone()
        cand[~whole] = -2.0
        cand[i] = -2.0
        top = cand.topk(K)
        nb = [[shown(tok.decode([j])), j, round(s, 3)] for s, j in zip(top.values.tolist(), top.indices.tolist())]
        idn = [[shown(tok.decode([j])), j, round(sims[j].item(), 3)] for j in (i - 1, i + 1)]
        words.append({"w": w, "id": i, "nb": nb, "idn": idn})

    # Cosine of every pair of listed words, upper triangle row by row.
    sub = unit[ids]
    full = (sub @ sub.T).tolist()
    pairs = [round(full[a][b], 3) for a in range(len(ids)) for b in range(a + 1, len(ids))]

    gen = torch.Generator().manual_seed(RANDOM_SEED)
    a = torch.randint(0, wte.shape[0], (RANDOM_PAIRS,), generator=gen)
    b = torch.randint(0, wte.shape[0], (RANDOM_PAIRS,), generator=gen)
    keep = a != b
    rand = (unit[a[keep]] * unit[b[keep]]).sum(dim=1)
    baseline = {
        "pairs": RANDOM_PAIRS,
        "seed": RANDOM_SEED,
        "mean": round(rand.mean().item(), 3),
        "p95": round(rand.quantile(0.95).item(), 3),
    }

    data = {
        "model": MODEL,
        "revision": REVISION,
        "matrix": "wte (input embeddings), 50257 x 768",
        "candidates": "whole-word tokens with a leading space, letters only",
        "candidateCount": int(whole.sum().item()),
        "k": K,
        "vocabSize": wte.shape[0],
        "baseline": baseline,
        "words": words,
        "pairs": pairs,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"wrote {OUT} ({OUT.stat().st_size} bytes), baseline {baseline}")


if __name__ == "__main__":
    main()
