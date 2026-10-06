"""Reference token sequences for the ChatSequenceDemo (Baustein tokenisierung-im-modell).

Renders a few chats through gpt-oss-20b's official chat template (harmony format,
`apply_chat_template`, reasoning effort "medium", current date fixed to 2026-10-06,
the date of the counts in the Baustein) and stores the resulting token IDs. The
browser demo rebuilds the same sequence itself (src/scripts/demos/chat-sequence.js
with gpt-tokenizer's o200k_harmony encoding); chat-sequence.test.mjs checks that it
reproduces every reference here ID for ID, and that the start chat gives the
Baustein's numbers (86 tokens in German, 84 in English).

Run (from packages/website):
  HF_HUB_OFFLINE=1 uv run --with torch --with transformers python scripts/demos/precompute/chat-sequence.py
"""

import json
from pathlib import Path

from huggingface_hub import snapshot_download
from transformers import AutoTokenizer

MODEL = "openai/gpt-oss-20b"
DATE = "2026-10-06"
OUT = Path(__file__).resolve().parents[3] / "src/scripts/demos/data/chat-sequence.json"

CHATS = {
    "startDe": [
        {"role": "system", "content": "Antworte kurz."},
        {"role": "user", "content": "Wie heißt die Hauptstadt von Frankreich?"},
    ],
    "startEn": [
        {"role": "system", "content": "Answer briefly."},
        {"role": "user", "content": "What is the capital of France?"},
    ],
    "followDe": [
        {"role": "system", "content": "Antworte kurz."},
        {"role": "user", "content": "Wie heißt die Hauptstadt von Frankreich?"},
        {"role": "assistant", "content": "Paris."},
        {"role": "user", "content": "Und von Italien?"},
    ],
    "followEn": [
        {"role": "system", "content": "Answer briefly."},
        {"role": "user", "content": "What is the capital of France?"},
        {"role": "assistant", "content": "Paris."},
        {"role": "user", "content": "And Italy?"},
    ],
    "noSystem": [
        {"role": "user", "content": "Wie heißt die Hauptstadt von Frankreich?"},
    ],
    "assistantFirst": [
        {"role": "system", "content": "Antworte kurz."},
        {"role": "assistant", "content": "Paris."},
        {"role": "user", "content": "Und von Italien?"},
    ],
    "tricky": [
        {"role": "system", "content": "Sei freundlich.\nNutze  zwei Leerzeichen."},
        {"role": "user", "content": "Grüße aus Köln 🍓! Was ist 1234567 × 89?"},
        {"role": "assistant", "content": "Das sind 109.876.463."},
        {"role": "user", "content": "Danke – und auf Englisch?"},
    ],
}


def render(tok, chat, tokenize):
    return tok.apply_chat_template(
        chat,
        add_generation_prompt=True,
        tokenize=tokenize,
        reasoning_effort="medium",
        # The template reads the date via strftime_now(); fix it so the
        # reference does not change with the day the script runs.
        strftime_now=lambda fmt: DATE,
    )


def main() -> None:
    path = snapshot_download(MODEL, local_files_only=True)
    tok = AutoTokenizer.from_pretrained(path)
    out = {
        "model": MODEL,
        "revision": Path(path).name,
        "template": "official chat_template.jinja via apply_chat_template, add_generation_prompt=True",
        "reasoningEffort": "medium",
        "date": DATE,
        "chats": {},
    }
    for key, chat in CHATS.items():
        ids = render(tok, chat, True)
        if not isinstance(ids, list):
            ids = ids["input_ids"]
        assert f"Current date: {DATE}" in render(tok, chat, False), key
        out["chats"][key] = {"messages": chat, "ids": ids}
        print(key, len(ids))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print("wrote", OUT, OUT.stat().st_size, "bytes")


if __name__ == "__main__":
    main()
