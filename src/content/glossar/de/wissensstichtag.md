---
title: 'Wissensstichtag'
description: 'Der Zeitpunkt, bis zu dem die Trainingsdaten eines Modells reichen. Was danach passiert ist, kennt das Modell aus seinen Gewichten nicht.'
translationKey: wissensstichtag
---

Der Wissensstichtag ist der Zeitpunkt, bis zu dem die Trainingsdaten eines Modells reichen. Ereignisse, die später stattfanden, konnte das Training nicht erfassen. Das Wissen steckt in den [Parametern](/de/glossar/parameter), also in den Zahlenwerten, die das Training eingestellt hat. Sie ändern sich im Gespräch nicht.

**Ein Beispiel:** Ein Modell mit Stichtag Juni hat von einer Wahl im September nichts im Training gesehen. Fragst du danach, kann es nur aus Text antworten, der im Gespräch liegt, etwa aus einer Suche. Ohne Suche rät es oder greift auf älteres Wissen zurück.

**Nicht verwechseln mit einem harten Schnitt:** Der Stichtag ist keine scharfe Grenze. Für die aktuellen Claude-Modelle nennt Anthropic Juni 2026 zweimal. Einmal als Datum, bis zu dem das Wissen am umfangreichsten und verlässlichsten ist, einmal als Stand der breiteren Trainingsdaten.

**Wo du dem Begriff begegnest:** In Modellübersichten der Anbieter steht meist ein Datum für den Wissensstand.

Eingeführt wird der Begriff in [Was ein Chatbot in einem Gespräch weiß: Vier Quellen, ein Kontextfenster](/de/bausteine/was-ein-chatbot-im-gespraech-weiss).
