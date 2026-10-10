<!-- Generated from src/content/bausteine/de/transformerbloecke-und-attention.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Transformerblöcke und Attention: Wie Kontext eingemischt wird

> Lesefassung für GitHub. Die vollständige Fassung mit interaktiven Demos, Animationen und Abrufmoment findest du auf der Website: **[Transformerblöcke und Attention: Wie Kontext eingemischt wird](https://ki-einfach-verstehen.de/de/bausteine/transformerbloecke-und-attention/)**
>
> Lizenz: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.de) · Nenne die Quelle so: KI einfach verstehen, „Transformerblöcke und Attention: Wie Kontext eingemischt wird“, CC BY 4.0, https://ki-einfach-verstehen.de/de/bausteine/transformerbloecke-und-attention/

Wie ein Sprachmodell die Information früherer Wörter in jedes Token einmischt, warum es nicht nach vorne schauen darf und wie viele Blöcke dabei arbeiten.

Zwei Sätze: „Ich zahle Geld bei der Bank ein“ und „Ich sitze auf der Bank im Park“. Im vorigen Baustein hat jedes Token seinen Steckbrief bekommen, eine lange Zahlenliste aus der Nachschlagetabelle des Modells. Für „Bank“ ist es in beiden Sätzen dieselbe Liste. Ein Chatbot, der beide Sätze ins Englische übersetzt, muss aber einmal „bank“ und einmal „bench“ schreiben. Woher soll er das wissen, wenn „Bank“ in beiden Fällen gleich aussieht?

![Gebäude mit Säulen und Giebel](../../public/bausteine/transformerbloecke-und-attention/bank.svg)

*Geldinstitut oder Sitzbank: Das Wort allein entscheidet es nicht.*

Die Antwort steckt in vielen gleich gebauten Blöcken, jeder mit eigenen Zahlen. Diese Architektur heißt **[Transformer](https://ki-einfach-verstehen.de/de/glossar/transformer/)** und wurde 2017 vorgestellt. In diesen Blöcken bekommt jedes Token Information von den anderen. Zur Vereinfachung ist hier jedes Wort ein Token.

## Ein Steckbrief, zwei Bedeutungen

Wenn du „Ich sitze auf der Bank“ liest, denkst du nicht an Geld, denn du liest den Satz drumherum mit. Ein Steckbrief kann das nicht: Für „Bank“ wird jedes Mal derselbe nachgeschlagen, egal was davor oder danach steht.

Ein Sprachmodell löst das, indem es aus jedem Steckbrief Schritt für Schritt neue Zahlen berechnet; die Tabelle selbst bleibt, wie sie ist. Erinnerst du dich an das Mischpult aus dem ersten Baustein dieses Themenbereichs? Dein Text lief durch viele Rechenstufen, und die Zahlen dazwischen hießen Zwischenwerte, im Bild die Anzeigen. Diese Rechenstufen sind die Blöcke, in Modellangaben meist Schichten genannt. Das frei verfügbare Qwen3-8B, ein größeres Modell derselben Familie wie Qwen3-0.6B-Base aus jenem Baustein, hat 36 davon, und der weitaus größte Teil seiner Parameter steckt darin.

Die Zwischenwerte eines einzelnen Tokens heißen in diesem Baustein sein **Zustand**. Am Eingang beginnt er mit dem Steckbrief, nach jedem Block gibt es eine neue Fassung. Messungen zeigen, dass sich die Zustände desselben Wortes in vielen Sätzen umso stärker unterscheiden, je weiter hinten der Block liegt. Bei GPT-2 (einem älteren, frei verfügbaren Modell) sind sie nach dem letzten Block fast vollständig vom Satz geprägt.

## Der Sitzplatz im Satz

Bevor die Blöcke Kontext einmischen, fehlt dem Steckbrief noch etwas Einfacheres: wo das Token steht. „Hund beißt Mann“ und „Mann beißt Hund“ bestehen aus denselben drei Wörtern. Das Modell holt in beiden Sätzen dieselben drei Steckbriefe. Nur die Reihenfolge ist anders, und sie entscheidet, wer gebissen wird. Fragst du einen Chatbot danach, muss er genau das auseinanderhalten.

Naheliegend wäre, dass das Modell die Reihenfolge ohnehin kennt, denn die Steckbriefe stehen der Reihe nach untereinander. Doch jeder Block rechnet mit jedem Zustand gleich, und wenn er die anderen Wörter einmischt, zählt er nur zusammen, wie viel von welchem kommt. Beim Zusammenzählen ist die Reihenfolge egal: 2 + 3 ergibt dasselbe wie 3 + 2. Innerhalb eines Blocks erfährt ein Token so, welche Wörter es sieht, aber nicht, in welcher Reihenfolge sie stehen und wie weit sie entfernt sind. Deshalb schrieben die Forschenden von 2017, man solle die Position eigens mitgeben.

GPT-2 löst das mit einer zweiten Tabelle. Sie hat eine Zeile für jede Position im [Kontextfenster](https://ki-einfach-verstehen.de/de/glossar/kontextfenster/) (die Höchstzahl an Tokens, die das Modell auf einmal verarbeitet), bei GPT-2 sind das 1.024. Jede Zeile ist ein Steckbrief für einen **Sitzplatz**: einer für Platz 1, einer für Platz 2 und so weiter. Auch diese Zahlen starten zufällig und werden im Training gelernt.

Weil beide Steckbriefe gleich lang sind, werden sie Zahl für Zahl addiert. Angenommen, im Steckbrief von „Hund“ steht an erster Stelle 0,2 und im Steckbrief von Platz 1 eine 0,1. In die Blöcke geht dann 0,3. Steht der Hund wie in „Mann beißt Hund“ auf Platz 3, dessen Steckbrief mit −0,1 beginnt, geht 0,1 hinein. **Derselbe Hund ergibt auf einem anderen Platz eine andere Summe.** Die Fachsprache nennt den Sitzplatz-Steckbrief **[Positions-Embedding](https://ki-einfach-verstehen.de/de/glossar/positions-embedding/)**.

![Drei Spalten für Hund, beißt und Mann: jeweils ein Token-Steckbrief mit vier ausgedachten Zahlen, darunter plus Sitzplatz 1, 2 oder 3, darunter gleich die Summe als Eingang](../../public/bausteine/embeddings/sitzplatz.svg)

*Token-Steckbrief plus Sitzplatz-Steckbrief ergibt, was in die Blöcke geht. Bei „Mann beißt Hund“ sitzt der Hund auf Platz 3, und seine Summe fällt anders aus.*

Geht dabei verloren, welches Token es war? Bei einer einzigen Zahl schon, denn 0,3 kann auch 0,3 plus 0 sein. Bei 768 Zahlen kaum: Für diesen Baustein wurde an GPT-2 nachgerechnet, welcher Token-Steckbrief einer solchen Summe am ähnlichsten ist, also am ehesten in dieselbe Richtung zeigt. In über 99 von 100 Fällen ist es der des richtigen Tokens.

Qwen3-8B hat keine solche Tabelle. Es verrechnet den Platz erst innerhalb der Blöcke, dort, wo Tokens miteinander verglichen werden. Bei GPT-2 ist die Summe der erste Zustand des Tokens: Er weiß jetzt, wo er steht, aber nicht, welche Bank gemeint ist. Wie kommt die Information der anderen Wörter hinein?

## Der Scheinwerfer: Kontext gewichtet einmischen

Für das Token, das gerade an der Reihe ist, gehen bildlich gesprochen mehrere Scheinwerfer an. Das Licht eines Scheinwerfers verteilt sich auf die Tokens davor und auf das Token selbst: Manche Stellen werden hell beleuchtet, andere nur schwach. **Was hell beleuchtet ist, fließt stark in den neuen Zustand ein**, was im Halbdunkel liegt, nur wenig. Das Modell rechnet alle Positionen gleichzeitig, hier wird eine herausgegriffen. Dieses Verfahren heißt **[Attention](https://ki-einfach-verstehen.de/de/glossar/attention/)**, englisch für Aufmerksamkeit. Niemand richtet den Scheinwerfer aus: Wie hell jede Stelle wird, rechnet das Modell aus.

![Eine Bühne mit sechs hellen Karten in einer Reihe; darüber hängt ein einziger Scheinwerfer, dessen breiter Lichtkegel sich ungleich verteilt: Die zweite Karte liegt in kräftigem Bernsteinlicht, die fünfte in schwächerem, drei Karten bekommen nur blasses Licht, die Karte ganz rechts bleibt im Schatten](../../public/bausteine/transformerbloecke-und-attention/scheinwerfer.webp)

*Das Licht fällt unterschiedlich hell auf die Tokens. Was hell beleuchtet ist, fließt stark ein.*

Angenommen, jeder Vektor hätte nur zwei Stellen, eine für „Sitzmöbel“ und eine für „Geld“ (ausgedachte Zahlen). Echte Vektoren haben Tausende Stellen ohne Namen. Der Zustand von „Bank“ ist zu Beginn (1 | 1), also unentschieden. In diesem Beispiel macht der Scheinwerfer Hinweise auf Sitzmöbel hell. Überleg kurz: Welches Wort in „Ich sitze auf der Bank im Park“ dürfte er am hellsten beleuchten?

Am hellsten ist „sitze“ mit 50 Prozent. „auf“ und „Bank“ selbst bekommen je 18 Prozent, „Ich“ und „der“ je 7. Zusammen sind es genau 100 Prozent. Die Regel kennst du aus dem Baustein über [Wahrscheinlichkeit und Softmax](./wahrscheinlichkeit-und-softmax.md): Dort machte [Softmax](https://ki-einfach-verstehen.de/de/glossar/softmax/) nach dem Modell aus Scores die Wahrscheinlichkeiten 72, 27 und 1 Prozent. Dieselbe Rechnung steckt auch mitten im Modell, in jedem Block. Die Prozente hier sind aber keine Wahrscheinlichkeiten für ein nächstes Token, sondern Anteile am Licht.

Jedes Wort gibt dazu zwei Zahlen mit, eine pro Stelle:

| Wort | Anteil | gibt mit: Sitzmöbel | gibt mit: Geld |
| :--- | ---: | ---: | ---: |
| Ich | 7 % | 0 | 0 |
| sitze | 50 % | 2 | 0 |
| auf | 18 % | 0 | 0 |
| der | 7 % | 0 | 0 |
| Bank | 18 % | 1 | 1 |

Jeder Beitrag wird mit seinem Anteil malgenommen, dann wird alles zusammengezählt. Für Sitzmöbel ergibt 0,5 · 2 + 0,18 · 1 rund 1,2, für Geld 0,18 · 1 nur rund 0,2. So eine Rechnung heißt **gewichtete Summe**, gewichtet wird hier mit den Anteilen. Die Mischung (1,2 | 0,2) wird zum alten Zustand addiert, statt ihn zu ersetzen. So bleibt erhalten, was „Bank“ war: (1 | 1) plus (1,2 | 0,2) ergibt (2,2 | 1,2). Der Zustand zeigt jetzt deutlich Richtung Sitzmöbel.

Im Geld-Satz läuft derselbe Scheinwerfer, findet aber keine Sitzmöbel-Hinweise. In beiden Sätzen läuft daneben ein zweiter für Geld-Hinweise. Im Geld-Satz gibt er „Geld“ 61 Prozent, und der Zustand landet bei (1,1 | 2,5), also Richtung Geldinstitut.

![Zwei Balkendiagramme. Oben der Satz Ich sitze auf der Bank im Park, der Scheinwerfer sucht Sitzmöbel-Hinweise: sitze bekommt mit 50 Prozent den größten Anteil, auf und Bank je 18, Ich und der je 7; im und Park kommen erst danach und bekommen 0. Unten der Satz Ich zahle Geld bei der Bank ein, der Scheinwerfer sucht Geld-Hinweise: Geld bekommt 61 Prozent, zahle 22, Bank 8, Ich, bei und der je 3; ein kommt erst danach](../../public/bausteine/transformerbloecke-und-attention/scheinwerfer-gewichte.svg)

*Dasselbe Wort, zwei Sätze, zwei Scheinwerfer (ausgedachte Zahlen). Wörter, die erst nach „Bank“ kommen, bekommen keinen Anteil.*

## Query, Key und Value: woher die Anteile kommen

Woher weiß der Scheinwerfer, dass „sitze“ besser passt als „der“? „Bank“ kommt wie bei einer Suche im Archiv mit einem Suchzettel: „Gibt es hier Hinweise auf Sitzmöbel?“ Jedes Wort davor ist ein Ordner mit einem Etikett auf dem Rücken und einem Inhalt darin. **Verglichen wird der Suchzettel mit den Etiketten, mitgenommen wird der Inhalt.** Hier endet das Bild: Im Archiv ziehst du einen Ordner heraus. Attention nimmt aus jedem Ordner etwas, je nachdem, wie gut er passt.

Im Modell heißen die drei Teile **Query** (Suchzettel), **Key** (Etikett) und **Value** (Inhalt). Alle drei sind Vektoren, berechnet aus dem Zustand eines Tokens: die Query für das Token, das an der Reihe ist, Key und Value für jedes sichtbare Token. Die Zahlen, die im Rechenbeispiel jedes Wort mitgab, waren seine Values.

Das Modell nimmt Query und Key Stelle für Stelle mal und addiert alles. Das ergibt einen [Score](https://ki-einfach-verstehen.de/de/glossar/score/), hier aber nicht für ein nächstes Token, sondern dafür, wie gut Query und Key passen. Die Query von „Bank“ sucht Sitzmöbel: (1 | 0). Mit dem Key von „sitze“, (2 | 0), ergibt das 1 · 2 + 0 · 0 = 2. Die Keys von „auf“, (1 | 0), und „Bank“, (1 | 1), ergeben je 1, die Keys (0 | 0) von „Ich“ und „der“ ergeben 0.

Aus den Scores macht Softmax die Anteile von eben. Erinnerst du dich an die Regel? Ein Score von 0 bekommt die Stärke 1, jeder Punkt mehr multipliziert sie mit etwa 2,7. „sitze“ kommt so auf 7,4, „auf“ und „Bank“ auf je 2,7, „Ich“ und „der“ auf je 1. Zusammen sind das rund 14,8, und 7,4 geteilt durch 14,8 ist die Hälfte: 50 Prozent. Key und Value haben verschiedene Aufgaben: Woran ein Wort gefunden wird, muss nicht das sein, was es mitbringt. Bei „auf“ passt der Key ein wenig, aber mit dem Value (0 | 0) bringt es nichts mit.

![Animation: Query von Bank wird mit den Keys verglichen, Softmax macht aus den Scores Anteile, die Values werden gemischt, und der alte Zustand plus die Mischung ergibt den neuen Zustand von Bank](../../public/bausteine/transformerbloecke-und-attention/query-key-value.static.svg)

[▶ Animation auf der Website ansehen](https://ki-einfach-verstehen.de/de/bausteine/transformerbloecke-und-attention/)

*Ein Durchgang für „Bank“: Query und Keys vergleichen, Softmax macht Anteile daraus, die Values werden gemischt und zum alten Zustand addiert (ausgedachte Zahlen).*

> **Interaktive Demo:** [auf der Website ausprobieren](https://ki-einfach-verstehen.de/de/bausteine/transformerbloecke-und-attention/)

Woher kommen Query, Key und Value? Wieder aus einer gewichteten Summe wie eben: Jede Zahl des Zustands wird mit einem Faktor malgenommen, dann wird addiert. Für die Sitzmöbel-Stelle der Query von „Bank“ sind die Faktoren 0,5 und 0,5, mit dem Zustand (1 | 1) also 0,5 · 1 + 0,5 · 1 = 1, für die Geld-Stelle beide 0.

Die Faktoren stehen in einer Tabelle, einer [Matrix](https://ki-einfach-verstehen.de/de/glossar/matrix/). Für Query, Key und Value gibt es jeweils eine. Anders als bei der Nachschlagetabelle des vorigen Bausteins wählt hier keine ID eine Zeile aus. Alle Zahlen der Matrix werden mit dem Zustand verrechnet. Im Mischpult-Bild sind sie Regler, also [Parameter](https://ki-einfach-verstehen.de/de/glossar/parameter/): vom Training eingestellt und für jede Chatnachricht dieselben. Query, Key und Value sind dagegen Anzeigen, die für jeden Text neu entstehen. Im Beispiel sind die Faktoren ausgedacht. Im echten Modell hat niemand vorgegeben, dass „sitze“ zu „Bank“ passt, und keine Stelle trägt einen Namen.

Und „Park“, der beste Hinweis auf eine Sitzbank, bekam gar keinen Anteil. Warum?

## Nicht nach vorne schauen: die Causal Mask

„Park“ steht nach „Bank“. Und Sprachmodelle, die wie Chatbots von links nach rechts schreiben, haben eine feste Regel: **Jede Position sieht nur sich selbst und die Positionen davor**, nie die danach. Für „Bank“ ist „Park“ unsichtbar, obwohl es dasteht.

![Durchgestrichenes Auge](../../public/bausteine/transformerbloecke-und-attention/nicht-nach-vorne.svg)

*Was nach dem aktuellen Token kommt, bleibt unsichtbar.*

Der Grund steckt im Training. Dort geht der ganze Satz auf einmal hinein, und an jeder Position soll das Modell das nächste Token vorhersagen: Die Position von „Bank“ soll „im“ vorhersagen. Könnte sie „im“ schon sehen, müsste sie nichts vorhersagen, sie könnte abschreiben.

Eine **[Causal Mask](https://ki-einfach-verstehen.de/de/glossar/causal-mask/)** setzt diese Regel um. Bevor Softmax rechnet, setzt sie den Score jeder späteren Position auf minus unendlich. Nach der Softmax-Regel wird für jeden Punkt weniger durch etwa 2,7 geteilt. Bei unendlich vielen Punkten weniger bleibt nichts übrig: Gewöhnliche Scores behalten immer einen Rest, hier ist der Anteil *genau* 0. Für einen ganzen Satz ergibt das ein Dreieck: Das erste Wort sieht nur sich, das zweite zwei Wörter, und so weiter bis zum letzten, das alle sieht.

![Raster aus sieben mal sieben Feldern mit den Wörtern Ich, sitze, auf, der, Bank, im, Park als Zeilen und Spalten. Auf und unter der Diagonale steht ja, darüber minus unendlich. In der hervorgehobenen Zeile Bank sind Ich, sitze, auf, der und Bank erlaubt, im und Park gesperrt](../../public/bausteine/transformerbloecke-und-attention/causal-mask.svg)

*Die Causal Mask für „Ich sitze auf der Bank im Park“: Jede Zeile zeigt, worauf eine Position schauen darf. Hervorgehoben ist die Zeile von „Bank“.*

„Park“ dagegen darf auf alles schauen, auch zurück auf „Bank“. Für die Übersetzung reicht das trotzdem: Das Modell sagt das nächste Wort aus dem Zustand der letzten Position voraus, und diese Position sieht den ganzen Satz samt „Park“ und „Bank“. Steht „Park“ vorn, wie in „Im Park sitze ich auf der Bank“, sieht sogar „Bank“ den „Park“.

## Viele Scheinwerfer, viele Blöcke

Im Rechenbeispiel gab es schon zwei Scheinwerfer, einen für Sitzmöbel-Hinweise und einen für Geld-Hinweise. Warum nicht einer für beides? Sein Licht ergibt immer 100 Prozent. Soll er beide Sorten Hinweise zugleich hell beleuchten, muss er das Licht teilen, und jeder Hinweis kommt nur halb so deutlich an. Ein Block hat deshalb mehrere Scheinwerfer, **Heads** genannt, jeder mit eigener Query-Matrix und damit eigener Query. Die Heads eines Blocks rechnen gleichzeitig, in jedem Satz. Ihre Mischungen werden aneinandergehängt, mit einer weiteren gelernten Matrix verrechnet und dann addiert. Bei Qwen3-8B sind es 32 Heads pro Block.

Manche Heads lassen sich deuten. Ein **Induction Head** sucht, was beim letzten Auftreten des aktuellen Tokens folgte: Stand früher im Chat „Frau Kowalczyk“ und folgt jetzt wieder „Frau“, hebt er „Kowalczyk“ hervor. Für große Modelle gibt es dafür nur Indizien, viele Heads zeigen kein benennbares Muster.

> **Interaktive Demo:** [auf der Website ausprobieren](https://ki-einfach-verstehen.de/de/bausteine/transformerbloecke-und-attention/)

Attention ist nur der erste Teil eines Blocks. Danach kommt eine **Weiterverarbeitung** (Feed-Forward-Netz), gebaut aus Schichten mit Untergrenze wie im Baustein über [neuronale Netze](./neuronale-netze.md). Dort bekommt jedes Token einzeln eine große Rechnung, ohne auf die anderen zu schauen. Auch ihr Ergebnis wird zum Zustand addiert. Attention plus Weiterverarbeitung bilden zusammen einen **[Transformerblock](https://ki-einfach-verstehen.de/de/glossar/transformerblock/)**.

![Von oben nach unten: Steckbriefe aller Tokens, dann Block 1 mit den Teilen Attention, mischt zwischen Positionen, und Weiterverarbeitung, jede Position für sich; darunter Block 2, gleich gebaut mit eigenen Zahlen, Auslassungspunkte, Block 36 bei Qwen3-8B und unten Zustände mit eingemischtem Kontext](../../public/bausteine/transformerbloecke-und-attention/blockstapel.svg)

*Jeder Block mischt erst zwischen den Positionen und verarbeitet dann jede Position für sich. Qwen3-8B hat 36 solcher Blöcke hintereinander.*

**Kontext kommt nur über die Attention herein.** In großen Modellen stecken trotzdem die meisten Parameter in der Weiterverarbeitung, bei Qwen3-8B rund zwei Drittel, nachgerechnet aus den veröffentlichten Werten. Dort scheint auch viel Wissen zu sitzen, etwa dass Paris die Hauptstadt von Frankreich ist. Ein Transformer stapelt viele solcher Blöcke, je nach Modell ein bis mehrere Dutzend.

Nach dem letzten Block steckt in jedem Zustand viel Kontext. Kann man an den Scheinwerfern ablesen, warum der Chatbot so antwortet?

## Was der Scheinwerfer nicht verrät

Manche Programme zeigen das Licht eines Heads als farbige Tabelle: Hier hat das Modell „hingeschaut“. Das wirkt wie ein Blick in seine Überlegungen. Die Forschung ist vorsichtiger.

Wie wichtig ein Wort ist, lässt sich prüfen, indem man es weglässt. Eine viel zitierte Studie von 2019 tat das: Wie stark sich die Vorhersage änderte, hing oft kaum mit den Anteilen zusammen. Untersucht wurden aber Modelle einer älteren Bauart ohne Transformerblöcke, und andere hielten dagegen: Es komme darauf an, was man unter einer Erklärung versteht.

Bei Transformern vermischt sich die Information über die Blöcke immer stärker. Schon nach wenigen Blöcken ist der Zustand von „sitze“ nicht mehr nur „sitze“. Licht auf „sitze“ in Block 20 beleuchtet also eine Mischung aus vielen Wörtern. Neben dem Anteil zählt auch der Value: Ein beleuchtetes Token mit winzigem Value bringt wenig, wie „auf“ im Rechenbeispiel.

Außerdem landet auffällig viel Licht auf den allerersten Tokens eines Textes, etwa auf einem Spezial-Token für den Textanfang wie `<|begin_of_text|>`, auch wenn sie nichts bedeuten. Forschende nennen sie **Attention Sinks**. Ihre Erklärung: Die Anteile müssen immer zusammen 100 Prozent ergeben. Findet ein Head nichts Passendes, muss das Licht trotzdem irgendwohin, und das erste Token ist wegen der Causal Mask für jede Position sichtbar.

Hier endet das Bild vom Scheinwerfer: Es zeigt gut, wie Information gemischt wird, **erklärt aber nicht zuverlässig, warum eine Antwort entsteht**.

„Bank“ startet mit demselben Steckbrief. In jedem Block mischt die Attention die Values früherer Tokens mit berechneten Anteilen hinein, nie die der späteren. Im Park-Satz zieht „sitze“ den Zustand Richtung Sitzmöbel, im Geld-Satz zieht „Geld“ ihn Richtung Geldinstitut. Wie aus dem Zustand der letzten Position eine Score-Liste über das ganze Vokabular wird, zeigt der nächste Baustein.

---

Quelle: https://ki-einfach-verstehen.de/de/bausteine/transformerbloecke-und-attention/

← Zurück: [Embeddings: wie aus einer Nummer ein gelernter Vektor wird](./embeddings.md) · [Alle Bausteine](../../README.de.md#inhalt) · Weiter: [Output Head: Vom letzten Zustand zur Vorhersage](./output-head.md) →
