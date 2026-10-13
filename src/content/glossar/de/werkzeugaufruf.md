---
title: 'Werkzeugaufruf'
description: 'Die Anforderung, mit der ein Modell ein Werkzeug nutzen will: ein Textstück in festem Format, das ein Programm erkennt und ausführt.'
translationKey: werkzeugaufruf
---

Ein Werkzeugaufruf ist die Anforderung eines [Modells](/de/glossar/sprachmodell), ein [Werkzeug](/de/glossar/werkzeug) außerhalb des Modells zu nutzen, etwa eine Suche oder das Lesen einer Datei. Das Modell schreibt keinen Befehl, der etwas tut. Es schreibt Text in einem festen Format, meist mit dem Namen des Werkzeugs und den Angaben für seine Ausführung. Das Programm bekommt den Aufruf als klar gegliederten Block mit Namen und Angaben und muss ihn nicht aus dem Fließtext herauslesen.

**Ein Beispiel:** Das Modell schreibt `liste_dateien` mit dem Ordner `Entwürfe`. Das Programm nimmt den Block entgegen, führt den Aufruf auf dem Rechner aus und schreibt das Ergebnis als Text in den Verlauf. Das Modell sieht nur diesen Text, nicht den Ordner selbst.

**Nicht verwechseln mit der Ausführung:** Der Aufruf ist die Bitte, das Ergebnis ist die Antwort auf die Bitte. Ein Aufruf ist noch keine Handlung. Zwischen beiden liegt die Ausführung. Bei Server-Werkzeugen wie der Websuche übernimmt der Anbieter diesen Schritt, und du siehst nur das Ergebnis. Werkzeuge, die dein Programm ausführt, etwa das Ausführen von Befehlen, laufen dort, wo das Programm läuft. Ob vorher nachgefragt wird, legt das Programm über seine Berechtigungen fest (siehe [Berechtigung](/de/glossar/berechtigung)).

**Wo du dem Begriff begegnest:** In Chat-Apps erscheint ein Werkzeugaufruf oft als eigener Schritt, etwa „Suche im Netz“. Ob er ausgeführt wird, entscheidet nicht das Modell, auch wenn es höflich darum bittet. Bei Werkzeugen, die dein Programm ausführt, entscheidet dessen [Berechtigung](/de/glossar/berechtigung), ob vorher gefragt wird; Server-Werkzeuge wie die Websuche führt der Anbieter aus.

Eingeführt wird der Begriff in [Vom Chatbot zum Agenten: Wie KI eine Aufgabe abarbeitet](/de/bausteine/vom-chatbot-zum-agenten).
