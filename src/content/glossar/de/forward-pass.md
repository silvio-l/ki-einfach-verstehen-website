---
title: 'Forward Pass (Vorwärtsdurchlauf)'
description: 'Der Weg der Zahlen durch ein Modell vom Input bis zur Vorhersage — beim Antworten wie im Training derselbe, im Training an allen Positionen zugleich.'
translationKey: forward-pass
---

Ein Forward Pass, auf Deutsch **Vorwärtsdurchlauf**, ist der Weg der Zahlen durch ein [Modell](/de/glossar/modell): vom [Input](/de/glossar/input) durch alle [Schichten](/de/glossar/schicht) bis zur Vorhersage. Die [Parameter](/de/glossar/parameter) bleiben dabei, wie sie sind; das Modell rechnet nur.

Bei einem Sprachmodell ist das derselbe Weg wie beim Antworten. Der [Output Head](/de/glossar/output-head) liefert an jeder Position Scores für das nächste Token; erst [Softmax](/de/glossar/softmax) macht daraus Prozente. Im Training steht der ganze Text schon fest, deshalb rechnet ein einziger Vorwärtsdurchlauf die Vorhersagen für alle Positionen zugleich. Die [Causal Mask](/de/glossar/causal-mask) sorgt dafür, dass keine Position dabei auf spätere Wörter schaut.

**Ein Beispiel:** Für „Der Hund jagt die Katze“, vereinfacht mit einem Token pro Wort, liefert ein Vorwärtsdurchlauf vier Vorhersagen auf einmal: nach „Der“ für „Hund“, nach „Der Hund“ für „jagt“ und so weiter. Jede bekommt Strafpunkte, ihr Durchschnitt ist der [Loss](/de/glossar/loss).

**Nicht verwechseln mit dem ganzen Training:** Der Vorwärtsdurchlauf misst nur, er verändert nichts. Erst der Rückweg, die Backpropagation, ermittelt, wie jeder Parameter zum Loss beigetragen hat, und danach stellt der [Trainingsalgorithmus](/de/glossar/trainingsalgorithmus) nach. Der Rückweg kostet etwa doppelt so viel Rechenarbeit wie der Vorwärtsdurchlauf.

**Wo du dem Begriff begegnest:** In technischen Texten über Training und Rechenkosten heißt es oft „forward and backward pass“, Vorwärts- und Rückweg. Bei der Inferenz, also beim Antworten, gibt es nur den Vorwärtsdurchlauf, einmal für jedes neue Token.

Eingeführt in [Forward Pass und Loss: Wie das Modell seinen eigenen Fehler misst](/de/bausteine/forward-pass-und-loss).
