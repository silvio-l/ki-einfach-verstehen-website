---
title: 'Attention'
description: 'Das Verfahren, mit dem ein Sprachmodell die Information früherer Tokens gewichtet in den Zustand eines Tokens einmischt.'
translationKey: attention
---

Attention (englisch für Aufmerksamkeit) mischt in den Zustand eines [Tokens](/de/glossar/token) Information von anderen Tokens ein. Dazu stellt das aktuelle Token eine Frage, die Query, und vergleicht sie mit dem Key, dem Etikett jedes sichtbaren Tokens. Jeder Vergleich ergibt einen [Score](/de/glossar/score), [Softmax](/de/glossar/softmax) macht daraus Gewichte, die zusammen 1 ergeben. Dann werden die Values, also die Inhalte der Tokens, mit diesen Gewichten gemischt, und die Mischung wird zum Zustand addiert. Ein Block hat mehrere solcher Berechnungen nebeneinander, die Heads.

Welche Query, welcher Key und welcher Value aus einem Zustand wird, legen gelernte [Parameter](/de/glossar/parameter) fest. In Sprachmodellen sorgt die [Causal Mask](/de/glossar/causal-mask) dafür, dass nur frühere Tokens und das Token selbst sichtbar sind.

**Ein Beispiel:** Ein gedachtes Beispiel ohne echte Werte: In „Ich sitze auf der Bank“ würde „sitze“ für „Bank“ ein hohes Gewicht bekommen, in „Ich zahle Geld bei der Bank ein“ wäre es „Geld“. So rückt derselbe Startvektor von „Bank“ je nach Satz in eine andere Richtung.

**Nicht verwechseln mit menschlicher Aufmerksamkeit:** Das Modell richtet sich nicht bewusst auf etwas aus. Die Gewichte werden berechnet. Sie zeigen auch nicht zuverlässig, warum ein Modell eine bestimmte Antwort gibt; auffällig viel Gewicht landet zum Beispiel oft auf den ersten Tokens eines Textes.

**Wo du dem Begriff begegnest:** In Beschreibungen von Sprachmodellen, oft als „Self-Attention“ oder „Multi-Head Attention“, und in Programmen, die Attention-Gewichte als farbige Tabellen zeigen.

Eingeführt in [Transformerblöcke und Attention: Wie Kontext eingemischt wird](/de/bausteine/transformerbloecke-und-attention).
