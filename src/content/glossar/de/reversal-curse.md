---
title: 'Reversal Curse'
description: 'Der Befund, dass ein Modell eine im Training gelernte Beziehung oft nicht in die umgekehrte Richtung beantwortet.'
translationKey: reversal-curse
---

Der Reversal Curse (deutsch etwa Umkehrfluch) ist ein Befund von Berglund und Kollegen (2024): Ein Modell, das im Training „A ist B“ gelernt hat, beantwortet die Frage „Was ist B?“ oder „Wer ist B?“ oft nicht. Die Umkehrung fehlt, obwohl sie logisch folgt. In ihrem Experiment passten die Autorinnen und Autoren zwei Sprachmodelle, GPT-3 (von der Firma OpenAI) und Llama-1 (von Meta), mit zusätzlichem Training auf erfundene Fakten an. Bei den erfundenen Fakten war die Trefferquote in der Umkehrung nicht besser als Raten.

**Ein Beispiel (ausgedacht):** Im Training steht: „Frau Berger ist die Mutter von Jonas.“ Fragst du nach der Mutter von Jonas, kann das Modell oft richtig antworten. Fragst du umgekehrt, von wem Frau Berger die Mutter ist, fällt es häufig aus. Die Information ist dieselbe, nur die Richtung wechselt.

**Nicht verwechseln mit fehlender Logik:** Steht derselbe Satz im Gespräch selbst, also in deiner Nachricht an das Modell, kann es die Umkehrung ableiten. Der Befund betrifft also, was das Modell beim Training gelernt hat, nicht, was es aus einem Text im Gespräch folgern kann. Bei Eltern von Prominenten maß Berglund und Kollegen an GPT-4 79 Prozent richtige Antworten auf die Frage nach dem Elternteil und 33 Prozent auf die umgekehrte Frage nach dem Kind. Ob GPT-4 solche Paare im Training gesehen hat, weiß man nicht, denn seine Trainingsdaten sind nicht bekannt. Die Zahlen sind deshalb nur ein Hinweis, kein Beweis. Die Autorinnen und Autoren vermuten, dass das Modell auf den Schutz von Privatpersonen abgestimmt ist und die Zahl die Fähigkeit unterschätzt.

**Wo du dem Begriff begegnest:** In Forschungsarbeiten seit 2023, und in der Diskussion über Fehler von Chatbots bei Fakten. Der Befund steht im Baustein [Versteht KI, was sie sagt?](/de/bausteine/versteht-ki-was-sie-sagt).
