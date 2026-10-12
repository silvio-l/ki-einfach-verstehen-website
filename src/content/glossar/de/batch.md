---
title: 'Batch (Stapel)'
description: 'Ein Batch (Stapel) ist im Training eine Menge Beispiele, deren Fehler zu einer Zahl gemittelt wird; bei der Inferenz viele gemeinsam berechnete Anfragen.'
translationKey: batch
---

Ein Batch, auf Deutsch **Stapel**, ist im Training eine Menge von Beispielen, die gemeinsam durch das [Modell](/de/glossar/modell) laufen. Aus allen ihren Vorhersagen wird eine einzige Zahl, der [Loss](/de/glossar/loss) des Batches. Danach stellt der [Trainingsalgorithmus](/de/glossar/trainingsalgorithmus) die [Parameter](/de/glossar/parameter) einmal nach, und der nächste Batch kommt dran.

Bei Sprachmodellen besteht ein Batch aus vielen Textfolgen. Jede Position jeder Folge liefert ihre Strafpunkte, und der Durchschnitt über alle Positionen aller Folgen ist der Loss. Weil der Durchschnitt zählt und nicht die Summe, bleiben große und kleine Batches vergleichbar.

**Ein Beispiel:** Beim größten Modell von GPT-3, einem Sprachmodell der Firma OpenAI aus dem Jahr 2020, mit 175 Milliarden Parametern erreichte der Batch laut Forschungspapier 3,2 Millionen Tokens; zu Beginn war er mit 32.000 Tokens viel kleiner und wuchs erst danach auf diesen Wert. 

**Nicht verwechseln mit dem Batch bei der Inferenz:** Beim Betrieb eines Chatbots heißt Batch etwas anderes. Dort rechnet das Rechenzentrum die Anfragen vieler Menschen gemeinsam, und wie groß dieser Batch ist, hängt davon ab, wie viele gerade gleichzeitig fragen. Es gibt dabei kein Label, keinen Loss und keine Änderung an den Parametern.

**Wo du dem Begriff begegnest:** In Berichten über das Training großer Modelle steht die Batchgröße oft in einer Tabelle neben der Zahl der Parameter, mal in Tokens, mal in Textfolgen. In Anleitungen zum Selbsttrainieren heißt die Einstellung dafür meist „batch size“.

Eingeführt in [Forward Pass und Loss: Wie das Modell seinen eigenen Fehler misst](/de/bausteine/forward-pass-und-loss).
