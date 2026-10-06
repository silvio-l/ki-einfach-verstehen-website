---
title: 'Transformer'
description: 'Die 2017 vorgestellte Architektur aus vielen gleich gebauten Blöcken mit Attention, auf der heutige Sprachmodelle beruhen.'
translationKey: transformer
---

Ein Transformer ist eine [Architektur](/de/glossar/architektur) für Modelle, die aus vielen gleich gebauten [Transformerblöcken](/de/glossar/transformerblock) besteht. In jedem Block mischt die [Attention](/de/glossar/attention) Information zwischen den [Tokens](/de/glossar/token), danach wird jedes Token für sich weiterverarbeitet. Am Anfang stehen die Steckbriefe der Tokens, am Ende Zustände, in die viel Kontext eingemischt ist.

Vorgestellt wurde der Transformer 2017 in einem Forschungspaper, ursprünglich für maschinelle Übersetzung. Attention gab es schon vorher; neu war, ein Modell ganz darauf aufzubauen, ohne Text Wort für Wort nacheinander zu verarbeiten. Heutige Chatbot-Modelle nutzen eine Variante, die nur von links nach rechts liest und dafür eine [Causal Mask](/de/glossar/causal-mask) verwendet.

**Ein Beispiel:** GPT-2, Llama 3.1 8B und Qwen3-8B sind Transformer. Sie unterscheiden sich unter anderem in der Zahl der Blöcke: 12, 32 und 36.

**Nicht verwechseln mit dem Original von 2017:** Das Original hatte 6 Blöcke und zwei Hälften, eine zum Lesen des Ausgangstexts und eine zum Schreiben der Übersetzung. Heutige Sprachmodelle ändern zudem Einzelheiten, etwa wie die Position eines Tokens einfließt.

**Wo du dem Begriff begegnest:** In Modellbeschreibungen und Fachtexten, oft als „Decoder-only-Transformer“, und in der Konfiguration frei verfügbarer Modelle.

Eingeführt in [Transformerblöcke und Attention: Wie Kontext eingemischt wird](/de/bausteine/transformerbloecke-und-attention).
