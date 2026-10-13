<!-- Generated from src/content/bausteine/de/was-ein-chatbot-im-gespraech-weiss.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Was ein Chatbot in einem Gespräch weiß: Vier Quellen, ein Kontextfenster

> Lesefassung für GitHub. Die vollständige Fassung mit interaktiven Demos, Animationen und Abrufmoment findest du auf der Website: **[Was ein Chatbot in einem Gespräch weiß: Vier Quellen, ein Kontextfenster](https://ki-einfach-verstehen.de/de/bausteine/was-ein-chatbot-im-gespraech-weiss/)**
>
> Lizenz: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.de) · Nenne die Quelle so: KI einfach verstehen, „Was ein Chatbot in einem Gespräch weiß: Vier Quellen, ein Kontextfenster“, CC BY 4.0, https://ki-einfach-verstehen.de/de/bausteine/was-ein-chatbot-im-gespraech-weiss/

Woher kommen Antworten im Chat? Aus den im Training eingestellten Reglern, dem Text im Kontextfenster, Werkzeugen oder gespeicherten Notizen. Davon hängt ab, wie verlässlich eine Antwort ist.

Angenommen, du fragst einen Chatbot: „Was habe ich letzte Woche über meinen Garten geschrieben?“ Er antwortet, als hätte er nachgeschlagen, was du damals geschrieben hast. Woher kennt er deine Angaben? Aus dem Training kennt er deinen Garten nicht. Die Antwort stammt also aus Informationen, die ihm im Gespräch vorliegen, oder sie ist geraten. Um das unterscheiden zu können, hilft ein Blick auf die Quellen, aus denen ein Chatbot seine Antworten bildet.

## Vier Quellen, ein Kontextfenster

Ein Chatbot kann im Gespräch auf vier Quellen zurückgreifen. Die **Gewichte** sind die Zahlen, die während des Trainings eingestellt wurden. Im Baustein über das Mischpult heißen sie Regler. Zum **Kontext** gehört alles, was im Gespräch steht: die Vorgaben der App, der bisherige Verlauf und ein angehängtes Dokument. Über **Werkzeuge** kann der Chatbot etwa im Netz oder in früheren Chats suchen. Hinzu kommen **gespeicherte Notizen**: Angaben, die außerhalb des Modells liegen, bis sie abgerufen werden.

Die letzten drei Quellen haben etwas gemeinsam: Sobald ihr Inhalt abgerufen wird, gelangt er als Text ins [Kontextfenster](https://ki-einfach-verstehen.de/de/glossar/kontextfenster/). Das Kontextfenster ist die feste Zahl an Plätzen, die ein Modell auf einmal verarbeitet. Im Baustein über [Tokens](https://ki-einfach-verstehen.de/de/glossar/token/) hast du dieselbe Grenze als Prellbock am Gleisende kennengelernt. Hier kannst du dir diese Grenze als die Größe einer Tischplatte vorstellen.

Auf der Platte liegen Zettel: die Vorgaben, der Verlauf, ein Dokument, ein Suchergebnis, eine Notiz. Die Regler stehen nicht auf dem Tisch. Sie sind am Mischpult eingestellt und bleiben, wie sie sind.

![Mischpult auf einem Beistelltisch, Pfeil zu einem Zettelstapel auf der Platte, zweiter Pfeil zu einem leeren Ausgabe-Blatt](../../public/bausteine/was-ein-chatbot-im-gespraech-weiss/schreibtisch.webp)

*Ein Schreibtisch als Bild für das Kontextfenster: Auf der Platte liegt ein Stapel Zettel. Das Mischpult mit den Reglern steht auf einem eigenen Beistelltisch daneben. Ein Pfeil führt vom Mischpult zu den Zetteln, ein zweiter zum Zettel mit der Antwort. Das Bild zeigt, was im Gespräch vorliegt, nicht was das Modell weiß.*

Der Unterschied ist wichtig. Die Gewichte stecken im Modell und wirken auf jede Antwort. Was im Fenster liegt, wirkt auf die aktuelle Antwort. Ob ältere Nachrichten dort bleiben, entscheidet die App: Ist das Fenster voll, kann sie die ältesten herausnehmen. Das Modell verarbeitet alles auf dem Tisch als Eingabe: Text als Text, Bilder als Bilder. Das gilt für einen Satz aus der Systemanweisung ebenso wie für einen Satz aus einer Websuche. Hat die App eine Systemanweisung hinterlegt, schickt sie diese bei jeder Nachricht erneut an das Modell. Die Gewichte bleiben bei jeder Frage dieselben. Am Ende entsteht aus den Zetteln und den Reglern ein Ausgabe-Zettel: die Antwort. Bei der Verarbeitung des Textes kommen die eingestellten Regler zum Einsatz. Ihre Einstellungen ändern sich dabei nicht.

![Die Gewichte stehen getrennt links; Kontext, Werkzeug und gespeicherte Notiz fließen als Text in das Kontextfenster](../../public/bausteine/was-ein-chatbot-im-gespraech-weiss/vier-quellen.svg)

*Vier Quellen um das Kontextfenster: Die Gewichte stecken im Modell und wirken auf jede Antwort. Werkzeuge und gespeicherte Notizen liefern Text, der ins Kontextfenster kommt.*

## Das Training endet an einem Stichtag

Die Gewichte sind das Ergebnis des Trainings: Dabei werden die Regler eingestellt. Danach bleiben ihre Einstellungen unverändert, auch während eines Gesprächs. Diesen Zusammenhang erklärt der Baustein über [Input und Output](./input-und-output.md). Was im Training nicht vorkam, kann das Modell deshalb nicht aus seinen Reglern lesen.

Bis zu welchem Tag das Training reichte, heißt der [Wissensstichtag](https://ki-einfach-verstehen.de/de/glossar/wissensstichtag/). Für die aktuellen Claude-Modelle nennt Anthropic Juni 2026 zweimal: als Zeitraum, in dem das Wissen am verlässlichsten ist, und als Stand der breiteren Trainingsdaten. Die Angabe steht in der Modellübersicht von Anthropic, abgerufen am 12. Oktober 2026.

![Zeitleiste: links das Training, rechts nach dem Wissensstichtag ein gestrichelter Bereich, unten ein Ereignis im September](../../public/bausteine/was-ein-chatbot-im-gespraech-weiss/stichtag.svg)

*Der Stichtag trennt, was im Training vorkam, von allem danach. Ein Ereignis aus dem September liegt nur als Text auf dem Tisch, wenn es geholt wird.*

Wissen, das sich nicht ändert, bleibt auch nach dem Stichtag brauchbar. Den Satz „Die Hauptstadt von Frankreich ist …“ ergänzt ein Modell aus den Gewichten, weil diese Angabe in vielen Texten steht und deshalb im Training vorkam. Ein Ereignis aus dem September 2026 fand dagegen erst nach einem Wissensstichtag im Juni statt. Der Chatbot kann davon also nur durch Text im Gespräch erfahren oder eine Antwort raten.

Eine flüssige Antwort verrät dabei nicht, woher sie stammt. Der Ton ist derselbe, ob die Angabe aus den Reglern, aus einer Suche oder aus dem Raten kommt.

## Was auf dem Tisch liegt: Vorgaben, Verlauf, Dokumente

Die einfachste Quelle ist der Kontext, den du siehst oder den die App hinzufügt. Dazu gehört die [Systemanweisung](https://ki-einfach-verstehen.de/de/glossar/systemanweisung/): die Vorgaben, die vor den Nachrichten des Gesprächs stehen. Du kennst sie aus dem Baustein [Vom Textfortsetzer zum Assistenten](./vom-textfortsetzer-zum-assistenten.md). Dazu gehört der bisherige Verlauf deines Chats und jedes Dokument, das du hochlädst.

Der Verlauf wirkt wie ein Gedächtnis, ist aber ein Stück Text. Bei jeder neuen Nachricht geht er erneut ins Modell, wie im Baustein über Tokens beschrieben. Anthropic beschreibt jede Runde so: Die Eingabe enthält den gesamten bisherigen Verlauf und die neue Nachricht. Wer über die Programmierschnittstelle schreibt, sieht das in jedem Aufruf.

Anthropic führt genau auf, was zum Kontextfenster gehört: die Systemanweisung, jede Nachricht mit Werkzeugergebnissen, Bildern und Dokumenten, die Werkzeugbeschreibungen und die Antwort selbst. Die Modellübersicht nennt für Claude Opus 5.5 ein Kontextfenster von 1 Million [Tokens](https://ki-einfach-verstehen.de/de/glossar/token/). Das klingt nach viel, aber alles teilt sich denselben Platz.

Ist die Eingabe allein zu lang, lehnt die Claude-API die Anfrage mit einem Fehler ab. Eine App kann deshalb vorher etwas weglassen oder kürzen.

Die Platte ist also das Kontextfenster, die Zettel darauf sind alles, was im Gespräch steht. Die Regler gehören nicht dazu.

## Werkzeuge bringen Zettel aus dem Archiv

Wenn du nach dem heutigen Wetter in Leipzig fragst, fehlt diese Angabe zunächst auf dem Tisch. Um sie zu beschaffen, kann der Chatbot [Werkzeuge](https://ki-einfach-verstehen.de/de/glossar/werkzeug/) nutzen. Das sind Funktionen, die ein Programm ausführt. Ihr Ergebnis wird als Text ins Gespräch eingefügt. Die bekanntesten sind die Websuche und die Suche in früheren Chats.

Bei der einfachen Websuche landet jedes Suchergebnis im Kontextfenster, auch wenn viel davon unwichtig ist. Mit dem sogenannten Dynamic Filtering gelangt nur relevanter Inhalt auf den Tisch. Relevant heißt aber nicht richtig.

Ein einmal abgerufener Zettel bleibt außerdem auf dem Tisch liegen. Anthropic schreibt, dass Suchergebnisse, die während eines Gesprächs abgerufen werden, auch in späteren Runden als Eingabe zählen. Sie kosten also weiter Platz.

Laut der Hilfe zu Claude nutzt die Suche in früheren Chats ein Verfahren namens [Retrieval-Augmented Generation](https://ki-einfach-verstehen.de/de/glossar/rag/), kurz RAG. Sie findet passende Abschnitte und legt sie auf den Tisch. Im Chat erscheint sie als Werkzeugaufruf. Inkognito-Chats durchsucht sie nicht.

Die Suche arbeitet wie eine Hilfskraft im Archiv: Sie bringt die Fundstücke zur Anfrage auf den Tisch. Was sie nicht findet, fehlt dort auch dem Modell. Wie verlässlich ein gefundener Zettel ist, hängt davon ab, von welcher Webseite er stammt.

> **Interaktive Demo:** [auf der Website ausprobieren](https://ki-einfach-verstehen.de/de/bausteine/was-ein-chatbot-im-gespraech-weiss/)

## Gespeicherte Notizen liegen außerhalb der Regler

Manche Chatbots speichern Angaben, damit sie in späteren Gesprächen wieder auftauchen. Claude legt beim Chatten Erinnerungen als einzelne Themen ab, statt Gespräche erst nach ihrem Ende zusammenzufassen.
Die Erinnerung liegt außerhalb der Regler. Wird sie geholt, liegt sie als Text auf dem Tisch, und die Regler ändern sich dadurch nicht.

![Auf der Platte liegt nur ein einzelnes leeres Blatt, rechts steht ein eigenes Regal mit einem geschlossenen Notizbuch](../../public/bausteine/was-ein-chatbot-im-gespraech-weiss/notizbuch.webp)

*Ein geschlossenes Notizbuch liegt auf einem Regal neben dem Tisch. Auf der Platte liegt nur ein einzelnes Blatt. Das Bild zeigt, dass eine Notiz außerhalb des Modells liegt, bis sie geholt wird; die Regler bleiben unverändert.*

Gespeicherte Notizen von Chat-Apps folgen diesem Muster. Ein Teil des Gedächtnisses liegt außerhalb des Modells, und nur der Ausschnitt, der gerade gebraucht wird, kommt auf den Tisch. Ob und wie eine App Notizen anlegt, entscheidet der Anbieter der App, nicht das Modell. Für dich heißt das: Eine Angabe, die ein Chatbot aus seiner Erinnerung nennt, ist nicht automatisch richtig. Sie ist nur so verlässlich wie die Notiz, und die kann veraltet oder falsch sein. Die Notiz bleibt im Notizbuch, bis die Anwendung sie holt; dann liegt sie als Zettel auf der Platte.

Bei der Programmierschnittstelle ist das genauer.

<details>
<summary>Eine Ebene tiefer: Wie die API einen Speicher einbindet</summary>

Das Memory-Werkzeug der Programmierschnittstelle läuft in der Anwendung, nicht im Modell. Claude fordert Dateioperationen an, etwa das Lesen oder Schreiben einer Datei. Die Anwendung führt sie aus und gibt das Ergebnis zurück. Beim Start eines Auftrags prüft Claude sein Speicherverzeichnis selbst, sodass ein früher abgelegter Eintrag dort wieder erscheint, solange die Anwendung ihn bereithält. Daraus folgt: Löscht die Anwendung eine Datei, ist sie beim nächsten Gespräch nicht mehr auf dem Tisch. Lernen im Sinne des Trainings findet dabei nicht statt: Die Gewichte bleiben gleich, nur der Inhalt des Speichers ändert sich. Für die Praxis heißt das: Was in diesem Speicher liegt, entscheidet die Anwendung, nicht das Modell.

</details>

Bei OpenAI wird jede Anfrage zur Textgenerierung für sich verarbeitet; frühere Anfragen gehören nicht automatisch dazu. Soll eine Antwort an die vorige anknüpfen, wird deren Kennung mitgeschickt. Dann kann der Verlauf beim Anbieter liegen. Unabhängig davon speichert OpenAI die Antworten standardmäßig 30 Tage lang. Diese Speicherung lässt sich abschalten.

Bei Anthropic schickt die App den Verlauf in jeder Anfrage mit. Gespeicherter Text beim Anbieter ist damit wieder ein Zettel: Er kommt auf den Tisch, wenn er gebraucht wird.

## Die Mitte langer Texte wird oft schwächer genutzt

Wenn alles auf dem Tisch liegt, nutzt das Modell dann jede Stelle gleich gut? Stell dir ein langes Dokument vor, in dessen Mitte eine wichtige Zahl steht.

Im großen Kontextfenster wird nicht jede Stelle gleich gut genutzt. Anthropic schreibt, mehr Kontext sei nicht automatisch besser. Mit wachsender Tokenzahl antwortet das Modell ungenauer und greift weniger zuverlässig auf frühere Angaben zurück. Anthropic nennt diesen Effekt context rot. Der Befund, dass die Mitte langer Eingaben besonders schwach genutzt wird, hat einen eigenen Namen: [Lost in the Middle](https://ki-einfach-verstehen.de/de/glossar/lost-in-the-middle/).

Besonders anschaulich ist ein Befund von Liu und Kollegen aus dem Jahr 2024. Sie stellten Sprachmodellen Fragen zu Dokumenten, bei denen die passende Angabe an unterschiedlichen Stellen stand. Die Leistung war oft am höchsten, wenn die Angabe am Anfang oder am Ende stand. Sie sank deutlich, wenn die Angabe in der Mitte langer Eingaben lag, auch bei Modellen, die für lange Kontexte gebaut sind.

![Drei Zonen für Anfang, Mitte und Ende: Anfang und Ende besser genutzt, die Mitte schlechter; schematisch](../../public/bausteine/was-ein-chatbot-im-gespraech-weiss/lage-im-fenster.svg)

*Lage im Fenster, schematisch: Angaben am Anfang und am Ende werden oft besser genutzt als die in der Mitte. Drei Zonen, schematisch ohne Messwerte; der Befund stammt von Liu et al. (2024).*

Weitere Studien aus den Jahren 2024 und 2025 zeigen ebenfalls, dass Modelle bei langen Eingaben oft unzuverlässiger arbeiten. Die genauen Zahlen stehen in der Vertiefung darunter. Untersucht wurden eigens eingerichtete Testsituationen, keine Alltagschats.

<details>
<summary>Eine Ebene tiefer: Zahlen aus den Studien</summary>

RULER testete 2024 17 Modelle für lange Eingaben. Bei 32.000 Tokens lieferte nur etwa die Hälfte zufriedenstellende Ergebnisse, obwohl alle ein Kontextfenster von mindestens dieser Größe angaben. NoLiMa testete 2025 13 Modelle. Bei 32.000 Tokens fielen 11 davon unter die Hälfte ihrer Leistung bei kurzen Kontexten. Dabei enthalten die Fragen und die gesuchten Angaben bewusst kaum dieselben Wörter, damit das Modell den Zusammenhang über die Bedeutung erkennen muss. Chroma Research testete im Juli 2025 18 Modelle; die Leistung wird mit wachsender Eingabelänge unzuverlässig, auch bei einfachen Aufgaben.

Die Zahlen gelten für die Modelle, die in den Studien getestet wurden. Sie zeigen, wie ein Modell unter diesen Bedingungen abschneidet, und sagen nichts Sicheres über deinen Chat. Wer die Zahlen nachlesen will, findet die Quellen hier: RULER unter arxiv.org/abs/2404.06654, NoLiMa unter arxiv.org/abs/2502.05167 und die Untersuchung von Chroma Research unter trychroma.com/research/context-rot. Alle drei Arbeiten messen, wie die Leistung mit zunehmender Eingabelänge nachlässt. Sie verwenden dafür unterschiedliche Aufgaben. Deshalb lohnt es sich, bei einer konkreten Frage die Angaben im Original nachzuschlagen.

</details>

Für deinen Chat heißt das: Ein hochgeladenes Dokument liegt vollständig auf dem Tisch. Eine Angabe in der Mitte wird trotzdem nicht unbedingt so verlässlich genutzt wie eine am Anfang. Bei Zahlen und Bedingungen lohnt deshalb der Blick ins Original.

## Was am Ende bleibt

Die Frage vom Anfang lässt sich jetzt beantworten. Die Angabe über deinen Garten kann nur aus Text stammen, der im Gespräch liegt, etwa aus dem Verlauf, einer Notiz oder einer Suche in früheren Chats. Sonst ist die Antwort geraten. Aus den Reglern kommt sie nicht.

Auf dem Tisch liegt alles als Eingabe, Text ebenso wie Bilder, und nicht jede Stelle wird gleich gut genutzt. Eine wichtige Angabe prüfst du am besten an ihrer Quelle: an der Webseite, der Notiz oder dem Dokument, aus dem sie stammt. Eine Antwort allein ist dafür kein Beleg.

**Übung: Woher kommt die Aussage?**

Das Gespräch ist ausgedacht. Ordne jede Aussage einer möglichen Quelle zu: Gewichte, Kontext (Vorgaben, Verlauf oder Dokument), Werkzeug oder gespeicherte Notiz.

1. „Die Hauptstadt von Frankreich ist Paris.“
2. „Gerade eben hast du geschrieben: Mein Balkon zeigt nach Süden.“
3. „Heute liegt die Temperatur in Leipzig bei 12 Grad, laut dem Wetterdienst.“
4. „Antworte kurz und auf Deutsch.“
5. „Auf Seite 3 steht die Frist 30. Juni.“

**Auflösung:**

1 stammt aus den Gewichten: Das ist stabiles Wissen, das im Training vorkam. 2 stammt aus dem Verlauf: deine eigene Nachricht liegt als Text auf dem Tisch. 3 stammt aus einem Werkzeug: Die Suche hat die Angabe gefunden und als Text auf den Tisch gelegt. Ob die Angabe des Wetterdienstes stimmt, ist damit noch nicht geprüft. 4 stammt aus dem Kontext: eine Anweisung, die als Text ins Gespräch kommt, etwa eine Systemanweisung oder deine Bitte. 5 stammt aus dem Kontext, aus einem angehängten Dokument.

Die Quelle sagt, woher ein Satz kommt, nicht ob er stimmt. Der Satz über die Frist ist nur so verlässlich wie das Dokument, das auf dem Tisch liegt.

---

Quelle: https://ki-einfach-verstehen.de/de/bausteine/was-ein-chatbot-im-gespraech-weiss/

← Zurück: [Warum KI überzeugend falsch liegt: Wenn Raten sich lohnt und Sicherheit im Ton nichts beweist](./warum-ki-ueberzeugend-falsch-liegt.md) · [Alle Bausteine](../../README.de.md#inhalt) · Weiter: [Vom Chatbot zum Agenten: Wie KI eine Aufgabe abarbeitet](./vom-chatbot-zum-agenten.md) →
