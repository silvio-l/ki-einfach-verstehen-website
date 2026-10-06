<!-- Generated from src/content/bausteine/de/was-ein-ki-modell-eigentlich-ist.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Was ein KI-Modell eigentlich ist

> Lesefassung für GitHub. Die vollständige Fassung mit interaktiven Demos, Animationen und Abrufmoment findest du auf der Website: **[Was ein KI-Modell eigentlich ist](https://ki-einfach-verstehen.de/de/bausteine/was-ein-ki-modell-eigentlich-ist/)**
>
> Lizenz: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.de) · Nenne die Quelle so: KI einfach verstehen, „Was ein KI-Modell eigentlich ist“, CC BY 4.0, https://ki-einfach-verstehen.de/de/bausteine/was-ein-ki-modell-eigentlich-ist/

Warum ein KI-Modell keine Datenbank voller Fakten ist, wie Wissen in seinen Zahlen verteilt steckt und warum daraus kluge Antworten und erfundene Fakten entstehen.

Am Ende der Grundlagen blieb eine Frage offen: In den Milliarden Zahlen eines Modells steht kein ausgeschriebener Fakt. Woher weiß ein Chatbot dann, dass Paris die Hauptstadt von Frankreich ist?

Für diesen Baustein bekam ein kleines, frei verfügbares **[Sprachmodell](https://ki-einfach-verstehen.de/de/glossar/sprachmodell/)** den Satzanfang „Die Hauptstadt von Frankreich ist“. Es heißt Qwen3-0.6B-Base: „0.6B“ für 0,6 Milliarden Parameter, wie das „8B“ bei Llama aus den Grundlagen, und „Base“ für die Grundfassung ohne Nachtraining zum Chatbot. Als nächstes **[Token](https://ki-einfach-verstehen.de/de/glossar/token/)** lag „Paris“ vorn, mit knapp der Hälfte. Andersherum, nach „Paris ist die Hauptstadt von“, lag „Deutschland“ vorn, mit knapp 30 Prozent. Die Prozente sagen, welches Textstück als Nächstes passt, nicht, ob eine Aussage wahr ist.

In einer Tabelle steht „Frankreich | Paris“ in einer Zeile, lesbar von links wie von rechts. Das kleine Modell kam hier nur in einer Richtung auf den Fakt. Warum, klärt der erste von drei Fällen unten. Zuerst: Was geschieht im Modell, wenn es antwortet?

## Wo steht, dass Paris die Hauptstadt ist?

Eine richtige Antwort wirkt wie Nachschlagen: Irgendwo im Modell gäbe es eine Zeile mit diesem Fakt, und das Modell fände sie. So arbeitet eine Datenbank.

Ein Blick in eine echte **[Modelldatei](./parameter-training-inferenz-hardware.md)** spricht dagegen. Du kennst sie aus den Grundlagen: ein kleiner Bauplan, die **[Architektur](https://ki-einfach-verstehen.de/de/glossar/architektur/)**, und sehr viele Zahlen, die **[Parameter](https://ki-einfach-verstehen.de/de/glossar/parameter/)**. Bei Qwen3-8B, einem größeren Modell derselben Familie, liegen sie in einigen Hundert Zahlenblöcken, also Tabellen aus Zahlen wie im Baustein über Vektor und Matrix. Ihre Namen bezeichnen Rechenschritte, die spätere Bausteine erklären. Keiner heißt „Länder“ oder „Hauptstädte“.

Aus den Grundlagen kennst du das Mischpult: Jeder Regler steht für einen Parameter, seine Stellung für dessen Zahlenwert. Das Training hat die Regler eingestellt, beim Antworten bleiben sie fest. Gespeichert sind also Einstellungen, keine Sätze. Neu ist hier der Weg durchs Pult: Links kommt ein Signal herein, rechts geht es hinaus, und die Anzeigen zeigen, was gerade hindurchläuft.

![Ein breites Mischpult ohne Beschriftung. Links führt ein Kabel hinein, rechts ein Kabel hinaus zu einem Lautsprecher. Die Schieberegler stehen fest auf unterschiedlichen Höhen, darüber zieht sich eine Leiste mit Pegelanzeigen, deren Balken unterschiedlich hoch leuchten](../../public/bausteine/was-ein-ki-modell-eigentlich-ist/pult-signalweg.webp)

*Die Regler bleiben stehen. Die Anzeigen wechseln mit dem Signal, das gerade hindurchläuft.*

Im Modell ist dieses Signal dein Text, in Zahlen übersetzt. Was damit geschieht, kennst du vom Spamfilter. Er zählte für „Gratis: Dein Gewinn wartet“ die Gewichte 2 und 3 zusammen und kam auf 5. Diese 5 war nirgends gespeichert, sie entstand für genau diese Mail. Ein Sprachmodell bildet auf jeder Rechenstufe sehr viele solcher Summen aus den ankommenden Zahlen und seinen festen Parametern; wie im Kern, zeigt gleich ein Mini-Modell, ohne die weiteren Rechenschritte echter Modelle. Die Ergebnisse reicht es an die nächste Stufe weiter, bis zum Ausgang. Diese weitergereichten Zahlen, die Zwischenergebnisse aus dem Baustein über Parameter, heißen hier **Zwischenwerte**. Sie entsprechen den Anzeigen, denn sie entstehen für jeden Text neu.

Aus den letzten Zwischenwerten wird die **[Score](https://ki-einfach-verstehen.de/de/glossar/score/)**-Liste aus den Grundlagen, ein Score für jedes Textstück, das das Modell kennt. Softmax verteilt sie wie beim Glücksrad auf Anteile, die Prozente vom Anfang.

Weiter trägt das Bild nicht: Am echten Pult gehört jede Anzeige zu einem Kanal, etwa einem Mikrofon. Ein Zwischenwert gehört zu keinem einzelnen Parameter und keinem Thema. Schon die 5 hing an zwei Gewichten, im großen Modell hängt jeder Zwischenwert an sehr vielen.

![Links eine Tabelle mit den Spalten Land und Hauptstadt, die Zeile Frankreich, Paris ist markiert. Rechts läuft der Satzanfang an festen Schiebereglern vorbei, die für die Parameter stehen; daraus entsteht ein gestrichelter Kasten mit schematischen Balken für die Zwischenwerte, daraus eine Score-Liste mit Paris oben](../../public/bausteine/was-ein-ki-modell-eigentlich-ist/datenbank-oder-modell.svg)

*Eine Datenbank sucht die passende Zeile. Im Modell entstehen aus deiner Eingabe und den festen Parametern Zwischenwerte, aus denen am Ende die Score-Liste wird. Die Zwischenwerte sind schematisch.*

Bei der umgedrehten Frage rechneten dieselben Parameter mit einer anderen Eingabe, also entstand eine andere Score-Liste. Wie aber können feste Zahlen Wissen über Paris enthalten?

![Links zwei Eingaben: Die Hauptstadt von Frankreich ist, und: Paris ist die Hauptstadt von. Beide laufen durch denselben Block fester Schieberegler, beschriftet mit dieselben, fest. Danach je ein gestrichelter Kasten mit unterschiedlich hohen Balken für die Zwischenwerte. Rechts die Score-Listen in Prozent: oben Paris 47,5, unten Deutschland 28,9 und Frank als Anfang von Frankreich 9,4](../../public/bausteine/was-ein-ki-modell-eigentlich-ist/zwei-durchlaeufe.svg)

*Derselbe Fakt, zweimal gefragt, je ein Lauf von Qwen3-0.6B-Base: Die Parameter sind dieselben, die Zwischenwerte und die Score-Liste nicht. Die Balken der Zwischenwerte sind schematisch. Das größere Qwen3-4B-Base setzt den umgedrehten Satz zu 61,7 Prozent mit „Frank…“ fort.*

## Kein Parameter heißt „Paris“

Was das Modell im Training über Paris lernte, steckt in den Einstellungen seiner Parameter, aber in keinem einzelnen.

Ein ausgedachtes Mini-Modell mit zwei Stufen und zehn Reglern zeigt, wie das geht. Jede Stufe rechnet wie das Apfel-Modell aus dem Baustein über Parameter, nur mit mehreren Zahlen: jeder Regler mal seine ankommende Zahl, alles zusammengezählt. Satz A, „Die Hauptstadt von Frankreich ist“, kommt als drei ausgedachte Zahlen herein: 2, 1 und 1. Stufe 1 hat die Regler 1 bis 6, je drei pro Anzeige. Für Anzeige 1 stehen sie auf 2, −1 und 1: 2·2 − 1·1 + 1·1 = 4. Anzeige 2 rechnet mit −1, 2 und 1 und kommt auf 1. Stufe 2 hat die Regler 7 bis 10 und macht daraus Scores: Paris 2·4 + 1·1 = 9, Frankreich 1·4 + 2·1 = 6. Paris liegt vorn.

Satz B, „Paris ist die Hauptstadt von“, kommt als 1, 2 und 1 herein. Dieselben Regler ergeben die Anzeigen 1 und 4, dann Paris 6 und Frankreich 9. Jetzt liegt Frankreich vorn. Kein Regler speichert den Fakt. Er zeigt sich erst, wenn eine Eingabe durchläuft.

![Zwei Zeilen, Satz A und Satz B. Satz A: Eingabe 2, 1, 1, Anzeigen 4 und 1, Scores Paris 9 und Frankreich 6. Satz B: Eingabe 1, 2, 1, Anzeigen 1 und 4, Scores Paris 6 und Frankreich 9. In der Mitte ein Kasten mit zehn festen Reglern für beide Zeilen. Darunter: Regler 9 auf 3, dann Satz A Frankreich 14, Satz B Frankreich 11](../../public/bausteine/was-ein-ki-modell-eigentlich-ist/spielzeugmodell.svg)

*Ein ausgedachtes Mini-Modell: dieselben zehn Regler, zwei Satzanfänge. Anzeigen und Scores entstehen für jeden Satzanfang neu. Steht Regler 9 auf 3 statt auf 1, ändern sich die Scores beider Sätze.*

Angenommen, Regler 9, der Anzeige 1 in den Frankreich-Score einrechnet, steht auf 3 statt auf 1. Dann kommt Frankreich bei Satz A auf 3·4 + 2·1 = 14 und überholt Paris. Bei Satz B steigt es von 9 auf 11. Im echten Modell rechnen dieselben Parameter bei jeder Frage mit, ob zu Paris oder zu Fußball. Wer sie verstellt, um eine Antwort zu ändern, verschiebt auch die Scores anderer, und bei manchen kippt, was vorn liegt. Deshalb lässt sich ein Fakt nicht wie eine Tabellenzeile korrigieren.

> **Interaktive Demo:** [auf der Website ausprobieren](https://ki-einfach-verstehen.de/de/bausteine/was-ein-ki-modell-eigentlich-ist/)

Wo in den Millionen bis Milliarden Reglern echter Modelle der Paris-Fakt sitzt, kann bis heute niemand vollständig zeigen. Untersuchen lassen sich aber die Zwischenwerte.

Ein Forschungsteam der KI-Firma Anthropic, die den Chatbot Claude herstellt, tat das an einem kleinen Sprachmodell. Ein einzelner Zwischenwert, im Bild eine einzelne Anzeige, schlug dort bei wissenschaftlichen Zitaten aus, bei englischen Dialogen und bei koreanischem Text. Ein Zwischenwert ist also kein Fach für einen Begriff.

![Links vier Auslöser, wissenschaftliche Zitate, englische Dialoge, Webseiten-Anfragen und koreanischer Text, die alle auf denselben einzelnen Zwischenwert zeigen. Rechts eine Reihe schematischer Balken unterschiedlicher Höhe; eine Klammer unter allen Balken markiert ihre Kombination als Merkmal](../../public/bausteine/was-ein-ki-modell-eigentlich-ist/zahl-und-merkmal.svg)

*Ein einzelner Zwischenwert reagiert auf ganz verschiedene Dinge. Ein Merkmal zeigt sich als bestimmte Kombination von Werten über viele Zwischenwerte.*

In einer Fassung von Claude fand das Team stattdessen Millionen wiederkehrender Kombinationen über viele Zwischenwerte, etwa für berühmte Personen, Länder und Städte. Sie heißen **Merkmale**. Ein Merkmal ist wie ein Akkord: Ein einzelner Ton kommt in vielen Akkorden vor und verrät allein nicht, welcher gerade erklingt. Erst die Töne zusammen ergeben C-Dur. Anders als Akkorde hat Merkmale niemand festgelegt; sie entstanden im Training.

Damit hast du drei Größen: Parameter sind gespeichert und fest, die Regler. Zwischenwerte entstehen für jeden Text neu, die Anzeigen. Merkmale sind Kombinationen darin, die Akkorde. Ein Fakt wie „Paris ist die Hauptstadt von Frankreich“ ist keine dieser Größen. Er zeigt sich erst in der Antwort.

![Drei Zeilen. Parameter: gespeichert, beim Antworten fest, im Bild die Regler. Zwischenwerte: für jeden Text neu berechnet, im Bild die Anzeigen. Merkmale: Kombinationen in den Zwischenwerten, im Bild Akkorde. Darunter: Der Fakt zeigt sich erst in der Antwort](../../public/bausteine/was-ein-ki-modell-eigentlich-ist/drei-groessen.svg)

*Drei Größen, die du auseinanderhalten solltest. Der Fakt ist keine davon: Er zeigt sich erst in der Antwort.*

<details>
<summary>Eine Ebene tiefer: Wie sich Merkmale die Zwischenwerte teilen</summary>

Verschiedene Merkmale nutzen dieselben Zwischenwerte. Bei 82 Prozent der untersuchten Merkmale in Claude 3 Sonnet hing kein einzelner Zwischenwert stark mit dem Merkmal zusammen. Sind mehrere Merkmale zugleich aktiv, überlagern sich ihre Beiträge. Das Fachwort dafür ist **Superposition**, Überlagerung. So passen mehr Merkmale hinein, als es Zwischenwerte gibt, so wie wenige Tasten sehr viele Akkorde ergeben. Das klappt, weil meist nur wenige zugleich aktiv sind; sonst stören sie sich. In einem kleinen Modell mit nur einer Rechenstufe ließen sich aus 512 Zwischenwerten Zehntausende Merkmale herauslösen.

Dass Merkmale die Antwort steuern, zeigte ein Versuch mit der Golden Gate Bridge. Das Team hielt das Merkmal für die Brücke während der Rechnung auf dem Zehnfachen seines Höchstwerts, ohne Parameter zu ändern. Daraufhin hielt sich das Modell für die Golden Gate Bridge. Wo ein Fakt steckt, zeigt der Versuch nicht.

</details>

## Drei Fragen, bei denen eine Tabelle anders reagiert

Gemeint ist hier das Sprachmodell selbst. Manche Chatbots lassen erst das Internet durchsuchen und geben die Treffer als zusätzlichen Input ins Modell, wie den Gesprächsverlauf aus den Grundlagen. Das Modell allein rechnet aus deiner Eingabe eine Fortsetzung.

Der erste Fall ist die umgedrehte Frage, bei der im kleinen Modell „Deutschland“ vorn lag. Beim größeren Qwen3-4B-Base mit 4 Milliarden Parametern lag „Frank…“ vorn, der Anfang von „Frankreich“, mit gut 60 Prozent. Der Fakt ist also in beiden Richtungen lernbar. Dem kleinen Modell fehlte vermutlich die Größe, und nach „Hauptstadt von“ folgt in deutschen Texten oft „Deutschland“.

Trotzdem zählt die **Richtung**. Im Training ist immer der Textanfang der Input und das folgende Stück das Label, wie bei „Die Katze sitzt“ und „auf“. Was fast nur hinter einem Namen steht, lernt das Modell nur von dort aus. Auch große Modelle zeigen bei Fakten, die fast immer gleich herum dastehen, einen deutlichen Richtungseffekt. Fragen wie „Wer ist die Mutter von Tom Cruise?“ (Mary Lee Pfeiffer) beantwortete GPT-4, ein Modell hinter ChatGPT, 2023 zu fast vier Fünfteln richtig. Umgedrehte Fragen wie „Wer ist der Sohn von Mary Lee Pfeiffer?“ nur zu einem Drittel. Steht der Fakt schon in deiner Frage, gelingt die Umkehrung meist.

Der zweite Fall: Nicht jeder Fakt sitzt gleich fest. In einer Tabelle ist jede Zeile gleich gut auffindbar. Ein Modell antwortet umso sicherer, je mehr passende Texte es im Training sah, und größere Modelle halten mehr fest. Das kleine und das größere Modell bekamen „Der Physiker Albert Einstein wurde geboren am“ und nahmen Stück für Stück das Textstück, das vorn lag. Das kleine schrieb „14. August 1879 in Zürich“, das größere „14. März 1879 in Ulm“, und das stimmt. Selbst dieser oft erwähnte Fakt saß beim kleinen Modell nicht sicher.

Der dritte Fall fragt nach etwas, das es nicht gibt: dem Physiker Bernhard Quelling, für diesen Baustein erfunden. Eine Datenbank meldet: kein Treffer. Was, glaubst du, schreibt ein Sprachmodell? Das kleine und das größere Modell nannten ohne Zögern ein Geburtsdatum, das kleine „13. August 1920 in der Stadt Berlin“. Die Rechnung liefert eine Score-Liste, und irgendein Textstück liegt darin vorn. „Das weiß ich nicht“ wäre nur eine mögliche Fortsetzung, nach diesem Satzanfang passt ein Datum besser. Ein Modell mit nur dem Grundtraining hat kaum gelernt, hier das Stopp-Zeichen aus den Grundlagen zu wählen oder Nichtwissen zuzugeben. Das bringt erst das Nachtraining zum Chatbot bei.

> **Interaktive Demo:** [auf der Website ausprobieren](https://ki-einfach-verstehen.de/de/bausteine/was-ein-ki-modell-eigentlich-ist/)

Die drei Fälle zusammen: Die Richtung zählt, die Häufigkeit zählt, und Leerstellen werden plausibel gefüllt. Auch das „Das weiß ich nicht“ eines Chatbots ist gelerntes Verhalten, kein Suchergebnis.

## Antworten, die so nirgends standen

Dass ein Modell rechnet statt nachzuschlagen, ist zugleich seine größte Stärke, denn Gelerntes lässt sich kombinieren. In einem Anthropic-Versuch bekam ein Modell die Frage nach der Hauptstadt des US-Bundesstaats, in dem Dallas liegt. Das ist Texas, die Hauptstadt ist Austin. Zuerst sprang, ausgelöst durch „Dallas“, ein Merkmal für Texas an. Zusammen mit der Frage nach einer Hauptstadt führte es zur Antwort Austin.

![Animation: Die Frage nach der Hauptstadt des Bundesstaats von Dallas wird in zwei Schritten über Texas zu Austin beantwortet; nach dem Austausch von Texas gegen Kalifornien lautet die Antwort Sacramento](../../public/bausteine/was-ein-ki-modell-eigentlich-ist/zwei-schritte.static.svg)

[▶ Animation auf der Website ansehen](https://ki-einfach-verstehen.de/de/bausteine/was-ein-ki-modell-eigentlich-ist/)

*Zwei gelernte Fakten werden verknüpft: Dallas liegt in Texas, die Hauptstadt von Texas ist Austin.*

Kombiniert das Modell hier wirklich, oder ruft es eine auswendig gelernte Antwort ab? Die Forschenden ersetzten während der Rechnung das Merkmal für Texas durch eines für Kalifornien, indem sie Zwischenwerte änderten, nicht Parameter. Daraufhin antwortete das Modell „Sacramento“, die Hauptstadt Kaliforniens. Der zweite Schritt hing also wirklich vom ersten ab.

Auch über Sprachen hinweg funktioniert das. Fragten die Forschenden auf Englisch, Französisch oder Chinesisch nach dem Gegenteil von „klein“, wurden dieselben Merkmale für „klein“ und „Gegenteil“ aktiv. Das spricht dafür, dass dir ein Chatbot auf Deutsch etwas erklären kann, das er fast nur aus englischen Texten kennt.

Wörtliches gibt ein Modell trotzdem manchmal wieder. Aus GPT-2, einem älteren, frei verfügbaren Modell, ließen sich Hunderte Textstücke wörtlich herausholen, darunter Namen, Telefonnummern und E-Mail-Adressen, manche aus einem einzigen Trainingsdokument. Nachgeschlagen wird trotzdem nichts, in der Modelldatei stehen nur Parameter. Eine Nummer kommt erst heraus, wenn der passende Textanfang hineingeht und Stück für Stück genau diese Fortsetzung vorn liegt.

## Warum das Modell lieber rät als schweigt

2023 reichten zwei Anwälte in New York bei einem Bundesgericht einen Schriftsatz mit sechs Gerichtsentscheidungen ein. Keine davon existierte. ChatGPT hatte sie erzeugt, samt Aktenzeichen und Zitaten, die echten Urteilen oberflächlich glichen. Wie Urteile und Aktenzeichen aussehen, hatte das Modell aus sehr vielen Texten gelernt. Die Form entstand auch ohne die passenden Fakten.

Solche flüssigen, plausibel klingenden Aussagen, die nicht stimmen, heißen **[Halluzinationen](https://ki-einfach-verstehen.de/de/glossar/halluzination/)**. Sie haben drei ineinandergreifende Ursachen.

![Ein Stapel dicker, verschnürter Gerichtsakten auf einem Holztisch, daneben ein Richterhammer](../../public/bausteine/was-ein-ki-modell-eigentlich-ist/akten.webp)

*Sechs Urteile, die echt aussahen und nie gefällt wurden.*

Die erste steckt im Grundtraining. Ein Sprachmodell soll an jeder Stelle eines Textes ein nächstes Stück liefern, auch dort, wo seine **[Trainingsdaten](https://ki-einfach-verstehen.de/de/glossar/trainingsdaten/)** kaum etwas hergeben. Eine Fortsetzung entsteht deshalb immer. Die zweite steckt in der Bewertung. In Tests mit großen Fragenkatalogen bringt eine richtige Antwort oft einen Punkt, eine falsche null und „weiß ich nicht“ ebenfalls null. Das ist wie eine Klassenarbeit ohne Minuspunkte: Wer etwas nicht weiß, kreuzt trotzdem an. Chatbots werden im Nachtraining auf gute Testergebnisse getrimmt und lernen so: Ein Tipp bringt mehr. Bewusst entscheidet sich ein Modell dabei nicht; es wurde so eingestellt, dass Raten sich auszahlt.

Die dritte Ursache ist ein Fehlgriff innerhalb des Gelernten. Ein Chatbot lernt im Nachtraining durchaus, „Das weiß ich nicht“ zu sagen. Im Inneren von Claude lässt sich beobachten, wie: Bei Fragen nach Personen antwortet Claude mit „Das kann ich nicht beantworten“, solange nichts anderes anspringt. Ein Merkmal für „bekannte Person“ schaltet diese Antwort ab, wenn das Modell eine Person kennt. Manchmal wirkt ein Name aber nur vertraut, und das Merkmal springt trotzdem an. Dann ist die Antwort freigegeben, und das Modell schreibt weiter, was plausibel klingt.

Besonders anfällig sind Einzelfakten, die sich aus keiner Regel ableiten lassen, etwa Geburtstage. Wenn ein Fakt im Training nur einmal vorkam, hält das Modell ihn meist nicht zuverlässig fest, auch wenn einzelne solche Stellen hängen bleiben wie die Telefonnummern aus GPT-2. Das gilt selbst bei fehlerfreien Trainingsdaten. Prüfe deshalb seltene Fakten anhand einer Quelle: Urteile, Zitate, Zahlen, Lebensdaten.

<details>
<summary>Eine Ebene tiefer: Warum sich Raten rechnerisch lohnt</summary>

Forschende von OpenAI und Georgia Tech haben 2025 durchgerechnet, warum Halluzinationen so hartnäckig sind. Angenommen, ein Modell soll den Geburtstag einer Person nennen, über die es nichts weiß. Rät es ein Datum, liegt es in einem von 365 Fällen richtig, bringt im Schnitt also rund 0,003 Punkte. „Weiß ich nicht“ bringt sicher 0 Punkte. Raten gewinnt knapp.

Der Artikel leitet außerdem unter vereinfachten Annahmen eine Untergrenze für Fehler aus dem Grundtraining her, selbst bei fehlerfreien Daten: Sie wächst mit dem Anteil der Fakten, die im Training nur ein einziges Mal vorkommen.

Als Ausweg schlagen die Autoren vor, Tests anders zu bewerten: Eine falsche Antwort soll mehr kosten als ein ehrliches „weiß ich nicht“. Dann lohnt sich Raten nicht mehr.

</details>

## Nicht jedes KI-Modell ist ein Sprachmodell

„KI-Modell“ ist aber ein Oberbegriff. Den **[Spamfilter](https://ki-einfach-verstehen.de/de/glossar/spamfilter/)** und die Bilderkennung, fachlich ein **[Bildklassifikator](https://ki-einfach-verstehen.de/de/glossar/bildklassifikator/)**, kennst du aus den Grundlagen: Eine Mail oder ein Foto geht hinein, ein Urteil kommt heraus, etwa „Spam“ oder „Katze“.

Viele Bildgeneratoren wie Stable Diffusion arbeiten anders. Sie sind **[Diffusionsmodelle](https://ki-einfach-verstehen.de/de/glossar/diffusionsmodell/)**: Sie beginnen mit reinem Rauschen, wie Schnee auf einem alten Fernseher, und machen das ganze Bild in vielen Schritten immer klarer, gesteuert durch deinen Text. Ein Sprachmodell hängt dagegen Stück an Stück hinten an. **[Multimodale Modelle](https://ki-einfach-verstehen.de/de/glossar/multimodales-modell/)** schließlich verarbeiten mehrere Arten von Input, etwa Text und ein Foto, und antworten mit Text.

![Vier Karten: Klassifikation, eine Mail oder ein Foto rein, ein Urteil raus. Bildgenerator, Text rein, Bild raus, aus Rauschen in vielen Schritten. Sprachmodell, Text rein, nächstes Textstück raus. Multimodales Modell, Text und Bild rein, Text raus](../../public/bausteine/was-ein-ki-modell-eigentlich-ist/modellarten.svg)

*Vier Arten von KI-Modellen, unterschieden nach Input und Output. Gemeinsam ist ihnen der Aufbau aus Bauplan und trainierten Parametern.*

Alle bestehen aus Bauplan und trainierten Parametern. Was hineingeht, was herauskommt und wie gerechnet wird, unterscheidet sich.

Dieser Themenbereich folgt dem Weg durch ein Sprachmodell, denn die meisten großen Sprachmodelle von heute sind nach demselben Grundmuster gebaut: Sie sagen das nächste Token voraus und sehen dabei nur den Text davor. Auch Chatbots, die Fotos verstehen, arbeiten im Kern so. Der Weg hat vier Stationen, eine je Baustein. Aus deinem Text werden Tokens. Jedes Token bekommt eine Liste aus Zahlen, wie eine Seite im Nachschlagebuch aus dem Baustein über Vektor und Matrix. Viele Rechenstufen mischen dann den Zusammenhang des Satzes ein. Fachleute nennen sie Blöcke, nicht zu verwechseln mit den Zahlenblöcken. Am Ende macht der Ausgang, der Output Head, daraus die Score-Liste.

![Vier Karten von links nach rechts, verbunden durch Pfeile, darüber links: Rein, deine Chatnachricht, rechts: Raus, ein nächstes Token. Baustein 2, Tokens: Text wird zur Tokenfolge. Baustein 3, Embeddings: jedes Token bekommt eine Liste aus Zahlen. Baustein 4, Blöcke: Zusammenhang des Satzes wird eingemischt. Baustein 5, Output Head, der Ausgang: Score-Liste für das nächste Token](../../public/bausteine/was-ein-ki-modell-eigentlich-ist/weg-durchs-modell.svg)

*Der Weg durchs Modell in vier Stationen. Jede bekommt in diesem Themenbereich einen eigenen Baustein.*

Ein Chatbot weiß also, dass Paris die Hauptstadt von Frankreich ist, weil das Training seine Parameter so eingestellt hat, dass beim Durchrechnen dieser Frage „Paris“ vorn liegt. Der Chatbot schlägt nichts nach, sondern rechnet aus deiner Eingabe eine Fortsetzung aus. Deshalb kann er Gelerntes neu kombinieren, und deshalb füllt er Lücken flüssig mit Erfundenem.

Zur ersten Station: Aus deiner Chatnachricht wird eine lange Folge von Tokens, in der auch steht, wer was gesagt hat. Wie sie entsteht und wie lang sie sein darf, zeigt der nächste Baustein.

---

Quelle: https://ki-einfach-verstehen.de/de/bausteine/was-ein-ki-modell-eigentlich-ist/

← Zurück: [Parameter, Training und Inferenz, Hardware: Wie ein Modell läuft](./parameter-training-inferenz-hardware.md) · [Alle Bausteine](../../README.de.md#inhalt) · Weiter: [Tokenisierung im Modell: Wie dein Chat zu einer Tokenfolge wird](./tokenisierung-im-modell.md) →
