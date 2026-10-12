---
title: 'Epoche'
description: 'Ein vollständiger Durchgang durch einen Datensatz im Training: Jedes Beispiel kam genau einmal dran.'
translationKey: epoche
---

Eine Epoche ist ein vollständiger Durchgang durch einen Datensatz, wie bei einem Übungsheft, das du einmal von vorn bis hinten durcharbeitest: Jedes Beispiel kam im Training genau einmal dran. Zwei Epochen heißen, dass das Modell jedes Beispiel zweimal gesehen hat, 0,5 Epochen, dass es nur die Hälfte gesehen hat.

**Ein Beispiel:** Bei GPT-3 kam die größte Quelle, eine gefilterte Sammlung von Webseiten, nur auf 0,44 Epochen. Sie war so groß, dass das Training nicht einmal zur Hälfte durchkam. Die viel kleinere Wikipedia kam dagegen 3,4-mal dran, weil ihr ein fester Anteil an den [Trainingsdaten](/de/glossar/trainingsdaten) zugeteilt war.

**Nicht verwechseln mit einem Schritt:** Ein [Schritt](/de/glossar/schritt) ist eine einzige Korrekturrunde nach einem Stapel Beispiele, eine Epoche besteht aus vielen solchen Runden. Eine zweite Epoche trifft dieselben Beispiele auf schon veränderte [Parameter](/de/glossar/parameter). Wie stark sich einzelne Beispiele dabei einprägen, zeigt die [Überanpassung](/de/glossar/ueberanpassung). Zu viele Epochen auf zu wenig Text führen zur [Überanpassung](/de/glossar/ueberanpassung).

**Wo du dem Begriff begegnest:** In Kursen zum [maschinellen Lernen](/de/glossar/maschinelles-lernen), wo kleine Modelle oft viele Epochen lang trainiert werden. Bei großen [Sprachmodellen](/de/glossar/sprachmodell) zählt man stattdessen meist das [Tokenbudget](/de/glossar/tokenbudget), weil jede Quelle verschieden oft drankommt.

Eingeführt in [Batch, Epoch, Step, Tokenbudget: Wie man Trainingsfortschritt misst](/de/bausteine/batch-epoch-step-tokenbudget).
