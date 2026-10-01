---
title: 'Spamfilter'
description: 'Ein trainiertes Modell, das eine E-Mail als Spam oder kein Spam einordnet, oft als Wahrscheinlichkeitsangabe.'
translationKey: spamfilter
---

Ein Spamfilter ist ein trainiertes [Modell](/de/glossar/modell), das eine E-Mail (Betreff, Text, Absenderadresse) als Eingabe entgegennimmt und daraus eine Einschätzung berechnet: „Spam“ oder „kein Spam“, häufig sogar als Wahrscheinlichkeit wie „92 % Spam“. Der [Trainingsalgorithmus](/de/glossar/trainingsalgorithmus) stellt die [Parameter](/de/glossar/parameter) anhand tausender bereits von Menschen als Spam oder kein Spam markierter E-Mails ein; welche Merkmale tatsächlich auf Spam hindeuten, muss dabei kein Mensch vorher von Hand als Regel aufschreiben.

**Ein Beispiel:** Stark vereinfacht hat der Filter für jedes Wort ein gelerntes Gewicht gespeichert, etwa „Gewinn“ +3, „gratis“ +2 und „Rechnung“ −2 (ausgedachte Werte). Bei der Mail „Gratis: Dein Gewinn wartet“ zählt er die Gewichte zusammen und kommt auf 5. Erst der Vergleich mit einer festen Schwelle, hier 2, macht daraus das Urteil „Spam“. Kommt dieselbe Mail ein zweites Mal, ergibt sich wieder 5, denn beim Bewerten lernt der Filter nichts dazu.

**Nicht verwechseln mit einem Regelfilter:** Ein klassisches [Programm](/de/glossar/programm) arbeitet eine von Menschen geschriebene Regelliste ab, etwa „Enthält der Betreff das Wort ‚Gewinn‘, ab in den Spam“. Solche Regeln lassen sich leicht umgehen, schon „G3WINN“ rutscht durch. Beim trainierten Spamfilter steckt das Verhalten in eingestellten Zahlen statt in lesbaren Regeln. Er funktioniert damit nach demselben Prinzip wie ein [Bildklassifikator](/de/glossar/bildklassifikator) oder ein [Sprachmodell](/de/glossar/sprachmodell), nur mit E-Mails als [Trainingsdaten](/de/glossar/trainingsdaten).

**Wo du dem Begriff begegnest:** Im Spam-Ordner deines Postfachs und in den Einstellungen deines Mail-Programms. Meldest du eine Mail als Spam, kann das in einen späteren Trainingsschritt einfließen. Dass der Filter selbst eine Mail bewertet, verändert ihn dagegen nicht.

Ausführlicher erklärt in [Input und Output: Was eine Funktion tut](/de/bausteine/input-und-output).
