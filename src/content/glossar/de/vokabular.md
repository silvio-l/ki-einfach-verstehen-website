---
title: 'Vokabular'
description: 'Die feste Liste aller Textstücke, die ein Sprachmodell überhaupt kennt und aus denen es jeden Output zusammensetzt.'
translationKey: vokabular
---

Das Vokabular eines Sprachmodells ist die feste, im Vorhinein festgelegte Liste aller Textstücke, die das Modell überhaupt kennt. Ein realistisches Modell hat kein Vokabular mit fünf Einträgen, sondern eher mehrere Zehntausend — aber egal wie groß, es bleibt eine feste, abgeschlossene Liste.

Ein [Tokenizer](/de/glossar/tokenizer) zerlegt Text in Einträge dieses Vokabulars und gibt deren [Token-IDs](/de/glossar/token-id) aus. Für den [Output](/de/glossar/output) gilt außerdem: Bei jedem Rechenschritt bekommt jedes einzelne Textstück im Vokabular einen [Score](/de/glossar/score) — auch die, die am Ende nicht gewinnen.

Die Zerlegung erklärt [Wie Sprache zu Zahlen wird: Tokenizer, IDs, Vokabular](/de/bausteine/tokenizer-ids-vokabular). Den anschließenden Rechenschritt erklärt [Input und Output: Wie eine Funktion „denkt"](/de/bausteine/input-und-output).
