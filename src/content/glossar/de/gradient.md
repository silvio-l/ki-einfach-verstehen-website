---
title: 'Gradient'
description: 'Die Liste der Steigungen des Fehlers für alle Parameter: je Regler eine Richtung und eine Stärke, für die jetzige Stellung und einen Batch.'
translationKey: gradient
---

Der Gradient ist die Liste der Steigungen des Fehlers für alle [Parameter](/de/glossar/parameter) eines Modells. Für jeden Regler steht darin, in welche Richtung sich der Fehler bewegt, wenn der Regler ein winziges Stück höher gedreht wird, und wie stark. Ein Modell mit acht Milliarden Parametern bekommt nach jedem Batch acht Milliarden solcher Angaben. Ausgerechnet wird der Gradient mit der [Backpropagation](/de/glossar/backpropagation).

Stell dir ein Mischpult vor, an dem nach jedem Durchlauf an jedem Regler ein Zettel hängt, mit „höher“ oder „tiefer“ und einer Stärke. Der Gradient ist die Liste aller dieser Zettel.

**Ein Beispiel:** Ein ausgedachtes Netz für ein Treppenlicht mit zwei Schaltern hat neun Regler. Der Gradient hat neun Einträge, einen pro Regler, auch wenn alle Gewichte richtig stehen. Sind beide Schalter gedrückt, hat der Gradient beim Gewicht, mit dem Neuron C auf Neuron A zählt, den größten Eintrag, eine 4: höher gedreht würde der Fehler wachsen. Dieses Gewicht steht aber richtig; der größte Eintrag zeigt nur die Steigung an dieser Stelle, nicht den falsch eingestellten Regler.

**Nicht verwechseln mit dem Weg zum richtigen Wert:** Der Gradient zeigt nur die Neigung an der jetzigen Stelle, nicht, wo der richtige Wert eines Reglers liegt. Er dreht auch selbst keinen Regler; das erledigt ein eigener Schritt danach. Und er gilt nur für die Beispiele, aus denen er stammt: Der nächste Batch liefert einen neuen.

**Wo du dem Begriff begegnest:** In Forschungspapieren und Trainingsberichten, etwa wenn es heißt, die Größe des Gradienten sei begrenzt worden, wie beim Training von GPT-3.

Eingeführt in [Backpropagation und Gradienten: Wie das Modell weiß, was es ändern muss](/de/bausteine/backpropagation-und-gradienten).
