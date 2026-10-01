---
title: 'Maschinelles Lernen'
description: 'Verfahren, bei denen ein Trainingsalgorithmus die Parameter eines Modells anhand von Beispielen einstellt, statt dass Menschen Regeln schreiben.'
translationKey: maschinelles-lernen
---

Maschinelles Lernen ist der Oberbegriff für Verfahren, bei denen ein [Trainingsalgorithmus](/de/glossar/trainingsalgorithmus) die [Parameter](/de/glossar/parameter) eines [Modells](/de/glossar/modell) anhand von Beispielen einstellt — statt dass ein Mensch die Regeln, nach denen entschieden wird, von Hand in Code schreibt.

Der Name ist etwas irreführend: Ein Modell „lernt“ nicht im menschlichen Sinn, sondern seine Parameter werden Schritt für Schritt so verändert, dass seine Fehler bei den Trainingsbeispielen kleiner werden. Das ist Rechnen, kein Verstehen. Wie das im Detail funktioniert, ist Thema eines eigenen, späteren Themenbereichs.

**Ein Beispiel:** Ein Spamfilter speichert für jedes Wort eine Zahl, ein Gewicht. Trainiert wird er mit Tausenden Mails, die Menschen vorher als Spam oder als normale Post markiert haben. Liegt der Filter bei einer Beispielmail daneben, verschiebt der Trainingsalgorithmus die beteiligten Gewichte ein kleines Stück in die Richtung, die den Fehler verkleinert. Am Ende haben typische Werbewörter hohe Werte, ohne dass jemand „Gewinn ist verdächtig“ aufgeschrieben hat.

**Nicht verwechseln mit KI als Ganzem:** [KI](/de/glossar/ki) ist der weitere Begriff. Auch Systeme aus von Hand geschriebenen Regeln, etwa frühe [Expertensysteme](/de/glossar/expertensysteme), zählen dazu. Maschinelles Lernen ist der Teil der KI, bei dem das Verhalten aus Beispielen entsteht. Gelernt wird außerdem nur im Training: Ein fertiges Modell verändert sich beim Benutzen nicht, bis jemand es neu trainiert.

**Wo du dem Begriff begegnest:** In Berichten über KI, in Stellenanzeigen, oft auch als Machine Learning (ML), und auf Produktseiten von Software, die etwas „lernt“ oder „sich anpasst“. Auch hinter Spamfiltern und Empfehlungen in Streamingdiensten steckt meist ein Modell, das auf diese Weise trainiert wurde.

Kurz eingeführt in [„Programm, Algorithmus, Modell im Vergleich“](/de/bausteine/programm-algorithmus-modell).
