---
title: 'Parameter'
description: 'Die gespeicherten, einstellbaren Zahlenwerte, aus denen ein trainiertes Modell besteht — auch Gewichte genannt.'
translationKey: parameter
---

Parameter (auch Gewichte genannt) sind die gespeicherten Zahlenwerte, von denen das Verhalten eines [Modells](/de/glossar/modell) abhängt. Ein [Trainingsalgorithmus](/de/glossar/trainingsalgorithmus) stellt sie anhand von Trainingsbeispielen ein, statt dass ein Mensch jeden Wert einzeln festlegt.

*Denkbild: die genauen Stellungen der Regler auf einem Mischpult* — die Anordnung der Regler selbst (die Architektur) bleibt dabei fest.

Wie viele Parameter ein Modell hat und was das für Speicher und Hardware bedeutet, zeigt [Modellgröße und Hardware](/de/bausteine/modellgroesse-und-hardware). Mit 2 Byte pro Zahl braucht jede Milliarde Parameter rund 2 Gigabyte.

**Ein Beispiel:** Ein einfacher [Spamfilter](/de/glossar/spamfilter) speichert für jedes Wort eine Zahl, mit ausgedachten Werten etwa +3 für „Gewinn“ und −2 für „Rechnung“. Für jede Mail zählt er die Zahlen der vorkommenden Wörter zusammen und vergleicht die Summe mit einer Schwelle. Diese Zahlen sind seine Parameter. Ändert sich eine einzige davon, entscheidet der Filter anders, ohne dass sich eine Zeile Programmcode ändert.

**Nicht verwechseln mit Hyperparametern:** [Hyperparameter](/de/glossar/hyperparameter) legen Menschen vor dem Training fest, etwa wie viele Parameter es überhaupt gibt. Die Parameter selbst stellt erst das Training ein. Und kein einzelner Parameter ist eine lesbare Regel: In den Zahlen steht kein Satz und kein Fakt im Klartext.

**Wo du dem Begriff begegnest:** Oft schon im Namen eines Modells. Das „8B“ in Llama 3.1 8B steht für 8 Milliarden Parameter, das B für das englische billion, also eine deutsche Milliarde. Auch Meldungen über neue KI-Modelle nennen die Parameterzahl häufig als Maß für die Größe. Wer ein Modell herunterlädt, bekommt die Parameter als große Gewichtsdateien.

Kurz eingeführt in [„Programm, Algorithmus, Modell im Vergleich“](/de/bausteine/programm-algorithmus-modell).
