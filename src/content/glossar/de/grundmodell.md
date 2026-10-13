---
title: 'Grundmodell'
description: 'Ein Modell nach dem Grundtraining, das nur gelernt hat, Text fortzusetzen, und noch nicht für Gespräche nachtrainiert ist.'
translationKey: grundmodell
---

Ein Grundmodell ist ein [Modell](/de/glossar/modell) nach dem Grundtraining, aber vor dem Chat-Training. Es hat gelernt, das nächste Stück eines Textes vorherzusagen, und auf Fragen ist es nicht eingestellt. Deshalb schreibt es auf eine Frage oft weitere Fragen, denn in Texten folgt auf eine Frage häufig eine nächste.

**Ein Beispiel:** Im Paper von OpenAI aus dem Jahr 2022 bekam GPT-3 mit 175 Milliarden [Parametern](/de/glossar/parameter) den Auftrag, eine kurze Geschichte auf Französisch zu schreiben. GPT-3 schrieb keine Geschichte, sondern drei weitere Aufgaben derselben Art (arXiv:2203.02155v1, Abbildung 8, S. 15). Die Legende sagt, dass die Beispiele ausgewählt sind; bei einer Code-Frage beantwortete GPT-3 die Frage nur etwa in der Hälfte der Fälle. Man kann sich das wie eine Schreibkraft vorstellen, die ein angefangenes Dokument weiterschreibt: Sie folgt dem Muster, das in solchen Dokumenten üblich ist, und beantwortet die Aufgabe oft nicht.

**Nicht verwechseln mit einem Chatmodell:** Ein Chatmodell entsteht, wenn das Grundmodell danach nachtrainiert wird, damit es Anweisungen befolgt. Die Modellkarte von Qwen2.5-7B nennt das Modell „the base 7B Qwen2.5 model“ und spricht allgemein von „base language models“, was sich mit Basismodelle übersetzen lässt. Dieser Text sagt Grundmodell, weil der Begriff zum Grundtraining passt. Ein Grundmodell ist also nicht kaputt; es hat nur ein anderes Ziel gelernt.

**Wo du dem Begriff begegnest:** In Modellkarten, die davon abraten, ein Modell für Gespräche zu verwenden, und stattdessen Nachtraining empfehlen.

Eingeführt in [Vom Textfortsetzer zum Assistenten: Was das Nachtraining aus einem Modell macht](/de/bausteine/vom-textfortsetzer-zum-assistenten).
