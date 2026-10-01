---
title: 'Trainingsdaten'
description: 'Die Beispiele, auf die ein Trainingsalgorithmus angewendet wird, um die Parameter eines Modells einzustellen.'
translationKey: trainingsdaten
---

Trainingsdaten sind die Beispiele, auf die ein [Trainingsalgorithmus](/de/glossar/trainingsalgorithmus) angewendet wird, um die [Parameter](/de/glossar/parameter) eines [Modells](/de/glossar/modell) einzustellen. Bei einem Spamfilter wären das etwa tausende E-Mails, die bereits als „Spam“ oder „kein Spam“ markiert sind; bei einem [Sprachmodell](/de/glossar/sprachmodell) riesige Mengen an Text.

Ein Modell kann nur Muster lernen, die in seinen Beispielen stecken, und es lernt auch deren Fehler mit. Hätten Menschen beim Markieren jede Mail mit dem Wort „Rechnung“ als Spam eingeordnet, würde der Filter genau das lernen. Eine falsche Regel, die man nachlesen und korrigieren könnte, stünde dann nirgends.

**Ein Beispiel:** Bei einem Sprachmodell steckt die richtige Antwort schon im Text selbst. Aus dem Satz „Die Katze sitzt auf dem Sofa.“ entstehen gleich mehrere [Beispiele](/de/glossar/beispiel): Zum Input „Die Katze sitzt“ gehört das [Label](/de/glossar/label) „auf“, zu „Die Katze sitzt auf“ das Label „dem“. Niemand muss dafür etwas von Hand markieren.

**Nicht verwechseln mit deinem Input im Einsatz:** Trainingsdaten verstellen die Parameter, solange trainiert wird. Was du später einem fertigen Modell gibst, eine Mail oder eine Frage an einen Chatbot, ist Input. Dazu gibt es kein Label, und kein Parameter verändert sich. Nutzt ein Anbieter solche Eingaben später für ein neues Training, ist das ein eigener Trainingsschritt.

**Wo du dem Begriff begegnest:** In Nachrichten über KI, wenn es darum geht, mit welchen Texten oder Bildern ein Modell trainiert wurde. Außerdem in Einstellungen und Datenschutzhinweisen mancher Dienste, die angeben, ob deine Eingaben für künftiges Training verwendet werden.

Wie viel und welche Art von Trainingsdaten ein Modell tatsächlich braucht und woher sie stammen, ist Thema eines eigenen, späteren Themenbereichs.

Mehr dazu in [„Programm, Algorithmus, Modell im Vergleich“](/de/bausteine/programm-algorithmus-modell).
