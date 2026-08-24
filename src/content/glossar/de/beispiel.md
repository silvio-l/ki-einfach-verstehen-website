---
title: 'Beispiel (Sample)'
description: 'Ein zusammengehöriges Input-Output-Paar, mit dem ein Modell trainiert wird — auch Sample genannt.'
translationKey: beispiel
---

Ein Beispiel (auch **Sample** genannt) ist ein zusammengehöriges Paar aus [Input](/de/glossar/input) und erwartetem [Output](/de/glossar/output), mit dem ein Modell trainiert wird. Bei einem Spamfilter ist ein Beispiel etwa eine einzelne E-Mail zusammen mit der Information, ob sie tatsächlich Spam war oder nicht.

Bei einem Sprachmodell entsteht ein einzelnes Beispiel, indem ein Satz an einer Stelle durchgeschnitten wird: Alles davor wird zum Input, das nächste Textstück danach wird zum [Label](/de/glossar/label). Verschiebt man diesen Schnittpunkt, entstehen aus einem einzigen Satz mehrere solcher Beispiele.

Viele Beispiele zusammen bilden einen Trainingsdatensatz.

Ausführlicher erklärt in [Input und Output: Was eine Funktion tut](/de/bausteine/input-und-output).
