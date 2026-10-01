---
title: 'Inferenz'
description: 'Das Benutzen eines fertig trainierten Modells: Es rechnet mit seinen festen Parametern aus einem Input einen Output.'
translationKey: inferenz
---

Inferenz heißt, ein fertig trainiertes [Modell](/de/glossar/modell) zu benutzen. Es bekommt einen [Input](/de/glossar/input) und rechnet mit seinen festen [Parametern](/de/glossar/parameter) einen [Output](/de/glossar/output) aus. Bei einem Sprachmodell ist jede Antwort auf einen [Prompt](/de/glossar/prompt) Inferenz.

Anders als beim Training wird dabei nichts verglichen und kein Parameter nachgestellt. Deshalb braucht Inferenz für eine einzelne Anfrage viel weniger Rechenzeit und Speicher als das Training.

*Denkbild: das Konzert nach dem Soundcheck* — die Regler bleiben stehen, das Pult verarbeitet, was hereinkommt.

**Ein Beispiel:** Ein trainierter [Spamfilter](/de/glossar/spamfilter) bekommt eine neue Mail und rechnet mit seinen Gewichten ein Urteil aus: Spam oder Posteingang. Die Gewichte bleiben dabei unverändert. Genauso bei einem Chatbot: Er erzeugt seine Antwort auf deine Frage Textstück für Textstück, und für jedes Stück rechnet er mit denselben Parametern wie bei allen anderen Anfragen.

**Nicht verwechseln mit Lernen im Gespräch:** Ein Chatbot lernt nicht dazu, während du mit ihm schreibst. Bei der Inferenz bewegt sich kein Parameter, ganz gleich, was du eingibst. Was er sich innerhalb eines Gesprächs „merkt“, wird bei jeder Nachricht als Input mitgeschickt. Mit „Inferenz“ ist hier auch keine logische Schlussfolgerung gemeint, sondern schlicht das Benutzen des Modells.

**Wo du dem Begriff begegnest:** Bei Anbietern von KI-Diensten, die das Benutzen ihrer Modelle oft nach [Tokens](/de/glossar/token) abrechnen. In Meldungen über Rechenzentren und KI-Chips, die zwischen Hardware für Training und für Inferenz unterscheiden. Eine einzelne Anfrage ist billig, doch weil Millionen Menschen Fragen stellen, braucht auch Inferenz zusammengenommen große Rechenzentren.

Eingeführt in [Parameter, Training und Inferenz, Hardware: Wie ein Modell läuft](/de/bausteine/parameter-training-inferenz-hardware).
