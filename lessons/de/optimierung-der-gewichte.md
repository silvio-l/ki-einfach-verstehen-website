<!-- Generated from src/content/bausteine/de/optimierung-der-gewichte.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Optimierung: Wer die Gewichte tatsächlich ändert

> Lesefassung für GitHub. Die vollständige Fassung mit interaktiven Demos, Animationen und Abrufmoment findest du auf der Website: **[Optimierung: Wer die Gewichte tatsächlich ändert](https://ki-einfach-verstehen.de/de/bausteine/optimierung-der-gewichte/)**
>
> Lizenz: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.de) · Nenne die Quelle so: KI einfach verstehen, „Optimierung: Wer die Gewichte tatsächlich ändert“, CC BY 4.0, https://ki-einfach-verstehen.de/de/bausteine/optimierung-der-gewichte/

Wie der Optimierer aus den Zetteln der Backpropagation echte Schritte macht: mit Schwung, mit einer eigenen Schrittweite für jeden Regler, mit einem leisen Zug Richtung null und nach einem Plan für die Lernrate.

Am Ende des letzten Bausteins hing am Mischpult von Llama 3.1 8B an jedem der rund acht Milliarden Regler ein Zettel. Die Backpropagation hatte ihn für einen [Batch](https://ki-einfach-verstehen.de/de/glossar/batch/) ausgerechnet, also für einen Stapel Text, für den der [Loss](https://ki-einfach-verstehen.de/de/glossar/loss/) eine einzige Fehlerzahl liefert. Jeder Regler steht für einen [Parameter](https://ki-einfach-verstehen.de/de/glossar/parameter/), seine Stellung für dessen Zahl. Sein Zettel sagt nur für diesen Batch: höher oder tiefer, und wie stark. Alle Zettel zusammen heißen Gradient. Bewegt hat sich dabei noch kein Regler.

Beim nächsten Batch zeigen viele Zettel ein wenig anders, manche sogar in die Gegenrichtung. Was glaubst du: Wohin führt es, den Zetteln jedes Mal genau zu folgen?

## Wer dreht: der Optimierer, mit Schwung

Aus dem Baustein über Training kennst du die einfachste Antwort: Schritt gleich Steigung mal [Lernrate](https://ki-einfach-verstehen.de/de/glossar/lernrate/). Ein Zettel ist genau diese Steigung, für jeden Regler einzeln: wohin es bergab geht und wie steil. Beim ausgedachten Apfel-Modell halbierte mit einer Lernrate von einem Vierundzwanzigstel jeder Schritt den Rest bis zum Tal. Mit einem Sechstel sprang der Regler zwischen 0 und 6 hin und her. Diese Regel ist eine feste Rechenvorschrift, die aus den Zetteln Schritte macht. Eine solche Vorschrift heißt **[Optimierer](https://ki-einfach-verstehen.de/de/glossar/optimierer/)**. Im Training ist der Optimierer der Teil, der die Regler Schritt für Schritt dreht.

Folgt er der einfachen Regel aufs Wort, gibt es ein Problem. Ein ausgedachtes Modell mit zwei Reglern zeigt es. Seine Fehlerzahl bildet einen Nebel-Hang wie im Baustein über Training, nur jetzt mit zwei Richtungen: Der eine Regler bewegt dich quer, der andere längs. Wo du stehst, sind die Stellungen beider Regler. Der Hang ist eine schmale Rinne: quer fällt der Boden steil zu ihrer Mitte ab, längs geht es nur sanft bergab. Mit großen Schritten landest du quer jedes Mal auf der gegenüberliegenden Seite, wie das Apfel-Modell bei 6. Dein Weg wird ein Zickzack. Kleinere Schritte beenden das Springen, aber dann kommst du längs kaum voran. Dazu wackelt der Hang: Jeder Batch liefert etwas andere Zettel.

![Rinne von oben: Die einfache Regel springt von Rand zu Rand, der Weg mit Schwung läuft ruhig in der Mitte zum Tal links](../../public/bausteine/optimierung-der-gewichte/rinne-zickzack.svg)

*Eine ausgedachte Rinne von oben, das Tal liegt links. Die einfache Regel folgt jedem Zettel und zickzackt von Rand zu Rand, mit Schwung wird der Weg ruhiger.*

Was hilft, zeigen ausgedachte, bewusst glatte Zahlen. Quer springst du von Seite zu Seite, also zeigen die Zettel dort abwechselnd +8 und −8. Längs sagen sie jedes Mal 1. Die Zettel gelten nur für ihren Batch und sind danach weg. Was von ihnen über die Batches hinweg bleibt, ist der **Schwung**. Er ist keine Physik, sondern eine gespeicherte Zahl pro Regler, die bei jedem Batch ein Stück vom neuen Zettel aufnimmt. Der Optimierer folgt also dem Schwung statt jedem Zettel. Der neue Schwung besteht zu 90 Prozent aus dem bisherigen und zu 10 Prozent aus dem neuen Zettel. Der Schritt ist dann Lernrate mal Schwung statt Lernrate mal Zettel. Was quer hin und her zeigt, hebt sich im Schwung fast auf. Was längs immer gleich zeigt, sammelt sich. Nach zwanzig Zetteln schwankt der Schwung quer noch zwischen rund −0,4 und +0,5. Längs ist er auf fast 0,9 gewachsen, beinahe den vollen Zettel.

![Zwei Diagramme: Quer springen die Zettel zwischen +8 und −8, der Schwung bleibt um null; längs steigt er auf fast 0,9](../../public/bausteine/optimierung-der-gewichte/schwung-zettel.svg)

*Das ausgedachte Beispiel aus dem Text: Quer heben sich die Zettel im Schwung fast auf, längs sammelt er sich bis fast auf die volle Zettelgröße.*

Das Fachwort für den Schwung ist **[Momentum](https://ki-einfach-verstehen.de/de/glossar/momentum/)**. Ein Lehrbuch beschreibt es als gleitenden Durchschnitt früherer Steigungen, in deren Richtung sich der Optimierer weiterbewegt. Die Rechnung gibt es in leicht verschiedenen Formen. Die hier gezeigte Form mittelt die Steigungen: Der neue Zettel geht nur mit 10 Prozent ein. Sie steckt im meistgenutzten Verfahren für große Sprachmodelle, das gleich noch vorkommt. Beim Training von GPT-3, einem Vorläufer der Modelle hinter ChatGPT, behielt es laut Forschungspapier genau diese 90 Prozent. Der Anteil ist gewählt, also ein [Hyperparameter](https://ki-einfach-verstehen.de/de/glossar/hyperparameter/).

Mit dieser Mittelung wird der Weg längs nicht schneller, er bleibt knapp unter dem vollen Zettel. Er wird ruhiger, und deshalb verträgt er größere Schritte, ohne quer aufzuschaukeln. Der echte Hang hat allerdings nicht zwei Richtungen, sondern so viele, wie es Regler gibt. Mehr Schwung ist auch nicht immer besser. Behält der Optimierer 99 Prozent, reagiert er träge: Neue Zettel ändern seine Richtung kaum noch, und das Modell kommt schwerer zur Ruhe.

Schwung glättet das Hin und Her. Er ändert aber nichts daran, dass manche Regler stets große Zettel bekommen und andere winzige.

## Jeder Regler seine eigene Schrittweite

Im Baustein über Training stand dazu nur ein Satz: Große Sprachmodelle richten den Schritt jedes Reglers danach, wie groß seine Steigungen bisher waren. Im Baustein über Modellgröße kam hinzu, dass das meistgenutzte Trainingsverfahren sich dafür je Regler zwei Hilfswerte merkt. Wozu braucht es die?

Zwei ausgedachte Regler, je vier Zettel aus vier Batches. Die Tabelle rechnet nicht mit der Mischung von oben, sondern nimmt zur Abkürzung den einfachen Durchschnitt der vier Zettel: einmal mit Vorzeichen, als Abkürzung für den Schwung, und einmal ohne, also so, als wären alle Zettel positiv. Das ist ihre übliche Größe. Mit der 90-zu-10-Mischung kämen andere Zahlen heraus. Die Abkürzung zeigt nur, welche Zettel sich aufheben und welche sich sammeln. Bei P heben sich 10, −8, 9 und −11 zu null auf. Ohne Vorzeichen sind es 10, 8, 9 und 11, zusammen 38, geteilt durch 4 also 9,5.

| Regler | Zettel | Durchschnitt mit Vorzeichen | übliche Größe |
|---|---|---|---|
| P | 10, −8, 9, −11 | 0 | rund 9,5 |
| Q | 0,1, 0,1, 0,1, 0,1 | 0,1 | 0,1 |

Mit der einfachen Regel macht P beim letzten Zettel einen Schritt von 11 mal Lernrate, Q einen von 0,1 mal Lernrate, also hundertzehnmal weniger. Dabei weiß P gar nicht, wohin er soll: Seine Zettel widersprechen sich. Q dagegen bekommt immer dieselbe Auskunft, nur leise. Was glaubst du: Welcher der beiden sollte den größeren Schritt machen?

![Wanderer in einer nebligen Schlucht; seine Fußspuren liegen längs weit auseinander, zu den Wänden hin kurz und dicht](../../public/bausteine/optimierung-der-gewichte/wanderer.webp)

*Ein eigenes Schrittmaß für jede Richtung: vorsichtig, wo es steil und unruhig ist, mutig, wo es flach und beständig bergab geht.*

Ein guter Wanderer in der Rinne hätte für jede Richtung ein eigenes Schrittmaß, nicht für jeden Ort. Quer, wo es steil ist und die Neigung ständig wechselt, setzt er vorsichtig kurze Schritte. Längs, wo es flach, aber beständig bergab geht, schreitet er weit aus. Wo es steil ist, weiß er vorher allerdings nicht. Er merkt es an seinen letzten Schritten: Wo die Neigung immer wieder umschlug, wird er vorsichtiger. Ein Wanderer hat nur zwei Richtungen und spürt den Boden unter den Füßen. Der Optimierer hat so viele Richtungen, wie es Regler gibt, und kennt nur die Zettel. Er rechnet sein Schrittmaß für jeden von Milliarden Reglern einzeln aus.

Genau das tut das Verfahren **Adam**, 2014 von zwei Forschern vorgestellt. Es speichert für jeden Regler zwei Hilfswerte: den Schwung und einen gleitenden Durchschnitt der quadrierten Zettel. Das Quadrat macht jeden Zettel positiv. Der Schritt ist dann Lernrate mal Schwung geteilt durch die Wurzel aus diesem Durchschnitt, also durch die übliche Größe der Zettel. Bei P sind das 0 geteilt durch 9,5, also fast kein Schritt. Bei Q 0,1 geteilt durch 0,1, also eine volle Lernrate. Hätte ein dritter Regler viermal den Zettel 10, wäre es 10 geteilt durch 10, ebenfalls eine volle Lernrate. Adam rechnet die Größe der Zettel also heraus: Die übliche Größe misst nur, wie stark sie sind; ob sie beständig in eine Richtung zeigen, entscheidet der Schwung.

Adam ist trotzdem kein Modell und lernt nichts dazu. Es ist eine feste Rechenvorschrift mit gewählten Einstellungen. Schwung und übliche Größe sind Rechenstände des Trainings, keine Parameter des Modells. Beim Benutzen des fertigen Modells werden sie nicht gebraucht. GPT-3 wurde mit Adam trainiert.

<details class="verstaendnishilfe">
<summary>Welcher Regler bewegt sich weiter, P oder Q?</summary>

Q. Seine Schritte zeigen bei jedem Batch in dieselbe Richtung und addieren sich: nach hundert solchen Batches rund hundert Lernraten weit. Die Schritte von P sind winzig und zeigen mal hierhin, mal dorthin. Sie heben sich weitgehend auf, und P bleibt ungefähr, wo er war.

</details>

> **Interaktive Demo:** [auf der Website ausprobieren](https://ki-einfach-verstehen.de/de/bausteine/optimierung-der-gewichte/)

Mit Schwung und eigener Schrittweite ist Adam fast komplett. Im Bericht zu Llama 3 steht aber AdamW, ein Name mit einem Buchstaben mehr.

## Das W: ein leiser Zug Richtung null

Meta hat sein größtes Modell, Llama 3.1 mit 405 Milliarden Reglern, laut eigenem Forschungspapier mit AdamW trainiert. Was bedeutet das W?

![Schieberegler mit Knopf über einem Querbalken, der für die Null steht; eine Spiralfeder zieht den Knopf zu ihm hinunter](../../public/bausteine/optimierung-der-gewichte/feder-regler.webp)

*Weight Decay wie eine kleine Feder an jedem Regler: Sie zieht ihn bei jedem Schritt ein wenig Richtung null, ganz gleich, was der Zettel sagt. Der Querbalken steht für die Null.*

Am Mischpult sieht es so aus: An jedem Regler hängt eine kleine Feder, die ihn zur Null zieht. Bei jedem Schritt rückt der Optimierer den Regler zuerst ein winziges Stück Richtung null, im Verhältnis zu seinem Wert. Danach kommt der Schritt aus Schwung und üblicher Größe, wie eben. Die Feder hat keine andere Ruhelage als null, und sie zieht immer, egal was der Zettel sagt. Diesen Zug nennt man **[Weight Decay](https://ki-einfach-verstehen.de/de/glossar/weight-decay/)**, auf Deutsch etwa Gewichtsschwund. Kein Regler wird dabei entfernt, und keiner springt auf null.

Was passiert aber mit einem Regler, dessen Zettel bei jedem Batch null sagt?

Er schrumpft, Schritt für Schritt um denselben kleinen Anteil seines Werts. Nach sehr vielen Schritten steht er nahe null. Regler, die das Modell braucht, bekommen dagegen Zettel, die dem Zug immer wieder entgegenhalten.

Warum ein eigener Buchstabe? Man könnte den Zug auch einfach zum Zettel dazuzählen. Dann teilte Adam ihn aber zusammen mit dem Zettel durch dessen übliche Größe. Bei einem Regler mit großen Zetteln würde der Zug dadurch winzig, und gerade er spürte die Feder kaum noch. Zwei Forscher schlugen 2017 deshalb vor, den Zug getrennt vom Zettel anzuwenden, „entkoppelt“. Das W in AdamW steht für dieses getrennte Weight Decay. Wie stark die Feder zieht, ist eine gewählte Zahl. GPT-3 nutzte laut Forschungspapier den Wert 0,1. Verbreitete Umsetzungen multiplizieren den Zug zusätzlich mit der Lernrate: Pro Schritt wird jeder Regler um Lernrate mal 0,1 mal seinen Wert kleiner. Ausgedacht, mit bewusst großer Lernrate 0,1 zum Rechnen: Ein Regler auf 2 wird im Schritt um 0,1 mal 0,1 mal 2, also 0,02, Richtung null gezogen und steht danach auf 1,98. Steht er auf 1, sind es nur 0,01. Weil die Lernrate großer Modelle winzig ist, bleibt der Zug pro Schritt ein winziger Bruchteil des Werts.

Nicht jedes große Modell wird nur mit AdamW trainiert: Das deutsch-englische Sprachmodell Kolibri optimiert laut Bericht seiner Entwickler große Teile seiner Regler mit einem neueren Optimierer namens Muon.

Bleibt die Lernrate selbst: Sie stand bisher fest.

## Erst hoch, dann lange runter: der Lernraten-Plan

Wenn so viel an der Lernrate hängt, warum wählt man nicht einfach eine gute und hält sie fest?

> **Interaktive Demo:** [auf der Website ausprobieren](https://ki-einfach-verstehen.de/de/bausteine/optimierung-der-gewichte/)

Weil das Training an seinem Anfang und an seinem Ende verschiedene Schritte braucht. Gegen Ende liegt das Modell schon nahe am Tal. Die Zettel wackeln aber weiter, denn jeder Batch enthält anderen Text. Ein Lehrbuch nennt dieses Rauschen als Grund, bei der einfachen Regel die Lernrate im Lauf zu senken: Es verschwindet auch am Tiefpunkt nicht. Mit großen Schritten würde das Modell immer wieder aus dem Tal geschubst, wie das Apfel-Modell, das zwischen 0 und 6 sprang. Kleine Schritte lassen es dagegen zur Ruhe kommen.

Am Anfang stehen die Regler zufällig, die Zettel sind groß und wild. Aus so wenigen Zetteln schätzt Adam die übliche Größe nur ungenau. Seine Schrittweiten schwanken dann stark, und manche werden viel größer als nötig. Mit einer hohen Lernrate gehen solche Schritte leicht schief. Ein Forschungsteam schlug vor, dass ein langsamer Start genau diese Unsicherheit abfedert, und stützte das mit Experimenten und Theorie. Deshalb beginnt die Lernrate fast bei null und wird in kurzer Zeit hochgefahren. Das heißt **Aufwärmen**. Danach sinkt sie langsam.

Diesen vorher festgelegten Verlauf nennt man **[Lernraten-Plan](https://ki-einfach-verstehen.de/de/glossar/lernraten-plan/)**. Er ist ein Hyperparameter wie die Lernrate selbst. Beim größten Modell dieser Reihe, Llama 3.1 mit 405 Milliarden Reglern, ging es laut Meta 8.000 Schritte hoch und danach über eine Million Schritte langsam hinunter. Die genauen Werte zeigt das Diagramm. Ganz am Ende des Trainings sank die Lernrate auf null.

![Lernrate von Llama 3.1 405B: steigt in 8.000 Schritten auf 0,00008 und sinkt über 1,2 Millionen Schritte bis auf null](../../public/bausteine/optimierung-der-gewichte/lernraten-plan-llama3.svg)

*Der Lernraten-Plan von Llama 3.1 mit 405 Milliarden Reglern laut Meta: links die ersten Schritte, in denen die Lernrate hochfährt, rechts der ganze Lauf, in dem das Aufwärmen nur als senkrechter Strich am Anfang erscheint.*

<details class="verstaendnishilfe">
<summary>Was würde passieren, wenn man gegen Ende plötzlich wieder auf die Spitzenlernrate springt?</summary>

Die Schritte würden wieder groß. Das Modell liegt dann zwar nahe am Tal, aber die Zettel wackeln weiter, und jeder große Schritt schubst es ein Stück hinaus, so wie das Apfel-Modell bei einem Sechstel zwischen 0 und 6 sprang. Der Loss würde wohl wieder steigen. Deshalb endet ein Plan mit kleinen Schritten und springt nicht zurück.

</details>

<details>
<summary>Eine Ebene tiefer: Was der Optimierer pro Regler speichert</summary>

Im Baustein über Modellgröße hast du die 16 Byte pro [Parameter](https://ki-einfach-verstehen.de/de/glossar/parameter/) kennengelernt, die das Training in einer verbreiteten Einstellung braucht. Sie stammen aus dem Forschungspapier zu ZeRO, einem Verfahren zum Training sehr großer Modelle. Dort teilen sie sich so auf: 2 Byte für die 16-Bit-Zahl, 2 Byte für ihren Zettel und 12 Byte für den Optimierer. Die 12 Byte sind die genauere 32-Bit-Kopie der Zahl sowie Adams Schwung und übliche Größe, je 4 Byte.

Drei Viertel dessen, was pro Parameter gespeichert wird, gehören also dem Optimierer. Rechnet man das für Llama 3.1 8B nach, sind es rund 96 der 128 Gigabyte. Genau dort setzt ZeRO an. Trainieren viele Chips gemeinsam, muss nicht jeder die vollständigen Optimiererwerte halten. Jeder Chip hält nur seinen Anteil und stellt nur diesen Teil der Regler nach. Das Papier rechnet ein Beispiel mit 7,5 Milliarden Parametern auf 64 Chips: 120 Gigabyte pro Chip ohne Aufteilung, 31,4 Gigabyte, wenn nur der Optimiererzustand verteilt wird.

</details>

Am Anfang lagen auf den acht Milliarden Reglern von Llama 3.1 8B die Zettel bereit, und keiner hatte sich bewegt. Jetzt kennst du den, der dreht. Wie viele solche Schritte braucht ein Modell, wie viel Text sieht es dabei, und woran erkennt man, dass es vorankommt? [Batch, Epoch, Step, Tokenbudget: Wie man Trainingsfortschritt misst](./batch-epoch-step-tokenbudget.md).

---

Quelle: https://ki-einfach-verstehen.de/de/bausteine/optimierung-der-gewichte/

← Zurück: [Backpropagation und Gradienten: Wie das Modell weiß, was es ändern muss](./backpropagation-und-gradienten.md) · [Alle Bausteine](../../README.de.md#inhalt) · Weiter: [Batch, Epoch, Step, Tokenbudget: Wie man Trainingsfortschritt misst](./batch-epoch-step-tokenbudget.md) →
