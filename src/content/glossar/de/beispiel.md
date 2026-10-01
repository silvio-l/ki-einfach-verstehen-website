---
title: 'Beispiel (Sample)'
description: 'Ein zusammengehöriges Input-Output-Paar, mit dem ein Modell trainiert wird — auch Sample genannt.'
translationKey: beispiel
---

Ein Beispiel (auch **Sample** genannt) ist ein zusammengehöriges Paar aus [Input](/de/glossar/input) und erwartetem [Output](/de/glossar/output), mit dem ein Modell trainiert wird. Der erwartete Output heißt dabei [Label](/de/glossar/label). Viele Beispiele zusammen bilden einen Trainingsdatensatz, die [Trainingsdaten](/de/glossar/trainingsdaten).

**Ein Beispiel:** Bei einem [Spamfilter](/de/glossar/spamfilter) ist ein Beispiel eine einzelne E-Mail zusammen mit der Information, ob sie tatsächlich Spam war oder nicht. Diese Markierung haben Menschen vergeben. Bei einem Sprachmodell entsteht ein Beispiel dagegen, indem ein Satz an einer Stelle durchgeschnitten wird: Alles davor wird zum Input, das nächste Textstück danach zum Label. Aus „Die Katze sitzt auf dem Sofa.“ werden so gleich mehrere Beispiele, etwa „Die Katze sitzt“ → „auf“ und „Die Katze sitzt auf“ → „dem“. Ein Label von Hand vergibt dabei niemand, es steckt schon im Text.

**Nicht verwechseln mit Sampling:** Trotz des ähnlichen Wortes hat [Sampling](/de/glossar/sampling) nichts mit Trainingsbeispielen zu tun. Es bezeichnet den Auswahlschritt, mit dem ein fertiges Sprachmodell im Einsatz das nächste Textstück per gewichtetem Zufall bestimmt. Beispiele gibt es dagegen nur im Training, denn nur dort ist bekannt, welcher Output richtig gewesen wäre. Stellst du einem Chatbot eine Frage, bekommt das Modell nur Input ohne Label.

**Wo du dem Begriff begegnest:** Das englische „Sample“ liest du in Fachtexten und Berichten über das Training von KI-Modellen, oft wenn es um Menge und Qualität der Trainingsdaten geht. Im Alltag steckst du selbst manchmal hinter einem Beispiel: Markierst du eine Mail als Spam, kann daraus Material für einen späteren Trainingsschritt werden.

Ausführlicher erklärt in [Input und Output: Was eine Funktion tut](/de/bausteine/input-und-output).
