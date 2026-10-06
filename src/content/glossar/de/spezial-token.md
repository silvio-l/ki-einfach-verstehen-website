---
title: 'Spezial-Token'
description: 'Ein Vokabulareintrag, der nicht für Text steht, sondern für Struktur: Anfang, Rollen, Nachrichtengrenzen oder das Ende einer Antwort.'
translationKey: spezial-token
---

Ein Spezial-Token ist ein Eintrag im [Vokabular](/de/glossar/vokabular), der kein Textstück darstellt, sondern eine Markierung. Es zeigt einem [Sprachmodell](/de/glossar/sprachmodell) an, wo ein Text beginnt, welche Rolle gerade spricht, wo eine Nachricht endet oder dass eine Antwort fertig ist. Wie jedes [Token](/de/glossar/token) hat es eine feste [Token-ID](/de/glossar/token-id). Der Tokenizer zerlegt es nie in kleinere Stücke.

**Ein Beispiel:** Bei Llama 3.1 umschließen `<|start_header_id|>` und `<|end_header_id|>` den Namen einer Rolle, `<|eot_id|>` beendet einen Redebeitrag. Das Chatmodell hat im Training gelernt, am Ende seiner Antwort selbst ein `<|eot_id|>` zu erzeugen. Das Programm drumherum hört dort auf. Andere Modelle verwenden andere Marken, etwa `<|im_start|>` und `<|im_end|>` bei Qwen oder `<end_of_turn>` bei Gemma.

**Nicht verwechseln mit Sonderzeichen im Text:** Tippst du die Zeichenfolge `<|eot_id|>` in einen Chat, ist das zunächst gewöhnlicher Text. Gut gebaute Anwendungen sorgen dafür, dass daraus kein echtes Spezial-Token wird, weil sich ein Modell sonst über getippte Marken steuern ließe.

**Wo du dem Begriff begegnest:** In Modellbeschreibungen und Anleitungen zu Chat-Formaten, in Programmbibliotheken als „special tokens“ und bei Fehlerbildern, in denen ein Modell nicht aufhört zu schreiben oder fremde Marken in seine Antwort mischt.

Eingeführt in [Tokenisierung im Modell: Wie dein Chat zu einer Tokenfolge wird](/de/bausteine/tokenisierung-im-modell).
