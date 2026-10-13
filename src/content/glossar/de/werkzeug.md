---
title: 'Werkzeug'
description: 'Eine Funktion, die ein Programm ausführt, damit ein Chatbot Informationen holen oder Aufgaben erledigen kann.'
translationKey: werkzeug
---

Ein Werkzeug ist eine Funktion, die außerhalb des Modells läuft. Das Modell kann sie anfordern, etwa eine Websuche oder eine Suche in früheren Chats. Ausgeführt wird sie aber von der Anwendung oder, bei Server-Werkzeugen wie der Websuche, von den Servern des Anbieters, nicht vom Modell selbst. Das Ergebnis kommt als Text zurück in den [Kontext](/de/bausteine/was-ein-chatbot-im-gespraech-weiss) und liegt dann im [Kontextfenster](/de/glossar/kontextfenster), bis das Gespräch es verwirft.

**Ein Beispiel:** Du fragst nach dem Wetter in Leipzig. Die App hat eine Websuche aktiviert. Die Suche liefert Seiten mit aktuellen Angaben, deren Text ins Gespräch geladen wird. Das Modell antwortet dann auf Basis dieses Textes. Ob die Seite stimmt, prüft die Antwort damit nicht.

**Nicht verwechseln mit dem Wissen des Modells:** Ein Werkzeug fügt Text hinzu, es verändert die [Parameter](/de/glossar/parameter) nicht. Was das Modell im Training gelernt hat, bleibt gleich.

**Wo du dem Begriff begegnest:** In Chat-Apps erscheint ein Werkzeugaufruf oft als eigener Schritt, etwa „Suche im Netz“. Die Anwendung beschreibt jedes Werkzeug mit einem Namen und einer Beschreibung, damit das Modell es anfordern kann. Ob die App dich vorher fragt, entscheidet sie selbst; bei Server-Werkzeugen siehst du nur das Ergebnis. Wie daraus ein [Agent](/de/glossar/agent) wird, zeigt der Baustein „Vom Chatbot zum Agenten“.

Eingeführt wird der Begriff in [Was ein Chatbot in einem Gespräch weiß: Vier Quellen, ein Kontextfenster](/de/bausteine/was-ein-chatbot-im-gespraech-weiss).
