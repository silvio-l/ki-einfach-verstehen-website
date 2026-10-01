---
title: 'Bildklassifikator'
description: 'Ein trainiertes Modell, das Bilder einer von mehreren vorgegebenen Kategorien zuordnet, etwa „Katze“ oder „Hund“.'
translationKey: bildklassifikator
---

Ein Bildklassifikator ist ein trainiertes [Modell](/de/glossar/modell), das ein Bild als Eingabe entgegennimmt und es einer von mehreren vorgegebenen Kategorien zuordnet, zum Beispiel „Katze“ oder „Hund“. Der [Trainingsalgorithmus](/de/glossar/trainingsalgorithmus) stellt die [Parameter](/de/glossar/parameter) anhand tausender bereits kategorisierter Bilder ein; welche Bildmerkmale tatsächlich zwischen den Kategorien unterscheiden, muss dabei kein Mensch vorher festlegen.

Für das Modell ist ein Foto eine Menge von Zahlen, die Helligkeits- und Farbwerte seiner Bildpunkte. Sein unmittelbarer Output ist kein Wort, sondern ein [Score](/de/glossar/score) für jede Kategorie. Erst ein eigener Schritt danach nimmt die Kategorie mit dem höchsten Score.

**Ein Beispiel:** Ein Klassifikator kennt die Kategorien Katze, Hund, Fuchs und Auto. Für das Foto einer Katze gibt er etwa Katze 6,2, Hund 2,9, Fuchs 1,4 und Auto −3,0 aus (ausgedachte Werte), und auf dem Bildschirm steht „Katze“. Andere Antworten als diese vier kennt er nicht. Auch ein Pferdefoto landet deshalb in einer der vier Kategorien, nämlich in der mit dem höchsten Score.

**Nicht verwechseln mit einem Bildgenerator:** Ein Bildklassifikator ordnet vorhandene Bilder ein, neue erzeugt er nicht. Vom Prinzip her ist er näher an einem trainierten [Spamfilter](/de/glossar/spamfilter): Beide ordnen eine Eingabe einer festen Liste von Kategorien zu, nur mit Bildern statt E-Mails als [Trainingsdaten](/de/glossar/trainingsdaten). Auch ein [Sprachmodell](/de/glossar/sprachmodell) wählt in jeder Runde aus einer festen Liste, seinem [Vokabular](/de/glossar/vokabular). Erst weil es das gewählte Stück anhängt und weiterrechnet, entsteht neuer Text.

**Wo du dem Begriff begegnest:** Häufiger als das Fachwort liest du „Bilderkennung“. Die Idee dahinter steckt zum Beispiel in Apps, die eine Pflanze oder ein Tier auf einem Foto benennen sollen.

Mehr dazu in [„Input und Output: Was eine Funktion tut“](/de/bausteine/input-und-output).
