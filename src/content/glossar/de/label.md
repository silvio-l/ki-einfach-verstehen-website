---
title: 'Label (Target)'
description: 'Die erwartete richtige Ausgabe, gegen die eine Modellvorhersage beim Training verglichen wird — auch Target genannt.'
translationKey: label
---

Ein Label (auch **Target** genannt) ist die erwartete richtige Ausgabe, gegen die die eigene Vorhersage eines Modells beim Training verglichen wird. Zusammen mit dem zugehörigen [Input](/de/glossar/input) bildet es ein [Beispiel](/de/glossar/beispiel).

Bei einem Spamfilter ist das Label die Information „Spam“ oder „kein Spam“ zu einer E-Mail. Bei einem Sprachmodell ist das Label meist das tatsächlich folgende Textstück — für den Input „Die Katze“ wäre das etwa „sitzt“.

**Ein Beispiel:** Aus dem gewöhnlichen Satz „Die Katze sitzt auf dem Sofa.“ entstehen gleich mehrere Trainingsbeispiele. Zu „Die Katze sitzt“ gehört das Label „auf“, zu „Die Katze sitzt auf“ das Label „dem“, zu „Die Katze sitzt auf dem“ das Label „Sofa“. Beim Spamfilter mussten Menschen jede Mail von Hand markieren. Beim Sprachmodell steckt das Label schon im Text selbst.

**Nicht verwechseln mit dem Output:** Der [Output](/de/glossar/output) ist das, was das Modell selbst berechnet. Das Label ist das, was richtig gewesen wäre. Der [Trainingsalgorithmus](/de/glossar/trainingsalgorithmus) vergleicht beides und stellt die Parameter ein kleines Stück nach. Im Einsatz gibt es kein Label: Wenn du einem Chatbot eine Frage stellst, kennt niemand das richtige nächste Stück.

**Wo du dem Begriff begegnest:** In Berichten über das Training von KI-Modellen ist oft von gelabelten Daten die Rede, also Daten, bei denen zu jedem Input das richtige Ergebnis vermerkt ist. Wenn Menschen Bilder kategorisieren oder Antworten bewerten, damit ein Modell daraus lernt, vergeben sie solche Labels.

Ausführlicher erklärt in [Input und Output: Was eine Funktion tut](/de/bausteine/input-und-output).
