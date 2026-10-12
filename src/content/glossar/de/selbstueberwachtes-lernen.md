---
title: 'Selbstüberwachtes Lernen'
description: 'Training, bei dem die Lösungen schon in den Daten stehen: Bei einem Sprachmodell ist das nächste Token im Text die Lösung jeder Aufgabe.'
translationKey: selbstueberwachtes-lernen
---

Selbstüberwachtes Lernen ist eine Art zu trainieren, bei der niemand Lösungen aufschreiben muss, weil sie schon in den Daten stecken. Ein [Sprachmodell](/de/glossar/sprachmodell) lernt im Grundtraining so: Jeder Anfang eines Textes ist eine Frage, das [Token](/de/glossar/token), das im Text tatsächlich folgt, ist die Lösung. Man kann sich das wie eine Abdeckkarte über einer Buchzeile vorstellen, die nur den Anfang freigibt. Anders als ein Leser rät das Modell nicht nacheinander: Es rechnet alle Stellen eines Textes in einem Durchlauf und merkt sich keine Lösung, es stellt nur seine Zahlen ein Stück nach. Ein Text mit 12 Tokens liefert dadurch 11 Übungsaufgaben, eine weniger, als er Tokens hat. Weil das für jeden Text gilt, werden aus Billionen Tokens Billionen Aufgaben.

**Ein Beispiel:** Im Satz „Am Morgen fährt der Bus“ lautet eine Aufgabe „Am Morgen fährt der“, ihre Lösung ist „Bus“. Für diese Stelle nennt das Modell einen Vorschlag, der mit „Bus“ verglichen wird, und das Training stellt die [Parameter](/de/glossar/parameter) ein Stück so nach, dass „Bus“ beim nächsten Mal wahrscheinlicher wird.

**Nicht verwechseln mit Lernen ohne Lösungen:** Auch hier gibt es zu jeder Aufgabe eine richtige Antwort, das [Label](/de/glossar/label). Es stammt nur nicht von Menschen, sondern aus dem Text selbst. Beim Spamfilter dagegen markieren Menschen jede Mail von Hand. Auch das spätere Nachtraining eines Chatbots mit Antworten, die Menschen geschrieben oder bewertet haben, ist kein selbstüberwachtes Lernen.

**Wo du dem Begriff begegnest:** In Berichten über das Vortraining großer Sprachmodelle, auf Englisch als „self-supervised learning“, und in Lehrmaterial zum maschinellen Lernen, oft neben überwachtem und unüberwachtem Lernen.

Eingeführt in [Aus Text werden viele Übungsaufgaben](/de/bausteine/aus-text-werden-uebungsaufgaben).
