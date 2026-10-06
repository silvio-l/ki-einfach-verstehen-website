---
title: 'Diffusionsmodell'
description: 'Eine Art KI-Modell, die Bilder erzeugt, indem sie Bildrauschen in vielen kleinen Schritten entfernt, gesteuert durch einen Text.'
translationKey: diffusionsmodell
---

Ein Diffusionsmodell ist ein [Modell](/de/glossar/modell), das Bilder erzeugt. Es beginnt nicht mit einer leeren Fläche, sondern mit reinem Bildrauschen, wie ein stark gestörtes Fernsehbild. In vielen kleinen Schritten entfernt es einen Teil dieses Rauschens. Nach jedem Schritt ist ein wenig mehr Struktur zu erkennen, bis am Ende ein fertiges Bild steht. Gelernt hat das Modell im Training den umgekehrten Weg: Es bekam echte Bilder, die schrittweise verrauscht wurden, und sollte das Rauschen wieder herausrechnen. Ein Text, etwa „eine Katze auf einem Fensterbrett“, steuert, in welche Richtung das Entrauschen geht.

**Ein Beispiel:** Stable Diffusion ist ein frei verfügbares Diffusionsmodell, das aus einer Texteingabe ein Bild erzeugt. Damit das schneller geht, arbeitet es nicht direkt auf den Bildpunkten, sondern auf einer stark verkleinerten Zwischenform des Bildes.

**Nicht verwechseln mit einem [Sprachmodell](/de/glossar/sprachmodell):** Ein Sprachmodell erzeugt Text Stück für Stück von vorn nach hinten. Ein Diffusionsmodell arbeitet am ganzen Bild gleichzeitig und verfeinert es Schritt für Schritt. Beide bestehen aus Bauplan und trainierten [Parametern](/de/glossar/parameter), rechnen aber auf verschiedene Weise.

**Wo du dem Begriff begegnest:** Bei vielen Bildgeneratoren, die aus einer Beschreibung Bilder malen, in Programmen zur Bildbearbeitung mit KI-Funktionen und in Berichten über KI-erzeugte Fotos und Kunstwerke.

Eingeführt in [Was ein KI-Modell eigentlich ist](/de/bausteine/was-ein-ki-modell-eigentlich-ist).
