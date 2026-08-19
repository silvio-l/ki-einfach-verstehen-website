---
title: 'Programm, Algorithmus, Modell — was ist der Unterschied?'
description: 'Klärt den Unterschied zwischen Algorithmus (Verfahren) und Modell (Ergebnis) anhand des Kochrezept-vs-Mischpult-Bildes.'
themenbereich: grundlagen
order: 1
translationKey: programm-algorithmus-modell
---

Bevor es losgeht, ein kurzer Gedanke zum Selbst-Ausprobieren: Was, glaubst du, unterscheidet ein KI-Modell wie ein Sprachmodell von einem ganz gewöhnlichen Computerprogramm — ist das im Kern dasselbe, nur komplizierter, oder etwas grundlegend anderes?

## Ein weit verbreiteter Irrtum

Eine sehr verbreitete Vorstellung lautet: „Ein KI-Modell ist einfach ein extrem kompliziertes Programm mit sehr vielen Wenn-Dann-Regeln." Das klingt plausibel — Programme bestehen tatsächlich aus Regeln, und ein Sprachmodell trifft ständig irgendwelche Entscheidungen. Warum sollte darunter also nicht einfach eine sehr, sehr lange Liste von Regeln stecken, die irgendjemand aufgeschrieben hat?

Tatsächlich passiert etwas anderes: Bei einem klassischen Programm hat ein Mensch jede Regel selbst festgelegt. Bei einem KI-Modell legt kein Mensch die einzelnen Regeln fest — sie entstehen aus Beispielen, in einem eigenen Vorgang, der einmal durchlaufen wird, bevor das Modell überhaupt benutzt wird. Um zu verstehen, wie das funktioniert, lohnt sich ein Blick auf drei Begriffe, die oft durcheinandergeworfen werden: Programm, Algorithmus und Modell.

## Programm: die feststehenden Anweisungen

Ein **Programm** ist eine von Menschen geschriebene Folge von Anweisungen. Der Code legt fest, welche Rechenschritte in welcher Reihenfolge ausgeführt werden — und zwar vollständig, bevor das Programm läuft.

*Denkbild: ein Kochrezept, dessen Schritte bereits feststehen.* Wer das Rezept befolgt, weiß vorher genau, was in welcher Reihenfolge passiert.

## Algorithmus: das Verfahren dahinter

Ein **Algorithmus** ist ein allgemeines, endliches Lösungsverfahren — die Idee hinter einem Programm, nicht der konkrete Code selbst. Ein Sortieralgorithmus beschreibt zum Beispiel, wie sich ungeordnete Werte in eine Reihenfolge bringen lassen; ein konkretes Programm ist dann eine mögliche Umsetzung dieser Idee in einer bestimmten Programmiersprache.

Beim maschinellen Lernen gibt es einen eigenen **Trainingsalgorithmus**: ein festes Verfahren, das auf Trainingsbeispiele angewendet wird und daraus etwas Neues erzeugt.

## Modell: das Ergebnis, nicht das Rezept

Ein **Modell** ist eine Rechenstruktur, deren Verhalten zusätzlich von gespeicherten Zahlenwerten abhängt. Diese Zahlen heißen **Parameter** oder **Gewichte**. Der Trainingsalgorithmus stellt sie anhand von Beispielen ein — nicht ein Mensch, der jeden Wert einzeln festlegt.

*Denkbild: ein Mischpult mit sehr vielen Reglern.* Die Anordnung der Regler (die Architektur des Modells) steht fest, aber ihre genauen Stellungen (die Parameter) ergeben sich erst aus dem Training.

Damit lässt sich die Rezept-Analogie einen Schritt weiterdenken: Der Trainingsalgorithmus ist wie das Rezept, das **einmal** auf die Zutaten (die Trainingsdaten) angewendet wird. Das Modell ist der **gebackene Kuchen** — das Ergebnis dieser einen Anwendung. Und genau wie sich ein fertiger Kuchen nicht mehr wie ein Rezept verändern lässt, lässt sich ein fertiges Modell nicht einfach durch eine geänderte Codezeile korrigieren. Etwas an seinem Verhalten zu ändern bedeutet in aller Regel: neu trainieren, mit anderen oder zusätzlichen Zutaten.

<details>
<summary>Eine Ebene tiefer: Was macht etwas formal zu einem Algorithmus?</summary>

In der Informatik gilt ein Verfahren als Algorithmus, wenn es drei Eigenschaften erfüllt: Es besteht aus **endlich vielen, eindeutig festgelegten Schritten**, jeder Schritt ist **ausführbar** (kein Schritt verlangt etwas Unmögliches oder Mehrdeutiges), und das Verfahren **hält nach endlich vielen Schritten an** — es liefert irgendwann ein Ergebnis, statt für immer weiterzulaufen. Ein Sortieralgorithmus erfüllt das offensichtlich; ein Trainingsalgorithmus für ein KI-Modell genauso, auch wenn „endlich viele Schritte" dort schnell in die Millionen geht.

</details>

## Warum der Unterschied wichtig ist

Bei klassischer Programmierung schreibt ein Mensch Regeln, und der Computer wendet sie auf Daten an. Beim maschinellen Lernen schreibt ein Mensch stattdessen den Trainingsalgorithmus, die Struktur des Modells und ein Maß dafür, was ein gutes Ergebnis ausmacht — die konkreten Parameter entstehen erst aus den Trainingsbeispielen. Das ist der Grund, warum sich ein KI-Modell nicht wie gewöhnlicher Code „debuggen" lässt: Es gibt keine einzelne Zeile, in der ein falsches Verhalten steckt, sondern ein Muster über sehr viele Parameter hinweg, das aus den Trainingsdaten stammt.

Zur Einordnung noch ein Begriff, der in diesem Zusammenhang häufig fällt: **KI** (Künstliche Intelligenz) ist der Oberbegriff für Systeme, die Aufgaben lösen, die üblicherweise mit Wahrnehmen, Sprache, Planen oder Entscheiden verbunden werden. Nicht jedes KI-System lernt aus Beispielen — ein trainiertes Modell ist nur eine (aktuell besonders erfolgreiche) Untergruppe davon.

## Und danach?

Ist ein Modell einmal trainiert, ändert sich seine Rolle noch einmal: Es nimmt einen Input entgegen und liefert einen Output — genau wie ein gewöhnliches Programm. Der Unterschied aus diesem Baustein bleibt bestehen (die Regeln stecken in gelernten Parametern statt in handgeschriebenem Code), aber im Betrieb, wenn du zum Beispiel gerade mit einem KI-Assistenten chattest, verhält sich ein trainiertes Modell wieder wie eine ganz normale Funktion. Genau darum geht es im nächsten Baustein.
