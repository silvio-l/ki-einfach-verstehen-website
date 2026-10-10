<!-- Generated from src/content/bausteine/de/parameter-training-inferenz-hardware.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Parameter, Training und Inferenz: Wie ein Modell lernt

> Lesefassung für GitHub. Die vollständige Fassung mit interaktiven Demos, Animationen und Abrufmoment findest du auf der Website: **[Parameter, Training und Inferenz: Wie ein Modell lernt](https://ki-einfach-verstehen.de/de/bausteine/parameter-training-inferenz-hardware/)**
>
> Lizenz: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.de) · Nenne die Quelle so: KI einfach verstehen, „Parameter, Training und Inferenz: Wie ein Modell lernt“, CC BY 4.0, https://ki-einfach-verstehen.de/de/bausteine/parameter-training-inferenz-hardware/

Was in einer Modelldatei steckt, was Menschen vor dem Training festlegen, wie das Training aus dem Fehler die Richtung für jeden Regler gewinnt und warum Lernen teurer ist als Benutzen.

Manche Modelle gibt es zum Herunterladen, etwa Llama 3.1, das die Firma Meta im Sommer 2024 veröffentlicht hat. Die kleinste Fassung heißt Llama 3.1 8B und besteht vor allem aus rund acht Milliarden Zahlen.

Die [Temperatur](https://ki-einfach-verstehen.de/de/glossar/temperatur/) aus dem vorigen Baustein (der Wert, der im Auswahlschritt festlegt, wie viel Zufall mitspielt) gehört nicht dazu, sie wird beim Benutzen gewählt. Diese Zahlen aber hat das Training eingestellt. Wer hat festgelegt, wie viele es sind, und woher wusste das Training bei jeder einzelnen Zahl, ob sie nach oben oder nach unten muss?

## Was in einer Modelldatei steckt

Wer Llama 3.1 8B herunterlädt, bekommt vor allem zwei Arten von Dateien. Eine ist winzig, weniger als tausend Zeichen lang, und enthält eine Art Bauplan des Modells. Zur anderen Art gehören vier große Dateien mit zusammen rund 16 Gigabyte. Sie enthalten nur Zahlen: rund acht Milliarden Parameter, die das Training eingestellt hat. Einen lesbaren Satz findest du darin nicht.

![Links eine kleine Karte Bauplan mit Einträgen wie Vokabular und Rechenstufen, unter einem Kilobyte; rechts ein großer Block aus Zahlen, rund acht Milliarden Parameter, rund 16 Gigabyte](../../public/bausteine/parameter-training-inferenz-hardware/modelldatei.svg)

*Ein heruntergeladenes Modell besteht aus zwei Teilen: einem kleinen Bauplan und sehr vielen Zahlen.*

Das „8B“ im Namen steht für 8 Milliarden Parameter, B für das englische billion. Auch die 16 Gigabyte folgen daraus. Speicher misst man in Byte (acht Ja-Nein-Stellen ergeben ein Byte), und ein Gigabyte ist eine Milliarde Byte. Llama 3.1 speichert jede Zahl in 2 Byte. Acht Milliarden Zahlen mal 2 Byte ergeben 16 Milliarden Byte, also 16 Gigabyte. Warum es gerade 2 Byte sind und ob es auch mit weniger geht, zeigt der nächste Baustein.

![Mischpult mit mehreren Schiebereglern](../../public/bausteine/parameter-training-inferenz-hardware/mischpult.svg)

*Die Architektur legt fest, wie das Pult gebaut ist. Die Parameter halten fest, wie seine Regler stehen.*

Am Mischpult aus dem ersten Baustein steht jeder Regler für einen Parameter, seine Stellung für eine Zahl. Die Verschaltung der Regler entspricht der Rechenvorschrift. Die kleine Datei nennt den Bautyp des Geräts und seine Maße: wie viele Rechenschritte es hat und wie viele Regler jeder bekommt. Diesen Bauplan nennt man die **[Architektur](https://ki-einfach-verstehen.de/de/glossar/architektur/)** des Modells. Die großen Dateien halten fest, wie jeder einzelne Regler steht. Einen Teil dieser Regler kennst du aus dem Baustein über Vektoren und Matrizen: das Nachschlagebuch mit einer Liste gelernter Zahlen für jedes Token. Jede dieser Zahlen ist ein Regler; wie viele Seiten und Zahlen das Buch hat, steht im Bauplan. Anders als am echten Pult trägt keiner dieser Regler eine Beschriftung.

Was glaubst du: Wenn zwei Modelle genau dieselbe Architektur haben, verhalten sie sich dann auch gleich? Überleg kurz, bevor du weiterliest.

Nicht unbedingt. Neben Llama 3.1 8B bietet Meta eine zweite Fassung an, Llama 3.1 8B Instruct. Beide haben denselben Bauplan und genau gleich viele Parameter. Die Grundfassung hat nur das Grundtraining hinter sich, bei dem sie das nächste Textstück vorhersagen lernt. Das kennst du aus dem Baustein über Input und Output. Die Instruct-Fassung wurde danach nachtrainiert, damit sie wie ein Chatbot auf Fragen und Anweisungen eingeht. Bis auf kleine Begleitdateien unterscheiden sich die beiden nur in den Werten ihrer Zahlen. Auf Download-Seiten erkennst du die Fassung zum Chatten am Zusatz „Instruct“ (englisch für anweisen).

Wer hat aber entschieden, dass Llama 3.1 8B acht und nicht neun Milliarden Regler hat?

## Was Menschen vor dem Training festlegen

Das Training jedenfalls nicht. Es stellt die Regler ein, aber es baut kein neues Pult. Wie viele Rechenschritte das Modell hat und wie viele Regler jeder davon bekommt, legen Menschen fest, bevor das Training beginnt. Daraus ergibt sich die Zahl der Parameter. Am Mischpult entspricht das der Wahl, welches Pult auf die Bühne kommt.

Ebenso steht vorher fest, wie groß das Vokabular wird. Im Tokenizer-Baustein lief das Verfahren [Byte Pair Encoding](https://ki-einfach-verstehen.de/de/glossar/byte-pair-encoding/) (BPE, das nur zählt) so lange, bis das [Vokabular](https://ki-einfach-verstehen.de/de/glossar/vokabular/) (die feste Liste aller Stücke, die ein Tokenizer kennt) diese Größe hatte. Und auch das Kontextfenster steht vorher fest, also wie viele Tokens das Modell auf einmal verarbeiten kann. Deshalb hat jeder Chatbot ein festes Kontextfenster: Es steht im Bauplan, lange bevor jemand die erste Frage stellt.

Solche Festlegungen heißen **[Hyperparameter](https://ki-einfach-verstehen.de/de/glossar/hyperparameter/)**. Das Training ändert sie nicht. Parameter dagegen stellt das Training ein. Auch die Maße im Bauplan gehören zu den Hyperparametern. Dazu kommen Einstellungen für den Trainingslauf selbst, etwa wie viel Text das Modell zu sehen bekommt.

Auch die Temperatur aus dem vorigen Baustein wird nicht trainiert. Ist sie deshalb ein Hyperparameter? Denk kurz darüber nach.

Nein. Hyperparameter stehen fest, bevor das Training beginnt, und prägen, welche Zahlen am Ende in der Datei stehen. Wer das fertige Modell benutzt, wählt erst dann die Temperatur, und zwar bei jeder Anfrage neu. Sie bestimmt nur, wie aus den gerade berechneten Scores die Prozente werden, und ändert keine Zahl in der Datei. Eine Chat-App kann dasselbe Modell deshalb einmal mit niedriger und einmal mit hoher Temperatur laufen lassen.

![Drei Spalten auf einer Zeitachse. Vor dem Training legen Menschen die Hyperparameter fest: Zahl der Rechenschritte, Vokabulargröße, Kontextfenster, Menge an Trainingstext. Im Training stellt der Algorithmus die Parameter ein, die Werte der acht Milliarden Regler. Beim Benutzen wählt man je Anfrage die Temperatur, sie ändert keine Zahl in der Datei](../../public/bausteine/parameter-training-inferenz-hardware/wer-legt-fest.svg)

*Hyperparameter stehen vor dem Training fest, die Parameter stellt das Training ein, die Temperatur wählt man erst beim Benutzen.*

<details>
<summary>Eine Ebene tiefer: Wie GPT-3 eingestellt wurde</summary>

GPT-3 aus dem ersten Baustein, ein Vorläufer der Modelle hinter ChatGPT, hat rund 175 Milliarden Parameter. Für diese größte Fassung nennt das Forschungspapier von 2020 unter anderem folgende Hyperparameter:

- **96 Schichten.** Eine Schicht ist eine Rechenstufe, die das Ergebnis der vorigen weiterverarbeitet.
- **12.288 Zahlen pro Token.** So lang ist der Vektor, mit dem das Modell jedes Token auf seinem Weg durch die Schichten darstellt.
- **Ein Kontextfenster von 2048 Tokens.**
- **Eine Lernrate von höchstens 0,00006.** Von der Lernrate hängt ab, wie weit das Training jeden Regler pro Schritt dreht. Auch wie sich die Lernrate im Lauf des Trainings ändert, stand vorher fest: Sie wurde zu Beginn hochgefahren und danach abgesenkt.
- **Ein Batch von 3,2 Millionen Tokens.** Der Trainingsalgorithmus sammelt die Korrekturen aus dieser Textmenge und stellt dann einmal nach.

Keiner dieser Werte wurde gelernt. Die Zahl der Schichten und die Länge der Vektoren legen fest, wie groß das Pult ist: Aus ihnen ergeben sich die 175 Milliarden Parameter. Lernrate und Batch bestimmen dagegen, wie das Training abläuft.

</details>

Wenn alles feststeht, beginnt das Training.

## Woher kennt das Training die Richtung?

Beim Spamfilter aus dem ersten Baustein rückte der Trainingsalgorithmus die Gewichte nach jedem Fehler ein kleines Stück in die Richtung, die den Fehler verkleinert. Dort ließ sich die Richtung noch erraten. Landete die Bankmail „Dein Gewinn aus Zinsen“ im Spam, stand das Gewicht von „Gewinn“ zu hoch. Bei acht Milliarden Reglern ohne Beschriftung kann niemand raten. Woher weiß der Trainingsalgorithmus dann, wohin jeder einzelne soll?

Zuerst wird der Fehler zu einer Zahl. Der Trainingsalgorithmus vergleicht die Vorhersage des Modells mit der richtigen Antwort und rechnet aus, wie weit sie danebenliegt. Diese Fehlerzahl heißt **Loss**, englisch für Verlust. Bei einem Sprachmodell ist der Loss umso größer, je weniger Prozent das Modell dem Textstück gab, das im Trainingstext tatsächlich folgt, etwa „auf“ nach „Die Katze sitzt“.

Ein ausgedachtes Mini-Modell mit einem einzigen Regler soll vorhersagen, was Äpfel kosten: Vorhersage gleich Regler mal Kilo. Der Regler ist also der Preis pro Kilo. Zum Lernen hat es drei ausgedachte Einkäufe: 1 Kilo für 2 Euro, 1 Kilo für 4 Euro und 2 Kilo für 6 Euro. Prozente gibt es hier nicht, also braucht das Apfel-Modell eine eigene Regel für seine Fehlerzahl: Man nimmt jede Abweichung mal sich selbst und zählt alles zusammen. So zählt zu viel genauso wie zu wenig, und große Abweichungen wiegen schwerer.

Der Regler startet bei 0, wie die Gewichte des Spamfilters. Dann sagt das Modell für jeden Einkauf 0 Euro voraus, und der Fehler ist 56. Wird er kleiner, wenn der Regler auf 1 steht? Überleg kurz.

Ja, er sinkt auf 26. Höher ist also die richtige Richtung. Bei 2 sinkt er auf 8, bei 3 auf 2, den kleinsten Wert, und bei 4 steigt er wieder auf 8. Null wird er nie, weil sich die beiden Ein-Kilo-Einkäufe widersprechen.

Einkäufe und Rechenregel sind ausgedacht; das Mini-Modell zeigt nur, wie man am Fehler abliest, wohin ein Regler muss. Ob der Fehler eines echten Modells, der von Milliarden Reglern zugleich abhängt, ebenso nur einen tiefsten Punkt hat, zeigt es nicht.

<details class="verstaendnishilfe">
<summary>Woher kommen die 56 und die 26?</summary>

Bei 0 lautet jede Vorhersage 0 Euro, also liegt das Modell um 2, 4 und 6 Euro daneben. Jede Abweichung mal sich selbst ergibt 4, 16 und 36, zusammen 56. Bei 1 sagt es 1, 1 und 2 Euro voraus, die Abweichungen schrumpfen auf 1, 3 und 4. Mal sich selbst ergeben sie 1, 9 und 16, zusammen 26. Bei 3 stimmt die Vorhersage für den dritten Einkauf genau, für die beiden ersten liegt sie je 1 Euro daneben: Der Fehler ist 2.

</details>

![Kurve in Form eines Tals: Reglerstellung 0 bis 6 Euro pro Kilo, Fehler 56 bei 0, 26 bei 1, 8 bei 2, Tiefpunkt 2 bei 3, wieder 8 bei 4; die Stufen dazwischen fallen um 30, 18 und 6](../../public/bausteine/parameter-training-inferenz-hardware/fehlerkurve.svg)

*Der Fehler des ausgedachten Apfel-Modells für jede Reglerstellung: Weit weg vom Tiefpunkt fällt er pro Euro stark, kurz davor kaum noch.*

Der Fehler sinkt von Stellung zu Stellung immer weniger: erst um 30, dann um 18, zuletzt nur um 6. Wie stark sich der Fehler bei einer winzigen Drehung genau an einer Stelle ändert, auf einen Euro hochgerechnet, heißt **Steigung**, wie bei einem Hang. Sie verrät die Richtung. Fällt der Fehler beim Höherdrehen, muss der Regler höher. Steigt er beim Höherdrehen, muss der Regler tiefer. Ihre Stärke verrät die Entfernung: In einem Tal wie diesem ist der Tiefpunkt noch weit, wo es steil abwärts geht, und nah, wo es flach wird.

Du stehst bei dichtem Nebel an einem Hang und willst ins Tal. Du siehst nichts, spürst aber unter den Füßen, wohin der Boden abfällt und wie steil. Also gehst du ein Stück bergab und spürst neu. Das Tal ist die Reglerstellung mit dem kleinsten Fehler. Den Hang gibt es allerdings nicht: Er steht für die Fehlerzahl bei jeder Reglerstellung, und die Neigung, die du spürst, muss das Training ausrechnen.

Wie weit soll ein Schritt bergab gehen? Im Nebel würdest du am steilen Hang weit ausschreiten und kurz vor dem Tal vorsichtig werden.

## Wie weit ein Schritt geht

Schritt gleich Steigung mal Lernrate. Die **[Lernrate](https://ki-einfach-verstehen.de/de/glossar/lernrate/)** ist eine Zahl, die Menschen vor dem Training wählen, also ein Hyperparameter. Hier bleibt sie fest.

Beim Apfel-Modell ist die Steigung bei 0 sogar größer als die 30 von eben. Die 30 gelten für den ganzen Weg von 0 bis 1, und auf diesem Weg wird der Hang flacher. Wie steil er direkt bei 0 ist, zeigt eine winzige Drehung: Von 0 auf 0,01 sinkt der Fehler um knapp 0,36. Auf einen ganzen Euro hochgerechnet, mal 100, ist die Steigung bei 0 also 36. Für das Beispiel ist die Lernrate auf ein Vierundzwanzigstel gesetzt, damit die Schritte glatt aufgehen. Der erste Schritt ist also 36 geteilt durch 24, gleich 1,5. Der Regler rückt von 0 auf 1,5.

Bei dieser Kurve wächst die Steigung gleichmäßig mit dem Abstand zum Tiefpunkt. Bei 0 sind es 3 Euro bis zum Tiefpunkt, bei 1,5 nur noch halb so viel, also ist auch die Steigung halb so groß: 18. Der nächste Schritt ist deshalb halb so lang, 0,75, und führt auf 2,25. Jeder weitere Schritt halbiert den Rest bis zum Tiefpunkt bei 3. Beim Apfel-Modell muss niemand die Schritte verkürzen: Sie werden von selbst kürzer, weil die Steigung kleiner wird.

Was, glaubst du, passiert mit einer viermal so großen Lernrate, einem Sechstel? Überleg kurz, bevor du weiterliest.

Der erste Schritt wird 36 geteilt durch 6, also 6 Euro lang. Der Regler springt von 0 auf 6, auf die andere Seite des Tals. Dort ist der Fehler wieder 56. Der Hang fällt jetzt aber in die andere Richtung, und der nächste Schritt führt zurück auf 0. Der Regler springt hin und her und kommt nie unten an. Ist die Lernrate dagegen sehr klein, kommt das Training kaum voran. Die passende Lernrate finden Fachleute oft erst durch Ausprobieren über mehrere Trainingsläufe.

![Zwei Fehlerkurven nebeneinander. Links: Schritte von 0 auf 1,5, auf 2,25, auf 2,625, immer kürzer, Richtung Tiefpunkt bei 3. Rechts: ein Sprung von 0 auf 6 und zurück auf 0, beide Male beim Fehler 56](../../public/bausteine/parameter-training-inferenz-hardware/lernrate.svg)

*Dieselbe Fehlerkurve, zwei Lernraten: Mit einem Vierundzwanzigstel halbiert jeder Schritt den Rest bis zum Tal, mit einem Sechstel springt der Regler zwischen 0 und 6 hin und her.*

> **Interaktive Demo:** [auf der Website ausprobieren](https://ki-einfach-verstehen.de/de/bausteine/parameter-training-inferenz-hardware/)

Ein echtes Modell hat Milliarden Regler. Würde man jeden einzeln ein Stück drehen und den Fehler neu messen, müsste man das ganze Modell für einen einzigen Schritt milliardenfach durchrechnen. Ein Rechenverfahren namens **Backpropagation** liefert stattdessen die Steigung für alle Regler zugleich, in einem einzigen Durchgang rückwärts durch das Modell. Jeder Regler rückt dann ein Stück bergab. Beim Apfelmodell galt: je steiler, desto größer der Schritt. Große Sprachmodelle richten den Schritt jedes Reglers stattdessen danach, wie groß seine Steigungen bisher waren. Wie die Backpropagation alle Steigungen in einem Durchgang findet, erfährst du im Themenbereich „Wie Lernen funktioniert“.

Beim Spamfilter war es genauso: Nach der Bankmail hätte ein höheres Gewicht für „Gewinn“ den Fehler vergrößert und ein tieferes ihn verkleinert, also rückte das Gewicht ein Stück nach unten. Die Stelle, an der sich Werbemails und Bankmails die Waage halten, ist der Tiefpunkt seines Fehlers.

## Lernen kostet mehr als Benutzen

Eine Antwort im Chatfenster steht nach wenigen Sekunden da. Das Training von Llama 3.1 8B hat dagegen laut Meta knapp anderthalb Millionen Stunden Rechenzeit gekostet, zusammengezählt über alle Chips, die gleichzeitig daran gerechnet haben. Es lief auf Grafikprozessoren, den Chips aus dem Baustein über Vektoren und Matrizen, die Tausende gleichartiger Rechnungen parallel ausführen. Ein einzelner solcher Chip wäre damit über 160 Jahre beschäftigt.

Beim Soundcheck vor einem Konzert spielt die Band ein paar Takte. Die Tontechnikerin hört hin und schiebt am Mischpult Regler, bis es passt. Während des Konzerts verarbeitet das Pult dann einfach, was hereinkommt. Der Soundcheck steht für das Training. Das Benutzen des fertigen Modells heißt **[Inferenz](https://ki-einfach-verstehen.de/de/glossar/inferenz/)** und entspricht dem Konzert. Jede Frage, die du einem Chatbot stellst, löst Inferenz aus.

![Von hinten gesehen: eine Tontechnikerin greift an einem großen Mischpult nach einem Regler; vor ihr leere Sitzreihen, auf der Bühne eine Band mit Gitarre, Schlagzeug und Bass](../../public/bausteine/parameter-training-inferenz-hardware/soundcheck.webp)

*Der Soundcheck vor dem Konzert: Erst werden die Regler eingestellt, dann bleiben sie stehen.*

Hier hinkt das Bild an zwei Stellen. Beim Training schiebt kein Mensch nach Gehör. Die Backpropagation rechnet für alle Regler aus, wohin sie sollen. Und am echten Pult greift die Technikerin auch im Konzert noch ein. **Bei der Inferenz bewegt sich kein Regler, ganz gleich, was du eingibst.** Was ein Chatbot sich in deinem Gespräch „merkt“, wird bei jeder Nachricht als Input mitgeschickt, wie im Baustein über Input und Output. Neue Fassungen eines Modells entstehen erst in späteren Trainingsläufen.

Warum kostet das eine so viel mehr als das andere? Bei der Inferenz rechnet das Modell für jedes Textstück einmal mit seinen festen Zahlen: Input rein, Score-Liste raus. Im Training rechnet das Modell zunächst genauso. Dann vergleicht der Trainingsalgorithmus die Vorhersage mit dem Textstück, das tatsächlich folgt, und misst den Loss. Dann liefert die Backpropagation für jeden der acht Milliarden Regler seine Steigung. Der Trainingsalgorithmus stellt die Regler nach, sobald die Steigungen aus einem großen Stapel Text gesammelt sind.

![Oben Training: Rechnen, Vergleichen mit dem richtigen Textstück, alle Parameter nachstellen, nach jedem Stapel Text, danach wieder von vorn. Unten Inferenz: Input, Rechnen mit festen Parametern, Score-Liste](../../public/bausteine/parameter-training-inferenz-hardware/training-inferenz.svg)

*Training ist eine Schleife aus Rechnen, Vergleichen und Nachstellen. Inferenz ist nur der erste Schritt, mit festen Zahlen.*

Pro Textstück kostet das Training damit nur etwa dreimal so viel Rechenarbeit wie das Antworten. Die Menge erklärt den Unterschied zwischen Sekunden und Millionen Stunden. Eine Antwort hat einige hundert Textstücke. Für das Training von Llama 3.1 nennt Meta rund 15 Billionen, also 15.000 Milliarden. Deshalb läuft das Training auf Tausenden Chips gleichzeitig. Dieser Aufwand fällt für jede Fassung einmal an. Eine einzelne Anfrage ist dagegen billig. Weil aber Millionen Menschen Fragen stellen, braucht auch das Benutzen zusammengenommen große Rechenzentren.

Die acht Milliarden Zahlen von Llama 3.1 8B hat also kein Mensch einzeln eingestellt. Menschen haben den Bauplan festgelegt und die Lernrate gewählt. Das Training hat für Billionen Textstücke den Fehler gemessen, daraus für jeden Regler die Steigung berechnet und ihn immer wieder ein Stück bergab gestellt. Beim Benutzen bleiben die Zahlen stehen.

16 Gigabyte nur für diese Zahlen sind allerdings eine Menge. Wie passt ein Sprachmodell dann auf manche Handys, während große Chatbots ein Rechenzentrum brauchen? Darum geht es im nächsten Baustein, [Modellgröße und Hardware: Wo ein Modell Platz findet](./modellgroesse-und-hardware.md).

---

Quelle: https://ki-einfach-verstehen.de/de/bausteine/parameter-training-inferenz-hardware/

← Zurück: [Wahrscheinlichkeit und Softmax: Wie ein Modell sich entscheidet](./wahrscheinlichkeit-und-softmax.md) · [Alle Bausteine](../../README.de.md#inhalt) · Weiter: [Modellgröße und Hardware: Wo ein Modell Platz findet](./modellgroesse-und-hardware.md) →
