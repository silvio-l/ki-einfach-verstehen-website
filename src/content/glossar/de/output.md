---
title: 'Output'
description: 'Das Ergebnis eines Rechenschritts — bei einem Sprachmodell keine fertige Antwort, sondern eine Liste von Scores für das jeweils nächste Textstück.'
translationKey: output
---

Der Output (die Ausgabe) ist das Ergebnis, das eine [Funktion](/de/glossar/funktion) aus einem [Input](/de/glossar/input) berechnet.

Bei einem Sprachmodell ist der unmittelbare Output kein fertiges Wort und schon gar kein fertiger Satz, sondern eine Liste von [Scores](/de/glossar/score) — ein Zahlenwert für jedes einzelne Textstück im gesamten [Vokabular](/de/glossar/vokabular), auch für völlig unpassende. Ein nachgeschalteter Auswahlschritt macht daraus ein konkretes Textstück: Er nimmt entweder immer das Stück mit dem höchsten Score oder wählt mit etwas Zufall.

**Ein Beispiel:** Ein [Spamfilter](/de/glossar/spamfilter) zählt die Gewichte der Wörter einer Mail zusammen. Sein Output ist zuerst eine Zahl, etwa 5. Erst der Vergleich mit einer festen Schwelle macht daraus das Urteil „Spam“. Eine Bilderkennung gibt dagegen eine ganze Reihe von Zahlen aus, eine pro Klasse wie Katze, Hund oder Auto. Die ganze Reihe zusammen ist dann der eine Output.

**Nicht verwechseln mit der fertigen Antwort:** Was du im Chatfenster liest, ist das Ergebnis vieler Runden. In jeder Runde gibt das Modell eine Score-Liste aus, ein Stück wird gewählt und angehängt, und der längere Text geht wieder hinein. Die Liste selbst ist immer gleich lang: Beim älteren Sprachmodell GPT-2 hat sie 50.257 Einträge, egal wie kurz oder lang der Input ist.

**Wo du dem Begriff begegnest:** Dass ein Chatbot seine Antwort fast Wort für Wort aufbaut, ist diese Schleife, sichtbar gemacht. Das Wort selbst taucht in Dokumentationen und Einstellungen von KI-Diensten auf, etwa bei einer Längengrenze für die Ausgabe.

Ausführlicher erklärt in [Input und Output: Was eine Funktion tut](/de/bausteine/input-und-output).
