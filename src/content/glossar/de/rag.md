---
title: 'RAG'
description: 'Retrieval-Augmented Generation: Das System sucht passende Textstellen und fügt sie vor dem Antworten in den Kontext ein.'
translationKey: rag
---

RAG steht für Retrieval-Augmented Generation, auf Deutsch etwa „Abruf-gestützte Erzeugung“. Ein System durchsucht zum Beispiel Dokumente oder frühere Gespräche nach Textstellen, die zu einer Frage passen. Die gefundenen Stellen werden in den [Kontext](/de/bausteine/was-ein-chatbot-im-gespraech-weiss) aufgenommen, damit das Modell sie beim Antworten nutzen kann. Lewis und Kollegen haben das Verfahren 2020 beschrieben.

**Ein Beispiel:** Du fragst nach einer Angabe aus einem Handbuch, das viele hundert Seiten hat. Das System sucht die drei Abschnitte heraus, die zur Frage passen, und legt sie in das [Kontextfenster](/de/glossar/kontextfenster). Das Modell kann seine Antwort dann auf diese drei Abschnitte stützen.

**Nicht verwechseln mit einem eigenen Modell:** Beim Einsatz im Chat ist RAG kein neues Modell und kein Training. Die Gewichte, also die beim Lernen eingestellten Werte im Modell, bleiben unverändert. Das Modell bekommt nur die Textstellen ins Kontextfenster, die die Suche findet.

**Wo du dem Begriff begegnest:** Wenn Claude frühere Chats durchsucht, nutzt es laut der Hilfeseite des Anbieters dieses Verfahren. Auch Wissensdatenbanken für Unternehmen nutzen es häufig.

Eine Einführung zum Begriff findest du in [Was ein Chatbot in einem Gespräch weiß: Vier Quellen, ein Kontextfenster](/de/bausteine/was-ein-chatbot-im-gespraech-weiss).
