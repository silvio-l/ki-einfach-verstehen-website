---
title: 'Validierungs-Loss'
description: 'Der Loss auf zurückgehaltenem Text, den das Training nie sieht, zeigt, ob ein Modell Muster lernt statt Einzelheiten.'
translationKey: validierungs-loss
---

Der Validierungs-Loss ist der Loss auf einem Prüftext, den man vor dem Training zurückhält. Dieser Text kommt nie ins Training, kein [Parameter](/de/glossar/parameter) wird nach ihm nachgestellt. In regelmäßigen Abständen sagt das Modell ihn vorher, und der Loss darauf zeigt, wie gut es mit unbekanntem Text zurechtkommt.

**Ein Beispiel:** Ein winziges Zeichenmodell lernt aus den ersten 4.000 Zeichen von Kafkas „Die Verwandlung“, das letzte Zehntel der Erzählung ist der Prüftext. Nach neun Epochen ist der Validierungs-Loss am niedrigsten, danach steigt er wieder, obwohl der Trainings-Loss weiter fällt. Mit fast der ganzen Erzählung als Trainingstext bleiben beide Werte dicht beieinander.

**Nicht verwechseln mit dem Trainings-Loss:** Der Trainings-Loss misst, wie gut das Modell genau die Texte vorhersagt, an denen es gerade lernt. Er sinkt auch dann, wenn es sich nur auf deren Eigenheiten einstellt. Erst der Vergleich beider Kurven zeigt eine [Überanpassung](/de/glossar/ueberanpassung). Damit der Prüftext wirklich unbekannt bleibt, entfernt man vorher Kopien von ihm aus den [Trainingsdaten](/de/glossar/trainingsdaten).

**Wo du dem Begriff begegnest:** In Trainingsprotokollen und Diagrammen, oft als „val loss“ oder „eval loss“ neben „train loss“. In Forschungspapieren über Sprachmodelle ist er die Messgröße, an der man ablesen kann, ob ein größeres Modell oder mehr Text etwas bringt.

Eingeführt in [Batch, Epoch, Step, Tokenbudget: Wie man Trainingsfortschritt misst](/de/bausteine/batch-epoch-step-tokenbudget).
