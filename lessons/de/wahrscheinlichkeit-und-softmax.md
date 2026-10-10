<!-- Generated from src/content/bausteine/de/wahrscheinlichkeit-und-softmax.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Wahrscheinlichkeit und Softmax: Wie ein Modell sich entscheidet

> Lesefassung für GitHub. Die vollständige Fassung mit interaktiven Demos, Animationen und Abrufmoment findest du auf der Website: **[Wahrscheinlichkeit und Softmax: Wie ein Modell sich entscheidet](https://ki-einfach-verstehen.de/de/bausteine/wahrscheinlichkeit-und-softmax/)**
>
> Lizenz: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.de) · Nenne die Quelle so: KI einfach verstehen, „Wahrscheinlichkeit und Softmax: Wie ein Modell sich entscheidet“, CC BY 4.0, https://ki-einfach-verstehen.de/de/bausteine/wahrscheinlichkeit-und-softmax/

Wie ein Sprachmodell aus seinen Scores Anteile macht, warum es mal das Naheliegende und mal etwas anderes wählt und was die Temperatur daran ändert.

Lässt du einen Chatbot eine Antwort neu erzeugen, bekommst du oft eine andere, obwohl deine Frage gleich geblieben ist. Wie du aus dem Baustein über Input und Output weißt, berechnet das Modell bei gleichem Input im Prinzip jedes Mal dieselbe [Score](https://ki-einfach-verstehen.de/de/glossar/score/)-Liste. Sie enthält für jedes [Token](https://ki-einfach-verstehen.de/de/glossar/token/) (ein Textstück) eine Bewertung, wie gut es als Nächstes passt. Ein eigener Schritt danach wählt aus, und dort kommt der Zufall ins Spiel. Scores wie 7,1 oder −2,3 aus dem vorigen Baustein sind noch keine Wahrscheinlichkeiten. Wie wird aus ihnen genau ein Token?

Du tippst „Die Katze“, und es gibt nur drei mögliche Fortsetzungen: „sitzt“ mit dem Score 3,0, „schläft“ mit 2,0 und „fliegt“ mit −1,0. Diese Scores sind für das Beispiel ausgedacht. Ein Mensch hat sie gesetzt, trainiert wurde nichts. Ein echtes Modell vergibt einen Score an jedes Token seines [Vokabulars](https://ki-einfach-verstehen.de/de/glossar/vokabular/) (die feste Liste aller Stücke, die ein Tokenizer kennt), GPT-2 zum Beispiel an 50.257 Tokens. Es berechnet jeden Score aus seinen [Parametern](https://ki-einfach-verstehen.de/de/glossar/parameter/), den Zahlen, die das Training eingestellt hat. Mit diesen ausgedachten Scores lässt sich nur die Auswahl eines Tokens durchrechnen. Welche Fortsetzung ein echtes Modell nach „Die Katze“ bevorzugt, lässt sich daraus nicht ablesen.

## Wie oft soll „sitzt“ drankommen?

Angenommen, das Modell soll nach „Die Katze“ hundertmal das nächste Token wählen. Wie oft sollte dabei „sitzt“ kommen und wie oft „fliegt“? Versuch es kurz aus den Scores abzulesen, bevor du weiterliest.

Nimmt der Auswahlschritt wie im Baustein über Input und Output immer den höchsten Score, kommt hundertmal „sitzt“, und Neu-Erzeugen brächte nie etwas anderes. Soll auch „schläft“ manchmal drankommen, braucht es eine Angabe, wie oft. Aus den Scores lässt sie sich nicht ablesen. Bei „fliegt“ hakt es. Sein Score ist negativ, und „minus einmal von hundert“ gibt es nicht. Eine feste Summe haben Scores auch nicht, nach einem anderen Satzanfang kann die ganze Liste höher oder tiefer liegen. Ein Score sagt nur, welches Token besser dasteht als ein anderes und mit welchem Abstand. Wie oft es drankommen soll, steht nicht darin.

![Drei Katzen nebeneinander: links eine große, aufrecht sitzende Katze, in der Mitte eine mittelgroße, zusammengerollt schlafende Katze, rechts eine sehr kleine Katze, die an einem Luftballon in der Luft hängt](../../public/bausteine/wahrscheinlichkeit-und-softmax/drei-kandidaten.png)

*Drei mögliche Fortsetzungen von „Die Katze …“: sitzt, schläft, fliegt. Nicht jede ist gleich naheliegend.*

Wie bei einem Glücksrad bekommt jedes Token ein Feld, dessen Größe angibt, wie oft es bei sehr vielen Versuchen drankommt. Alle Felder zusammen füllen das ganze Rad. Je größer ein Feld, desto öfter bleibt der Zeiger dort stehen. Der Anteil eines Felds am Rad heißt **[Wahrscheinlichkeit](https://ki-einfach-verstehen.de/de/glossar/wahrscheinlichkeit/)** und liegt immer zwischen 0 und 100 Prozent. Die Liste aller Anteile, die zusammen genau 100 Prozent ergeben, heißt **Wahrscheinlichkeitsverteilung**, kurz Verteilung. Für jedes nächste Token einer Antwort braucht ein Chatbot so ein Rad, nach jedem angehängten Token ein neues. Wie baut man also aus 3,0, 2,0 und −1,0 ein Rad?

## Aus Punkten werden Anteile: Softmax

Nach einem Quizabend hängt die Punktetafel an der Wand. Team A hat 30 Punkte, Team B 20, Team C 10. Team A hat also die Hälfte aller 60 Punkte.

Bei den Scores geht das schief. Sie ergeben zusammen 4,0, und „fliegt“ bekäme −1,0 davon, also einen negativen Anteil. Ein Feld, das kleiner ist als nichts, passt auf kein Rad.

Deshalb wird im Auswahlschritt, also nach dem Modell, aus jedem Score zuerst eine positive Zahl, hier Stärke genannt. Sie wird für jede Score-Liste neu ausgerechnet. Dafür gilt eine feste Regel: Ein Score von 0 bekommt die Stärke 1, jeder Punkt darüber multipliziert sie mit etwa 2,7, jeder Punkt darunter teilt sie durch 2,7. Dann zählt der Auswahlschritt die Stärken zusammen. Zuletzt teilt er jede Stärke durch diese Summe, so wie die Punkte eines Teams durch die Gesamtpunktzahl.

„sitzt“ liegt drei Punkte über null und bekommt 2,7 · 2,7 · 2,7, „schläft“ bekommt 2,7 · 2,7 und „fliegt“ 1 : 2,7. Mit dem genauen Faktor gerechnet sind das rund 20,1, 7,4 und 0,37, zusammen rund 27,8.

Geteilt durch 27,8 ergeben sich für „sitzt“ rund 72 Prozent, für „schläft“ rund 27 und für „fliegt“ rund 1 Prozent. Diese Rechnung heißt **[Softmax](https://ki-einfach-verstehen.de/de/glossar/softmax/)**. Sie macht aus jeder Score-Liste eine Verteilung, ein Rad.

![Animation: Softmax macht aus den Scores 3,0, 2,0 und −1,0 die Wahrscheinlichkeiten 72, 27 und 1 Prozent](../../public/bausteine/wahrscheinlichkeit-und-softmax/softmax-schritte.static.svg)

[▶ Animation auf der Website ansehen](https://ki-einfach-verstehen.de/de/bausteine/wahrscheinlichkeit-und-softmax/)

*Softmax in drei Schritten: Scores in positive Stärken verwandeln, die Stärken zusammenzählen, jede Stärke durch die Summe teilen. Die Scores sind ausgedacht.*

Angenommen, du addierst zu allen drei Scores 10 und nimmst 13,0, 12,0 und 9,0. Überleg kurz: Werden die Prozente dann größer, kleiner oder bleiben sie gleich?

Sie bleiben genau gleich. Zehn Punkte mehr vergrößern jede Stärke und die Summe um denselben Faktor, der beim Teilen wieder wegfällt. Dafür ist die Regel gemacht: Wie im ersten Abschnitt gesehen, kann eine ganze Score-Liste höher oder tiefer liegen, ohne dass sich an ihrer Aussage etwas ändert. Hier endet das Bild der Punktetafel. Bekäme dort jedes Team 10 Punkte dazu, würden sich die Anteile verschieben. **Bei Scores zählt nur, wie weit sie auseinanderliegen.**

Auf dem Rad bekommt der höchste Score immer das größte Feld. Jeder Punkt Vorsprung vervielfacht die Stärke. Bei einem Punkt ist sie etwa 2,7-mal so groß, bei zwei Punkten gut siebenmal so groß. Liegt ein Token weit vor allen anderen, bekommt es deshalb fast das ganze Rad. Kein Token fällt ganz auf null, selbst „fliegt“ behält rund 1 Prozent.

![Links die Scores als Balken an einer Nulllinie: sitzt 3,0, schläft 2,0, fliegt −1,0 nach links; ein Pfeil mit der Beschriftung Softmax führt nach rechts zu den Wahrscheinlichkeiten 72 %, 27 % und 1 %, zusammen 100 %](../../public/bausteine/wahrscheinlichkeit-und-softmax/punkte-zu-prozent.svg)

*Softmax macht aus ausgedachten Scores Anteile: Die Reihenfolge bleibt, die Summe ist 100 %.*

Die Bilderkennung aus dem Baustein über Input und Output rechnet meist genau so. Die Katze lag dort gut drei Punkte vor dem Hund und bekommt rund 96 Prozent, selbst das Auto behält einen winzigen Rest über null. Bei einem Sprachmodell wie GPT-2 kann dieselbe Rechnung vor jedem neuen Token laufen, mit allen Scores seines Vokabulars.

<details>
<summary>Eine Ebene tiefer: Die Formel hinter Softmax</summary>

Die Stärke eines Scores ist die Zahl e hoch dem Score. e ist eine feste Zahl aus der Mathematik, ungefähr 2,718. Die kleine Zahl oben zählt, wie oft mit e malgenommen wird: e³ = e · e · e ≈ 20,1 und e² = e · e ≈ 7,4. Eine negative Zahl oben heißt teilen: e⁻¹ = 1 : e ≈ 0,37. Und e⁰ ist 1, genau wie in der Regel oben. Als Formel für den Kandidaten Nummer i:

`Softmax(xᵢ) = eˣⁱ / Σⱼ eˣʲ`

Oben steht die Stärke des Kandidaten, unten mit dem Summenzeichen Σ die Summe aller Stärken.

Der Name kommt von der harten Regel „nimm den Größten“ (englisch max). Softmax ist ihre weiche Version: Der Größte bekommt am meisten, die anderen behalten etwas, und je größer der Vorsprung, desto näher kommt Softmax der harten Regel. In der Fachsprache heißen die Scores vor Softmax **Logits**.

</details>

## Den Favoriten nehmen oder das Rad drehen

Softmax hat das Rad gebaut. „sitzt“ hat ein Feld von 72 Prozent, „schläft“ eines von 27 Prozent, „fliegt“ einen schmalen Streifen. Gewählt ist damit noch nichts. Im Baustein über Input und Output nahm der Auswahlschritt einfach das Token mit dem höchsten Score, bei „Die Katze sitzt“ das „auf“ mit 8,1. Das Rad wird dabei gar nicht gedreht, und der Zeiger zeigt auf das größte Feld. Diese Auswahl heißt **Greedy-Auswahl**, nach dem englischen Wort für gierig. Weil Softmax die Reihenfolge nicht ändert, gehört das größte Feld immer dem höchsten Score. Für die Greedy-Auswahl bräuchte es Softmax also gar nicht.

![Ein Glücksrad auf einem Ständer mit einem Zeiger oben; ein großes türkisfarbenes Feld nimmt etwa drei Viertel des Rads ein, ein mittleres bernsteinfarbenes Feld etwa ein Viertel, dazwischen ein sehr schmaler heller Streifen](../../public/bausteine/wahrscheinlichkeit-und-softmax/gluecksrad.png)

*Das Glücksrad nach Softmax: Jedes Feld ist so groß wie seine Wahrscheinlichkeit.*

Erst für die Auswahl mit Zufall braucht es das Rad. Es wird wirklich gedreht, und das Token, bei dem der Zeiger stehen bleibt, kommt dran. Das heißt **[Sampling](https://ki-einfach-verstehen.de/de/glossar/sampling/)**, vom englischen Wort für Stichprobe. Bei 100 Drehungen landet der Zeiger im Schnitt ungefähr 72-mal auf „sitzt“, 27-mal auf „schläft“ und einmal auf „fliegt“. Zufall erinnert im Alltag an einen Würfel, bei dem jede Seite gleich oft kommt. **Das Rad zieht dagegen gewichtet:** Große Felder kommen oft, schmale selten. Mit Sampling unterscheiden sich Antworten deshalb von Mal zu Mal, ohne dass das Modell beliebige Wörter aneinanderreiht.

![Zwei Zeilen mit je drei Versuchen für die Eingabe Die Katze: In der Zeile Immer das Größte steht dreimal sitzt, in der Zeile Rad drehen steht sitzt, sitzt und schläft](../../public/bausteine/wahrscheinlichkeit-und-softmax/greedy-und-sampling.svg)

*Dreimal dieselbe Eingabe: Wer immer das Wahrscheinlichste nimmt, bekommt dreimal „sitzt“. Wer das Rad dreht, bekommt meistens „sitzt“ und manchmal etwas anderes (ausgedachte Ziehung).*

Warum nimmt ein Chatbot dann nicht immer das größte Feld? Bei kurzen Antworten wie einer Zahl geht das gut. Längere Texte werden dabei fade und wiederholen leicht dieselben Wendungen immer wieder. Das verstärkt sich selbst. Steht eine Wendung schon zweimal im Text, wird ihre Wiederholung oft zur wahrscheinlichsten Fortsetzung, und die Greedy-Auswahl kommt aus dieser Rille nicht mehr heraus. Sampling bringt Abwechslung hinein, weil gelegentlich auch das zweit- oder drittbeste Token drankommt.

Ein Rad gilt immer nur für ein Token. Vor jedem neuen Token rechnet das Modell eine neue Score-Liste, Softmax baut daraus ein neues Rad, und das wird genau einmal gedreht. Das gewählte Token wird angehängt, und die Schleife beginnt von vorn. Lässt du eine Antwort neu erzeugen, werden alle Räder noch einmal gedreht. Das erste Rad ist im Prinzip dasselbe wie beim ersten Mal. Bleibt der Zeiger aber woanders stehen, etwa bei „schläft“ statt „sitzt“, rechnen alle folgenden Runden mit diesem Token weiter, denn zurückgenommen wird nichts. So entsteht auf dieselbe Frage eine andere Antwort, obwohl sich am Modell nichts geändert hat. Probier es in deinem Chatbot aus: Lass eine kurze Antwort drei-, viermal neu erzeugen und achte darauf, ab welchem Wort sich die Fassungen trennen.

Die drei Felder sind eine Vereinfachung. Ein echtes Rad hat ein Feld für jedes Token des Vokabulars, die allermeisten haarfein. Wie stark der Zufall beim Drehen wirkt, lässt sich einstellen.

## Mehr oder weniger Zufall: die Temperatur

Nicht jede Aufgabe verträgt gleich viel Zufall. Soll ein Programm aus einer Mail immer dasselbe Datum herauslesen, stört jede Abweichung. Bei zehn Vorschlägen für einen Titel ist Abwechslung erwünscht. Wer ein Sprachmodell aus einem eigenen Programm heraus nutzt, kann deshalb bei vielen Modellen mit jeder Anfrage einen Wert namens **[Temperatur](https://ki-einfach-verstehen.de/de/glossar/temperatur/)** mitschicken. Er wirkt im Auswahlschritt. Das Modell liefert seine Scores wie immer. Dann werden sie durch die Temperatur geteilt, und erst daraus berechnet Softmax die Anteile. Bei Temperatur 1 bleiben die Anteile bei 72, 27 und 1 Prozent.

Bei Temperatur 0,5 wird durch 0,5 geteilt, und das heißt verdoppeln. In Softmax gehen dann 6, 4 und −2. „schläft“ lag einen Punkt hinter „sitzt“, jetzt zwei. „fliegt“ lag vier Punkte dahinter, jetzt acht. Weil jeder Punkt Vorsprung die Stärke vervielfacht, bekommt „sitzt“ jetzt rund 88 Prozent, und „fliegt“ fast nichts mehr. Das große Feld wird noch größer.

Bei Temperatur 2 wird durch 2 geteilt. Überleg, was dann mit dem schmalen Feld von „fliegt“ passiert.

> **Interaktive Demo:** [auf der Website ausprobieren](https://ki-einfach-verstehen.de/de/bausteine/wahrscheinlichkeit-und-softmax/)

Werden die Scores durch 2 geteilt, schrumpfen alle Abstände auf die Hälfte, und die Felder gleichen sich an. „fliegt“ liegt nur noch zwei Punkte hinter „sitzt“. Sein Feld wächst von rund 1 auf rund 8 Prozent. Bei 100 Drehungen kommt es also etwa achtmal statt einmal.

![Drei Balkengruppen für sitzt, schläft und fliegt: bei Temperatur 0,5 88 %, 12 % und 0,03 %, bei Temperatur 1 72 %, 27 % und 1 %, bei Temperatur 2 57 %, 35 % und 8 %](../../public/bausteine/wahrscheinlichkeit-und-softmax/temperatur.svg)

*Dieselben ausgedachten Scores, drei Temperaturen: Eine niedrige Temperatur spitzt die Verteilung zu, eine hohe gleicht sie an.*

Je näher die Temperatur an 0 rückt, desto größer werden die Abstände, bis praktisch nur das größte Feld übrig bleibt. Durch 0 selbst lässt sich nicht teilen. Für Temperatur 0 gilt deshalb eine feste Regel. Die Programme nehmen das größte Feld, ohne zu drehen. Das ist die Greedy-Auswahl.

![Thermometer](../../public/bausteine/wahrscheinlichkeit-und-softmax/thermometer.svg)

*Die Temperatur regelt, wie stark die Abstände zwischen den Scores zählen.*

**Die Temperatur verändert weder das Modell noch seine Scores.** Sie ist kein Parameter, wird nicht trainiert und kann bei jeder Anfrage anders gesetzt werden. Eine hohe Temperatur macht das Modell deshalb nicht klüger. Die Antworten werden abwechslungsreicher. Die Temperatur gibt seltenen Tokens öfter eine Chance, passenden ebenso wie unpassenden. In den meisten Chat-Apps findest du für die Temperatur keinen Regler, dort legt der Anbieter sie fest.

## Was 72 Prozent nicht bedeuten

Gibt ein Modell „sitzt“ 72 Prozent, liegt der Gedanke nahe, es sei sich zu 72 Prozent sicher, dass „sitzt“ stimmt. **Gemeint ist aber nur die Größe des Felds auf dem Rad für das nächste Token.** Woher diese Größe kommt, zeigt das Grundtraining aus dem Baustein über Input und Output. Dort war das Label immer das Token, das im Text wirklich folgte.

Angenommen, in den Trainingstexten folgt auf „Die Katze“ siebenmal „sitzt“ und dreimal „schläft“. Jedes Beispiel stellt die Parameter ein kleines Stück nach, sodass der Score seines Labels im Vergleich zu den anderen steigt. „sitzt“ ist öfter das Label, sein Score steigt also öfter. Am Ende ergeben die Scores nach „Die Katze“ über Softmax Felder von ungefähr 70 und 30 Prozent. Das Modell lernt also, wie oft eine Fortsetzung folgte. Ob sie stimmt, prüft dabei niemand. Das Nachtraining, das ein Modell zum hilfreichen Chatbot macht, verschiebt die Scores noch einmal. Ein verlässliches Maß dafür, ob eine Antwort stimmt, werden die Felder dadurch nicht.

Angenommen, auf „Die Hauptstadt von Australien ist“ folgt in vielen Trainingstexten „Sydney“. Dann bekommt „Sydney“ ein großes Feld, obwohl Canberra die Hauptstadt ist. Ein Chatbot formuliert eine falsche Antwort dann genauso flüssig wie eine richtige. Wie oft das vorkommt und woran du es merkst, zeigt ein späterer Baustein über überzeugend falsche Antworten.

Die andere Antwort beim Neu-Erzeugen kommt also aus einer neuen Drehung am selben ersten Rad, nicht aus einem veränderten Modell. Die Scores berechnet das Modell aus seinen Parametern. Anders als die Temperatur werden diese Parameter im Training eingestellt. Wie viele Parameter ein Modell hat, wie das Training sie einstellt und was beim Benutzen eines fertigen Modells passiert, zeigt der nächste Baustein.

---

Quelle: https://ki-einfach-verstehen.de/de/bausteine/wahrscheinlichkeit-und-softmax/

← Zurück: [Skalar, Vektor, Matrix, Tensor: die Bausteine der Zahlen](./skalar-vektor-matrix-tensor.md) · [Alle Bausteine](../../README.de.md#inhalt) · Weiter: [Parameter, Training und Inferenz: Wie ein Modell lernt](./parameter-training-inferenz-hardware.md) →
