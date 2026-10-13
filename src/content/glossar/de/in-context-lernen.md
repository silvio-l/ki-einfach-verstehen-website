---
title: 'In-Context-Lernen'
description: 'Ein Modell übernimmt ein Muster aus Beispielen in der Eingabe, ohne dass seine Gewichte sich dabei ändern.'
translationKey: in-context-lernen
---

Beim In-Context-Lernen steht im [Prompt](/de/glossar/prompt) eine Aufgabe, dazu meist einige Beispiele. Das Modell löst danach eine neue Aufgabe nach demselben Muster. Dafür müssen seine [Parameter](/de/glossar/parameter) nicht verändert werden. Die Beispiele wirken nur auf diese eine Eingabe.

**Ein Beispiel:** Du erklärst einer erfundenen Wortregel in drei Sätzen, wie aus einem Verb ein Zählwort wird, und bittest dann um ein viertes Wort. Gelingt die Bildung, hat das Modell das Muster aus dem [Input](/de/glossar/input) übernommen. Im Training gelernt hat es die Regel dadurch nicht.

**Nicht verwechseln mit Nachtraining:** Beim Nachtraining werden die Gewichte nach dem Training noch einmal verändert. Beim In-Context-Lernen bleiben sie unverändert. Was ein Chat-Dienst zusätzlich speichert, ist eine andere Frage.

**Grenze der Aussage:** Die Belege stammen aus einer Messung an GPT-3 im Jahr 2020 und aus einer begrenzten Zahl von Aufgaben. Sie gelten nicht als Gesetz für jedes Modell.

Eingeführt wird der Begriff in [Warum Vorhersagen mehr ist als Nachplappern](/de/bausteine/warum-vorhersagen-mehr-ist-als-nachplappern).
