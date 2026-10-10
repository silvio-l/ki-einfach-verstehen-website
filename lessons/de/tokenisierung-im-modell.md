<!-- Generated from src/content/bausteine/de/tokenisierung-im-modell.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Tokenisierung im Modell: Wie dein Chat zu einer Tokenfolge wird

> Lesefassung für GitHub. Die vollständige Fassung mit interaktiven Demos, Animationen und Abrufmoment findest du auf der Website: **[Tokenisierung im Modell: Wie dein Chat zu einer Tokenfolge wird](https://ki-einfach-verstehen.de/de/bausteine/tokenisierung-im-modell/)**
>
> Lizenz: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.de) · Nenne die Quelle so: KI einfach verstehen, „Tokenisierung im Modell: Wie dein Chat zu einer Tokenfolge wird“, CC BY 4.0, https://ki-einfach-verstehen.de/de/bausteine/tokenisierung-im-modell/

Wie aus einem Chat mit Rollen eine einzige Tokenfolge wird, wozu Spezial-Tokens dienen und was alles ins Kontextfenster passen muss.

„Wie heißt die Hauptstadt von Frankreich?“ Sechs Wörter und ein Fragezeichen. Die Chat-App hat dem Modell vorher noch die Anweisung „Antworte kurz.“ mitgegeben. Schätz, bevor du weiterliest, wie viele [Tokens](https://ki-einfach-verstehen.de/de/glossar/token/) beim [Modell](https://ki-einfach-verstehen.de/de/glossar/modell/) ankommen, wenn du die Frage abschickst.

Aus dem ersten Baustein dieses Themenbereichs kennst du die erste Station auf dem Weg durchs Modell: Aus deiner Chatnachricht wird eine lange Folge von Tokens. Darin steht auch, wer was gesagt hat. Wie ein [Tokenizer](https://ki-einfach-verstehen.de/de/glossar/tokenizer/) Text in Stücke aus seinem [Vokabular](https://ki-einfach-verstehen.de/de/glossar/vokabular/) zerlegt und jedem Stück eine Nummer gibt, kennst du aus dem Baustein über [Token-IDs](./token-ids-und-vokabular.md).

## Dein Chat ist ein einziger langer Text

Im Chatfenster sieht ein Gespräch aus wie eine Reihe getrennter Sprechblasen. Naheliegend wäre, dass das Modell nur die neueste bekommt und die Rollen über getrennte Leitungen laufen. Beides stimmt nicht. Warum auch ältere Nachrichten mitgehen, zeigt der nächste Abschnitt. Gegen getrennte Leitungen spricht, was du aus dem Baustein über [Input und Output](./input-und-output.md) weißt: Ein [Sprachmodell](https://ki-einfach-verstehen.de/de/glossar/sprachmodell/) hängt Runde für Runde ein Stück an einen Text an. **Mehr als eine Folge von Tokens fortsetzen kann es nicht.** Also muss die Chat-App, das Programm um das Modell herum, das ganze Gespräch in eine einzige Folge verwandeln.

Dafür gehört zu jedem Chatmodell eine **[Chat-Vorlage](https://ki-einfach-verstehen.de/de/glossar/chat-vorlage/)**: ein festes Muster, das die Nachrichten samt ihrer Rolle hintereinandersetzt. Frei verfügbare Modelle bringen sie neben ihren gelernten [Parametern](https://ki-einfach-verstehen.de/de/glossar/parameter/) als kleine Begleitdatei mit. Übliche Rollen heißen „user“ für dich, „assistant“ für das Modell und „system“ für Anweisungen des Anbieters der Chat-App. Die **Systemnachricht** lautet im Beispiel „Antworte kurz.“, und meist bekommst du sie nicht zu sehen.

Llama 3.1 8B Instruct ist ein frei verfügbares Chatmodell der Firma Meta. Seine Vorlage macht aus dem Chat vom Anfang diesen Text:

```text
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

Cutting Knowledge Date: December 2023
Today Date: 26 Jul 2024

Antworte kurz.<|eot_id|><|start_header_id|>user<|end_header_id|>

Wie heißt die Hauptstadt von Frankreich?<|eot_id|><|start_header_id|>assistant<|end_header_id|>

```

Mit dem echten Tokenizer ausgezählt, sind das 50 Tokens. Nur 15 davon stammen aus dem Chat, also aus deiner Frage und der Systemnachricht. Die übrigen 35 hat die Vorlage hinzugefügt: Rollennamen, Zeilenumbrüche, die ebenfalls als Tokens zählen, zwei Zeilen mit Datumsangaben und mehrere Einträge in spitzen Klammern.

Diese Einträge in spitzen Klammern heißen **[Spezial-Tokens](https://ki-einfach-verstehen.de/de/glossar/spezial-token/)**, kurz Marken. Die Vorlage schreibt sie als Namen, und der Tokenizer macht aus jedem dieser Namen genau ein Token mit eigenem Eintrag im Vokabular. Ein solcher Eintrag steht für kein Textstück, er markiert die Struktur des Gesprächs. Damit verwandt ist das Stopp-Zeichen, das du aus dem Baustein über Input und Output kennst. Dieser unsichtbare Eintrag zeigt an, dass ein Text zu Ende ist. Allgemein heißt so eine Marke **Ende-Token**. Ein Gespräch braucht mehr solcher Marken, denn es hat Rollen und mehrere Redebeiträge.

![Animation: wie aus einem Chat eine Tokenfolge wird](../../public/bausteine/tokenisierung-im-modell/chat-wird-folge.static.svg)

[▶ Animation auf der Website ansehen](https://ki-einfach-verstehen.de/de/bausteine/tokenisierung-im-modell/)

*Aus zwei Nachrichten mit Rollen wird bei Llama 3.1 eine einzige Folge aus 50 Tokens, die mit einem offenen Kopf für die Antwort endet.*

![Ein Güterzug aus vielen petrolfarbenen Waggons mit zwei bernsteinfarbenen Waggons dazwischen fährt in einer Kurve auf einen Prellbock am Gleisende zu](../../public/bausteine/tokenisierung-im-modell/zug.png)

*Die Tokenfolge als Güterzug: gewöhnliche Waggons für Textstücke, andersfarbige Markierungswaggons für Spezial-Tokens. Der Prellbock am Gleisende steht für die Längengrenze, um die es weiter unten geht.*

Die fertige Folge ist wie ein langer Güterzug. Jeder Waggon ist ein Token. Andersfarbige Markierungswaggons zeigen an, wo ein Rollenname steht und wo eine Nachricht endet. Die Vorlage stellt den Zug für jede Anfrage neu zusammen, nach einem Muster, das zum Modell gehört. Das Bild hat zwei Grenzen. Ein Waggon hat keine Ladung, die etwas bedeutet, nur eine Nummer an der Seite: seine [Token-ID](https://ki-einfach-verstehen.de/de/glossar/token-id/) im Vokabular. Und die Markierungen wirken nur, weil das Modell im Training sehr viele Züge mit genau diesen Markierungen gesehen hat.

## Text, den du nie geschrieben hast

Zwei Zeilen der Llama-Folge stammen weder von dir noch von der Chat-App: „Cutting Knowledge Date: December 2023“ und „Today Date: 26 Jul 2024“. Diesen **Zusatztext** fügt die Vorlage von sich aus ein. Die erste Zeile nennt den Wissensstand, denn die Texte, mit denen das Modell zuerst trainiert wurde, reichen nur bis Dezember 2023. Das zweite Datum ist voreingestellt und gilt, solange die Chat-App kein aktuelles mitgibt. Du siehst diese Zeilen nie, das Modell liest sie bei jeder Anfrage mit.

Wie viel Zusatz dazukommt, hängt vom Modell ab. Bei vier frei verfügbaren Modellen fügt die offizielle Vorlage zwischen 10 und 74 Tokens hinzu. Der Teil aus dem Chat bleibt fast gleich; ganz gleich lang ist er nicht, weil jedes Modell seinen eigenen Tokenizer hat.

![Gestapeltes Balkendiagramm, je Modell aus dem Chat und von der Vorlage: Gemma 3 1B 12 plus 10 gleich 22 Tokens, keine Systemrolle; Qwen3-8B 14 plus 13 gleich 27, schlichte Rollenmarken; Llama 3.1 8B 15 plus 35 gleich 50, fügt zwei Datumszeilen ein; gpt-oss-20b 12 plus 74 gleich 86, setzt eigenen Zusatztext davor](../../public/bausteine/tokenisierung-im-modell/vier-vorlagen.svg)

*Derselbe Chat, vier Chat-Vorlagen: Der Teil aus dem Chat bleibt fast gleich, der Zusatz der Vorlage reicht von 10 bis 74 Tokens (ausgezählt am 6. Oktober 2026).*

Die längste Vorlage gehört zu gpt-oss. So heißen frei verfügbare Modelle von OpenAI, der Firma hinter ChatGPT. Sie setzt eigenen Zusatztext mit Datum und Wissensstand an den Anfang, noch vor die Systemnachricht des App-Anbieters. Auch ihre Marken sehen anders aus als bei Llama: Jede Nachricht beginnt mit `<|start|>` und endet mit `<|end|>`.

> **Interaktive Demo:** [auf der Website ausprobieren](https://ki-einfach-verstehen.de/de/bausteine/tokenisierung-im-modell/)

Schreibst du nach der Antwort „Paris.“ noch „Und von Italien?“, schickt die Chat-App nicht nur diese Frage ab. Die Llama-Vorlage baut den ganzen Zug neu: Systemnachricht, erste Frage, alte Antwort, neue Frage, jeweils mit Markierungen dazwischen. Ins Modell gehen jetzt 67 Tokens, 17 mehr als beim ersten Mal: die alte Antwort, deine neue Frage und ihre Markierungen. Der bisherige Verlauf geht jedes Mal wieder als Input mit, denn das Modell merkt sich zwischen deinen Nachrichten nichts. **Was eine Anfrage kostet, hängt deshalb nicht nur davon ab, was du tippst.** Wird pro Token abgerechnet, bezahlst du Zusatztext, Marken und Verlauf in jeder Runde mit.

## Markierungswaggons: woran das Modell Rollen und Enden erkennt

![Flagge](../../public/bausteine/tokenisierung-im-modell/flagge.svg)

*Spezial-Tokens markieren, wo ein Redebeitrag beginnt und wo er endet.*

Woher weiß das Modell, dass es die Systemnachricht anders behandeln soll als deine Frage? An festen Marken. In der Llama-Folge steht `<|begin_of_text|>` ganz vorn. `<|start_header_id|>` und `<|end_header_id|>` schließen einen Rollennamen ein, also „system“, „user“ oder „assistant“; zusammen bilden die drei den Kopf einer Nachricht. `<|eot_id|>` beendet einen Redebeitrag, der Name steht für „end of turn“.

Was diese Marken bedeuten, weiß das Modell aus dem Training. Nach dem **Grundtraining** mit gewöhnlichem Text wird ein Chatbot mit Beispielen nachtrainiert, damit er wie ein hilfreicher Assistent antwortet. Diese Beispielgespräche stehen in genau diesem Format, mit genau diesen Marken. Das Modell hat also gelernt, wie es nach einem Kopf mit „system“, „user“ oder „assistant“ weitergeht. Ein Modell, das nur das Grundtraining hinter sich hat, heißt **Grundmodell**.

Am Ende der Folge steht ein offener Kopf für die Rolle „assistant“, hinter dem noch nichts kommt. Was passiert, wenn dieser Kopf fehlt? Überleg kurz, bevor du weiterliest. Dann fehlt das Signal, wer als Nächstes spricht. Das Modell könnte zum Beispiel deine Nachricht weiterschreiben, statt sie zu beantworten. Davor warnt die Anleitung zu Chat-Vorlagen von Hugging Face, einer Plattform, über die viele frei verfügbare Modelle verteilt werden.

Wann eine Antwort fertig ist, entscheidet ebenfalls ein Spezial-Token. Erinnere dich an die Textschleife: In jeder Runde gibt das Modell eine Score-Liste aus, mit einem Score für jeden Eintrag des Vokabulars, und ein Auswahlschritt wählt daraus ein Stück, das hinten angehängt wird. Auch `<|eot_id|>` ist so ein Eintrag mit eigenem Score. In den Gesprächen des Nachtrainings stand es am Ende jeder Antwort, deshalb bekommt es einen hohen Score, wenn eine Antwort fertig wirkt. Die Chat-App achtet auf genau diese Nummer. Wählt der Auswahlschritt diese Nummer, hört die Chat-App auf, spätestens aber an einer eingestellten Längengrenze. **Das Ende setzt also die Chat-App, nicht das Modell.**

Llama 3.1 gibt es als Grundmodell und als Chatmodell. Für dieses Beispiel kommt es auf zwei ihrer Ende-Tokens an: Das Grundmodell beendet einen Text mit `<|end_of_text|>`, das Chatmodell eine Antwort mit `<|eot_id|>`. Wartet ein Programm beim Chatmodell auf das falsche Ende-Token, hört es nicht auf. Das Modell schreibt dann über seine Antwort hinaus weiter, etwa einen erfundenen nächsten Redebeitrag, bis die Längengrenze greift.

Weil die Marken nur durch das Training wirken, schadet auch eine fremde Vorlage. Angenommen, ein Programm schickt einem Llama-Modell die Marken von gpt-oss. Für `<|start|>` hat das Llama-Vokabular keinen Spezial-Eintrag. Mit dem Llama-Tokenizer nachgezählt, zerfällt die Zeichenfolge in fünf gewöhnliche Stücke: `<`, `|`, `start`, `|` und `>`. Statt eines Markierungswaggons hängen dann fünf normale Waggons im Zug, und die Folge sieht nicht mehr aus wie die Gespräche aus dem Training. Hugging Face warnt, mit falschen Marken arbeiteten Chatmodelle drastisch schlechter. OpenAI schreibt zu gpt-oss, die Modelle funktionierten nur mit ihrem eigenen Format korrekt.

## Das Kontextfenster ist ein Budget

Beliebig lang darf der Zug nicht werden. Im Baustein über den Tokenizer hieß diese Grenze [Kontextfenster](https://ki-einfach-verstehen.de/de/glossar/kontextfenster/): die Höchstzahl an Tokens, die ein Modell auf einmal verarbeiten kann. Im Zugbild ist sie der Prellbock am Gleisende. Bei Llama 3.1 fasst das Fenster bis zu 128.000 Tokens, bei den größten heutigen Modellen rund eine Million.

Viele nehmen an, in dieses Fenster müsse nur passen, was du eintippst, denn die Antwort entsteht ja erst danach. Doch die Antwort entsteht in der Textschleife: Jedes gewählte Stück wird hinten angehängt und ist in der nächsten Runde Teil des Inputs. Deshalb **zählt alles**. So beschreiben es OpenAI und Anthropic, die Firma hinter dem Chatbot Claude. Dazu gehören die Systemnachricht und der Zusatztext der Vorlage. Auch die Beschreibungen von Werkzeugen, also Funktionen, die das Modell aufrufen kann, etwa einer Websuche, die die Chat-App für das Modell bereithält, und deren Ergebnisse zählen mit. Angehängte Dokumente, der Verlauf, deine neue Nachricht und die Antwort selbst zählen ebenfalls mit.

Bei Modellen, die vor der Antwort „nachdenken“, kommen die **Denk-Tokens** hinzu: Zwischenschritte, die das Modell als Tokens schreibt, bevor die eigentliche Antwort beginnt. Du siehst sie oft nicht, aber sie belegen Platz.

![Ein Balken für ein Kontextfenster mit 100.000 Tokens: Systemnachricht, Vorlage und Werkzeuge 3.000, bisheriger Verlauf 87.000, deine neue Nachricht 2.000, frei für Denken und Antwort 8.000](../../public/bausteine/tokenisierung-im-modell/kontextfenster-budget.svg)

*Ein erfundenes Beispiel: Wenn Systemnachricht, Vorlage, Werkzeuge, Verlauf und neue Nachricht 92.000 von 100.000 Tokens belegen, bleiben für Denken und Antwort zusammen nur 8.000.*

Angenommen, das Fenster deines Modells fasst 100.000 Tokens, und du chattest schon lange. Systemnachricht, Zusatztext, Werkzeuge, Verlauf und deine neue Frage belegen zusammen 92.000. Was passiert, wenn das Modell für eine gründliche Antwort 12.000 Tokens bräuchte? Überleg kurz. Es hat nur 8.000, und davon gehen noch die Denk-Tokens ab. Erreicht das Modell beim Schreiben die Grenze, bricht die Antwort unvollständig ab. Hier endet das Zugbild: Ein echter Güterzug fährt fertig zusammengestellt ab, der Zug aus Tokens wächst beim Antworten hinten weiter, bis zum Ende-Token oder bis zum Prellbock.

Ist schon die Eingabe zu lang, lehnt etwa Anthropic die Anfrage mit der Meldung „prompt is too long“ ab. Chat-Anwendungen schaffen deshalb vorher Platz. Laut Anthropic kann claude.ai die ältesten Teile eines Gesprächs schrittweise herausfallen lassen. Wenn ein Chatbot in einem langen Gespräch auf den Anfang nicht mehr eingeht, kann es daran liegen, dass dieser Teil im Zug nicht mehr mitfährt.

## Am Ende steht eine Folge von Nummern

Aus sechs Wörtern, einem Fragezeichen und einer kurzen Anweisung sind bei Llama 3.1 also 50 Tokens geworden, bei gpt-oss 86. Nach einer Folgefrage sind es noch mehr, und jede Antwort muss in dasselbe Fenster passen.

Beim Modell kommt ein Zug an, dessen Waggons nur ihre Nummer an der Seite tragen. Mit einer Nummer allein lässt sich nichts Sinnvolles rechnen. Dass „Paris“ und „Frankreich“ zusammengehören, steht in keiner Nummer. Wie das Modell aus jeder Nummer etwas macht, womit es rechnen kann, zeigt der nächste Baustein.

---

Quelle: https://ki-einfach-verstehen.de/de/bausteine/tokenisierung-im-modell/

← Zurück: [Was ein KI-Modell eigentlich ist](./was-ein-ki-modell-eigentlich-ist.md) · [Alle Bausteine](../../README.de.md#inhalt) · Weiter: [Embeddings: wie aus einer Nummer ein gelernter Vektor wird](./embeddings.md) →
