---
title: 'Vokabular'
description: 'Die feste Liste aller Textstücke, die ein Sprachmodell überhaupt kennt und aus denen es jede Antwort zusammensetzt.'
translationKey: vokabular
---

Das Vokabular eines Sprachmodells ist die feste, im Vorhinein festgelegte Liste aller Textstücke, die das Modell überhaupt kennt. Echte Vokabulare haben Zehntausende Einträge oder mehr, das ältere Modell GPT-2 etwa 50.257. Egal wie groß, es bleibt eine feste, abgeschlossene Liste.

Ein [Tokenizer](/de/glossar/tokenizer) zerlegt Text in Einträge dieses Vokabulars und gibt deren [Token-IDs](/de/glossar/token-id) aus. Für den [Output](/de/glossar/output) gilt außerdem: Bei jedem Rechenschritt bekommt jedes einzelne Textstück im Vokabular einen [Score](/de/glossar/score), auch die, die am Ende nicht gewinnen.

**Ein Beispiel:** Stell dir das Vokabular als Kartei vor. Auf jeder Karte stehen ein Textstück und eine Kennnummer, etwa „Die“ mit 417 oder „ Kat“ (mit Leerzeichen davor) mit 82, hier mit ausgedachten Nummern. Gibt es keine Karte für „ Katze“, setzt der Tokenizer das Wort aus „ Kat“ und „ze“ zusammen.

**Nicht verwechseln mit einem Wörterbuch:** Das Vokabular enthält keine Bedeutungen und auch nicht alle Wörter einer Sprache. Viele Einträge sind Wortteile, Satzzeichen oder Wörter mit vorangestelltem Leerzeichen. Ein einzelner Eintrag heißt [Token](/de/glossar/token), das Vokabular ist die ganze Liste.

**Wo du dem Begriff begegnest:** Mit einem neuen Chatbot-Modell kommt oft ein eigener Tokenizer mit eigenem Vokabular, und derselbe Satz ergibt dort andere Token-IDs. Spürbar wird das Vokabular, wenn ein Anbieter pro Token abrechnet oder ein Text das [Kontextfenster](/de/glossar/kontextfenster) füllt: Was das Vokabular weniger kompakt abdeckt, etwa lange Zahlenreihen oder ungewöhnliche Produktkennungen, zerfällt in mehr Tokens.

Die Zerlegung erklärt [Tokenizer: Wie Sprache zu Zahlen wird](/de/bausteine/tokenizer-ids-vokabular). Den anschließenden Rechenschritt erklärt [Input und Output: Was eine Funktion tut](/de/bausteine/input-und-output).
