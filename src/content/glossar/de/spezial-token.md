---
title: 'Spezial-Token'
description: 'Ein Eintrag im Vokabular, der kein Textstück bezeichnet, sondern die Struktur markiert: Anfang, Rollen, Nachrichtengrenzen oder das Ende einer Antwort.'
translationKey: spezial-token
---

Ein Spezial-Token ist ein Eintrag im [Vokabular](/de/glossar/vokabular), der kein Textstück darstellt, sondern eine Markierung. Es zeigt einem [Sprachmodell](/de/glossar/sprachmodell) an, wo ein Text beginnt oder eine Nachricht endet, welche Rolle gerade spricht und wann die Antwort fertig ist. Im Chat sind meist drei Rollen beteiligt: du, das Modell und die Chat-App mit ihren Anweisungen. Wie jedes [Token](/de/glossar/token) hat es eine feste [Token-ID](/de/glossar/token-id). Im üblichen Betrieb zerlegt der Tokenizer es nicht in kleinere Stücke.

**Ein Beispiel:** Bei Llama 3.1, einem frei verfügbaren Chatmodell von Meta, stehen `<|start_header_id|>` und `<|end_header_id|>` vor und nach dem Namen einer Rolle. `<|eot_id|>` beendet einen Redebeitrag. Das Chatmodell hat im Training gelernt, am Ende seiner Antwort selbst ein `<|eot_id|>` zu erzeugen. Der Tokenizer behandelt jede solche Marke als genau ein Token mit eigenem Eintrag im Vokabular. Sie steht für kein Textstück, sondern markiert die Struktur des Gesprächs. An einem `<|eot_id|>` erkennt das Programm drumherum, dass die Antwort zu Ende ist, und hört auf. Andere Modelle verwenden andere Marken. Qwen, ein Chatmodell von Alibaba, nutzt etwa `<|im_start|>` und `<|im_end|>`.

**Nicht verwechseln mit Sonderzeichen im Text:** Die Zeichenfolge `<|start|>` ist im Format von gpt-oss, den frei verfügbaren Modellen von OpenAI, eine echte Marke. Im Vokabular von Llama 3.1 zerfällt dieselbe Zeichenfolge dagegen in fünf gewöhnliche Textstücke. Dort ist sie also kein Spezial-Token.

**Wo du dem Begriff begegnest:** Du findest ihn in Modellbeschreibungen, Anleitungen zu Chat-Formaten und Programmbibliotheken (fertigen Code-Sammlungen für Entwickler), dort als „special tokens“. Der Begriff taucht auch auf, wenn ein Modell nicht aufhört zu schreiben oder fremde Marken in seine Antwort mischt.

Eingeführt in [Tokenisierung im Modell: Wie dein Chat zu einer Tokenfolge wird](/de/bausteine/tokenisierung-im-modell).
