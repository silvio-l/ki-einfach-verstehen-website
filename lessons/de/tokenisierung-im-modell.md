<!-- Generated from src/content/bausteine/de/tokenisierung-im-modell.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Tokenisierung im Modell: Wie dein Chat zu einer Tokenfolge wird

> Lesefassung für GitHub. Die vollständige Fassung mit interaktiven Demos, Animationen und Abrufmoment findest du auf der Website: **[Tokenisierung im Modell: Wie dein Chat zu einer Tokenfolge wird](https://ki-einfach-verstehen.de/de/bausteine/tokenisierung-im-modell/)**
>
> Lizenz: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.de) · Nenne die Quelle so: KI einfach verstehen, „Tokenisierung im Modell: Wie dein Chat zu einer Tokenfolge wird“, CC BY 4.0, https://ki-einfach-verstehen.de/de/bausteine/tokenisierung-im-modell/

Wie aus einem Chat mit Rollen eine einzige Tokenfolge wird, wozu Spezial-Tokens dabei dienen, warum die Vokabulargröße ein Kompromiss ist und was alles ins Kontextfenster passen muss.

„Wie heißt die Hauptstadt von Frankreich?“ Sechs Wörter und ein Fragezeichen. Ein Chatbot hat vorher noch die Anweisung „Antworte kurz.“ bekommen. Schätz, bevor du weiterliest: Wie viele [Tokens](https://ki-einfach-verstehen.de/de/glossar/token/) kommen beim [Modell](https://ki-einfach-verstehen.de/de/glossar/modell/) an, wenn du diese Frage abschickst? Zehn? Zwanzig?

Das Wissen eines Modells steckt in Milliarden Zahlen. Bevor es damit rechnet, muss aus deinem Chat eine einzige Folge von Tokens werden, in der auch steht, wer was gesagt hat. Was ein [Tokenizer](https://ki-einfach-verstehen.de/de/glossar/tokenizer/) tut, kennst du aus dem Baustein über den [Tokenizer](./tokenizer-ids-vokabular.md): Er zerlegt Text in Stücke aus einer festen Liste, dem [Vokabular](https://ki-einfach-verstehen.de/de/glossar/vokabular/), und jedes Stück bekommt eine Nummer. Hier geht es um das Drumherum: wie aus mehreren Nachrichten eine Folge wird, wie groß das Vokabular sein sollte und wie lang die Folge werden darf.

## Dein Chat ist ein einziger langer Text

Im Chatfenster sieht ein Gespräch aus wie getrennte Sprechblasen. Naheliegend wäre, dass das Modell nur die jüngste bekommt und die Rollen über getrennte Leitungen laufen. Beides stimmt nicht. Ein [Sprachmodell](https://ki-einfach-verstehen.de/de/glossar/sprachmodell/) **kann nur eines: eine Folge von Tokens fortsetzen.** Also muss das Programm um das Modell herum das ganze Gespräch in eine einzige Folge verwandeln.

Das erledigt die **[Chat-Vorlage](https://ki-einfach-verstehen.de/de/glossar/chat-vorlage/)**. Ein Modell besteht nicht nur aus Bauplan und Zahlen, wie im Baustein über [Parameter](./parameter-training-inferenz-hardware.md). Dazu kommen kleine Begleitdateien, und eine davon legt fest, wie ein Gespräch in Text umgewandelt wird: die Chat-Vorlage, ein festes Muster, das die Nachrichten samt Rollen hintereinandersetzt. Übliche Rollen heißen „system“ für Anweisungen, „user“ für dich und „assistant“ für das Modell. Den Systemtext schreibt meist der Anbieter der Chat-App, und du siehst ihn nicht.

Als Beispiel dient Llama 3.1 8B Instruct von Meta, die Chat-Fassung des frei verfügbaren Modells aus dem Parameter-Baustein. Seine Vorlage macht aus dem Chat vom Anfang diesen Text:

```text
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

Cutting Knowledge Date: December 2023
Today Date: 26 Jul 2024

Antworte kurz.<|eot_id|><|start_header_id|>user<|end_header_id|>

Wie heißt die Hauptstadt von Frankreich?<|eot_id|><|start_header_id|>assistant<|end_header_id|>

```

Mit dem echten Tokenizer ausgezählt sind das 50 Tokens. Nur 15 davon stammen aus dem Chat, zehn aus deiner Frage und fünf aus „Antworte kurz.“. Die anderen 35 hat die Vorlage hinzugefügt: drei Rollennamen, einige Zeilenumbrüche, die ebenfalls Tokens sind, zwei Zeilen Text, die du nie geschrieben hast, und neun Einträge in spitzen Klammern.

Diese neun heißen **[Spezial-Tokens](https://ki-einfach-verstehen.de/de/glossar/spezial-token/)**. Sie stehen nicht für Text, sondern für Struktur. Eines dieser Art kennst du schon: das Stopp-Zeichen aus dem Baustein über [Input und Output](./input-und-output.md), hier **Ende-Token** genannt. Es steht im Vokabular wie jedes Textstück, ist aber kein sichtbares Zeichen, sondern zeigt an, dass ein Text zu Ende ist. Ein Gespräch braucht mehr solcher Marken, denn es hat Rollen.

![Animation: wie aus einem Chat eine Tokenfolge wird](../../public/bausteine/tokenisierung-im-modell/chat-wird-folge.static.svg)

[▶ Animation auf der Website ansehen](https://ki-einfach-verstehen.de/de/bausteine/tokenisierung-im-modell/)

*Aus zwei Nachrichten mit Rollen wird bei Llama 3.1 eine einzige Folge aus 50 Tokens, die mit einem offenen Kopf für die Antwort endet.*

![Ein Güterzug aus vielen petrolfarbenen Waggons mit zwei bernsteinfarbenen Waggons dazwischen fährt in einer Kurve auf einen Prellbock am Gleisende zu](../../public/bausteine/tokenisierung-im-modell/zug.png)

*Die Tokenfolge als Güterzug: gewöhnliche Waggons für Textstücke, andersfarbige Markierungswaggons für die Spezial-Tokens und ein Prellbock für die Höchstlänge, um die es am Ende des Bausteins geht.*

Du kannst dir die fertige Folge wie einen langen Güterzug vorstellen. Jeder Waggon ist ein Token. Andersfarbige Markierungswaggons zeigen an, wo ein Rollenname steht und wo eine Nachricht endet. Am Gleisende steht ein Prellbock, mehr dazu im letzten Abschnitt. Das Bild hat zwei Grenzen. Ein Waggon hat keine Ladung, die etwas bedeutet, nur eine Nummer an der Seite: seine ID im Vokabular. Und die Markierungen wirken nur, weil das Modell im Training sehr viele Züge mit genau diesen Markierungen gesehen hat. Schreibst du nach der Antwort „Paris.“ noch „Und von Italien?“, baut die Vorlage den ganzen Zug neu: Systemtext, erste Frage, alte Antwort, neue Frage, jeweils mit Markierungen dazwischen. Aus 50 werden 67 Tokens. Wie im Baustein über Input und Output geht der Verlauf bei jeder Nachricht erneut mit, denn das Modell merkt sich dazwischen nichts.

## Text, den du nie geschrieben hast

Schau noch einmal auf die Llama-Folge. Zwei Zeilen darin stammen weder von dir noch vom Modell: „Cutting Knowledge Date: December 2023“ und „Today Date: 26 Jul 2024“. Die Vorlage fügt sie von sich aus ein. Die erste nennt den Wissensstand: Texte nach Dezember 2023 hat das Modell im Training nicht gesehen. Das zweite Datum ist voreingestellt und gilt, wenn das Programm kein aktuelles Datum mitgibt. Du siehst diese Zeilen nie, das Modell liest sie bei jeder Anfrage mit.

Wie viel Zusatztext dazukommt, hängt vom Modell ab. Derselbe Chat, durch die offiziellen Vorlagen von vier frei verfügbaren Modellen geschickt, ergibt zwischen 22 und 86 Tokens. Der Teil aus dem Chat bleibt dabei fast gleich, bei 12 bis 15 Tokens. Was sich ändert, ist der Zusatz:

![Gestapeltes Balkendiagramm, je Modell aus dem Chat und von der Vorlage: Gemma 3 1B 12 plus 10 gleich 22 Tokens, keine Systemrolle; Qwen3-8B 14 plus 13 gleich 27, schlichte Rollenmarken; Llama 3.1 8B 15 plus 35 gleich 50, fügt zwei Datumszeilen ein; gpt-oss-20b 12 plus 74 gleich 86, setzt eine eigene Systemnachricht davor](../../public/bausteine/tokenisierung-im-modell/vier-vorlagen.svg)

*Derselbe Chat, vier Chat-Vorlagen: Der Teil aus dem Chat bleibt fast gleich, der Zusatz der Vorlage reicht von 10 bis 74 Tokens (ausgezählt am 6. Oktober 2026).*

Die kürzesten Vorlagen setzen nur schlichte Marken um die Nachrichten. Die längste gehört zu gpt-oss, frei verfügbaren Modellen von OpenAI, der Firma hinter ChatGPT. Sie stellt einen eigenen Systemtext voran. Auch ihre Marken sehen anders aus als bei Llama: Jede Nachricht beginnt mit `<|start|>` und endet mit `<|end|>`.

> **Interaktive Demo:** [auf der Website ausprobieren](https://ki-einfach-verstehen.de/de/bausteine/tokenisierung-im-modell/)

**Es zählt also nicht nur, was du tippst.** Die Vorlage bestimmt mit, wie lang der Zug wird und was eine Anfrage kostet, wenn pro Token abgerechnet wird. Was aber leisten die Markierungen?

## Markierungs-Waggons: woran das Modell Rollen und Enden erkennt

![Flagge](../../public/bausteine/tokenisierung-im-modell/flagge.svg)

*Ein Ende-Token wirkt wie eine Zielflagge: Es zeigt an, dass ein Redebeitrag vorbei ist.*

Die Spezial-Tokens in der Llama-Folge haben feste Aufgaben. `<|begin_of_text|>` markiert ganz vorn den Anfang. `<|start_header_id|>` und `<|end_header_id|>` schließen einen Rollennamen ein, also „system“, „user“ oder „assistant“; zusammen bilden die drei den Kopf einer Nachricht. `<|eot_id|>` beendet einen Redebeitrag; der Name steht für „end of turn“. Woher weiß das Modell, dass es den Systemtext anders behandeln soll als deine Frage? Aus dem Nachtraining. Du kennst es aus dem Baustein über Input und Output: Nach dem Grundtraining mit gewöhnlichem Text wird ein Modell mit Beispielgesprächen nachtrainiert, damit es wie ein hilfreicher Chatbot antwortet. Diese Gespräche stehen in genau diesem Format, mit genau diesen Marken. Ein Modell, das nur das Grundtraining hinter sich hat, heißt **Grundmodell**.

Bemerkenswert ist das Ende der Folge. Sie endet nicht direkt nach deiner Frage, sondern mit einem offenen Kopf für die Rolle „assistant“, hinter dem noch nichts steht. Was passiert, wenn dieser Kopf fehlt? Dann fehlt das Signal, wer als Nächstes spricht, und das Modell könnte etwa deine Nachricht fortsetzen, statt sie zu beantworten. Davor warnt die Anleitung der Plattform Hugging Face, über die frei verfügbare Modelle wie Llama verteilt werden. **Der offene Kopf ist eine Regieanweisung: Ab hier spricht der Assistent.**

Und woher weiß das Modell, wann seine Antwort fertig ist? Im menschlichen Sinn weiß es das nicht. Erinnere dich an die Textschleife: In jeder Runde gibt das Modell eine Score-Liste aus, mit einem Score für jeden Eintrag des Vokabulars. Ein Auswahlschritt wählt daraus ein Token, und es wird hinten angehängt. Auch `<|eot_id|>` ist so ein Eintrag mit eigenem Score. In den Gesprächen des Nachtrainings stand es am Ende jeder Antwort. Deshalb bekommt es einen hohen Score, wenn eine Antwort fertig wirkt. Das Programm drumherum achtet auf genau diese ID: Wählt der Auswahlschritt sie, hört es auf, spätestens aber bei einer eingestellten Längengrenze.

Llama 3.1 kennt dafür zwei verschiedene Marken. Grundmodelle beenden einen Text mit `<|end_of_text|>`, Chatmodelle eine Antwort mit `<|eot_id|>`. Welche das Modell wählt, hat ihm allein das Training beigebracht. Wartet ein Programm beim Chatmodell auf die falsche Marke, hört es nicht auf: Das Modell schreibt über seine Antwort hinaus weiter, etwa einen erfundenen nächsten Redebeitrag, bis die Längengrenze greift.

Darum schadet eine falsche Vorlage so sehr. Schickt ein Programm einem Llama-Modell die Marken von gpt-oss, findet der Llama-Tokenizer für `<|start|>` keinen Spezial-Eintrag. Er zerlegt die Zeichenfolge in fünf gewöhnliche Stücke: `<`, `|`, `start`, `|` und `>`. Statt eines Markierungswaggons hängen also fünf normale Waggons im Zug. Die Folge sieht nicht mehr aus wie die Gespräche aus dem Training. Hugging Face warnt, mit falschen Marken arbeiteten Chatmodelle drastisch schlechter. OpenAI schreibt zu gpt-oss, die Modelle funktionierten nur mit ihrem eigenen Format korrekt.

## Wie groß soll das Vokabular sein?

Bisher war ein Waggon ein Token in der Folge. Jetzt geht es darum, wie viele verschiedene Waggon-Bauarten es gibt: wie viele Karten die Kartei aus dem Tokenizer-Baustein hat, jede mit einem Textstück und seiner Nummer. Wie groß soll dieses Vokabular sein?

Ein ausgedachtes Beispiel: Im Tokenizer-Baustein hatte ein Spielzeug-Vokabular fünf Einträge, „Die“, „␣Kat“, „ze“, „␣sitzt“ und „.“. Das Zeichen ␣ steht für ein Leerzeichen, das zum Stück gehört. „Die Katze sitzt.“ wird damit zu fünf Tokens. Mit „␣Katze“ als sechstem Eintrag sind es nur noch vier. Ist der neue Eintrag ein reiner Gewinn?

Nein, denn **jeder Eintrag braucht im Modell zweimal Platz**. Erstens am Eingang: Dieselbe Nummer, mit der der Tokenizer ein Textstück findet, ist im Modell eine Seitenzahl. Erinnerst du dich an das Nachschlagebuch aus dem Baustein über [Skalar, Vektor, Matrix und Tensor](./skalar-vektor-matrix-tensor.md)? Es hat eine Seite für jeden Eintrag, und auf jeder Seite steht eine Liste gelernter Zahlen. Im Rechner ist jede Seite eine Zeile einer Tabelle, hier **Eingangstabelle** genannt.

Zweitens am Ausgang: Dort gibt das Modell in jeder Runde für jeden Eintrag einen [Score](https://ki-einfach-verstehen.de/de/glossar/score/) aus. Dafür hat es meist eine zweite Tabelle, die **Ausgangstabelle**, wieder mit einer Zeile pro Eintrag. Am Ende der Rechnung stehen für die letzte Position Zwischenwerte, eine Liste von Zahlen. Das Modell vergleicht sie mit der Zeile jedes Eintrags: Je besser beide zusammenpassen, desto höher dessen Score. Wie genau, zeigt der Baustein über den Ausgang des Modells, den Output Head.

![Zwei Karten. Links Vokabular mit 5 Einträgen: Die, Leerzeichen-Kat, ze, Leerzeichen-sitzt, Punkt; Die Katze sitzt wird zu 5 Tokens; Eingangs- und Ausgangstabelle je 5 Zeilen. Rechts Vokabular mit 6 Einträgen, zusätzlich Leerzeichen-Katze; der Satz wird zu 4 Tokens; beide Tabellen je 6 Zeilen, die neue Zeile hervorgehoben](../../public/bausteine/tokenisierung-im-modell/spielzeug-vokabular.svg)

*Ein ausgedachtes Mini-Vokabular: Mit dem sechsten Eintrag „␣Katze“ wird der Satz ein Token kürzer, dafür bekommen Eingangs- und Ausgangstabelle je eine Zeile mehr.*

Gib im Spielzeugbeispiel jeder Zeile vier ausgedachte Zahlen. Mit fünf Einträgen haben beide Tabellen zusammen 2 × 5 × 4 = 40 Zahlen, mit sechs Einträgen 48. Ein Fünftel mehr Zahlen für ein Fünftel weniger Tokens. Doch die neue Zeile kostet immer, gespart wird nur, wenn „Katze“ im Text vorkommt. In einem Satz über Hunde bringt sie nichts.

## Was ein großes Vokabular kostet und bringt

![Waage](../../public/bausteine/tokenisierung-im-modell/waage.svg)

*Die Größe des Vokabulars ist eine Abwägung: kürzere Folgen auf der einen Seite, größere Tabellen auf der anderen.*

Bei echten Modellen geht es um Zehntausende Einträge. Meta, die Firma hinter Llama, hat das Vokabular von Llama 2 zum Nachfolger Llama 3, auf dem Llama 3.1 aufbaut, rund vervierfacht: von 32.000 auf gut 128.000 Einträge. Beide Tabellen wuchsen damit ebenfalls aufs Vierfache, auf gut eine Milliarde Zahlen, alles Parameter. Mit der Faustregel aus dem Parameter-Baustein, 2 Byte pro Zahl, sind das bei Llama 3.1 rund 2 Gigabyte. Dazu kommt Rechenarbeit: viermal so viele Scores in jeder Runde.

Braucht derselbe Text mit viermal so vielen Einträgen dann nur ein Viertel der Tokens? Meta verspricht bis zu 15 Prozent weniger. Wie wichtig das „bis zu“ ist, zeigt ein Versuch für diesen Baustein. „Die Katze sitzt auf dem Fensterbrett.“ braucht bei beiden Llama-Modellen 12 Tokens. Ein englischer Testabsatz wurde rund ein Zehntel kürzer, ein deutscher gar nicht. Wie im Spielzeugbeispiel **spart ein Eintrag nur dort, wo sein Stück im Text vorkommt**.

![Zwei Karten: Llama 2 7B mit 32.000 Einträgen, englischer Testabsatz 62 Tokens, deutscher 87, Eingangs- und Ausgangstabelle zusammen 262 Millionen Zahlen, 2 mal 131 Millionen; Llama 3.1 8B mit 128.256 Einträgen, englisch 55, deutsch 87, beide Tabellen zusammen 1,05 Milliarden Zahlen, 2 mal 525 Millionen](../../public/bausteine/tokenisierung-im-modell/vokabular-abwaegung.svg)

*Llama 2 gegen Llama 3.1: viermal so viele Einträge, im englischen Testabsatz etwas weniger Tokens, im deutschen keine Ersparnis, aber Eingangs- und Ausgangstabelle zusammen viermal so groß.*

Der deutsche Absatz brauchte außerdem bei beiden Modellen deutlich mehr Tokens als der englische mit demselben Inhalt. Das passt zum Tokenizer-Baustein: Häufiges passt in wenige Tokens, Seltenes zerfällt, und für diese Vokabulare sind deutsche Wörter offenbar seltener. Auf Deutsch füllst du das Kontextfenster, die Höchstlänge der Folge, also schneller und zahlst bei Abrechnung pro Token mehr.

> **Interaktive Demo:** [auf der Website ausprobieren](https://ki-einfach-verstehen.de/de/bausteine/tokenisierung-im-modell/)

Dazu kommt ein dritter Preis: Je größer das Vokabular, desto mehr Einträge kommen im Training kaum vor. Die Zeile eines Eintrags in der Eingangstabelle wird aber nur nachgestellt, wenn sein Token im Text steht, seltene Einträge bekommen also kaum Übung. Forscher fanden in verbreiteten Modellen solche untertrainierten Einträge, die seltsames Verhalten auslösen können. Die beste Größe hängt deshalb vom Modell ab, so eine Studie von 2024: Ein großes Modell, trainiert mit sehr viel Text, sieht auch seltene Einträge oft genug, für ein kleines kann schon ein mittleres Vokabular zu groß sein.

<details>
<summary>Eine Ebene tiefer: Wie viel Modell im Vokabular steckt</summary>

Bei Llama 3.1 8B sind Eingangs- und Ausgangstabelle getrennt: je 128.256 × 4.096 = 525.336.576 Zahlen, zusammen 1.050.673.152, gut 13 Prozent der rund 8 Milliarden Parameter. Bei Llama 2 7B waren es zusammen rund 262 Millionen, knapp 4 Prozent.

Bei kleinen Modellen wiegt das Vokabular noch schwerer. Gemma 3 1B von Google hat 262.144 Einträge mit je 1.152 Zahlen, also 301.989.888 Zahlen. Gemma nutzt diese eine Tabelle für Eingang und Ausgang zugleich: Dieselbe Zeile dient am Eingang als Seite im Nachschlagebuch und am Ausgang zum Berechnen des Scores. Trotzdem steckt laut dem technischen Bericht von Google fast ein Drittel des Modells in dieser Tabelle, 302 Millionen von rund einer Milliarde Parametern. Dafür ist es laut Bericht ausgewogener für Sprachen außer Englisch.

</details>

## Das Kontextfenster ist ein Budget

Bleibt die Frage, wo der Prellbock steht. Im Tokenizer-Baustein hieß diese Grenze [Kontextfenster](https://ki-einfach-verstehen.de/de/glossar/kontextfenster/): die Höchstzahl an Tokenpositionen, die ein Modell auf einmal verarbeiten kann. Bei GPT-2, dem älteren Modell aus dem Baustein über Input und Output, waren es 2019 nur 1.024. Llama 3.1 fasst bis zu 128.000 Tokens, zufällig fast so viele, wie sein Vokabular Einträge hat. Die größten heutigen Modelle fassen eine Million und mehr.

Viele nehmen an: In dieses Fenster muss nur passen, was du eintippst. Das klingt plausibel, die Antwort entsteht ja erst danach. Laut Anthropic, der Firma hinter dem Chatbot Claude, und OpenAI **zählt aber alles**. Das sind Systemtext und Zusätze der Vorlage, Beschreibungen von Werkzeugen wie einer Websuche, die das Modell benutzen darf, angehängte Dokumente, der Verlauf, deine neue Nachricht und auch die Antwort selbst. Dazu kommen bei Modellen, die vor der Antwort „nachdenken“, die **Denk-Tokens**: Zwischenschritte, die das Modell als Tokens schreibt, ehe die eigentliche Antwort beginnt. Du siehst sie oft nicht, aber sie belegen Platz.

![Ein Balken für ein Kontextfenster mit 100.000 Tokens: Systemtext und Werkzeuge 3.000, bisheriger Verlauf 87.000, deine neue Nachricht 2.000, frei für Denken und Antwort 8.000](../../public/bausteine/tokenisierung-im-modell/kontextfenster-budget.svg)

*Ein erfundenes Beispiel: Wenn Systemtext, Verlauf und neue Nachricht 92.000 von 100.000 Tokens belegen, bleiben für Denken und Antwort zusammen nur 8.000.*

Angenommen, das Fenster deines Modells fasst 100.000 Tokens, und du chattest schon lange. Systemtext, Werkzeuge, Verlauf und deine neue Frage belegen zusammen 92.000. Was passiert, wenn das Modell für eine gründliche Antwort 12.000 Tokens bräuchte? Es hat nur 8.000, und davon gehen auch noch die Denk-Tokens ab. Erreicht das Modell beim Schreiben die Grenze, bricht die Antwort unvollständig ab.

Hier endet das Zugbild: Ein echter Güterzug fährt fertig zusammengestellt ab, der Zug aus Tokens wächst beim Antworten hinten weiter, bis zum Ende-Token oder Prellbock.

Ist schon die Eingabe zu lang, lehnt etwa Anthropic die Anfrage mit „prompt is too long“ ab. Chat-Anwendungen schaffen deshalb vorher Platz: Laut Anthropic kann claude.ai die ältesten Teile eines Gesprächs schrittweise herausfallen lassen. Daher kommt oft der Eindruck, ein Chatbot habe den Anfang eines langen Gesprächs vergessen: Dieser Teil fährt im Zug nicht mehr mit.

Zwei weitere Missverständnisse liegen nahe. Erstens ist das Kontextfenster nicht die Länge der Antwort: Bei GPT-6 Luna, einem aktuellen Modell von OpenAI, fasst das Fenster gut eine Million Tokens, die Antwort darf aber nur ein gutes Zehntel davon lang sein. Zweitens heißt ein riesiges Fenster kein perfektes Gedächtnis. Anthropic warnt selbst, dass Genauigkeit und Erinnerung mit wachsender Tokenzahl nachlassen.

## Am Ende steht eine Folge von Nummern

Damit ist der Weg vom Chatfenster bis vor das Modell vollständig. Die Chat-Vorlage setzt Systemtext, Verlauf und deine Nachricht mit Spezial-Tokens zu einem Text zusammen und lässt einen Kopf für die Antwort offen. Der Tokenizer macht daraus Tokens, und jedes bekommt seine [Token-ID](https://ki-einfach-verstehen.de/de/glossar/token-id/). Die ganze Folge muss samt Antwort ins Kontextfenster passen. Und die Schätzung vom Anfang? Bei Llama 3.1 wurden es 50 Tokens, nur 15 davon aus dem Chat.

Das Modell hat jetzt eine Folge von Nummern. Eine ID ist aber nur ein Etikett, wie ein Barcode: Er sagt der Kasse, welcher Artikel das ist, aber nichts darüber, was drin ist. Mit der 417, die im Spielzeug-Vokabular für „Die“ stand, lässt sich nichts Sinnvolles rechnen. Wie daraus etwas wird, womit das Modell rechnen kann, zeigt der nächste Baustein.

Wenn du dir nur einen Satz merkst, dann diesen: Dein ganzer Chat wird mit Rollenmarken zu einer einzigen Tokenfolge, und diese Folge muss mitsamt der Antwort in das begrenzte Kontextfenster passen.

---

Quelle: https://ki-einfach-verstehen.de/de/bausteine/tokenisierung-im-modell/

← Zurück: [Was ein KI-Modell eigentlich ist](./was-ein-ki-modell-eigentlich-ist.md) · [Alle Bausteine](../../README.de.md#inhalt) · Weiter: [Embeddings: wie aus einer Nummer ein bedeutungsvoller Vektor wird](./embeddings.md) →
