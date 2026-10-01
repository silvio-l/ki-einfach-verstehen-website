---
title: 'Prompt'
description: 'Der Text-Input, den du einem KI-Modell übergibst — er wirkt nur, solange er mitgeschickt wird, und ändert nicht die gespeicherten Parameter.'
translationKey: prompt
---

Ein Prompt ist der Text, den du einem KI-Assistenten als Eingabe übergibst, also deine Frage, deine Anweisung, dein Auftrag. Der Prompt wirkt nur auf Antworten, in deren Input er steckt: Er ist [Input](/de/glossar/input) für ein bereits fertig trainiertes [Modell](/de/glossar/modell), verändert aber nicht dessen gespeicherte [Parameter](/de/glossar/parameter).

**Ein Beispiel:** Du schreibst „Erklär mir in drei Sätzen, was ein Tokenizer ist“. Dieser Text geht als Input in die erste Runde. Das Modell bewertet, welches Textstück als Nächstes passt, eins wird ausgewählt und angehängt, und so wächst die Antwort Stück für Stück. Fragst du danach nur „Und kürzer?“, versteht der Chatbot den Bezug, weil der bisherige Gesprächsverlauf mit jeder neuen Nachricht erneut als Input mitgeschickt wird.

**Nicht verwechseln mit Training:** Selbst eine feste, wiederholt mitgeschickte Anweisung (manche Anbieter nennen das „System-Prompt“ oder „Custom Instructions“) ändert nichts an den Parametern des Modells. Sie wirkt nur, solange sie Teil dessen ist, was dem Modell gerade mitgeschickt wird. Ein neues Gespräch beginnt deshalb ohne den alten Verlauf, außer die Anwendung schickt selbst etwas daraus mit. Ein Modell dauerhaft zu verändern bedeutet dagegen immer: neu trainieren.

**Wo du dem Begriff begegnest:** Im Eingabefeld jedes Chatbots, in Anleitungen zum „Prompten“ und überall dort, wo es darum geht, Anweisungen an eine KI geschickt zu formulieren. Technisch zählt ein langer Prompt mit: Zusammen mit dem bisherigen Verlauf belegt er Platz im [Kontextfenster](/de/glossar/kontextfenster), das nur eine begrenzte Zahl von Tokens fasst.

Ausführlicher eingeordnet in [„Input und Output: Was eine Funktion tut“](/de/bausteine/input-und-output).
