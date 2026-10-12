"""Precompute the learning curves for the LernkurvenDemo (Baustein batch-epoch-step-tokenbudget).

A real, deliberately tiny training run: a character model (it predicts the
next character from the eight before it) learns from Franz Kafka's "Die
Verwandlung" (1915, public domain; Project Gutenberg eBook #22367,
https://www.gutenberg.org/cache/epub/22367/pg22367.txt). The last tenth of the
story is held back as the validation text and never trained on. Two runs
start from the same random weights and differ only in how much training text
they get:

- "klein": the first SMALL_CHARS characters of the story,
- "gross": the whole first nine tenths of the story.

Each run sees its text EPOCHS times. After every epoch the script measures
the average loss (cross-entropy, natural log, as in the text) on the training
text and on the validation text, with the weights of that moment. Epoch 0 is
the untrained model. Everything runs on the CPU with fixed seeds, so the
numbers are reproducible on the same torch version.

Writes src/scripts/demos/data/lernkurven.json.

Run from packages/website (the text file is passed in, its hash is checked):
  uv run --with torch==2.14.1 python -I scripts/demos/precompute/lernkurven.py <path/to/pg22367.txt>
"""
import hashlib
import json
import pathlib
import platform
import re
import sys

import torch
from torch import nn

SOURCE_URL = "https://www.gutenberg.org/cache/epub/22367/pg22367.txt"
SOURCE_SHA256 = "359d3f5983c812393f4bd7ee49a350ffffc7d476015e58d6b84b6c848dd2b0e9"
CONTEXT = 8  # characters the model sees before the one it predicts
EMBED = 16
HIDDEN = 64
BATCH = 128  # examples (positions) per step
LR = 0.003
EPOCHS = 50
SMALL_CHARS = 4000
SEED = 7

OUT = pathlib.Path(__file__).resolve().parents[3] / "src/scripts/demos/data/lernkurven.json"


def load_story(path):
    raw = pathlib.Path(path).read_bytes()
    digest = hashlib.sha256(raw).hexdigest()
    if digest != SOURCE_SHA256:
        sys.exit(f"unexpected file hash {digest}; expected {SOURCE_SHA256} ({SOURCE_URL})")
    text = raw.decode("utf-8")
    start = text.index("*** START OF THE PROJECT GUTENBERG EBOOK")
    end = text.index("*** END OF THE PROJECT GUTENBERG EBOOK")
    body = text[start:end]
    # The story itself starts with its first sentence; the title pages and the
    # transcriber's notes before it are not part of it.
    body = body[body.index("Als Gregor Samsa") :]
    return re.sub(r"\s+", " ", body).strip()


class CharModel(nn.Module):
    def __init__(self, vocab):
        super().__init__()
        self.embed = nn.Embedding(vocab, EMBED)
        self.hidden = nn.Linear(CONTEXT * EMBED, HIDDEN)
        self.out = nn.Linear(HIDDEN, vocab)

    def forward(self, x):
        h = torch.tanh(self.hidden(self.embed(x).flatten(1)))
        return self.out(h)


def examples(ids):
    """Every position with a full context becomes one example (input, target)."""
    x = torch.stack([ids[i : i + CONTEXT] for i in range(len(ids) - CONTEXT)])
    y = ids[CONTEXT:]
    return x, y


@torch.no_grad()
def mean_loss(model, x, y):
    total = 0.0
    for i in range(0, len(y), 4096):
        total += nn.functional.cross_entropy(model(x[i : i + 4096]), y[i : i + 4096], reduction="sum").item()
    return total / len(y)


def run(train_text, val_xy, stoi, init_state):
    model = CharModel(len(stoi))
    model.load_state_dict(init_state)
    opt = torch.optim.AdamW(model.parameters(), lr=LR, weight_decay=0.0)
    ids = torch.tensor([stoi[c] for c in train_text])
    x, y = examples(ids)
    gen = torch.Generator().manual_seed(SEED)
    train, val = [round(mean_loss(model, x, y), 3)], [round(mean_loss(model, *val_xy), 3)]
    steps = 0
    for _ in range(EPOCHS):
        order = torch.randperm(len(y), generator=gen)
        for i in range(0, len(y), BATCH):
            batch = order[i : i + BATCH]
            loss = nn.functional.cross_entropy(model(x[batch]), y[batch])
            opt.zero_grad()
            loss.backward()
            opt.step()
            steps += 1
        train.append(round(mean_loss(model, x, y), 3))
        val.append(round(mean_loss(model, *val_xy), 3))
    return {
        "chars": len(train_text),
        "examples": len(y),
        "stepsPerEpoch": -(-len(y) // BATCH),
        "steps": steps,
        "train": train,
        "val": val,
    }


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    torch.manual_seed(SEED)
    torch.use_deterministic_algorithms(True)
    torch.set_num_threads(1)
    story = load_story(sys.argv[1])
    cut = int(len(story) * 0.9)
    train_full, val_text = story[:cut], story[cut:]
    chars = sorted(set(story))
    stoi = {c: i for i, c in enumerate(chars)}
    val_xy = examples(torch.tensor([stoi[c] for c in val_text]))
    init = CharModel(len(chars))
    params = sum(p.numel() for p in init.parameters())
    init_state = {k: v.clone() for k, v in init.state_dict().items()}
    runs = {
        "klein": run(train_full[:SMALL_CHARS], val_xy, stoi, init_state),
        "gross": run(train_full, val_xy, stoi, init_state),
    }
    data = {
        "source": {"title": "Franz Kafka, Die Verwandlung (1915)", "url": SOURCE_URL, "sha256": SOURCE_SHA256},
        "setup": {
            "vocab": len(chars),
            "parameters": params,
            "context": CONTEXT,
            "batch": BATCH,
            "epochs": EPOCHS,
            "valChars": len(val_text),
            "optimizer": f"AdamW, lr {LR}",
            "torch": torch.__version__,
            "python": platform.python_version(),
        },
        "runs": runs,
    }
    OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    for key, r in runs.items():
        best = min(range(len(r["val"])), key=r["val"].__getitem__)
        print(key, r["chars"], "chars", r["steps"], "steps; val min", r["val"][best], "at epoch", best, "end train", r["train"][-1], "val", r["val"][-1])


if __name__ == "__main__":
    main()
