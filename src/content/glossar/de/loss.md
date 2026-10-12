---
title: 'Loss (Cross-Entropy)'
description: 'Der Loss misst im Training, wie weit die Vorhersagen eines Modells danebenliegen; bei Sprachmodellen ist es der Durchschnitt der Strafpunkte.'
translationKey: loss
---

Der Loss ist die eine Zahl, die beim Training misst, wie weit die Vorhersagen eines Modells vom [Label](/de/glossar/label) entfernt sind. Der [Trainingsalgorithmus](/de/glossar/trainingsalgorithmus) versucht, diese Zahl kleiner zu machen.

Bei Sprachmodellen heißt die Regel **Cross-Entropy** (Kreuzentropie). An jeder Position zählt nur, wie viel [Wahrscheinlichkeit](/de/glossar/wahrscheinlichkeit) das Modell dem Token gegeben hat, das im Text tatsächlich folgt. Daraus werden Strafpunkte: 0 bei 100 Prozent, rund 0,7 bei 50 Prozent, und jedes weitere Halbieren kostet wieder rund 0,7 mehr. Der Loss ist der Durchschnitt dieser Strafpunkte über alle Positionen.

**Ein Beispiel:** Gibt ein Modell dem Token „Paris“ 47,5 Prozent, und im Text folgt tatsächlich „Paris“, kostet diese Position 0,74 Strafpunkte, obwohl „Paris“ die beste Wahl war. Ein Modell mit 151.936 Tokens im [Vokabular](/de/glossar/vokabular), das noch nichts gelernt hat und alle gleich behandelt, startet bei rund 11,9.

**Nicht verwechseln mit einem Prozentwert:** Ein Loss von 0,5 heißt nicht „halb falsch“. Die Zahl hat nach oben keine Grenze und erreicht 0 nur, wenn das Modell jedem richtigen Token 100 Prozent gibt. Direkt vergleichen lassen sich Loss-Werte nur bei gleichem [Tokenizer](/de/glossar/tokenizer) und gleichem Text. Und der Loss misst Übereinstimmung mit dem Trainingstext, nicht Wahrheit.

**Wo du dem Begriff begegnest:** In Berichten über neue Modelle zeigen Kurven, wie der Loss während des Trainings sinkt. Steht dort „Training Loss“ oder „Validation Loss“, ist dieselbe Messgröße gemeint, einmal auf dem Trainingstext und einmal auf zurückgehaltenem Text, jeweils mit eigenem Wert.

Ausführlicher erklärt in [Forward Pass und Loss: Wie das Modell seinen eigenen Fehler misst](/de/bausteine/forward-pass-und-loss).
