"""Precompute the next-token trees for the ModelProbe live demo.

Baustein 'Was ein KI-Modell eigentlich ist' (EN 'What an AI model actually is').
Same setup as the documented experiment in
docs/content-plan/versuche/was-ein-ki-modell-naechstes-token.md: base models
without chat template, bfloat16 on CPU, softmax over the last position in
bfloat16, percentages rounded to one decimal.

Per model and sentence start the script stores a small tree of states:
- the greedy path of GREEDY_STEPS tokens (always the most likely token),
  generated with model.generate() and its KV cache like the experiment, so the
  continuations match the ones the Baustein quotes,
- at step 1 and at the most uncertain later step of the greedy path, every
  other top-5 candidate as a branch, continued greedily for BRANCH_STEPS tokens.
Every state holds its top-5 candidates; a candidate points to its child state,
or to null where the tree was not computed.

Run (from packages/website):
  HF_HUB_OFFLINE=1 uv run --with torch --with transformers \
    python scripts/demos/precompute/modelprobe.py
Writes src/scripts/demos/data/modelprobe.json.
"""
import json
import platform
from pathlib import Path

import torch
import transformers
from transformers import AutoModelForCausalLM, AutoTokenizer

MODELS = {
    "small": ("Qwen/Qwen3-0.6B-Base", "da87bfb608c14b7cf20ba1ce41287e8de496c0cd"),
    "large": ("Qwen/Qwen3-4B-Base", "906bfd4b4dc7f14ee4320094d8b41684abff8539"),
}
# The four sentence starts of the experiment, in the experiment's wording. The
# English Baustein uses the same German prompts with a translation.
PROMPTS = {
    "capital": "Die Hauptstadt von Frankreich ist",
    "reverse": "Paris ist die Hauptstadt von",
    "einstein": "Der Physiker Albert Einstein wurde geboren am",
    "quelling": "Der Physiker Bernhard Quelling wurde geboren am",
}
TOP_K = 5
GREEDY_STEPS = 15  # as in the experiment's greedy continuation
BRANCH_STEPS = 8

OUT = Path(__file__).resolve().parents[3] / "src" / "scripts" / "demos" / "data" / "modelprobe.json"


def shares(logits, dtype):
    """Top-k of the softmax, computed in the dtype of the model's logits like
    the experiment (generate() hands logits back upcast to float32; casting
    them back is lossless)."""
    probs = torch.softmax(logits.to(dtype), -1)
    v, i = probs.topk(TOP_K)
    return [(int(j), round(float(x) * 100, 1)) for x, j in zip(v, i)]


def generate(model, ids, steps):
    """Greedy continuation with the KV cache, exactly like the experiment's
    model.generate(do_sample=False); returns the tokens and the logits that
    chose each of them."""
    with torch.no_grad():
        out = model.generate(
            torch.tensor([ids]), max_new_tokens=steps, do_sample=False,
            output_logits=True, return_dict_in_generate=True,
        )
    tokens = out.sequences[0, len(ids):].tolist()
    return tokens, [l[0] for l in out.logits]


def piece(tok, prompt_ids, path, token):
    """Text the token adds after prompt+path, decoded in context so a token
    that completes a multi-byte character shows the whole character."""
    before = tok.decode(prompt_ids + path)
    after = tok.decode(prompt_ids + path + [token])
    if after.startswith(before) and not before.endswith("�"):
        return after[len(before):]
    return tok.decode([token])


def build(tok, model, prompt):
    prompt_ids = tok(prompt).input_ids
    nodes = []
    cache = {}

    with torch.no_grad():
        dtype = model(torch.tensor([prompt_ids])).logits.dtype

    def walk(path, steps):
        """Follow the most likely token for `steps` tokens from `path` (one
        generate() call, as in the experiment); every visited state gets its
        top-5. Returns the visited node indices; the last one is a leaf."""
        tokens, logits = generate(model, prompt_ids + path, steps + 1)
        visited = []
        for k, step_logits in enumerate(logits):
            key = tuple(path + tokens[:k])
            if key not in cache:
                cands = shares(step_logits, dtype)
                # Rounded shares can tie; the token generate() chose leads.
                chosen = next((c for c in cands if c[0] == tokens[k]), None)
                assert chosen is not None and chosen[1] == cands[0][1], (key, tokens[k], cands)
                cands.remove(chosen)
                cands.insert(0, chosen)
                cache[key] = len(nodes)
                nodes.append({"path": list(key), "cands": cands, "next": [None] * TOP_K})
            if visited:
                nodes[visited[-1]]["next"][0] = cache[key]
            visited.append(cache[key])
        return visited

    greedy = walk([], GREEDY_STEPS)
    # The start state must be the experiment's single forward pass.
    with torch.no_grad():
        root = torch.softmax(model(torch.tensor([prompt_ids])).logits[0, -1], -1)
    v, i = root.topk(TOP_K)
    assert [(int(j), round(float(x) * 100, 1)) for x, j in zip(v, i)] == nodes[0]["cands"], prompt
    # Most uncertain later step: lowest top-1 share among steps 2..GREEDY_STEPS.
    later = min(greedy[1:-1], key=lambda n: nodes[n]["cands"][0][1])
    branch_at = [greedy[0], later]
    for n in branch_at:
        node = nodes[n]
        for k in range(1, TOP_K):
            child_path = node["path"] + [node["cands"][k][0]]
            path = walk(child_path, BRANCH_STEPS - 1)
            node["next"][k] = path[0]

    # Leaves (end of a computed continuation) keep their candidates for display
    # but have no children; mark them so the UI can say so.
    out = []
    for node in nodes:
        out.append({
            "c": [
                [piece(tok, prompt_ids, node["path"], t), p, node["next"][k]]
                for k, (t, p) in enumerate(node["cands"])
            ],
        })
    return {
        "prompt": prompt,
        "greedy": tok.decode(nodes[greedy[-1]]["path"]),
        "branchAt": [greedy.index(n) for n in branch_at],
        "nodes": out,
    }


def main():
    result = {
        "source": "docs/content-plan/versuche/was-ein-ki-modell-naechstes-token.md",
        "env": {
            "python": platform.python_version(),
            "torch": torch.__version__,
            "transformers": transformers.__version__,
            "dtype": "bfloat16",
            "device": "cpu",
        },
        "topK": TOP_K,
        "models": {},
    }
    torch.manual_seed(0)
    for key, (name, rev) in MODELS.items():
        tok = AutoTokenizer.from_pretrained(name, revision=rev)
        model = AutoModelForCausalLM.from_pretrained(name, revision=rev, dtype=torch.bfloat16).eval()
        runs = {}
        for pkey, prompt in PROMPTS.items():
            runs[pkey] = build(tok, model, prompt)
            print(key, pkey, len(runs[pkey]["nodes"]), "nodes:", repr(runs[pkey]["greedy"]), flush=True)
        result["models"][key] = {"id": name, "revision": rev, "runs": runs}
        del model
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print("wrote", OUT, OUT.stat().st_size, "bytes")


if __name__ == "__main__":
    main()
