---
title: 'Chat-Vorlage'
description: 'Das feste Muster eines Chatmodells, das Nachrichten mit Rollen und Spezial-Tokens zu einer einzigen Tokenfolge zusammensetzt.'
translationKey: chat-vorlage
---

Eine Chat-Vorlage (englisch „chat template“) legt fest, wie aus einem Gespräch eine einzige Folge von [Tokens](/de/glossar/token) wird. Ein [Sprachmodell](/de/glossar/sprachmodell) kann nur eine Folge fortsetzen; es kennt keine getrennten Sprechblasen. Die Vorlage nimmt deshalb die Liste der Nachrichten, jede mit ihrer Rolle wie „system“, „user“ oder „assistant“, und setzt sie mit [Spezial-Tokens](/de/glossar/spezial-token) als Markierungen hintereinander. Am Ende öffnet sie die Rolle des Assistenten, damit das Modell dort mit seiner Antwort weiterschreibt.

**Ein Beispiel:** Aus der Anweisung „Antworte kurz.“ und der Frage „Wie heißt die Hauptstadt von Frankreich?“ macht die Vorlage von Llama 3.1 eine Folge aus 50 Tokens. Sie fügt dabei sogar zwei Datumszeilen ein, die niemand getippt hat. Bei Gemma 3 werden aus demselben Chat 22 Tokens, bei gpt-oss 86.

**Nicht verwechseln mit einer Textvorlage für Prompts:** Gemeint ist kein Mustertext, den du ausfüllst, sondern das technische Format, das das Programm um das Modell herum bei jeder Anfrage anwendet. Jedes Chatmodell hat im Training sein eigenes Format gelernt; mit einer fremden Vorlage antwortet es deutlich schlechter.

**Wo du dem Begriff begegnest:** In Anleitungen für frei verfügbare Modelle, in Programmbibliotheken wie Transformers (dort heißt die Funktion `apply_chat_template`) und in Modellbeschreibungen, die ein bestimmtes „Prompt-Format“ vorschreiben.

Eingeführt in [Tokenisierung im Modell: Wie dein Chat zu einer Tokenfolge wird](/de/bausteine/tokenisierung-im-modell).
