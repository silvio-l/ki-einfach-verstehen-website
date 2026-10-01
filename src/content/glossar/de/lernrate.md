---
title: 'Lernrate'
description: 'Ein Hyperparameter, der festlegt, wie stark der Trainingsalgorithmus die Parameter bei jedem Schritt nachstellt.'
translationKey: lernrate
---

Die Lernrate legt fest, wie stark ein [Trainingsalgorithmus](/de/glossar/trainingsalgorithmus) die [Parameter](/de/glossar/parameter) bei jedem Schritt nachstellt. Sie ist ein [Hyperparameter](/de/glossar/hyperparameter): Menschen wählen sie, das Training lernt sie nicht.

Ist die Lernrate zu groß, schießt jede Korrektur übers Ziel hinaus, und das Training kommt nicht zur Ruhe. Ist sie zu klein, kommt es nur sehr langsam voran. Beim größten GPT-3 lag sie bei höchstens 0,00006.

**Ein Beispiel:** Ein [Spamfilter](/de/glossar/spamfilter) lernt, wie verdächtig das Wort „Gewinn“ ist. Nach jedem Fehler stellt der Trainingsalgorithmus dessen Gewicht ein Stück nach. Ist die Lernrate zu groß, springt das Gewicht nach einer Werbemail weit nach oben und nach der nächsten harmlosen Mail mit „Gewinn“, etwa von der Bank, weit nach unten. Es findet nie die Stelle, an der sich beide Seiten die Waage halten. Ist sie zu klein, braucht der Filter sehr viele Beispiele, bis das Gewicht passt.

**Nicht verwechseln mit der Temperatur:** Beide stellen Menschen ein, aber zu verschiedenen Zeitpunkten. Die Lernrate gilt nur während des Trainings und hinterlässt ihre Spuren in den Parametern. Die [Temperatur](/de/glossar/temperatur) wird erst beim Benutzen gesetzt, bei jeder Anfrage neu, und lässt das Modell unverändert. Eine größere Lernrate heißt nicht, dass ein Modell mehr lernt. Sie bestimmt nur die Größe jedes Korrekturschritts.

**Wo du dem Begriff begegnest:** In Forschungspapieren und technischen Berichten, die die Trainingseinstellungen eines Modells auflisten, meist als sehr kleine Zahl. Oft steht dort ein ganzer Plan: Bei GPT-3 wurde die Lernrate zu Beginn langsam hochgefahren und später allmählich verkleinert. Wer selbst ein Modell trainiert, etwa in einem Kurs zum maschinellen Lernen, muss sie selbst festlegen.

Eingeführt in [Parameter, Training und Inferenz, Hardware: Wie ein Modell läuft](/de/bausteine/parameter-training-inferenz-hardware).
