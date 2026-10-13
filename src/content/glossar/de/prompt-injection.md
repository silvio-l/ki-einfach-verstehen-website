---
title: 'Prompt Injection'
description: 'Versteckte Anweisungen in Text, den ein Modell verarbeitet, etwa in einer Webseite oder einem Werkzeugergebnis, die das Verhalten des Modells umlenken sollen.'
translationKey: prompt-injection
---

Prompt Injection heißt, dass Text im Kontext eines Modells Anweisungen enthält, die nicht vom Nutzer stammen. Das Modell liest alles im selben Text: die Vorgaben der App, deine Frage und den Inhalt einer Webseite oder eines [Werkzeugergebnisses](/de/glossar/werkzeugaufruf). Ob es eine Anweisung befolgt, entscheidet es aus diesem Text, nicht aus der Herkunft.

**Ein ausgedachtes Beispiel:** Ein Agent soll eine Webseite zusammenfassen. Auf der Seite steht ein versteckter Satz, der das Modell auffordert, seine bisherigen Vorgaben zu vergessen. Das Modell liest diesen Satz mit dem Rest der Seite.

**Nicht verwechseln mit einem Fehler:** Die Anweisung wirkt, weil Anweisung und Inhalt im selben Text stehen. Ein Ergebnis aus einem [Werkzeug](/de/glossar/werkzeug) kann außerdem Anweisungen enthalten, auch wenn es wie reine Information aussieht.

**Wo du dem Begriff begegnest:** Bei Agenten, die Webseiten lesen, etwa bei einer Websuche in einer Chat-App, kann jede gelesene Seite solche Sätze enthalten, meist unsichtbar für dich. Ob das Modell ihnen folgt, lässt sich von außen nicht sicher vorhersagen, auch wenn die Seite harmlos wirkt. Anthropic, der Hersteller von Claude, nennt in einem Beitrag zu Abwehrmaßnahmen für Browser-Agenten Prompt Injection eine der größten Sicherheitsherausforderungen für solche Agenten; das Problem sei noch lange nicht gelöst ([anthropic.com/research/prompt-injection-defenses](https://anthropic.com/research/prompt-injection-defenses)). Dagegen gibt es keine Garantie. Prüfe Antworten, die auf gelesenen Seiten beruhen, an der Quelle.

Eingeführt wird der Begriff in [Vom Chatbot zum Agenten: Wie KI eine Aufgabe abarbeitet](/de/bausteine/vom-chatbot-zum-agenten).
