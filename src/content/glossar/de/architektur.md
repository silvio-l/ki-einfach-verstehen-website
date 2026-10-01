---
title: 'Architektur'
description: 'Der Bauplan eines Modells: was mit den Zahlen gerechnet wird und wie viele Parameter es dafür gibt, unabhängig von deren Werten.'
translationKey: architektur
---

Die Architektur ist der Bauplan eines [Modells](/de/glossar/modell). Sie legt fest, was gerechnet wird, in welcher Reihenfolge und wie viele [Parameter](/de/glossar/parameter) es dafür gibt. Welche Werte diese Parameter haben, gehört nicht dazu: Das stellt das Training ein. Zwei Modelle mit derselben Architektur können sich deshalb ganz verschieden verhalten.

Bei frei verfügbaren Sprachmodellen nennt eine kleine Konfigurationsdatei den Bautyp und seine Maße, die Parameter stehen in großen Dateien daneben.

*Denkbild: das Mischpult selbst, mit der Zahl seiner Regler und ihrer Verschaltung* — die Reglerstellungen sind die Parameter.

**Ein Beispiel:** Meta bietet das Sprachmodell Llama 3.1 8B in zwei Fassungen an. Die Grundfassung hat nur das Grundtraining hinter sich, das Vorhersagen des nächsten Textstücks. Die Instruct-Fassung wurde danach weitertrainiert, damit sie wie ein Chatbot auf Fragen und Anweisungen eingeht. Beide haben dieselbe Architektur und genau gleich viele Parameter. Den Unterschied im Verhalten machen die Werte: dasselbe Pult, andere Reglerstellungen.

**Nicht verwechseln mit dem ganzen Modell:** Die Architektur allein tut noch nichts Brauchbares. Erst zusammen mit trainierten Parametern ergibt sie ein Modell. Auch mit der Software, die ein Modell lädt, ist sie nicht dasselbe: Die Konfigurationsdatei nennt den Bauplan nur, die Software führt die Rechnung aus.

**Wo du dem Begriff begegnest:** Auf den Download-Seiten frei verfügbarer Modelle, etwa auf der Plattform Hugging Face. Dort steht in der Konfigurationsdatei der Bautyp, zusammen mit Maßen wie der Zahl der Rechenstufen oder der Größe des [Vokabulars](/de/glossar/vokabular). Auch Fachartikel und Meldungen über neue Modelle sprechen von der Architektur, wenn es um den grundsätzlichen Aufbau geht.

Eingeführt in [Parameter, Training und Inferenz, Hardware: Wie ein Modell läuft](/de/bausteine/parameter-training-inferenz-hardware).
