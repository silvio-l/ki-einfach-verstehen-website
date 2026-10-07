---
title: 'Wie Lernen funktioniert'
description: 'Wie lernt eine KI? Sie misst ihren Fehler, verfolgt Verbesserungen rückwärts durch ihre Rechenschritte und ändert ihre Gewichte Schritt für Schritt.'
translationKey: wie-lernen-funktioniert
routeSlug: wie-lernen-funktioniert
order: 3
bausteine:
  - order: 1
    title: 'Aus Text werden viele Übungsaufgaben'
    slug: aus-text-werden-uebungsaufgaben
  - order: 2
    title: 'Forward Pass und Loss: Wie das Modell seinen eigenen Fehler misst'
    slug: forward-pass-und-loss
  - order: 3
    title: 'Backpropagation und Gradienten: Wie das Modell weiß, was es ändern muss'
    slug: backpropagation-und-gradienten
  - order: 4
    title: 'Optimierung: Wer die Gewichte tatsächlich ändert'
    slug: optimierung-der-gewichte
  - order: 5
    title: 'Batch, Epoch, Step, Tokenbudget: Wie man Trainingsfortschritt misst'
    slug: batch-epoch-step-tokenbudget
---

Hier geht es um den Vorgang, durch den aus einer noch ungeübten Rechenstruktur ein nützliches Modell wird. Du verfolgst, wie Trainingsaufgaben entstehen, wie Fehler messbar werden und wie viele kleine Parameteränderungen das Verhalten allmählich verbessern.

Die Reihenfolge macht einen sonst schwer sichtbaren Kreislauf greifbar: vorhersagen, Fehler bestimmen, den Einfluss jedes Gewichts berechnen und die Gewichte gezielt verändern.
