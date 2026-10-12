---
title: 'Überanpassung'
description: 'Ein Modell stellt sich auf einzelne Trainingsbeispiele ein statt auf das, was sie gemeinsam haben, und wird bei unbekannten Daten schlechter.'
translationKey: ueberanpassung
---

Überanpassung, englisch overfitting, heißt: Ein Modell stellt sich auf einzelne Trainingsbeispiele ein statt auf das, was sie gemeinsam haben. Bei den bekannten Beispielen wird es immer besser, bei unbekannten schlechter. Man erkennt das an zwei Kurven: Der Trainings-Loss fällt weiter, während der [Validierungs-Loss](/de/glossar/validierungs-loss) wieder steigt.

**Ein Beispiel:** Ein [Spamfilter](/de/glossar/spamfilter) wird nur mit ein paar Dutzend Werbemails trainiert, die zufällig alle an einem Dienstag kamen. Er lernt dann womöglich, dass Dienstag verdächtig ist, und sortiert harmlose Mails von diesem Tag aus. Mit vielen verschiedenen Beispielen verliert so ein Zufall sein Gewicht.

**Nicht verwechseln mit dem Auswendigkennen des Prüftexts:** Ein niedriger Validierungs-Loss heißt nicht, dass das Modell den Prüftext kennt. Es hat ihn nie gesehen und sagt ihn gut vorher, weil die Muster aus den [Trainingsdaten](/de/glossar/trainingsdaten) auch dort gelten. Überanpassung droht vor allem, wenn wenig Text viele [Epochen](/de/glossar/epoche) lang wiederholt wird. Mehr verschiedener Text schiebt sie hinaus.

**Wo du dem Begriff begegnest:** In Einführungen ins [maschinelle Lernen](/de/glossar/maschinelles-lernen), oft mit einem Diagramm zweier auseinanderlaufender Kurven. Im Forschungspapier zu GPT-3 schreiben die Autoren, dass sie für das häufigere Wiederholen hochwertiger Quellen eine kleine Menge Überanpassung in Kauf nahmen (englisch: „a small amount of overfitting“).

Eingeführt in [Batch, Epoch, Step, Tokenbudget: Wie man Trainingsfortschritt misst](/de/bausteine/batch-epoch-step-tokenbudget).
