---
title: 'Transformer'
description: 'Die 2017 vorgestellte Architektur aus vielen gleich gebauten Blöcken mit Attention, auf der heutige Sprachmodelle beruhen.'
translationKey: transformer
---

Ein Transformer ist eine [Architektur](/de/glossar/architektur) für Modelle, die aus vielen gleich gebauten [Transformerblöcken](/de/glossar/transformerblock) besteht. In jedem Block mischt die [Attention](/de/glossar/attention) Information zwischen den [Tokens](/de/glossar/token), danach wird jedes Token für sich weiterverarbeitet. Am Anfang stehen die Embeddings der Tokens, am Ende Zustände, in die viel Kontext eingemischt ist. Aus dem Zustand der letzten Position entsteht später die Liste der Scores für das nächste Token.

Vorgestellt wurde der Transformer 2017 in einem Forschungspaper, ursprünglich für maschinelle Übersetzung. Attention gab es schon vorher; neu war, ein Modell ganz darauf aufzubauen, ohne Text Wort für Wort nacheinander zu verarbeiten. Heutige Chatbot-Modelle nutzen eine Variante, die nur von links nach rechts liest und dafür eine [Causal Mask](/de/glossar/causal-mask) verwendet.

**Ein Beispiel:** Qwen3-8B ist ein Transformer mit 36 Blöcken. Je nach Modell sind es ein bis mehrere Dutzend Blöcke. Die Blöcke laufen nacheinander: Jeder rechnet mit dem Zustand weiter, den der vorige geliefert hat.

**Nicht verwechseln mit dem Original von 2017:** Die Bauart wurde 2017 vorgestellt. Heutige Sprachmodelle übernehmen sie, ändern aber Einzelheiten, etwa wie die Position eines Tokens einfließt.

**Wo du dem Begriff begegnest:** In Modellbeschreibungen und Fachtexten, oft als „Decoder-only-Transformer“, und in der Konfiguration frei verfügbarer Modelle.

Eingeführt in [Transformerblöcke und Attention: Wie Kontext eingemischt wird](/de/bausteine/transformerbloecke-und-attention).
