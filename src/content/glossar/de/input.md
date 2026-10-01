---
title: 'Input'
description: 'Die Daten, die in einen Rechenschritt hineingegeben werden — eine Zahl, ein Bild, ein Text oder viele Werte gleichzeitig.'
translationKey: input
---

Der Input (die Eingabe) ist das, was in eine [Funktion](/de/glossar/funktion) hineingegeben wird. Das können eine einzelne Zahl, ein Bild, ein Text oder viele zusammengehörige Werte gleichzeitig sein. Jedes Modell rechnet nur mit der Art von Input, für die es gebaut ist: Ein Spamfilter bekommt Text, ein Foto könnte er gar nicht bewerten.

Bei einem Sprachmodell ist der Input bei jedem Vorhersageschritt der bisher geschriebene Text. Aus „Die Katze sitzt“ sieht das Modell zum Beispiel nur diesen vorhandenen Teil, nicht das Wort, das danach folgen wird. Ein [Tokenizer](/de/glossar/tokenizer) zerlegt den Text vor der Berechnung nach festen Regeln in kleinere Textstücke und gibt jedem eine Nummer.

**Ein Beispiel:** Bei einer Bilderkennung ist der Input ein Foto, für das Modell genauer die Helligkeits- und Farbwerte seiner Bildpunkte. Beim [Spamfilter](/de/glossar/spamfilter) sind es die Wörter einer Mail.

**Nicht verwechseln mit dem Prompt:** Der [Prompt](/de/glossar/prompt) ist der Text, den du in einen Chatbot tippst. Er ist der Input der ersten Runde, aber nicht der einzige. Das Sprachmodell hängt jedes neu gewählte Textstück an, und der verlängerte Text ist der Input der nächsten Runde. Im selben Gespräch wird außerdem der bisherige Verlauf jedes Mal wieder mitgeschickt.

**Wo du dem Begriff begegnest:** In Beschreibungen von KI-Diensten bleibt das englische Wort meist stehen, etwa wenn angegeben ist, welche Arten von Input ein Modell annimmt: nur Text oder auch Bilder. Auch Preisangaben führen Input und Output oft getrennt auf.

Ausführlicher erklärt in [Input und Output: Was eine Funktion tut](/de/bausteine/input-und-output).
