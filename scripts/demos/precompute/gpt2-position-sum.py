"""Check the position-sum claim of the Baustein transformerbloecke-und-attention.

GPT-2 adds a position row (wpe) to every token row (wte) before the first
block. The text claims that the token can still be read from the sum: for
random pairs of token row and position row, the token row with the highest
cosine to the sum is almost always the right one. This script draws 3,000
random pairs (seed 0) and prints the share of hits.

Run from packages/website:
    HF_HUB_OFFLINE=1 uv run --with torch --with transformers \
        python scripts/demos/precompute/gpt2-position-sum.py
Prints the result; writes nothing.
"""

import torch
from transformers import GPT2Model

MODEL = "openai-community/gpt2"
REVISION = "607a30d783dfa663caf39e06633721c8d4cfcd7e"
PAIRS = 3_000
RANDOM_SEED = 0


def main() -> None:
    model = GPT2Model.from_pretrained(MODEL, revision=REVISION)
    wte = model.wte.weight.detach().float()
    wpe = model.wpe.weight.detach().float()
    gen = torch.Generator().manual_seed(RANDOM_SEED)
    tokens = torch.randint(0, wte.shape[0], (PAIRS,), generator=gen)
    positions = torch.randint(0, wpe.shape[0], (PAIRS,), generator=gen)
    sums = wte[tokens] + wpe[positions]
    unit_wte = torch.nn.functional.normalize(wte, dim=1)
    unit_sums = torch.nn.functional.normalize(sums, dim=1)
    best = (unit_sums @ unit_wte.T).argmax(dim=1)
    hits = (best == tokens).sum().item()
    print(f"{hits} of {PAIRS} sums ({100 * hits / PAIRS:.1f} %): the most similar token row is the right token")


if __name__ == "__main__":
    main()
