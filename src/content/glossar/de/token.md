---
title: 'Token'
description: 'Eine Einheit aus der festen Stückliste eines Tokenizers (seinem Vokabular), etwa ein ganzes Wort, ein Wortteil, ein Zeichen, ein Satzzeichen oder eine Marke für Struktur.'
translationKey: token
---

Ein Token ist eine Einheit aus der festen Stückliste eines [Tokenizers](/de/glossar/tokenizer). Diese Stückliste heißt [Vokabular](/de/glossar/vokabular). Die meisten Tokens sind Stücke, in die der Tokenizer einen Text zerlegt. Andere sind Marken, die dem Modell zum Beispiel zeigen, wo eine Nachricht beginnt oder endet; mehr dazu unter [Spezial-Token](/de/glossar/spezial-token). Ein Token kann ein ganzes Wort, ein Wortteil, ein einzelnes Zeichen, ein Satzzeichen oder eine andere wiederverwendbare Zeichenfolge sein. Token und Wort sind deshalb nicht dasselbe.

Jedes Token hat in einem konkreten Vokabular eine feste Nummer, seine [Token-ID](/de/glossar/token-id). Wie viele Tokens ein Text ergibt, hängt vom verwendeten Tokenizer ab.

**Ein Beispiel:** Der Satz „Die Katze sitzt.“ könnte in fünf Tokens zerfallen: „Die“, „ Kat“, „ze“, „ sitzt“ und „.“. Dabei gehört das Leerzeichen zum folgenden Stück. Der Punkt ist ein eigenes Token. Ein anderer Tokenizer kann denselben Satz anders zerlegen und „ Katze“ zum Beispiel als ein einziges Stück behandeln.

**Nicht verwechseln mit einem Wort:** Ein Wort gehört zur Sprache, ein Token ist eine technische Einheit. Häufige Wörter bilden oft ein einziges Token. Seltene Wörter, Namen oder ungewöhnliche Schreibweisen zerfallen dagegen meist in mehrere. Die Trennstellen setzt das gelernte [Vokabular](/de/glossar/vokabular). Die Silbentrennung, die du aus der Schule kennst, hat damit nichts zu tun. Wie viele Tokens ein Wort hat, verrät dir außerdem nicht, wie gut ein Modell es versteht.

**Wo du dem Begriff begegnest:** Viele Anbieter von KI-Diensten rechnen pro Token ab. Auch wie viel Text ein Modell auf einmal verarbeiten kann, geben sie in Tokens an; mehr dazu unter [Kontextfenster](/de/glossar/kontextfenster). Faustregeln, wie viele Zeichen ein Token im Schnitt hat, geben nur eine grobe Vorstellung. Die genaue Zahl bekommst du mit dem Zählwerkzeug des Anbieters.

Ausführlicher erklärt in [Tokenizer: Wie Text in Tokens zerfällt](/de/bausteine/tokenizer-ids-vokabular).
