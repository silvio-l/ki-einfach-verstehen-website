---
title: 'Programm, Algorithmus, Modell — was ist der Unterschied?'
description: 'Klärt den Unterschied zwischen Algorithmus (Verfahren) und Modell (Ergebnis) anhand des Kochrezept-vs-Mischpult-Bildes.'
themenbereich: grundlagen
order: 1
translationKey: programm-algorithmus-modell
quellen:
  - claim: 'Expertensysteme aus den 1980er-Jahren funktionierten, indem Fachleute Wissen als tausende von Hand geschriebene Wenn-Dann-Regeln in eine Wissensbasis eintrugen; das funktionierte für eng begrenzte Aufgaben, stieß aber an Grenzen, je größer die Regelbasis wurde.'
    url: 'https://en.wikipedia.org/wiki/Expert_system'
    geprueft: '2026-08-20'
    abschnitt: 'Ein weit verbreiteter Irrtum'
  - claim: 'Als die Grenzen regelbasierter Expertensysteme (u. a. hohe Pflegekosten, fehlende Lernfähigkeit, Bruchanfälligkeit bei ungewöhnlichen Eingaben) Ende der 1980er/Anfang der 1990er sichtbar wurden, ging Forschungsinteresse und Förderung im KI-Feld deutlich zurück.'
    url: 'https://en.wikipedia.org/wiki/AI_winter'
    geprueft: '2026-08-20'
    abschnitt: 'Ein weit verbreiteter Irrtum'
  - claim: 'Moderne große Sprachmodelle haben nicht nur einige Dutzend, sondern Milliarden von Parametern (GPT-3: 175 Milliarden Parameter).'
    url: 'https://arxiv.org/abs/2005.14165'
    geprueft: '2026-08-20'
    abschnitt: 'Modell: das Ergebnis, nicht das Rezept'
---

Bevor es losgeht, ein kurzer Gedanke zum Selbst-Ausprobieren: Was, glaubst du, unterscheidet ein KI-Modell wie ein [Sprachmodell](/de/glossar/sprachmodell) von einem ganz gewöhnlichen Computerprogramm — ist das im Kern dasselbe, nur komplizierter, oder etwas grundlegend anderes?

## Ein weit verbreiteter Irrtum

Eine sehr verbreitete Vorstellung lautet: „Ein KI-Modell ist einfach ein extrem kompliziertes Programm mit sehr vielen Wenn-Dann-Regeln." Das klingt plausibel — Programme bestehen tatsächlich aus Regeln, und ein Sprachmodell trifft ständig irgendwelche Entscheidungen. Warum sollte darunter also nicht einfach eine sehr, sehr lange Liste von Regeln stecken, die irgendjemand aufgeschrieben hat?

Der Eindruck entsteht auch deshalb leicht, weil sich ein KI-Modell im Gespräch tatsächlich regelhaft verhält: Es hält sich an Grammatik, an ein einigermaßen konsistentes Format, manchmal sogar an erkennbare Muster in der Wortwahl. Wer ein System beobachtet, das sich konsistent verhält, nimmt fast automatisch an, dass irgendwo eine Liste von Regeln existieren muss, die dieses Verhalten festlegt — genau wie bei einem klassischen Programm.

Die Vorstellung ist außerdem nicht aus der Luft gegriffen. Es gab tatsächlich KI-Systeme, die genau so funktionierten: sogenannte [Expertensysteme](/de/glossar/expertensysteme), wie sie in den 1980er-Jahren verbreitet waren. Dabei trugen Fachleute tausende Wenn-Dann-Regeln von Hand in eine Datenbank ein — etwa „Wenn Patient Fieber UND Husten hat UND keinen Hautausschlag, dann eher Grippe als Masern." Solche Systeme funktionierten für eng begrenzte Aufgaben durchaus brauchbar, brauchten aber für jede neue Situation eine neue, von Hand geschriebene Regel und stießen deshalb schnell an ihre Grenzen. Als klar wurde, dass sich komplexe, unscharfe Aufgaben — etwa Bilder erkennen oder natürliche Sprache verstehen — kaum vollständig in von Hand geschriebene Regeln fassen lassen, geriet dieser Ansatz an seine Grenzen; das Forschungsfeld erlebte in der Folge sogar eine Phase deutlich zurückgehenden Interesses und geringerer Förderung, bevor sich der heutige, auf Beispielen basierende Ansatz durchsetzte. Moderne KI-Modelle wie Sprachmodelle sind historisch gesehen tatsächlich auch aus der Abkehr von genau diesem handgeschriebenen Regel-Ansatz entstanden.

Tatsächlich passiert bei einem trainierten Modell etwas anderes: Bei einem klassischen Programm hat ein Mensch jede Regel selbst festgelegt. Bei einem KI-Modell legt kein Mensch die einzelnen Regeln fest — sie entstehen aus Beispielen, in einem eigenen Vorgang, der einmal durchlaufen wird, bevor das Modell überhaupt benutzt wird. Um zu verstehen, wie das funktioniert, lohnt sich ein Blick auf drei Begriffe, die oft durcheinandergeworfen werden: Programm, Algorithmus und Modell.

## Programm: die feststehenden Anweisungen

Ein **[Programm](/de/glossar/programm)** ist eine von Menschen geschriebene Folge von Anweisungen. Der Code legt fest, welche Rechenschritte in welcher Reihenfolge ausgeführt werden — und zwar vollständig, bevor das Programm läuft.

*Denkbild: ein Kochrezept, dessen Schritte bereits feststehen.* Wer das Rezept befolgt, weiß vorher genau, was in welcher Reihenfolge passiert.

Ganz konkret könnte ein winziges Programm so aussehen: eine Regel, die eine Temperaturangabe in Celsius entgegennimmt, sie mit 9/5 multipliziert und 32 addiert, und so die passende Fahrenheit-Angabe ausgibt.

```
Eingabe: Temperatur in Grad Celsius
Ausgabe: Temperatur in Grad Fahrenheit

fahrenheit = celsius * 9 / 5 + 32
ausgabe(fahrenheit)
```

Jeder einzelne Rechenschritt — multiplizieren, addieren, ausgeben — stand schon fest, bevor das Programm zum ersten Mal lief. Egal wie oft du es mit derselben Celsius-Zahl aufrufst: Es rechnet jedes Mal exakt denselben, vorher festgelegten Weg.

## Algorithmus: das Verfahren dahinter

Ein **[Algorithmus](/de/glossar/algorithmus)** ist ein allgemeines, endliches Lösungsverfahren — die Idee hinter einem Programm, nicht der konkrete Code selbst. Ein Sortieralgorithmus beschreibt zum Beispiel, wie sich ungeordnete Werte in eine Reihenfolge bringen lassen; ein konkretes Programm ist dann eine mögliche Umsetzung dieser Idee in einer bestimmten Programmiersprache.

Ein besonders anschauliches Beispiel: Vergleiche jeweils zwei benachbarte Werte in einer Liste, tausche sie, wenn sie in der falschen Reihenfolge stehen, und wiederhole das so lange, bis nichts mehr getauscht werden muss.

```
Wiederhole, bis nichts mehr getauscht wird:
  Für jedes Paar benachbarter Werte in der Liste:
    Wenn linker Wert > rechter Wert:
      Tausche die beiden Werte
```

Diese Idee — „vergleiche, tausche bei Bedarf, wiederhole" — lässt sich in praktisch jeder Programmiersprache umsetzen; der Algorithmus selbst ist aber unabhängig davon, in welcher Sprache er am Ende geschrieben wird. Genau dieser Unterschied zwischen der allgemeinen Idee (Algorithmus) und der konkreten Umsetzung (Programm) wird gleich wichtig, wenn es um Trainingsalgorithmen geht: Auch ein Trainingsalgorithmus lässt sich in unterschiedlichen Programmiersprachen implementieren — die zugrunde liegende Idee bleibt dieselbe.

Beim [maschinellen Lernen](/de/glossar/maschinelles-lernen) gibt es einen eigenen **[Trainingsalgorithmus](/de/glossar/trainingsalgorithmus)**: ein festes Verfahren, das auf [Trainingsbeispiele](/de/glossar/trainingsdaten) angewendet wird und daraus etwas Neues erzeugt.

## Modell: das Ergebnis, nicht das Rezept

Ein **[Modell](/de/glossar/modell)** ist eine Rechenstruktur, deren Verhalten zusätzlich von gespeicherten Zahlenwerten abhängt. Diese Zahlen heißen **[Parameter](/de/glossar/parameter)** oder **Gewichte**. Der Trainingsalgorithmus stellt sie anhand von Beispielen ein — nicht ein Mensch, der jeden Wert einzeln festlegt.

*Denkbild: ein Mischpult mit sehr vielen Reglern.* Die Anordnung der Regler (die Architektur des Modells) steht fest, aber ihre genauen Stellungen (die Parameter) ergeben sich erst aus dem Training.

Damit lässt sich die Rezept-Analogie einen Schritt weiterdenken: Der Trainingsalgorithmus ist wie das Rezept, das **einmal** auf die Zutaten (die [Trainingsdaten](/de/glossar/trainingsdaten)) angewendet wird. Das Modell ist der **gebackene Kuchen** — das Ergebnis dieser einen Anwendung. Und genau wie sich ein fertiger Kuchen nicht mehr wie ein Rezept verändern lässt, lässt sich ein fertiges Modell nicht einfach durch eine geänderte Codezeile korrigieren. Etwas an seinem Verhalten zu ändern bedeutet in aller Regel: neu trainieren, mit anderen oder zusätzlichen Zutaten.

Bei den Denkbildern oben klingt das Mischpult vielleicht nach ein paar Dutzend Reglern. Bei modernen Sprachmodellen sind es keine Dutzend, sondern Milliarden einzelner Parameter — das Mischpult-Bild bleibt zutreffend, nur in einer Größenordnung, die sich kaum noch bildlich vorstellen lässt. Wie viele Parameter ein Modell tatsächlich hat und was das für Hardware und Rechenaufwand bedeutet, ist Thema eines späteren, eigenen Bausteins — an dieser Stelle reicht die Beobachtung, dass „viele Regler" im Fall echter KI-Modelle sehr wörtlich gemeint ist.

<details>
<summary>Eine Ebene tiefer: Was macht etwas formal zu einem Algorithmus?</summary>

In der Informatik gilt ein Verfahren als Algorithmus, wenn es drei Eigenschaften erfüllt: Es besteht aus **endlich vielen, eindeutig festgelegten Schritten**, jeder Schritt ist **ausführbar** (kein Schritt verlangt etwas Unmögliches oder Mehrdeutiges), und das Verfahren **hält nach endlich vielen Schritten an** — es liefert irgendwann ein Ergebnis, statt für immer weiterzulaufen. Ein Sortieralgorithmus erfüllt das offensichtlich; ein Trainingsalgorithmus für ein KI-Modell genauso, auch wenn „endlich viele Schritte" dort schnell in die Millionen geht.

Die dritte Eigenschaft — das Anhalten — ist der Grund, warum in der Informatik nicht jedes Computerprogramm automatisch auch ein Algorithmus im strengen Sinn ist: Ein Programm, das dauerhaft auf neue Eingaben wartet (etwa ein Server, der Anfragen entgegennimmt), hält nie von selbst an. Für die Unterscheidung zwischen Programm, Algorithmus und Modell in diesem Baustein spielt das keine große Rolle, ist aber ein gutes Beispiel dafür, wie genau Informatiker Begriffe abgrenzen, die im Alltag lockerer verwendet werden.

</details>

## Ein Beispiel zum Anfassen

Die Begriffe Programm, Algorithmus und Modell bleiben abstrakt, solange sie nur an Kochrezept und Mischpult hängen. Deshalb noch einmal an einem Beispiel, das du aus deinem eigenen Postfach kennst: dem Umgang mit Spam-Mails. Angenommen, du willst entscheiden, ob eine eingehende E-Mail Spam ist oder nicht. Klassisch programmiert, sähe eine erste, einfache Lösung vielleicht so aus: Ein Mensch schreibt eine Regel wie „Wenn die Betreffzeile ‚GEWINN' in Großbuchstaben enthält, markiere die Mail als Spam." Das ist ein Programm im oben beschriebenen Sinn: Ein Mensch hat vorher festgelegt, worauf es ankommt.

Ein trainierter Spamfilter geht anders vor. Statt einer handgeschriebenen Regel bekommt ein Trainingsalgorithmus tausende bereits als „Spam" oder „kein Spam" markierte E-Mails vorgelegt. Er passt daraufhin selbstständig Parameter an — welche Wörter, Absenderadressen oder Satzmuster in der Praxis tatsächlich mit Spam zusammenhängen, muss dabei kein Mensch vorher wissen oder aufschreiben. Am Ende entsteht ein Modell, das neue, ihm unbekannte E-Mails bewerten kann, ohne dass irgendwo im System eine Zeile steht wie „GEWINN in Großbuchstaben → Spam."

Nehmen wir an, der trainierte Spamfilter markiert eine wichtige E-Mail deines Chefs fälschlich als Spam. Bei der handgeschriebenen Regel wüsstest du genau, wo du ansetzen musst: Du öffnest die Regel, schaust nach, welche Bedingung ausgelöst hat, und passt sie an. Beim trainierten Modell gibt es diese eine Stelle nicht. Das Fehlverhalten steckt verteilt in tausenden oder Millionen Parametern, die gemeinsam dieses eine falsche Ergebnis erzeugt haben — niemand kann dir zeigen „hier, genau dieser Parameter ist schuld." Die einzige verlässliche Reparatur ist erneutes Training mit besseren oder zusätzlichen Beispielen, nicht ein gezielter Eingriff an einer Stelle.

Genau darin liegt der praktische Unterschied: Ein klassischer Spamfilter lässt sich verbessern, indem jemand eine neue Regel ergänzt. Ein trainierter Spamfilter lässt sich nur verbessern, indem er mit neuen Beispielen erneut trainiert wird — für ein Sprachmodell wie die, mit denen du vielleicht schon gechattet hast, gilt exakt dasselbe Prinzip, nur mit sehr viel mehr Beispielen und sehr viel mehr Parametern.

## Dasselbe Prinzip in einem anderen Bereich

Damit klar wird, dass diese Unterscheidung nicht nur für Text gilt: Nimm einen [Bildklassifikator](/de/glossar/bildklassifikator), der entscheiden soll, ob ein Foto eine Katze oder einen Hund zeigt. Klassisch programmiert, müsste ein Mensch Regeln formulieren wie „Wenn spitze Ohren UND schmale Pupillen UND [weitere Merkmale], dann Katze" — schon bei diesem einfachen Beispiel merkst du vermutlich, wie schwer sich so etwas in eindeutige Regeln fassen lässt: Manche Hunderassen haben spitze Ohren, manche Katzen liegende Ohren, und Beleuchtung, Blickwinkel oder Bildausschnitt verändern, was überhaupt erkennbar ist.

Ein trainiertes Modell umgeht dieses Problem komplett. Es bekommt tausende Fotos, die bereits als „Katze" oder „Hund" markiert sind, und der Trainingsalgorithmus stellt die Parameter so ein, dass sich am Ende möglichst viele Trainingsbeispiele korrekt zuordnen lassen. Niemand hat dem Modell dabei erklärt, was „spitze Ohren" sind — welche Bildmerkmale tatsächlich zwischen Katze und Hund unterscheiden, hat der Trainingsalgorithmus selbst aus den Beispielen extrahiert. Genau dieser Wechsel — von handgeschriebenen Merkmalsregeln zu aus Beispielen gelernten Parametern — ist derselbe, der auch beim Sprachmodell aus dem Beispiel oben stattfindet.

Genau wie beim Spamfilter gilt auch hier: Ordnet das trainierte Modell ein Foto falsch zu, lässt sich das nicht durch eine gezielte Codeänderung beheben. Die Lösung ist dieselbe wie oben — mehr oder bessere Trainingsbeispiele, ein neuer Trainingsdurchlauf, ein neues Modell. Ob Text, Bild oder etwas ganz anderes: Die Unterscheidung zwischen Programm, Algorithmus und Modell aus diesem Baustein bleibt in allen Fällen dieselbe.

## Warum der Unterschied wichtig ist

Bei klassischer Programmierung schreibt ein Mensch Regeln, und der Computer wendet sie auf Daten an. Beim maschinellen Lernen schreibt ein Mensch stattdessen den Trainingsalgorithmus, die Struktur des Modells und ein Maß dafür, was ein gutes Ergebnis ausmacht — die konkreten Parameter entstehen erst aus den Trainingsbeispielen. Das ist der Grund, warum sich ein KI-Modell nicht wie gewöhnlicher Code „debuggen" lässt: Es gibt keine einzelne Zeile, in der ein falsches Verhalten steckt, sondern ein Muster über sehr viele Parameter hinweg, das aus den Trainingsdaten stammt.

Das erklärt auch etwas, das dir im Alltag mit KI-Chatbots vermutlich schon aufgefallen ist: Wenn ein Modell einen Fehler macht oder eine unerwünschte Antwort gibt, kannst du das nicht „mal eben reparieren", indem du eine Formulierung anders schreibst — das verändert nur deine Eingabe für dieses eine Gespräch, nicht das Modell selbst. Wirklich behoben wird so ein Verhalten erst, wenn der Anbieter das Modell mit veränderten oder zusätzlichen Trainingsdaten neu trainiert und eine neue Version veröffentlicht. Das ist einer der Gründe, warum KI-Anbieter regelmäßig neue Modellversionen herausbringen, statt einfach den Code der alten zu patchen. Das erklärt auch, warum sich das Verhalten eines KI-Assistenten manchmal ändert, ohne dass du selbst etwas an deinen Eingaben verändert hast: Der Anbieter hat im Hintergrund eine neue, umtrainierte Modellversion ausgerollt. Neu zu trainieren ist dabei kein kleiner Vorgang nebenbei: Es kostet Rechenzeit, Energie und bei großen Modellen teils erhebliche Summen — einer der Gründe, warum neue Modellversionen nicht im Wochentakt erscheinen, sondern typischerweise in größeren, geplanten Abständen.

Das lässt sich noch schärfer fassen, wenn du zwei Ebenen auseinanderhältst, die im Alltag leicht durcheinandergehen: den [Prompt](/de/glossar/prompt) — also das, was du gerade in ein Chatfenster eingibst — und das Modell selbst. Wenn du einem KI-Assistenten in deinem Prompt schreibst „Antworte ab jetzt immer auf Englisch" oder ihm über eigene Anweisungen (manche Anbieter nennen das „System-Prompt" oder „Custom Instructions") ein festes Verhalten mitgibst, änderst du damit nur den Input für dieses eine Gespräch — nicht die im Modell gespeicherten Parameter. Das Modell selbst „weiß" danach nichts von deiner Anweisung; sie wirkt nur, solange sie Teil dessen ist, was du (oder der Dienst, den du benutzt) ihm gerade mitschickst. Ein Modell dagegen dauerhaft zu verändern heißt: neu trainieren — mit den Zutaten aus dem Kuchen-Denkbild von weiter oben.

Zur Einordnung noch ein Begriff, der in diesem Zusammenhang häufig fällt: **[KI](/de/glossar/ki)** (Künstliche Intelligenz) ist der Oberbegriff für Systeme, die Aufgaben lösen, die üblicherweise mit Wahrnehmen, Sprache, Planen oder Entscheiden verbunden werden. Nicht jedes KI-System lernt aus Beispielen — ein trainiertes Modell ist nur eine (aktuell besonders erfolgreiche) Untergruppe davon. Manche älteren KI-Systeme, etwa die weiter oben erwähnten Expertensysteme, gehören zwar zur KI, aber nicht zum maschinellen Lernen — „KI" ist der weite Oberbegriff, „maschinelles Lernen" nur einer von mehreren Wegen dorthin.

## Ein Wort zur Alltagssprache

Im Alltag ist oft von „dem Algorithmus" die Rede — etwa wenn es heißt, „der Algorithmus von Instagram" entscheide, welche Beiträge dir angezeigt werden. Streng genommen ist das oft ungenau: Was tatsächlich entscheidet, welche Inhalte dir angezeigt werden, ist bei vielen modernen Plattformen kein von Menschen Schritt für Schritt festgelegtes Verfahren mehr, sondern zumindest teilweise ein trainiertes Modell, das aus Beispielen gelernt hat, welche Inhalte Nutzer wahrscheinlich interessieren. Der Sprachgebrauch hat sich hier von der technischen Bedeutung gelöst — „Algorithmus" wird umgangssprachlich zum Sammelbegriff für „irgendein automatisches System, das für mich entscheidet", egal ob darunter tatsächlich ein klassischer Algorithmus oder ein trainiertes Modell steckt. Das ist im Alltag meist kein großes Problem, lohnt sich aber im Hinterkopf zu behalten, sobald es um die genauen technischen Unterschiede geht — genau die, um die es in diesem Baustein geht. Dasselbe gilt für Formulierungen wie „der Empfehlungs-Algorithmus von Streaming- oder Musikdiensten" — auch dahinter steckt in aller Regel kein von Hand geschriebenes Regelwerk, sondern ein Modell, das aus dem bisherigen Verhalten sehr vieler Nutzer gelernt hat, welche Inhalte zueinander passen. Sprachlich bleibt „Algorithmus" trotzdem der gebräuchlichere Begriff, technisch ist „Modell" meistens der treffendere.

Ähnlich ist es bei Formulierungen wie „die Gesichtserkennung meines Handys" oder „die Autokorrektur erkennt das Wort nicht" — auch dahinter stecken heute überwiegend trainierte Modelle, auch wenn ältere Autokorrektur-Systeme tatsächlich noch stärker auf festen Wörterlisten und Regeln basierten. Ganz falsch ist der umgangssprachliche Gebrauch also nicht immer — nur ungenau, wenn er beide Fälle über einen Kamm schert.

## Warum das kein Nischenwissen ist

Diese Unterscheidung wirkt vielleicht wie Fachchinesisch für Informatiker, ist aber praktisch relevant für jede Entscheidung, die du im Umgang mit KI triffst. Wenn du verstehst, dass ein Modell aus Trainingsdaten entsteht und nicht aus handgeschriebenen Regeln, verstehst du auch, warum zwei verschiedene KI-Modelle auf denselben Prompt unterschiedlich reagieren können — sie wurden mit unterschiedlichen Trainingsdaten und unterschiedlichen Trainingsalgorithmen erzeugt, selbst wenn beide oberflächlich „dasselbe" tun sollen. Du verstehst auch, warum ein KI-Anbieter ein „Update" seines Modells ankündigen kann, ohne dass sich am zugrunde liegenden Programmcode viel ändert — das Update besteht meist aus neuem Training, nicht aus neuer Software im klassischen Sinn. Und du verstehst, warum ein Modell nie zu hundert Prozent vorhersagbar ist wie ein klassisches Programm: Seine Regeln stecken in Millionen oder Milliarden Parametern, die aus Beispielen entstanden sind — nicht in einer Liste, die jemand Zeile für Zeile geprüft hat.

## Die drei Begriffe auf einen Blick

- **Programm**: von Menschen geschriebene, vollständig feststehende Anweisungen — das Kochrezept.
- **Algorithmus**: die allgemeine Verfahrensidee dahinter, unabhängig von der konkreten Umsetzung — „vergleiche, tausche, wiederhole".
- **Modell**: eine Rechenstruktur, deren Verhalten von trainierten Parametern abhängt — das Ergebnis, nicht das Rezept, der gebackene Kuchen.

Wenn dir diese drei Zeilen künftig aus dem Gedächtnis einfallen, sobald jemand „Algorithmus" sagt, aber eigentlich „Modell" meint, hat dieser Baustein sein Ziel erreicht.

## Kurz zum Selbst-Testen

Bevor es weitergeht, ein kurzer Check für dich: Kannst du die folgenden Fragen aus dem Gedächtnis beantworten, ohne weiter oben nachzuschauen?

- Was legt bei einem klassischen Programm fest, was passiert — und was legt es bei einem trainierten Modell fest?
- Worin unterscheidet sich ein Algorithmus von einem konkreten Programm?
- Warum lässt sich ein fertig trainiertes Modell nicht einfach durch eine geänderte Codezeile korrigieren?
- Warum ist die umgangssprachliche Rede vom „Algorithmus einer Plattform" technisch oft ungenau?
- Was ändert sich an einem Modell, wenn du ihm im Prompt eine neue Anweisung gibst — und was ändert sich nicht?
- Warum funktioniert die Unterscheidung zwischen Programm, Algorithmus und Modell genauso bei einem Bildklassifikator wie bei einem Sprachmodell?

Wackelt eine der Antworten noch, lohnt sich ein zweiter Blick auf den jeweiligen Abschnitt — genau dafür ist dieser kurze Test da, nicht um dich zu prüfen, sondern um dir zu zeigen, wo sich nochmaliges Lesen lohnt. Sitzen alle Antworten sicher, bist du für den nächsten Baustein gut vorbereitet.

## Und danach?

Ist ein Modell einmal trainiert, ändert sich seine Rolle noch einmal: Es nimmt einen [Input](/de/glossar/input) entgegen und liefert einen [Output](/de/glossar/output) — genau wie ein gewöhnliches Programm. Der Unterschied aus diesem Baustein bleibt bestehen (die Regeln stecken in gelernten Parametern statt in handgeschriebenem Code), aber im Betrieb, wenn du zum Beispiel gerade mit einem KI-Assistenten chattest, verhält sich ein trainiertes Modell wieder wie eine ganz normale [Funktion](/de/glossar/funktion), die aus deiner Eingabe eine Ausgabe berechnet.

Wie dieser eine Rechenschritt — Input rein, Output raus — im Detail funktioniert und was „Input" und „Output" bei einem Sprachmodell überhaupt genau sind, ist noch offen. Genau darum geht es im nächsten Baustein: Er nimmt die Unterscheidung aus diesem Baustein als gegeben und schaut sich stattdessen genau an, was beim Rechenschritt selbst passiert.
