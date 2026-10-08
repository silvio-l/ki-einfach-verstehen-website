---
title: 'Token'
description: 'Eine einzelne Texteinheit aus dem festen Vokabular eines Tokenizers: ein Wort, ein Wortteil, ein Zeichen oder ein Satzzeichen.'
translationKey: token
---

Ein Token ist eine Einheit, in die ein [Tokenizer](/de/glossar/tokenizer) Text zerlegt. Es kann ein ganzes Wort, ein Wortteil, ein einzelnes Zeichen, Satzzeichen oder eine andere wiederverwendbare Zeichenfolge enthalten. Token und Wort sind deshalb nicht dasselbe.

Jedes Token besitzt in einem konkreten Vokabular eine [Token-ID](/de/glossar/token-id). Wie viele Tokens ein Text ergibt, hängt vom verwendeten Tokenizer ab.

**Ein Beispiel:** Der Satz „Die Katze sitzt.“ könnte in fünf Tokens zerfallen: „Die“, „ Kat“, „ze“, „ sitzt“ und „.“. Das Leerzeichen gehört dabei zum folgenden Stück, der Punkt ist ein eigenes Token. Ein anderer Tokenizer darf denselben Satz anders zerlegen und zum Beispiel „Katze“ als ein einziges Stück führen.

**Nicht verwechseln mit einem Wort:** Ein Wort ist eine sprachliche Einheit, ein Token eine technische. Häufige Wörter sind oft ein einziges Token, seltene Wörter, Namen oder ungewöhnliche Schreibweisen zerfallen in mehrere. Die Grenzen folgen dem gelernten [Vokabular](/de/glossar/vokabular), nicht der Silbentrennung. Von der Tokenzahl eines Wortes kannst du auch nicht darauf schließen, wie gut ein Modell es versteht.

**Wo du dem Begriff begegnest:** Viele Anbieter von KI-Diensten rechnen pro Token ab, und die Grenze dafür, wie viel Text ein Modell auf einmal verarbeitet, wird in Tokens gemessen, siehe [Kontextfenster](/de/glossar/kontextfenster). Faustregeln wie „ein Token sind ungefähr vier Zeichen“ geben nur eine grobe Vorstellung. Für eine genaue Zahl zählst du mit dem Zählwerkzeug des Anbieters.

Ausführlicher erklärt in [Tokenizer: Wie Text in Tokens zerfällt](/de/bausteine/tokenizer-ids-vokabular).
