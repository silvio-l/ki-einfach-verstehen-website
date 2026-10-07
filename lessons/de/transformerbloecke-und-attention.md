<!-- Generated from src/content/bausteine/de/transformerbloecke-und-attention.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Transformerblöcke und Attention: Wie Kontext eingemischt wird

> Lesefassung für GitHub. Die vollständige Fassung mit interaktiven Demos, Animationen und Abrufmoment findest du auf der Website: **[Transformerblöcke und Attention: Wie Kontext eingemischt wird](https://ki-einfach-verstehen.de/de/bausteine/transformerbloecke-und-attention/)**
>
> Lizenz: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.de) · Nenne die Quelle so: KI einfach verstehen, „Transformerblöcke und Attention: Wie Kontext eingemischt wird“, CC BY 4.0, https://ki-einfach-verstehen.de/de/bausteine/transformerbloecke-und-attention/

Wie ein Sprachmodell die Information früherer Wörter in jedes Token einmischt, warum es nicht nach vorne schauen darf und wie viele Blöcke dabei arbeiten.

Zwei Sätze: „Ich zahle Geld bei der Bank ein“ und „Ich sitze auf der Bank im Park“. Im vorigen Baustein hat jedes Token seinen Steckbrief bekommen, eine lange Zahlenliste aus der Nachschlagetabelle des Modells. Für „Bank“ ist es in beiden Sätzen dieselbe Liste. Ein Chatbot, der beide Sätze ins Englische übersetzt, muss aber einmal „bank“ und einmal „bench“ schreiben. Woher soll er das wissen, wenn „Bank“ in beiden Fällen gleich aussieht?

![Gebäude mit Säulen und Giebel](../../public/bausteine/transformerbloecke-und-attention/bank.svg)

*Geldinstitut oder Sitzbank: Das Wort allein entscheidet es nicht.*

Die Antwort steckt im größten Teil eines Sprachmodells, in vielen gleich gebauten Blöcken, jeder mit eigenen Zahlen. Diese Architektur heißt **[Transformer](https://ki-einfach-verstehen.de/de/glossar/transformer/)**, vorgestellt 2017. Wie sie jedem Token Information von den anderen bringen, zeigt dieser Baustein. Zur Vereinfachung ist hier jedes Wort ein Token.

## Ein Steckbrief, zwei Bedeutungen

Wenn du „Ich sitze auf der Bank“ liest, denkst du nicht an Geld, denn du liest den Satz drumherum mit. Ein Steckbrief kann das nicht: Für jedes „Bank“ wird derselbe nachgeschlagen, egal was davor oder danach steht. Das Sitzplatz-Signal aus dem vorigen Baustein verrät nur, wo das Wort steht, nicht welche Bank gemeint ist.

Ein Sprachmodell löst das, indem es jeden Steckbrief nach und nach umformt. Erinnerst du dich an das Mischpult aus dem ersten Baustein dieses Themenbereichs? Dein Text lief als Signal durch viele Rechenstufen, und die Zahlen, die von Stufe zu Stufe weiterwanderten, hießen Zwischenwerte, im Bild die Anzeigen. Diese Rechenstufen sind die Blöcke, in Modellangaben heißen sie meist Schichten. Das frei verfügbare Modell Qwen3-8B aus jenem Baustein hat 36 davon, und der weitaus größte Teil seiner Parameter steckt darin. In jedem Block wird in den Vektor eines Tokens etwas von den anderen Tokens eingemischt.

Die Zwischenwerte eines einzelnen Tokens heißen in diesem Baustein sein **Zustand**. Am Eingang ist der Zustand der Steckbrief, nach jedem Block eine neue Fassung davon. Messungen zeigen die Änderung: Die Zustände desselben Wortes in vielen Sätzen unterscheiden sich umso stärker, je später der Block. Bei GPT-2 sind sie nach dem letzten Block fast vollständig vom Satz geprägt. Wie aber kommt die Information der anderen Wörter hinein?

## Der Scheinwerfer: Kontext gewichtet einmischen

Für das Token, das gerade an der Reihe ist, geht ein Scheinwerfer an. Sein Licht verteilt sich auf die Tokens davor und auf das Token selbst: Manche Stellen werden hell beleuchtet, andere nur schwach. **Was hell beleuchtet ist, fließt stark in den neuen Zustand ein**, was im Halbdunkel liegt, nur wenig. In Wirklichkeit rechnet das Modell alle Positionen gleichzeitig, hier wird nur eine herausgegriffen. Dieses Verfahren heißt **[Attention](https://ki-einfach-verstehen.de/de/glossar/attention/)**, englisch für Aufmerksamkeit.

![Eine Bühne mit sechs hellen Karten in einer Reihe; darüber hängt ein einziger Scheinwerfer, dessen breiter Lichtkegel sich ungleich verteilt: Die zweite Karte liegt in kräftigem Bernsteinlicht, die fünfte in schwächerem, drei Karten bekommen nur blasses Licht, die Karte ganz rechts bleibt im Schatten](../../public/bausteine/transformerbloecke-und-attention/scheinwerfer.webp)

*Das Licht fällt unterschiedlich hell auf die Karten. Was hell beleuchtet ist, fließt stark ein.*

Ein Rechenbeispiel mit ausgedachten Zahlen zeigt, wie das geht; rechne ruhig im Kopf mit. Angenommen, jeder Vektor hätte nur zwei Stellen, eine für „Sitzmöbel“ und eine für „Geld“. Echte Vektoren haben Tausende Stellen ohne Namen. Der Zustand von „Bank“ ist zu Beginn (1 | 1), also unentschieden. Der Scheinwerfer sucht nach Hinweisen auf Sitzmöbel; woher er das „weiß“, zeigt der nächste Abschnitt. Überleg kurz: Welches Wort in „Ich sitze auf der Bank im Park“ dürfte er am hellsten beleuchten?

Am hellsten ist „sitze“ mit 50 Prozent. „auf“ und „Bank“ selbst bekommen je 18 Prozent, „Ich“ und „der“ je 7. Zusammen sind es genau 100 Prozent. Die Regel kennst du aus dem Baustein über [Wahrscheinlichkeit und Softmax](./wahrscheinlichkeit-und-softmax.md), wo aus Scores die Anteile 72, 27 und 1 Prozent wurden. Tatsächlich rechnet das Modell auch hier mit [Softmax](https://ki-einfach-verstehen.de/de/glossar/softmax/). Mit „Anteil“ ist in diesem Baustein immer so ein Prozentwert gemeint, nicht die Parameter, die in den Grundlagen auch Gewichte hießen.

Was heißt nun „stark einfließen“? Jedes Wort gibt zwei Zahlen mit, eine pro Stelle. Das ist nicht einfach sein Zustand; was es ist, zeigt der nächste Abschnitt.

| Wort | Anteil | gibt mit: Sitzmöbel | gibt mit: Geld |
| :--- | ---: | ---: | ---: |
| Ich | 7 % | 0 | 0 |
| sitze | 50 % | 2 | 0 |
| auf | 18 % | 0 | 0 |
| der | 7 % | 0 | 0 |
| Bank | 18 % | 1 | 1 |

Jeder Beitrag wird mit seinem Anteil malgenommen, dann wird alles zusammengezählt. Für Sitzmöbel ergibt 0,5 · 2 + 0,18 · 1 rund 1,2, für Geld 0,18 · 1 nur rund 0,2. So eine Rechnung heißt **gewichtete Summe**, gewichtet wird hier mit den Anteilen. Die Mischung (1,2 | 0,2) wird zum alten Zustand addiert statt ihn zu ersetzen, so bleibt erhalten, was „Bank“ war: (1 | 1) plus (1,2 | 0,2) ergibt (2,2 | 1,2). Der Zustand zeigt jetzt deutlich Richtung Sitzmöbel.

Im Geld-Satz „Ich zahle Geld bei der Bank ein“ findet dieser Scheinwerfer keine Sitzmöbel-Hinweise, sein meistes Licht fällt auf „Bank“ selbst. Ein zweiter Scheinwerfer, der nach Geld-Hinweisen sucht, beleuchtet dort „Geld“ mit 61, „zahle“ mit 22 und „Bank“ mit 8 Prozent. „Geld“ gibt (0 | 2) mit, „zahle“ (0 | 1), „Bank“ wie zuvor (1 | 1). Für Geld ergibt das 0,61 · 2 + 0,22 · 1 + 0,08 · 1, rund 1,5, für Sitzmöbel nur rund 0,1. Zum alten Zustand addiert: (1,1 | 2,5), also Richtung Geldinstitut.

![Zwei Balkendiagramme. Oben der Satz Ich sitze auf der Bank im Park, der Scheinwerfer sucht Sitzmöbel-Hinweise: sitze bekommt mit 50 Prozent den größten Anteil, auf und Bank je 18, Ich und der je 7; im und Park kommen erst danach und bekommen 0. Unten der Satz Ich zahle Geld bei der Bank ein, der Scheinwerfer sucht Geld-Hinweise: Geld bekommt 61 Prozent, zahle 22, Bank 8, Ich, bei und der je 3; ein kommt erst danach](../../public/bausteine/transformerbloecke-und-attention/scheinwerfer-gewichte.svg)

*Dasselbe Wort, zwei Sätze, zwei Scheinwerfer (ausgedachte Zahlen). Wörter, die erst nach „Bank“ kommen, bekommen keinen Anteil.*

Das Bild hat eine Grenze: Niemand richtet die Scheinwerfer aus, das Modell „achtet“ nicht im menschlichen Sinn. Die Anteile werden berechnet.

## Query, Key und Value: woher die Anteile kommen

Woher weiß der Scheinwerfer, dass „sitze“ besser passt als „der“? Stell dir ein Archiv vor. „Bank“ kommt mit einem Suchzettel: „Gibt es hier Hinweise auf Sitzmöbel?“ Jedes Wort davor ist ein Ordner mit einem Etikett auf dem Rücken und einem Inhalt darin. **Verglichen wird der Suchzettel mit den Etiketten, mitgenommen wird der Inhalt.** Weil Etikett und Inhalt getrennt sind, kann ein Ordner gut passen und trotzdem wenig enthalten. Hier endet das Bild: Im Archiv ziehst du einen Ordner heraus. Attention nimmt aus jedem Ordner etwas, je nach Passung.

Im Modell heißen die drei Teile **Query** (Suchzettel), **Key** (Etikett) und **Value** (Inhalt). Alle drei sind Vektoren, berechnet aus dem Zustand eines Tokens: die Query für das Token, das an der Reihe ist, Key und Value für jedes sichtbare Token. Die Zahlen, die im Rechenbeispiel jedes Wort mitgab, waren seine Values.

Verglichen wird so: Query und Key Stelle für Stelle malnehmen und addieren. Das ergibt einen [Score](https://ki-einfach-verstehen.de/de/glossar/score/), eine Zahl dafür, wie gut beide passen. Die Query von „Bank“ sucht Sitzmöbel: (1 | 0). Mit dem Key von „sitze“, (2 | 0), ergibt das 1 · 2 + 0 · 0 = 2. Die Keys von „auf“, (1 | 0), und „Bank“, (1 | 1), ergeben je 1, die Keys (0 | 0) von „Ich“ und „der“ ergeben 0.

Aus den Scores macht Softmax die Anteile von eben. Erinnerst du dich an die Regel? Ein Score von 0 wird zu 1, jeder Punkt mehr multipliziert mit etwa 2,72. „sitze“ kommt so auf 7,4, „auf“ und „Bank“ auf je 2,72, „Ich“ und „der“ auf je 1. Zusammen sind das rund 14,8, und 7,4 davon ist die Hälfte: 50 Prozent. „auf“ zeigt, warum Key und Value getrennt sind. Sein Key passt ein wenig, sein Value ist aber (0 | 0), es bringt nichts mit.

![Animation: Query von Bank wird mit den Keys verglichen, Softmax macht aus den Scores Anteile, die Values werden gemischt, und der alte Zustand plus die Mischung ergibt den neuen Zustand von Bank](../../public/bausteine/transformerbloecke-und-attention/query-key-value.static.svg)

[▶ Animation auf der Website ansehen](https://ki-einfach-verstehen.de/de/bausteine/transformerbloecke-und-attention/)

*Ein Durchgang für „Bank“: Query und Keys vergleichen, Softmax macht Anteile daraus, die Values werden gemischt und zum alten Zustand addiert (ausgedachte Zahlen).*

Das sind vier Schritte: Query mit allen sichtbaren Keys vergleichen, mit Softmax Anteile bilden, Values nach Anteil mischen, Mischung zum Zustand addieren.

> **Interaktive Demo:** [auf der Website ausprobieren](https://ki-einfach-verstehen.de/de/bausteine/transformerbloecke-und-attention/)

Woher kommen Query, Key und Value? Erinnerst du dich an den Spamfilter aus den Grundlagen? Er zählte die Gewichte der Wörter zusammen, die in einer Mail vorkamen. Bei der Query ist es ähnlich, nur wird jede Zahl des Zustands erst mit ihrem Gewicht malgenommen, hier Faktor genannt, dann wird addiert. Für die Sitzmöbel-Stelle sind die Faktoren 0,5 und 0,5, also 0,5 · 1 + 0,5 · 1 = 1, für die Geld-Stelle beide 0. So entsteht aus (1 | 1) die Query (1 | 0).

Die Faktoren stehen in einer Tabelle, einer [Matrix](https://ki-einfach-verstehen.de/de/glossar/matrix/), je eine für Query, Key und Value. Anders als bei der Nachschlagetabelle aus dem vorigen Baustein wählt hier keine ID eine Zeile aus, alle Zahlen der Matrix werden mit dem Zustand verrechnet. Im Mischpult-Bild sind sie Regler, also [Parameter](https://ki-einfach-verstehen.de/de/glossar/parameter/): vom Training eingestellt und für jede Chatnachricht dieselben. Query, Key und Value sind dagegen Anzeigen, die für jeden Text neu entstehen. Dass „sitze“ zu „Bank“ passt, hat niemand vorgegeben. Solche Passungen entstehen, weil sie beim Vorhersagen des nächsten Tokens geholfen haben.

Hier kommt bei Modellen wie Qwen3-8B auch der Sitzplatz ins Spiel, wie im vorigen Baustein angekündigt: Vor dem Vergleich werden Query und Key je nach Position gedreht, wie ein Uhrzeiger: je weiter hinten, desto weiter. Beim Vergleich zählt dann nicht die Position selbst, sondern der Unterschied der Drehungen, also der Abstand (Fachwort RoPE).

Noch etwas fällt auf: „Park“, der beste Hinweis auf eine Sitzbank, bekam keinen Anteil. Warum?

## Nicht nach vorne schauen: die Causal Mask

„Park“ steht nach „Bank“. Und Sprachmodelle, die wie Chatbots von links nach rechts schreiben, haben eine feste Regel: **Jede Position sieht nur sich selbst und die Positionen davor**, nie die danach. Für „Bank“ ist „Park“ unsichtbar, obwohl es dasteht.

![Durchgestrichenes Auge](../../public/bausteine/transformerbloecke-und-attention/nicht-nach-vorne.svg)

*Was nach dem aktuellen Token kommt, bleibt unsichtbar.*

Der Grund steckt im Training. Ein Sprachmodell lernt, an jeder Stelle das nächste Token vorherzusagen: Die Position von „Bank“ soll im Training „im“ vorhersagen. Könnte sie „im“ schon sehen, müsste sie nichts vorhersagen, sie könnte abschreiben. Beim Antworten gibt es die späteren Tokens ohnehin noch nicht, der Chatbot schreibt Stück für Stück.

Umgesetzt wird die Regel mit einer **[Causal Mask](https://ki-einfach-verstehen.de/de/glossar/causal-mask/)**. Bevor Softmax rechnet, setzt sie den Score jeder späteren Position auf minus unendlich. Nach der Softmax-Regel teilt jeder Punkt weniger durch 2,72, und unendlich viele Punkte weniger lassen nichts übrig. Bei gewöhnlichen Scores bleibt immer ein Rest, wie im Baustein über Softmax. Hier ist der Anteil *genau* 0, nicht bloß fast 0. Für einen ganzen Satz ergibt das ein Dreieck: Das erste Wort sieht nur sich, das zweite zwei Wörter, und so weiter bis zum letzten, das alle sieht.

![Raster aus sieben mal sieben Feldern mit den Wörtern Ich, sitze, auf, der, Bank, im, Park als Zeilen und Spalten. Auf und unter der Diagonale steht ja, darüber minus unendlich. In der hervorgehobenen Zeile Bank sind Ich, sitze, auf, der und Bank erlaubt, im und Park gesperrt](../../public/bausteine/transformerbloecke-und-attention/causal-mask.svg)

*Die Causal Mask für „Ich sitze auf der Bank im Park“: Jede Zeile zeigt, worauf eine Position schauen darf. Hervorgehoben ist die Zeile von „Bank“.*

„Park“ dagegen darf auf alles schauen, auch zurück auf „Bank“. Bleibt die Übersetzung damit ungelöst? Nein. Das nächste Wort sagt das Modell aus dem Zustand der letzten Position voraus, wie, zeigt der nächste Baustein. Und diese Position sieht den ganzen Satz samt „Park“ und „Bank“. Stellst du den Satz um, etwa zu „Im Park sitze ich auf der Bank“, sieht sogar „Bank“ selbst den „Park“.

<details>
<summary>Eine Ebene tiefer: Die Attention-Formel</summary>

Im Paper von 2017, das den Transformer vorstellte, steht die Rechnung in einer Zeile. Mit der Maske lautet sie:

`Attention(Q, K, V) = softmax(Q·Kᵀ / √d_k + M) · V`

Q, K und V sind Matrizen mit einer Zeile pro Token. Das hochgestellte T kippt die Key-Tabelle, aus Zeilen werden Spalten. So trifft beim Malnehmen jede Query auf jeden Key, und Q·Kᵀ liefert alle Scores auf einmal. M enthält 0 für erlaubte und −∞ für gesperrte Paare. d_k ist die Zahl der Stellen eines Keys, im Rechenbeispiel 2, bei Qwen3-8B 128.

Neu gegenüber dem Rechenbeispiel ist das Teilen durch √d_k: Der Score von „sitze“ wäre 2 / √2, rund 1,41. Die Autoren vermuten, dass Scores mit vielen Stellen sehr groß werden. Mit Zufallszahlen schwanken sie bei 128 Stellen typischerweise um ±11, geteilt durch √128 nur noch um ±1. Große Abstände lassen Softmax fast alles einem Kandidaten geben, aus 8, 16 und 24 werden fast 100 Prozent für den Größten. Dann ändert ein kleines Nachstellen der Regler am Ergebnis kaum etwas, und das Training bekommt kaum ein Signal, wohin es nachstellen soll.

</details>

## Viele Scheinwerfer, viele Blöcke

Im Rechenbeispiel gab es schon zwei Scheinwerfer, einen für Sitzmöbel-Hinweise und einen für Geld-Hinweise. Warum nicht einer für beides? Sein Licht ergibt immer 100 Prozent. Soll er beide Sorten Hinweise zugleich hell beleuchten, muss er das Licht teilen, und jeder Hinweis kommt nur halb so deutlich an. Ein Block hat deshalb mehrere Scheinwerfer, **Heads** genannt, jeder mit eigenen Matrizen und damit eigener Query. Alle Heads eines Blocks rechnen gleichzeitig. Ihre Mischungen werden aneinandergehängt, mit einer weiteren gelernten Matrix auf die Länge des Zustands gebracht und erst dann addiert. Das (2,2 | 1,2) oben zeigte also nur den Beitrag eines Heads. Bei Qwen3-8B sind es 32 Heads pro Block. Anders als im Beispiel legt aber niemand fest, wonach ein Head sucht, und keiner trägt einen Namen wie „Sitzmöbel“.

Manche Heads lassen sich deuten. Ein **Induction Head** sucht, was beim letzten Auftreten des aktuellen Tokens folgte: Stand früher im Chat „Frau Kowalczyk“ und folgt jetzt wieder „Frau“, hebt er „Kowalczyk“ hervor. Für große Modelle gibt es dafür nur Indizien, viele Heads zeigen kein benennbares Muster.

> **Interaktive Demo:** [auf der Website ausprobieren](https://ki-einfach-verstehen.de/de/bausteine/transformerbloecke-und-attention/)

Attention ist nur der erste Teil eines Blocks. Danach kommt eine **Weiterverarbeitung** (Fachwort: Feed-Forward-Netz). Dort bekommt jedes Token einzeln eine große Rechnung mit vielen Reglern, ohne auf die anderen zu schauen. Auch ihr Ergebnis wird zum Zustand addiert. Attention plus Weiterverarbeitung bilden zusammen einen **[Transformerblock](https://ki-einfach-verstehen.de/de/glossar/transformerblock/)**.

![Von oben nach unten: Steckbriefe aller Tokens, dann Block 1 mit den Teilen Attention, mischt zwischen Positionen, und Weiterverarbeitung, jede Position für sich; darunter Block 2, gleich gebaut mit eigenen Zahlen, Auslassungspunkte, Block 36 bei Qwen3-8B und unten Zustände mit eingemischtem Kontext](../../public/bausteine/transformerbloecke-und-attention/blockstapel.svg)

*Jeder Block mischt erst zwischen den Positionen und verarbeitet dann jede Position für sich. Qwen3-8B hat 36 solcher Blöcke hintereinander.*

**Kontext kommt nur über die Attention herein.** Die meisten Parameter stecken trotzdem in der Weiterverarbeitung, bei Qwen3-8B rund zwei Drittel, nachgerechnet aus den veröffentlichten Werten. Dort scheint auch viel Wissen aus dem ersten Baustein dieses Themenbereichs zu sitzen, etwa dass Paris die Hauptstadt von Frankreich ist. Ein Transformer stapelt viele solcher Blöcke, je nach Modell ein bis mehrere Dutzend.

Nach dem letzten Block steckt in jedem Zustand viel Kontext. Kann man an den Scheinwerfern ablesen, warum der Chatbot so antwortet?

## Was der Scheinwerfer nicht verrät

Manche Programme zeigen das Licht eines Heads als farbige Tabelle: Hier hat das Modell „hingeschaut“. Das wirkt wie ein Blick in seine Überlegungen, die Forschung ist vorsichtiger.

Eine viel zitierte Studie von 2019 maß die Wichtigkeit eines Wortes auch anders: das Wort weglassen und schauen, wie stark sich die Vorhersage ändert. Mit den Anteilen hing das oft kaum zusammen. Zudem führten ganz andere Verteilungen des Lichts zur gleichen Vorhersage. Untersucht wurden aber ältere Modelle, keine Transformer, und andere hielten dagegen: Es komme darauf an, was man unter einer Erklärung versteht.

Bei Transformern kommt mehr hinzu. Erstens vermischt sich die Information über die Blöcke immer stärker. Schon nach wenigen Blöcken ist der Zustand von „sitze“ nicht mehr nur „sitze“, und ein Anteil im zehnten Block zeigt auf eine Mischung. Zweitens zählt neben dem Anteil auch der Value: Ein beleuchtetes Token mit winzigem Value bringt wenig, wie „auf“ im Rechenbeispiel: 18 Prozent Licht, aber Value (0 | 0).

Drittens landet auffällig viel Licht auf den allerersten Tokens eines Textes, etwa dem Spezial-Token für den Textanfang wie `<|begin_of_text|>`, auch wenn sie nichts bedeuten. Forschende nennen sie **Attention Sinks**. Ihre Erklärung: Die Anteile müssen immer zusammen 100 Prozent ergeben. Findet ein Head nichts Passendes, muss das Licht trotzdem irgendwohin, und das erste Token ist wegen der Causal Mask für jede Position sichtbar.

Hier endet das Bild vom Scheinwerfer: Es zeigt gut, wie Information gemischt wird, **erklärt aber nicht zuverlässig, warum eine Antwort entsteht**.

Damit ist die Frage vom Anfang beantwortet. „Bank“ startet mit demselben Steckbrief. In jedem Block mischt die Attention die Values früherer Tokens mit berechneten Anteilen hinein, nie die der späteren. Im Park-Satz zieht „sitze“ den Zustand Richtung Sitzmöbel, im Geld-Satz zieht „Geld“ ihn Richtung Geldinstitut. Wie aus dem Zustand der letzten Position eine Score-Liste über das ganze Vokabular wird, zeigt der nächste Baustein.

---

Quelle: https://ki-einfach-verstehen.de/de/bausteine/transformerbloecke-und-attention/

← Zurück: [Embeddings: wie aus einer Nummer ein bedeutungsvoller Vektor wird](./embeddings.md) · [Alle Bausteine](../../README.de.md#inhalt) · Weiter: [Output Head: Vom letzten Zustand zur Vorhersage](./output-head.md) →
