---
title: 'Optimierer'
description: 'Die feste Rechenvorschrift im Training, die aus dem Gradienten den Schritt jedes Parameters macht und die Parameter tatsächlich verändert.'
translationKey: optimierer
---

Ein Optimierer ist die feste Rechenvorschrift, die im Training aus dem Gradienten einen Schritt für jeden [Parameter](/de/glossar/parameter) macht. Er ist der Teil des [Trainingsalgorithmus](/de/glossar/trainingsalgorithmus), der die Parameter tatsächlich verändert. Die einfachste Form ist die Regel „Schritt gleich Steigung mal [Lernrate](/de/glossar/lernrate)“. Große Sprachmodelle werden meist mit Adam oder AdamW trainiert: Sie nehmen Schwung aus früheren Steigungen mit, geben jedem Parameter eine eigene Schrittweite, und AdamW zieht jeden Parameter zusätzlich leicht Richtung null.

**Ein Beispiel:** Zwei [Parameter](/de/glossar/parameter) bekommen über vier [Batches](/de/glossar/batch) (Stapel von Beispielen) ihre Steigungen. Die Steigungen des einen zeigen abwechselnd stark nach oben und nach unten, die des anderen jedes Mal ein wenig nach oben. Die einfache Regel schickt den ersten Parameter bei jedem Batch weit hin und her; unter dem Strich kommt er kaum voran. Adam dagegen bringt den zweiten weiter als die einfache Regel, weil er jeden Schritt durch die übliche Größe der Steigungen dieses Parameters teilt: Seine kleinen, stets gleich gerichteten Steigungen ergeben fast einen vollen Lernraten-Schritt.

**Nicht verwechseln mit der Backpropagation:** Die Backpropagation rechnet nur aus, in welche Richtung und wie stark jeder Parameter sich ändern müsste. Bewegt wird dabei nichts. Erst der Optimierer macht daraus Schritte. Ein Optimierer ist auch kein Modell und lernt nichts dazu: Seine Hilfswerte, etwa der Schwung, sind Rechenstände des Trainings und fallen beim Benutzen weg.

**Wo du dem Begriff begegnest:** In Forschungspapieren und technischen Berichten zu großen Modellen, meist als Name mit seinen Einstellungen: „trainiert mit AdamW“. Nicht jeder große Lauf nutzt AdamW.

Eingeführt in [Optimierung: Wer die Gewichte tatsächlich ändert](/de/bausteine/optimierung-der-gewichte).
