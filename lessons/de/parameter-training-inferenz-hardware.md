<!-- Generated from src/content/bausteine/de/parameter-training-inferenz-hardware.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Parameter, Training und Inferenz, Hardware: Wie ein Modell läuft

> Lesefassung für GitHub. Die vollständige Fassung mit interaktiven Demos, Animationen und Abrufmoment findest du auf der Website: **[Parameter, Training und Inferenz, Hardware: Wie ein Modell läuft](https://ki-einfach-verstehen.de/de/bausteine/parameter-training-inferenz-hardware/)**
>
> Lizenz: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.de) · Nenne die Quelle so: KI einfach verstehen, „Parameter, Training und Inferenz, Hardware: Wie ein Modell läuft“, CC BY 4.0, https://ki-einfach-verstehen.de/de/bausteine/parameter-training-inferenz-hardware/

Was in einem fertigen KI-Modell steckt, was Menschen vor dem Training festlegen, warum Lernen so viel teurer ist als Benutzen und welche Hardware ein Modell braucht.

Im vorigen Baustein kam die Temperatur ins Spiel, eine Einstellung, die nicht trainiert wird. Die Scores selbst berechnet das Modell aus seinen Parametern, und die stellt das Training ein. Wie sähe so ein Modell eigentlich aus, wenn du es in die Hand nehmen könntest?

Fast geht das, denn manche Modelle gibt es zum Herunterladen, etwa Llama 3.1, das Meta 2024 veröffentlicht hat. Die kleinste Fassung, Llama 3.1 8B, umfasst rund 16 Gigabyte Gewichtsdateien. Was steckt in diesen 16 Gigabyte? Wie hat das Training die Zahlen darin eingestellt, und warum hat das über eine Million Stunden Rechenzeit gekostet? Und warum läuft ein kleines Modell auf einem Handy, während ein großer Chatbot ein Rechenzentrum braucht?

## Was in einer Modelldatei steckt

Wer Llama 3.1 8B herunterlädt, bekommt vor allem zwei Arten von Dateien. Eine ist winzig, kleiner als ein Kilobyte, eine Art Bauplan des Modells. Die andere Art sind die Gewichtsdateien, hier vier Stück mit zusammen 16 Gigabyte. Sie enthalten Zahlen, rund acht Milliarden davon. Das sind die Parameter, die das Training eingestellt hat. Ein Satz oder ein Fakt steht darin nirgends im Klartext.

![Links eine kleine Karte Bauplan mit Einträgen wie Vokabular und Rechenstufen, unter einem Kilobyte; rechts ein großer Block aus Zahlen, rund acht Milliarden Parameter, rund 16 Gigabyte](../../public/bausteine/parameter-training-inferenz-hardware/modelldatei.svg)

*Ein heruntergeladenes Modell besteht aus zwei Teilen: einem kleinen Bauplan und sehr vielen Zahlen.*

Aus dem ersten Baustein kennst du für diese zwei Teile ein Bild: das Mischpult. Die kleine Datei nennt Bautyp und Maße des Geräts, etwa wie viele Rechenstufen es hat. Diesen Bauplan nennt man die **[Architektur](https://ki-einfach-verstehen.de/de/glossar/architektur/)** des Modells. Die großen Dateien halten fest, wie jeder einzelne Regler steht: die Parameter. Anders als am echten Pult trägt keiner dieser Regler eine Beschriftung.

Was glaubst du: Wenn zwei Modelle genau dieselbe Architektur haben, verhalten sie sich dann auch gleich?

Nicht unbedingt. Neben Llama 3.1 8B bietet Meta eine zweite Fassung an, Llama 3.1 8B Instruct. Beide haben dieselbe Architektur und genau gleich viele Parameter. Die Grundfassung hat nur das Grundtraining hinter sich, das Vorhersagen des nächsten Textstücks. Die Instruct-Fassung wurde danach weitertrainiert, damit sie wie ein Chatbot auf Fragen und Anweisungen eingeht. Bis auf kleine Unterschiede in den Begleitdateien machen die Zahlen den Unterschied: dasselbe Pult, andere Reglerstellungen, anderes Verhalten. So entstehen auch Chatbots aus Grundmodellen.

Acht Milliarden Regler klingen nach viel. Wie viele haben die großen Modelle, und wie viel Platz braucht das?

## Milliarden Regler: Wie groß ein Modell ist

Die Zahl im Namen verrät die Größe. Das „8B“ in Llama 3.1 8B steht für 8 Milliarden Parameter, das B für das englische billion. Vorsicht: Das ist eine deutsche Milliarde, keine Billion.

Jede dieser Zahlen braucht Platz. Llama 3.1 speichert jeden Parameter in 2 Byte. Speicher zählt man in Byte. Ein Gigabyte sind eine Milliarde Byte. Acht Milliarden Zahlen zu je 2 Byte sind also 16 Milliarden Byte, rund 16 Gigabyte, genau die Größe der Gewichtsdateien. Daraus folgt eine einfache Faustregel: Milliarden Parameter mal 2 ergibt den Speicherbedarf in Gigabyte.

Probier die Regel selbst aus: Meta bietet dasselbe Modell auch mit 70 Milliarden Parametern an. Wie viel Speicher braucht diese Fassung?

Rund 140 Gigabyte. Die größte Fassung hat 405 Milliarden Parameter und kommt so auf rund 810 Gigabyte.

![Balkendiagramm: GPT-2 1,5 Milliarden Parameter 3 Gigabyte, Llama 3.1 8B 16 Gigabyte, Llama 3.1 70B 140 Gigabyte, GPT-3 175 Milliarden 350 Gigabyte, Llama 3.1 405B 810 Gigabyte](../../public/bausteine/parameter-training-inferenz-hardware/modellgroessen.svg)

*Speicherbedarf mit 2 Byte pro Parameter: Von GPT-2 bis zum größten Llama 3.1 wächst er von 3 auf rund 810 Gigabyte.*

GPT-3 aus dem ersten Baustein, ein Vorläufer der Modelle hinter ChatGPT, hat rund 175 Milliarden Parameter und käme so auf 350 Gigabyte. Die Regel zählt nur die Parameter selbst. Beim Benutzen kommen Zwischenergebnisse hinzu, die Regel ist also eine Untergrenze.

Vorsicht bei Namen wie Llama-4-Scout-17B-16E: Dort rechnet für jedes Textstück nur ein Teil der Regler mit, und nur diesen Teil zählen die 17B. Platz brauchen trotzdem alle, laut Modellbeschreibung 109 Milliarden.

Wer hat aber entschieden, dass Llama 3.1 8B acht und nicht neun Milliarden Regler hat? Das Training jedenfalls nicht.

## Was vor dem Training feststeht

Bevor sich der erste Regler bewegt, haben Menschen schon vieles entschieden. Das Training stellt die Regler, aber es baut kein neues Pult. Wie viele Regler es gibt, wie viele Einträge das Vokabular hat, wie viele Tokens ins Kontextfenster passen, also wie viel Text das Modell auf einmal sieht: Das alles steht fest, bevor das Training beginnt.

Solche Einstellungen heißen **[Hyperparameter](https://ki-einfach-verstehen.de/de/glossar/hyperparameter/)**. Der Unterschied: Hyperparameter legen Menschen fest, Parameter stellt das Training ein. Dazu kommen Einstellungen, die nur das Training betreffen. Am Mischpult wäre das alles, was vor dem Soundcheck feststeht, etwa wie viele Kanäle das Pult hat. Den Soundcheck, das Einstellen der Regler, übernimmt beim Modell das Training.

Ein Hyperparameter wirkt direkt auf das Training: die **[Lernrate](https://ki-einfach-verstehen.de/de/glossar/lernrate/)**. Im ersten Baustein hat der Trainingsalgorithmus die Gewichte des Spamfilters bei jedem Fehler „ein kleines Stück“ nachgestellt. Wie groß dieses Stück ist, hängt von der Lernrate ab. Was, glaubst du, passiert, wenn das Stück sehr groß ist?

Dann schießt jede Korrektur übers Ziel hinaus. Das Gewicht von „Gewinn“ spränge nach einer Werbemail weit nach oben, nach der nächsten Bankmail weit nach unten, und fände nie die Stelle, an der sich beide Seiten die Waage halten. Ist das Stück zu klein, kommt das Training kaum voran. Die passende Lernrate finden Fachleute oft nur durch Ausprobieren.

Mehr Regler heißt nicht automatisch besser. Beim KI-Labor DeepMind schnitt das Modell Chinchilla mit derselben Rechenzeit besser ab als das viermal größere Gopher, weil es dafür viermal so viel Text sah.

<details>
<summary>Eine Ebene tiefer: Wie GPT-3 eingestellt wurde</summary>

Das Forschungspapier zu GPT-3 von 2020 nennt für das größte Modell unter anderem diese Hyperparameter:

- **96 Schichten.** Eine Schicht ist eine Rechenstufe, die das Ergebnis der vorigen weiterverarbeitet.
- **12.288 Zahlen pro Token.** So lang ist der Vektor, mit dem das Modell jedes Token auf diesem Weg darstellt.
- **Eine Lernrate von höchstens 0,00006.** Auch wie sie sich im Lauf des Trainings ändert, stand vorher fest.
- **Ein Batch von 3,2 Millionen Tokens.** Der Trainingsalgorithmus sammelt die Korrekturen aus 3,2 Millionen Tokens Text und stellt dann einmal nach.

Keiner dieser Werte wurde gelernt. Zahl der Schichten und Länge der Vektoren legen fest, wie groß das Pult ist: Aus ihnen ergeben sich die 175 Milliarden Parameter. Lernrate und Batch bestimmen, wie der Soundcheck abläuft.

</details>

Sind alle Entscheidungen gefallen, beginnt das Training. Doch woher weiß es bei jedem Regler, ob er nach oben oder nach unten soll?

## Woher kennt das Training die Richtung?

Beim Spamfilter aus dem ersten Baustein kann man sich die Richtung noch denken. Bei Milliarden Reglern ohne Beschriftung geht das nicht.

Zuerst wird der Fehler zu einer Zahl. Das Modell macht eine Vorhersage, der Trainingsalgorithmus vergleicht sie mit der richtigen Antwort und rechnet aus, wie weit sie danebenliegt. Je größer die Zahl, desto falscher die Vorhersage. Fachleute nennen sie Loss, auf Deutsch Verlust.

Ein ausgedachtes Mini-Modell zeigt, was diese Zahl verrät. Es soll den Preis von Äpfeln vorhersagen und hat einen einzigen Regler, den Preis pro Kilo: Vorhersage gleich Regler mal Kilo. Es lernt aus drei erfundenen Einkäufen: 1 Kilo für 2 Euro, 1 Kilo für 4 Euro, 2 Kilo für 6 Euro. Als Fehler zählt jede Abweichung mal sich selbst, alles zusammengezählt. So wiegen große Abweichungen schwerer, und zu viel zählt genauso wie zu wenig.

Der Regler startet bei 0, wie die Gewichte des Spamfilters. Das Modell liegt dann um 2, 4 und 6 Euro daneben, der Fehler ist 4 + 16 + 36 = 56. Wird er kleiner, wenn du den Regler auf 1 drehst?

Ja: Die Abweichungen schrumpfen auf 1, 3 und 4, der Fehler auf 1 + 9 + 16 = 26. Höher ist also die richtige Richtung. Wäre der Fehler gestiegen, wäre es die andere. Bei 2 sinkt er auf 8, bei 3 auf 2, bei 4 steigt er wieder auf 8. Der kleinste Fehler liegt bei 3 Euro. Null wird er nie, weil sich die beiden Ein-Kilo-Einkäufe widersprechen.

![Kurve in Form eines Tals: Reglerstellung 0 bis 6 Euro pro Kilo, Fehler 56 bei 0, 26 bei 1, 8 bei 2, Tiefpunkt 2 bei 3, wieder 8 bei 4; die Stufen dazwischen fallen um 30, 18 und 6](../../public/bausteine/parameter-training-inferenz-hardware/fehlerkurve.svg)

*Der Fehler des ausgedachten Apfel-Modells für jede Reglerstellung: Weit weg vom Tiefpunkt fällt er pro Euro stark, kurz davor kaum noch.*

Aufschlussreich ist, um wie viel der Fehler pro Drehung sinkt: erst um 30, dann um 18, zuletzt nur um 6. Wie stark sich der Fehler bei einer kleinen Drehung ändert, ist die Steigung, wie bei einem Hang. Sie verrät zweierlei. Fällt der Fehler beim Höherdrehen, dreht das Training den Regler weiter hoch, steigt er, dreht es ihn tiefer. Und in einer Mulde wie dieser gilt: Je stärker er sich ändert, desto weiter ist es noch bis zum Tiefpunkt. Deshalb macht das Training große Schritte, wo es steil ist, und kleine, wo es flach wird. Die Lernrate ist der Faktor dazu: Schritt gleich Steigung mal Lernrate.

Ein Bild dafür: Du stehst bei dichtem Nebel an einem Hang und willst ins Tal. Du spürst nur, wohin der Boden abfällt und wie steil. Also gehst du ein Stück bergab und spürst neu. Das Tal ist die Reglerstellung mit dem kleinsten Fehler. Die Grenze des Bildes: Den Hang gibt es nicht. Er steht für die Fehlerzahl bei jeder Reglerstellung, und die Neigung, die du spürst, muss das Training ausrechnen.

> **Interaktive Demo:** [auf der Website ausprobieren](https://ki-einfach-verstehen.de/de/bausteine/parameter-training-inferenz-hardware/)

Ein echtes Modell hat nicht einen Regler, sondern Milliarden. Jeden einzeln ein Stück zu drehen und den Fehler neu zu messen, hieße, für einen einzigen Lernschritt das ganze Modell milliardenfach durchzurechnen. Viel zu teuer. Ein Rechenverfahren namens **Backpropagation** liefert Richtung und Stärke für alle Regler zugleich, in einem Durchgang rückwärts durch das Modell. Wie das funktioniert, zeigt der Themenbereich „Wie Lernen funktioniert“.

Damit wird auch der Spamfilter klarer. Nach der Bankmail „Dein Gewinn aus Zinsen“ stand das Gewicht von „Gewinn“ zu hoch. Ein Stück tiefer hätte den Fehler verkleinert, also rückte es nach unten. Die Stelle, an der sich Werbemails und Bankmails die Waage halten, ist der Tiefpunkt seiner Fehlerkurve.

Warum dauert Training dann so lange, wenn eine Antwort im Chatfenster nach Sekunden dasteht?

## Lernen kostet mehr als Benutzen

Bei einem Konzert gibt es zwei Phasen am Mischpult. Vorher, beim Soundcheck, spielt die Band ein paar Takte. Die Tontechnikerin hört hin und schiebt Regler, bis es passt. Während des Konzerts verarbeitet das Pult dann einfach, was hereinkommt. Der Soundcheck steht für das Training. Das Benutzen des fertigen Modells heißt **[Inferenz](https://ki-einfach-verstehen.de/de/glossar/inferenz/)**, das ist das Konzert. Jede Frage, die du einem Chatbot stellst, löst Inferenz aus.

![Von hinten gesehen: eine Tontechnikerin greift an einem großen Mischpult nach einem Regler; vor ihr leere Sitzreihen, auf der Bühne eine Band mit Gitarre, Schlagzeug und Bass](../../public/bausteine/parameter-training-inferenz-hardware/soundcheck.webp)

*Der Soundcheck vor dem Konzert: Erst werden die Regler eingestellt, dann bleiben sie stehen.*

Hier hinkt das Bild: Beim Training schiebt kein Mensch nach Gehör, die Backpropagation rechnet für alle Regler zugleich aus, wohin sie sollen. Und am echten Pult greift die Technikerin auch im Konzert noch ein. Beim Modell nicht: Bei der Inferenz bewegt sich kein Regler, ganz gleich, was du eingibst. Was ein Chatbot sich in deinem Gespräch „merkt“, wird bei jeder Nachricht als Input mitgeschickt, wie im Baustein über Input und Output. Neue Fassungen entstehen erst in späteren Trainingsläufen. Manche Anbieter verwenden dafür auch gespeicherte Gespräche, wenn die passende Einstellung eingeschaltet ist.

Warum ist das eine so viel teurer als das andere? Bei der Inferenz rechnet das Modell für jedes Textstück einmal mit seinen Zahlen: Input rein, Score-Liste raus. Beim Training kommen für jedes Beispiel die zwei Schritte aus dem vorigen Abschnitt dazu. Der Trainingsalgorithmus misst den Fehler: Je kleiner das Feld des tatsächlich folgenden Textstücks auf dem Rad aus dem Softmax-Baustein, desto größer der Fehler. Dann liefert die Backpropagation für jeden Parameter Richtung und Stärke. Bei Llama 3.1 8B sind das acht Milliarden Korrekturen pro Portion Trainingstext.

![Oben Training: Rechnen, Vergleichen mit dem richtigen Textstück, alle Parameter nachstellen, danach wieder von vorn. Unten Inferenz: Input, Rechnen mit festen Parametern, Score-Liste](../../public/bausteine/parameter-training-inferenz-hardware/training-inferenz.svg)

*Training ist eine Schleife aus Rechnen, Vergleichen und Nachstellen. Inferenz ist nur der erste Schritt, mit festen Zahlen.*

Und das Training braucht sehr viele Beispiele. Llama 3.1 wurde mit rund 15 Billionen Tokens trainiert, also 15.000 Milliarden. Für die kleinste Fassung gibt Meta 1,46 Millionen Stunden Rechenzeit auf Grafikchips an, den Grafikprozessoren aus dem Tensor-Baustein. Ein einzelner Chip bräuchte über 160 Jahre, deshalb läuft Training auf Tausenden Chips gleichzeitig. Dieser Aufwand fällt für jede Fassung einmal an. Eine einzelne Anfrage ist dagegen billig. Weil aber Millionen Menschen Fragen stellen, braucht auch das Benutzen zusammengenommen große Rechenzentren.

Auch beim Speicher bleibt es im Training nicht bei den Parametern. Zu jedem Regler merkt sich der Trainingsalgorithmus seine Korrektur, eine genauere Kopie und zwei Hilfswerte, zusammen rund 16 statt 2 Byte. Schon ohne Zwischenergebnisse braucht Training also rund achtmal so viel Platz wie das Benutzen, bei Llama 3.1 8B weit über 100 Gigabyte statt 16.

<details>
<summary>Eine Ebene tiefer: Was Training zusätzlich im Speicher hält</summary>

Erstens die Steigung für jeden Parameter aus dem letzten Rechenschritt, bei vielen Reglern Gradient genannt. Zweitens führt das verbreitete Trainingsverfahren Adam für jeden Parameter zwei laufende Durchschnitte mit, über Richtung und Größe der letzten Korrekturen. Drittens wird zwar mit 2-Byte-Zahlen gerechnet, aber eine genauere Kopie aller Parameter mit 4 Byte pro Zahl aufbewahrt. Sonst könnten winzige Korrekturen beim Runden ganz verschwinden.

Das Forschungspapier zum Speicherverfahren ZeRO rechnet so: 2 Byte für den Parameter, 2 für seinen Gradienten, 12 für die genaue Kopie und die beiden Adam-Werte. Zusammen sind das 16 Byte pro Parameter. Für Llama 3.1 8B ergeben 16 Byte rund 130 Gigabyte, mehr als ein einzelner Rechenzentrumschip mit 80 Gigabyte fasst. Dazu kommen die Zwischenergebnisse jeder Rechenstufe, die die Backpropagation braucht. Verfahren wie ZeRO verteilen all diese Daten deshalb auf viele Chips.

</details>

Und worauf läuft ein fertiges Modell, wenn du es benutzt?

## Platz und Tempo: Welche Hardware ein Modell braucht

Auf manchen Handys läuft ein Sprachmodell auf dem Gerät selbst, bei Apple etwa eines mit rund 3 Milliarden Parametern. Große Chatbots dagegen laufen in Rechenzentren. Liegt das vor allem daran, dass Handys zu langsam rechnen?

Hier endet das Mischpult-Bild: Ein Modell ist kein Gerät, sondern eine Datei. „Laufen“ heißt: Ein Chip lädt alle Reglerstellungen und rechnet damit. Am schnellsten rechnet ein Grafikchip mit Zahlen, die in seinem eigenen Speicher daneben liegen, dem **[Grafikspeicher](https://ki-einfach-verstehen.de/de/glossar/grafikspeicher/)**, oft VRAM genannt. Dort müssen alle Parameter Platz finden, damit ein Modell zügig läuft.

![Computerchip](../../public/bausteine/parameter-training-inferenz-hardware/chip.svg)

*Ein Grafikchip rechnet mit den Zahlen in seinem eigenen, schnellen Speicher.*

Eine Spiele-Grafikkarte wie die GeForce RTX 4090 hat 24 Gigabyte Grafikspeicher. Llama 3.1 8B passt mit seinen 16 Gigabyte darauf. Ein Chip für Rechenzentren wie die H100 von Nvidia hat in der verbreiteten Fassung 80 Gigabyte. Das größte Llama 3.1 mit rund 810 Gigabyte braucht mehrere Chips. Die erste Grenze ist also der Platz, nicht das Tempo.

Im Handy teilen sich Modell, System und alle Apps den Arbeitsspeicher, bei aktuellen Pixel-Handys 8 bis 16 Gigabyte. Ein Modell mit 3 Milliarden Parametern bräuchte nach der Faustregel 6 Gigabyte und nähme einem 8-Gigabyte-Handy fast den ganzen Platz. Wie passt es trotzdem aufs Handy? Die Lösung heißt **[Quantisierung](https://ki-einfach-verstehen.de/de/glossar/quantisierung/)**: Jede Zahl wird mit weniger Stellen gespeichert, also gröber gerundet. Gezählt wird in Bit, den kleinsten Ja-Nein-Stellen eines Speichers. Ein Byte hat 8 davon, 2 Byte also 16.

Speichert man jede Zahl mit 8 statt 16 Bit, halbiert sich der Platz, mit 4 Bit bleibt ein Viertel. Apple verkleinert den größten Teil seines Handy-Modells sogar auf 2 Bit pro Zahl, also auf ein Achtel. Das kann etwas Genauigkeit kosten, je nach Verfahren. Bei 8 Bit ist die Einbuße oft kaum messbar, selbst bei Modellen von der Größe von GPT-3.

> **Interaktive Demo:** [auf der Website ausprobieren](https://ki-einfach-verstehen.de/de/bausteine/parameter-training-inferenz-hardware/)

<details>
<summary>Eine Ebene tiefer: Warum die Antwort Stück für Stück erscheint</summary>

Für jedes neue Textstück rechnet ein Sprachmodell einmal durch das ganze Modell. Dafür müssen alle Parameter aus dem Grafikspeicher zu den Rechenwerken des Chips wandern. Bei einzelnen Anfragen dauert dieses Laden länger als das Rechnen selbst.

Wie viele Gigabyte der Speicher pro Sekunde liefern kann, heißt Speicherbandbreite. Bei der H100 in ihrer verbreiteten SXM-Fassung sind es laut Hersteller 3,35 Terabyte pro Sekunde, also 3350 Gigabyte. Ein Überschlag mit Llama 3.1 8B: 3350 geteilt durch 16 ergibt rund 209. Mehr als etwa 200 Textstücke pro Sekunde kann eine einzelne Anfrage auf diesem Chip mit 16-Bit-Zahlen also kaum bekommen, egal wie schnell er rechnet. In der Praxis sind es weniger. Deshalb rechnen Rechenzentren die Anfragen vieler Menschen gemeinsam, im Batch aus dem Baustein über Input und Output: Der Chip lädt die Parameter einmal und verwendet sie für alle Anfragen dieses Schritts.

</details>

Damit ist die Frage vom Anfang beantwortet. In den 16 Gigabyte von Llama 3.1 8B stecken ein kleiner Bauplan und rund acht Milliarden Zahlen. Menschen haben vorher festgelegt, wie das Pult gebaut ist. Das Training hat über eine Million Chip-Stunden lang Fehler gemessen und jeden Regler bergab gestellt. Benutzen heißt Rechnen mit festen Zahlen, und wo das geht, entscheidet zuerst der Platz.

Eine Frage bleibt. In diesen Milliarden Zahlen steht kein Satz. Wie kann ein Modell dann wissen, dass Paris die Hauptstadt von Frankreich ist? Darum geht es im nächsten Teil: was ein KI-Modell eigentlich ist und warum es keine Datenbank voller Fakten ist.

---

Quelle: https://ki-einfach-verstehen.de/de/bausteine/parameter-training-inferenz-hardware/

← Zurück: [Wahrscheinlichkeit und Softmax: Wie ein Modell sich entscheidet](./wahrscheinlichkeit-und-softmax.md) · [Alle Bausteine](../../README.de.md#inhalt) · Weiter: [Was ein KI-Modell eigentlich ist](./was-ein-ki-modell-eigentlich-ist.md) →
