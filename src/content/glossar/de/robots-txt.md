---
title: 'robots.txt'
description: 'Eine Textdatei auf einer Website, in der der Betreiber Crawlern mitteilt, welche Bereiche sie abrufen dürfen.'
translationKey: robots-txt
---

Die robots.txt ist eine Textdatei im Hauptverzeichnis einer Website. Sie enthält Anweisungen für Crawler, also Programme, die Webseiten automatisch abrufen. Der Betreiber schreibt dort etwa, welcher Crawler gemeint ist und welche Bereiche er nicht abrufen soll. Die Datei ist eine Bitte an Programme; ob sie sich daran halten, liegt bei ihnen. Sie erzwingt nichts.

Für KI-Training ist die robots.txt wichtig, weil sie ein [Nutzungsvorbehalt](/de/glossar/nutzungsvorbehalt) in maschinenlesbarer Form sein kann. Dafür gibt es einzelne Crawler-Namen, etwa den von Common Crawl, einer Organisation, die Webseiten sammelt und ihr Archiv frei zur Verfügung stellt. Eine Zeile wie „User-agent: CCBot“ mit „Disallow: /“ bittet diesen Crawler, die ganze Seite nicht abzurufen.

**Ein Beispiel:** Eine Website legt eine robots.txt an, die einem bestimmten Crawler den Zugriff verbietet, allen anderen aber nicht. Ein Mensch, der die Seite besucht, merkt davon nichts. Ein Sammelprogramm, das sich an die Datei hält, lässt die Seite für diesen Crawler aus.

**Nicht verwechseln mit einem Schutz:** Die robots.txt schützt keine Inhalte technisch. Wer den Text abrufen will, kann die Datei ignorieren. Ob der Hinweis rechtlich wirkt, hängt davon ab, wie das Gesetz eine maschinenlesbare Angabe bewertet.

**Wo du dem Begriff begegnest:** Beim Aufruf jeder großen Website, unter der Adresse /robots.txt, und in den Erklärungen von Anbietern, welche Crawler sie nutzen und wie man sie ausschließt.

Eingeführt im Baustein „[Trainingsdaten: Urheberrecht und Datenschutz](/de/bausteine/trainingsdaten-urheberrecht-und-datenschutz)“ im Abschnitt über den Vorbehalt, der nur ein Computer lesen kann.
