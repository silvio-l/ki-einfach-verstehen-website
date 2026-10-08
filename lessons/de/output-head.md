<!-- Generated from src/content/bausteine/de/output-head.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Output Head: Vom letzten Zustand zur Vorhersage

> Lesefassung für GitHub. Die vollständige Fassung mit interaktiven Demos, Animationen und Abrufmoment findest du auf der Website: **[Output Head: Vom letzten Zustand zur Vorhersage](https://ki-einfach-verstehen.de/de/bausteine/output-head/)**
>
> Lizenz: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.de) · Nenne die Quelle so: KI einfach verstehen, „Output Head: Vom letzten Zustand zur Vorhersage“, CC BY 4.0, https://ki-einfach-verstehen.de/de/bausteine/output-head/

Wie ein Sprachmodell aus seinem letzten Zustand einen Score für jedes Token berechnet und warum dabei nur die letzte Position zählt.

Am Ende des vorigen Bausteins hatte jede Position im Text einen Zustand: eine Liste von Zahlen, in die die Blöcke nacheinander den Kontext eingemischt haben. Bei dem kleinen Sprachmodell Qwen3-0.6B sind es 1.024 Zahlen pro Position. Im Chatfenster erscheinen aber keine Zahlenlisten, sondern Wörter.

Im ersten Baustein dieses Themenbereichs sagte genau dieses Modell nach „Die Hauptstadt von Frankreich ist“ mit 47,5 Prozent „Paris“ voraus. Bei einem weiteren Versuch schrieb dasselbe Modell nach genau diesem Satzanfang „Zürich“. Welche Rechnung führt zu den 47,5 Prozent?

## Heraus kommt eine Tafel, kein Wort

Was das Modell am Ende liefert, ist die Score-Liste, die der vorige Baustein angekündigt hat. Sie ähnelt der Punktetafel aus dem Baustein über [Wahrscheinlichkeit und Softmax](./wahrscheinlichkeit-und-softmax.md), die nach einem Quizabend die Punkte von drei Teams zeigte. Diese Tafel hat aber eine Zeile für jeden Eintrag im [Vokabular](https://ki-einfach-verstehen.de/de/glossar/vokabular/), bei Qwen3-0.6B sind es 151.936. Jede bekommt einen [Score](https://ki-einfach-verstehen.de/de/glossar/score/), auch die für ein Komma oder ein chinesisches Schriftzeichen.

![Eine sehr hohe hölzerne Anzeigetafel mit vielen schmalen Zeilen, die über den Bildrand hinausgehen; jede Zeile hat ein leeres Namensschild und ein unterschiedlich langes Punkteschild, ein türkisfarbenes Schild ragt am weitesten heraus und wird von einer kleinen Messinglampe beleuchtet, einige Schilder in der Nähe sind bernsteinfarben](../../public/bausteine/output-head/punktetafel.webp)

*Die Tafel am Ende des Modells: eine Zeile für jeden Eintrag im Vokabular, jede mit eigenem Punktestand. Eine Zeile liegt vorn.*

Für diesen Themenbereich wurde Qwen3-0.6B auf einem gewöhnlichen Rechner ausprobiert, in der frei verfügbaren Grundfassung ohne Chat-Training. Nach „Die Hauptstadt von Frankreich ist“ hat „Paris“ den höchsten Score, 20,5. Auf Platz zwei steht mit 19,1 ein Lückenstrich „____“, wie in Arbeitsblättern und Quizfragen. Auch Platz drei und vier sind Lückenstriche, nur verschieden lang, denn jede Länge ist ein eigenes Token. Solche Texte hat das Modell im Training offenbar oft gesehen. „Bern“ folgt erst auf Platz fünf. Softmax macht aus diesen Scores Prozente.

Erinnerst du dich an die Faustregel aus dem Softmax-Baustein? Liegt ein Kandidat einen Punkt vor einem anderen, bekommt er etwa 2,7-mal so viel, bei zwei Punkten gut siebenmal so viel (2,7 · 2,7). „Paris“ liegt knapp anderthalb Punkte vor dem Lückenstrich und bekommt rund viermal so viel: 47,5 gegen 12,0 Prozent. „Bern“ liegt dreieinhalb Punkte zurück und kommt nur auf 1,4 Prozent. Die ersten fünf haben zusammen rund zwei Drittel. Das letzte Drittel teilen sich in winzigen Stücken die übrigen Zeilen, und erst mit ihnen kommt „Paris“ auf genau 47,5 Prozent, die Zahl aus dem ersten Baustein.

![Tabelle nach Die Hauptstadt von Frankreich ist, Modell Qwen3-0.6B-Base: Platz 1 Paris, Score 20,5, nach Softmax 47,5 %; Platz 2 bis 4 Lückenstriche mit Scores 19,1, 17,8 und 17,8 und 12,0 %, 3,0 % und 3,0 %; Platz 5 Bern, Score 17,0, 1,4 %; darunter: und 151.931 weitere Zeilen](../../public/bausteine/output-head/paris-tafel.svg)

*Die Spitze der echten Tafel: Aus knapp anderthalb Punkten Vorsprung macht Softmax das Vierfache.*

Dass das Modell jeden Eintrag seines Vokabulars bewertet und erst ein eigener Schritt einen auswählt, kennst du aus dem Baustein über [Input und Output](./input-und-output.md): Dort lag nach „Die Katze sitzt auf“ das Wort „dem“ vorn. **Neu ist, dass das Gewählte oft nicht einmal ein ganzes Wort ist.** Nach „Der Hund jagt die“ lagen bei Qwen3 Wortanfänge vorn, etwa „T“ (wie in „Taube“), „F“ (wie in „Fliege“) und „Kat“ (wie in „Katze“). Welches Wort daraus wird, entscheiden erst die nächsten Runden. Gewählt wird ein [Token](https://ki-einfach-verstehen.de/de/glossar/token/).

Scores können sogar alle negativ sein. Beim älteren Modell GPT-2, das im Versuch mitlief, lag nach „The dog chased the“ (der Hund jagte den) „dog“ mit −86,4 vorn und bekam nach Softmax trotzdem knapp 20 Prozent. Es zählen nur die Abstände, wie bei einem Rennen, in dem alle hinter dem Rekord bleiben: Es gewinnt, wer am wenigsten zurückliegt.

Doch woher kommen die 20,5 Punkte für „Paris“?

## Woher die Punkte kommen: eine Zeile pro Token

Den Teil des Modells, der die Tafel füllt, nennen Fachleute **[Output Head](https://ki-einfach-verstehen.de/de/glossar/output-head/)**, auf Deutsch etwa Ausgabekopf. Er ist kein weiterer Block, sondern ein viel einfacherer Rechenschritt: keine Attention, kein Einmischen, nur ein Vergleich. Für jeden Eintrag im Vokabular hat er eine Zeile mit genauso vielen Zahlen wie der Zustand. **Der Score eines Tokens misst, wie gut der Zustand zu seiner Zeile passt.**

Angenommen, Zustände hätten nur drei Zahlen und das Vokabular vier Tokens: „Katze“, „Taube“, „Ente“ und „Wolke“. Zur Anschauung heißen die drei Stellen hier „Tier“, „flink“ und „Gegenstand“. Nach „Der Hund jagt die“ steht an der letzten Position der Zustand (1,0 | 0,5 | −1,0): Ein Tier passt, gern ein flinkes, ein Gegenstand eher nicht. Die Zeile von „Katze“ lautet (2,0 | 1,0 | −1,5): deutlich ein Tier, flink, kein Gegenstand. Die Zahlen sagen, wie gut ein Wort nach „jagt die“ passt, nicht, was es ist.

Der Output Head rechnet Stelle für Stelle: erste Zahl mal erste Zahl und so weiter. Dann zählt er alles zusammen. 1,0 mal 2,0 ergibt 2,0. 0,5 mal 1,0 ergibt 0,5. −1,0 mal −1,5 ergibt plus 1,5, denn minus mal minus ist plus. Zusammen sind das 4,0, der Score von „Katze“. Diese Rechnung kennst du aus dem vorigen Baustein: Genau so wurde dort die Query von „Bank“ mit jedem Key verglichen.

„Taube“ hat die Zeile (1,0 | 1,0 | −1,0), das ergibt 1,0 + 0,5 + 1,0 = 2,5. „Ente“ hat (0,5 | 0 | −1,0) und kommt auf 1,5. „Wolke“ hat die Zeile (−1,0 | 0 | 0). Welchen Score bekommt sie?

Es sind −1,0. Gesucht ist ein Tier, und die Wolke ist keins: An der Stelle „Tier“ ist der Zustand positiv und die Zeile negativ, das gibt Abzug. Daraus folgt die Regel hinter jedem Score: Haben Zustand und Zeile an einer Stelle dasselbe Vorzeichen, gibt es Punkte, bei entgegengesetztem Vorzeichen Abzug. Je weiter eine Zahl von null entfernt ist, desto stärker zählt sie.

Ein hoher Score heißt deshalb nicht, dass Zustand und Zeile gleich sind. Fachleute sagen: Beide zeigen in dieselbe Richtung. Gemeint ist die Regel von eben: an denselben Stellen dasselbe Vorzeichen, größere Zahlen zählen mehr. Gliche der Zustand genau der Zeile von „Taube“, läge trotzdem „Katze“ vorn, mit 4,5 zu 3,0: gleiche Richtung, aber größere Zahlen.

![Oben der Zustand mit den Zahlen 1,0, 0,5 und −1,0 für die letzte Position nach Der Hund jagt die, über den drei Stellen die ausgedachten Namen Tier, flink und Gegenstand; darunter vier Zeilen mit je drei Zahlen, daneben die Rechnung und der Score: Katze 2,0, 1,0, −1,5 ergibt 2,0 + 0,5 + 1,5 = 4,0; Taube 1,0, 1,0, −1,0 ergibt 2,5; Ente 0,5, 0, −1,0 ergibt 1,5; Wolke −1,0, 0, 0 ergibt −1,0](../../public/bausteine/output-head/zustand-trifft-zeilen.svg)

*Der Output Head im Kleinen: Der Zustand wird mit jeder Zeile Stelle für Stelle malgenommen, die Ergebnisse werden zusammengezählt (ausgedachte Zahlen und Stellennamen).*

Echte Modelle rechnen genauso, nur größer. Bei Qwen3-0.6B vergleicht der Output Head den Zustand mit 151.936 Zeilen zu je 1.024 Zahlen, zusammen rund 156 Millionen im Training eingestellte [Parameter](https://ki-einfach-verstehen.de/de/glossar/parameter/). Das geschieht für jedes Token, das ein Chatbot schreibt. Namen haben die Stellen dort nicht; „Tier“, „flink“ und „Gegenstand“ waren ausgedacht.

> **Interaktive Demo:** [auf der Website ausprobieren](https://ki-einfach-verstehen.de/de/bausteine/output-head/)

Auch das Bild der Punktetafel endet hier. Auf einer Punktetafel vergibt ein Schiedsrichter Punkte nach Regeln, die sich nachlesen lassen. Die Zeilen des Output Heads hat niemand geschrieben, ihre Zahlen hat das Training eingestellt.

<details>
<summary>Eine Ebene tiefer: Der Output Head als eine einzige Matrix-Rechnung</summary>

Alle Zeilen untereinander bilden eine [Matrix](https://ki-einfach-verstehen.de/de/glossar/matrix/). Bei GPT-2 hat sie die Form 50.257 × 768: eine Zeile pro Token, 768 Zahlen pro Zeile, so viele wie der Zustand h. Alle Vergleiche zusammen sind eine einzige Multiplikation:

`Scores = h · Wᵀ`

W ist die Matrix. Das hochgestellte T heißt, dass sie gekippt wird, damit ihre Zeilen auf die Stellen des Zustands treffen. Heraus kommt ein Vektor mit 50.257 Scores. Bei GPT-2 nachgerechnet, weicht er um weniger als 0,0002 von den Scores des Modells ab. Direkt davor steht noch ein Ausgleichsschritt, eine Normalisierung; „letzter Zustand“ meint den Zustand danach. Fachleute nennen die Scores Logits.

</details>

Die Zeilen des Output Heads erinnern an etwas, das ganz am Anfang des Weges stand.

## Dieselbe Tabelle am Eingang und am Ausgang

Am Eingang holt jede Token-ID ihren Steckbrief aus einer großen Tabelle. Im Baustein über Embeddings lagen dort etwa die Steckbriefe von „apple“ und „peach“ nah beieinander. Diese Tabelle hat eine Zeile pro Vokabulareintrag, jede so lang wie ein Zustand. Genau so sieht die Tabelle des Output Heads aus. Könnte es dieselbe sein?

Im Baustein über Embeddings hieß es, am Ausgang stehe meist eine zweite Tabelle. Manche Modelle teilen sie aber. Fachleute nennen das **Weight Tying**, auf Deutsch etwa „gekoppelte Gewichte“. „Gewichte“ ist hier nur ein anderes Wort für Parameter, also die Zahlen in der Tabelle. **Die Tabelle wird dann zweimal benutzt:** vorne, um zu einer ID die Zahlen zu holen, hinten, um den letzten Zustand mit jeder Zeile zu vergleichen. Ein hoher Score für „Paris“ heißt dann: Der Zustand an der letzten Position zeigt in eine ähnliche Richtung wie der Steckbrief von „Paris“.

![Zwei gegenläufige Pfeile](../../public/bausteine/output-head/hin-und-zurueck.svg)

*Weight Tying: Dieselbe Tabelle übersetzt am Eingang Tokens in Zahlen und vergleicht am Ausgang Zahlen mit Tokens.*

Ob ein Modell die Tabelle teilt, steht in seinem Bauplan, der kleinen Datei, die neben den Parametern jedem Modell beiliegt (Baustein über Parameter, Training, Inferenz und Hardware). Bei Qwen3-0.6B steht dort Ja, beim größeren Qwen3-8B Nein: Es hat am Ausgang eine eigene, zweite Tabelle.
Das Teilen kann Sprachmodelle sogar etwas besser machen, wie Forschende 2016 zeigten, und vor allem spart es Platz.

Wie viel, zeigt eine kleine Rechnung. Die Tabelle von Qwen3-0.6B hat die rund 156 Millionen Zahlen von eben. Das ganze Modell hat rund 0,6 Milliarden Parameter, daher das „0.6B“ im Namen. Ohne Teilen kämen die 156 Millionen am Ausgang ein zweites Mal dazu, rund ein Viertel mehr. Jede Zahl braucht hier zwei Byte, so wie bei Llama 3.1 8B aus den Grundlagen, dessen acht Milliarden Zahlen 16 Gigabyte füllen. Das Teilen spart also rund 0,3 Gigabyte. Gerade kleine Modelle sollen oft auf Laptop oder Handy laufen, wo jedes Gigabyte zählt.

Bisher ging es um einen einzigen Zustand. Das Modell hat aber an jeder Position einen.

## Welche Position zählt

„Die Hauptstadt von Frankreich ist“ besteht für Qwen3-0.6B aus sieben Tokens: „Die“, „Haupt“, „stadt“, „von“, „Frank“, „reich“ und „ist“. Nach dem letzten Block hat jedes davon seinen Zustand. Welcher der sieben geht in den Output Head?

**Beim Erzeugen nur einer: der Zustand der letzten Position**, hier der von „ist“. Die anderen sechs würden Tokens vorhersagen, die längst im Text stehen.

Heißt das, das Modell achtet nur auf das *letzte* Wort? Aber in diesen Zustand haben die Blöcke Information aus allen vorigen Positionen eingemischt, wie im vorigen Baustein beschrieben. Das Wort „ist“ allein deutet auf keine Hauptstadt hin. Erst durch den eingemischten Kontext passt sein Zustand gut zur Zeile von „Paris“.

Im Training ist das anders. Dort läuft ein Stück Trainingstext durch das Modell, und jede Position liefert ihre eigene Tafel. Wie viele Vorhersagen stecken in einem einzigen Durchlauf mit „Der Hund jagt die Katze“, wenn jedes Wort ein Token ist? Überleg kurz.

Fünf Positionen liefern je eine Tafel, vier davon lassen sich direkt prüfen: „Der“ soll „Hund“ vorhersagen, „Hund“ das Wort „jagt“, „jagt“ das Wort „die“ und „die“ das Wort „Katze“. Für „Katze“ steht das nächste Token nicht mehr im Text. Abschreiben kann keine Position, obwohl der ganze Satz im Modell steckt: Die Causal Mask aus dem vorigen Baustein lässt jede Position nur sehen, was vor ihr steht. Jede bekommt den echten Text davor, nicht das, was das Modell selbst geraten hätte (Fachwort: Teacher Forcing). Deshalb wartet keine Vorhersage auf eine andere, und alle laufen gleichzeitig.

![Oben Beim Erzeugen: die Tokens Der, Hund, jagt, die; nur die ist hervorgehoben und führt über den Output Head zu einem Fragezeichen, die anderen Zustände werden berechnet, gehen aber nicht in den Output Head. Unten Im Training: jedes der vier Tokens hat einen Pfeil zu seinem Ziel, Der zu Hund, Hund zu jagt, jagt zu die, die zu Katze; Ziel ist jeweils das echte nächste Token aus dem Trainingstext](../../public/bausteine/output-head/positionen.svg)

*Beim Erzeugen liefert nur die letzte Position eine Tafel. Im Training sagt jede Position ihr nächstes Token voraus, alle gleichzeitig.*

Deshalb erscheinen Antworten im Chatbot Stück für Stück, obwohl das Training ganze Texte auf einmal verarbeitet: Beim Erzeugen gibt es den echten nächsten Text noch nicht. Jedes Token muss gewählt sein, bevor das nächste berechnet werden kann.

## Eine ganze Runde, vom Text bis zum nächsten Token

Jetzt lässt sich der ganze Weg am Stück gehen. Der Text wird in Tokens zerlegt, jedes mit seiner ID. Jede ID holt ihren Steckbrief aus der Tabelle. Die Blöcke mischen nacheinander Kontext in die Zustände ein. Der Zustand der letzten Position geht in den Output Head, und heraus kommt die Tafel mit 151.936 Scores. Softmax macht daraus Prozente. Ein Auswahlschritt wählt ein Token, und das wird angehängt. Dann beginnt die nächste Runde mit einem Token mehr.

![Animation: eine Runde durchs Modell von Die Hauptstadt von Frankreich ist bis zum angehängten Token Paris](../../public/bausteine/output-head/eine-runde.static.svg)

[▶ Animation auf der Website ansehen](https://ki-einfach-verstehen.de/de/bausteine/output-head/)

*Eine vollständige Runde durchs Modell: vom Text über Tokens, Steckbriefe, Blöcke und den letzten Zustand bis zur Tafel, zur Auswahl und zum angehängten Token.*

**Beim Auswahlschritt entscheidet sich, was aus der Tafel wird.** Nimmt das Modell immer das Wahrscheinlichste (Greedy-Auswahl), kommt nach „Die Hauptstadt von Frankreich ist“ immer „Paris“. Wird dagegen am Glücksrad aus dem Baustein über Softmax gedreht ([Sampling](https://ki-einfach-verstehen.de/de/glossar/sampling/)), ist das Ergebnis offen: Jedes Token hat dort ein Feld, so groß wie sein Prozentanteil. Im Versuch kam beim ersten Mal „Zürich“ heraus, beim zweiten ein Doppelpunkt und der Satz noch einmal, beim dritten „Paris“.

Wie kommt „Zürich“ aufs Rad, wenn es nicht einmal unter den ersten fünf steht? Für das Modell ist „Zürich“ kein einzelnes Token, sondern drei: „Z“, „ür“ und „ich“. Der Wortanfang „Z“ steht auf Platz 17 der Tafel, mit rund 0,6 Prozent. Dieses schmale Feld trifft ungefähr jede 170. Drehung; dass es im Versuch gleich beim ersten Mal traf, war Zufall. Ist „Z“ angehängt, folgen „ür“ und „ich“ in den nächsten Runden fast sicher. Der Output Head hat also nichts falsch gerechnet. Er hat „Paris“ vorn gesehen, gelost hat der Auswahlschritt.

Was einmal angehängt ist, bleibt stehen, und jede weitere Runde baut darauf auf. Tippst du im Chatbot auf „Neu generieren“, bleibt die erste Tafel gleich, nur wird neu gelost; ab dem ersten anderen Token ändern sich auch die weiteren.

> **Interaktive Demo:** [auf der Website ausprobieren](https://ki-einfach-verstehen.de/de/bausteine/output-head/)

Immer das Wahrscheinlichste zu nehmen, hat eine eigene Schwäche. Im Versuch setzte GPT-2 so „Der Hund jagt die“ mit „Welt des Welt des Welt des Welt des“ fort. Das ist die Wiederholungsschleife aus dem Baustein über Softmax: Steht eine Wendung schon zweimal im Text, wird ihre Wiederholung oft zur wahrscheinlichsten Fortsetzung. GPT-2 kann kaum Deutsch, das verschärft den Effekt.

<details>
<summary>Eine Ebene tiefer: Muss jede Runde alles neu gerechnet werden?</summary>

So beschrieben, läuft in jeder Runde der ganze Text noch einmal durchs Modell, obwohl nur ein Token dazukam. Der Ausweg aus der Vertiefung des vorigen Bausteins heißt **KV-Cache**: Die Keys und Values früherer Tokens werden aufgehoben, weil spätere Tokens an ihnen nichts ändern. Pro Runde geht dann nur das neue Token durch die Blöcke.

Mit GPT-2 auf einem gewöhnlichen Rechner gemessen (nur als Größenordnung), dauerten 200 Tokens mit Cache rund 3,6 Sekunden, ohne rund 14, also etwa viermal so lange. Umsonst ist der Cache nicht: Er wächst mit jedem Token und kann bei sehr langen Texten einen großen Teil des Speichers belegen.

</details>

## Wann die Schleife endet und was sich einstellen lässt

Wann endet die Schleife? Erinnerst du dich an das Ende-Token aus dem Baustein über Tokenisierung im Modell, etwa `<|eot_id|>` bei Llama, das einen Redebeitrag abschließt? In den Grundlagen hieß es Stopp-Zeichen. Es hat eine eigene Zeile im Output Head und bekommt jede Runde einen Score wie alle anderen. **Das Modell beendet seine Antwort, indem genau dieses Token gewählt wird.** Die Längengrenze dagegen ist eine Einstellung außerhalb des Modells. Hört eine lange Antwort mitten im Satz auf und bietet die App an, weiterzuschreiben, war diese Grenze erreicht.

![Zwei Schieberegler](../../public/bausteine/output-head/regler.svg)

*Was sich von außen einstellen lässt, betrifft vor allem den Auswahlschritt, nicht den Output Head.*

Von außen lässt sich fast nur der Auswahlschritt einstellen, nicht die Rechnung davor. Die Temperatur kennst du aus dem Baustein über Softmax: Niedrig spitzt sie das Glücksrad zu, und das große Feld wird noch größer; hoch macht sie die Felder gleichmäßiger. In Chat-Apps kannst du solche Regler meist gar nicht verstellen, das übernimmt der Anbieter.

<details>
<summary>Eine Ebene tiefer: Was Anbieter melden und erlauben</summary>

Programme sprechen Modelle über die Programmierschnittstelle des Anbieters an, englisch API. Sie meldet, warum eine Antwort endete: bei Anthropic „end_turn“, wenn das Modell selbst abgeschlossen hat, sonst etwa die Höchstzahl an Tokens oder eine selbst festgelegte Stoppfolge.

Neben der Temperatur gibt es dort oft Top-k und Top-p: Vor dem Drehen bleiben nur die k wahrscheinlichsten Tokens übrig, beziehungsweise nur so viele, bis sie zusammen den Anteil p erreichen. Manche Anbieter schränken sie ein (Stand Oktober 2026): Bei den GPT-6-Modellen von OpenAI entfallen Temperatur und Top-p, sobald das Modell vor dem Antworten eigens nachdenken soll. Anthropic nimmt bei Modellen nach Claude Opus 4.6 nur Temperatur 1,0, kein Top-k und Top-p erst ab 0,99. Das behält 99 Prozent des Rads und streicht nur haarfeine Felder.

</details>

Die Anfangsfrage ist damit beantwortet: Das Modell schreibt kein Wort, es füllt eine Tafel. Der Output Head vergleicht den letzten Zustand mit einer Zeile für jedes Token, oft mit denselben Steckbriefen wie am Eingang. Je mehr beide in dieselbe Richtung zeigen, desto höher der Score. Softmax macht daraus Prozente wie die 47,5 für „Paris“. Ein Auswahlschritt nimmt das Wahrscheinlichste oder lost; beim Losen trifft er manchmal das schmale Feld „Z“, und es wird „Zürich“.

Damit ist auch der Weg durchs Modell komplett, vom Text über Tokens, Steckbriefe und Blöcke bis zur Tafel. Jede Zahl auf diesem Weg war aber einfach da: die Steckbriefe, die Parameter in den Blöcken, die Zeilen des Output Heads. Eingestellt hat sie das Training, mit genau der Vorhersage aus diesem Baustein: An jeder Position sagt das Modell das nächste Token voraus, und das wird mit dem echten verglichen. Wie daraus ein besseres Modell wird, zeigt der nächste Themenbereich, „Wie Lernen funktioniert“.

---

Quelle: https://ki-einfach-verstehen.de/de/bausteine/output-head/

← Zurück: [Transformerblöcke und Attention: Wie Kontext eingemischt wird](./transformerbloecke-und-attention.md) · [Alle Bausteine](../../README.de.md#inhalt)
