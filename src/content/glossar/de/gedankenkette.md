---
title: 'Gedankenkette'
description: 'Die Methode, bei der ein Modell Zwischenschritte als Text schreibt, bevor es die Antwort gibt.'
translationKey: gedankenkette
---

Eine Gedankenkette (englisch Chain of Thought) ist ein Gedankengang aus Zwischenschritten, den ein Modell vor der Antwort als Text schreibt. Jeder Schritt bleibt im [Kontext](/de/glossar/kontextfenster) stehen und dient dem nächsten als Grundlage. Der Begriff meint das Verfahren ebenso wie den geschriebenen Text selbst. Gezählt als geschriebener Text, besteht der Gedankengang aus [Denk-Tokens](/de/glossar/denk-tokens). Eine Zeile davon umfasst oft viele von ihnen.

**Ein Beispiel (ausgedacht):** Starte mit 3, verdopple das Ergebnis, addiere 4, verdopple wieder, addiere 1. Die Gedankenkette lautet 6, 10, 20, die Antwort ist 21. Das Modell schreibt die Zwischenergebnisse hin, statt sie im Kopf zu behalten. Bei Aufgaben, bei denen jeder Schritt den vorigen braucht, kann das helfen. Ob es hilft, hängt vom Modell ab: Eine Studie von 2022 (Wei und Kollegen) fand Hilfe erst bei Modellen mit rund 100 Milliarden [Parametern](/de/glossar/parameter), also den gespeicherten Gewichten.

**Nicht verwechseln mit einem Beleg:** Eine Gedankenkette beweist nicht, dass die Antwort stimmt. Ein falscher Zwischenschritt wird selbst Text, und der nächste Schritt baut auf ihm auf, als wäre er richtig. Ob ein angezeigter Gedankengang den wirklichen Ablauf zeigt, ist außerdem eine eigene Frage.

**Wo du dem Begriff begegnest:** In Forschungsarbeiten seit 2022, dort unter dem Namen Chain-of-Thought, und in Anleitungen für Prompts. Die Befunde dazu, mit Zahlen und Quellen, stehen im Baustein [Wie ein Modell „nachdenkt“: Zwischenschritte, die es selbst schreibt](/de/bausteine/wie-ein-modell-nachdenkt).
