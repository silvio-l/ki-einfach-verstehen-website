[English](README.md) · **Deutsch**

<!-- TODO(demo-gif): Banner durch ein kurzes GIF einer Live-Demo (z. B. Tokenizer) ersetzen, sobald eines aufgenommen ist. -->
<p align="center">
  <a href="https://ki-einfach-verstehen.de/de/">
    <img src="public/og-image-de.png" alt="KI einfach verstehen: KI verständlich erklärt, ohne an der Oberfläche stehen zu bleiben" width="720">
  </a>
</p>

# KI einfach verstehen: Verstehen statt nur bedienen

Ein kostenloser Kurs, der dir zeigt, was in modernen KI-Modellen passiert,
vom einfachen Spamfilter bis zum Sprachmodell hinter einem Chatbot. Kurze
Bausteine bauen aufeinander auf, mit Grafiken, Animationen und interaktiven
Demos zum Ausprobieren. Du brauchst kein technisches Vorwissen, und trotzdem wird
nichts weggelassen.

- **Schritt für Schritt:** Bausteine in fester Reihenfolge, jeder baut nur auf dem auf, was schon erklärt ist.
- **Zweisprachig:** jeder Baustein auf Deutsch und Englisch.
- **Selbst prüfen:** ein paar Abrufmomente am Ende jedes Bausteins, ohne
  Anmeldung, dein Fortschritt bleibt in deinem Browser.
- **Offen:** Inhalte unter CC BY 4.0, Code unter MIT. Du darfst die Grafiken
  in Folien, Unterricht und Artikeln verwenden.

**Direkt loslesen:** [ki-einfach-verstehen.de](https://ki-einfach-verstehen.de/de/)
oder die Markdown-Fassungen hier im Repo.

> ⭐ **Setz einen Stern als Lesezeichen.** Neue Bausteine erscheinen hier,
> so findest du zurück, wenn der nächste fertig ist.

## Inhalt

<!-- Die Liste unten erzeugt `pnpm gen:lessons` (scripts/export-lessons.mjs). Bearbeite die Content-Collections, nicht diese Liste. -->
<!-- lessons-toc:start -->
### 1. [Grundlagen](https://ki-einfach-verstehen.de/de/themenbereich/grundlagen/)

Die Begriffe, auf denen alles aufbaut — du klärst, was Programm und Modell unterscheidet und was hinter Wahrscheinlichkeiten, Vektoren, Hardware und neuronalen Netzen steckt.

1. **Programm, Algorithmus, Modell im Vergleich**  
   Programm, Algorithmus und KI-Modell auseinanderhalten: warum ein Modell nicht aus aufgeschriebenen Regeln besteht, sondern aus Zahlen, die beim Training eingestellt werden.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/programm-algorithmus-modell/) · [Markdown](lessons/de/programm-algorithmus-modell.md)
2. **Input und Output: Was eine Funktion tut**  
   Was bekommt ein KI-Modell, und was gibt es zurück? Vom Spamfilter über die Bilderkennung bis zum Chatbot: warum der Output meist eine Liste von Bewertungen ist und wie daraus Stück für Stück eine Antwort wird.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/input-und-output/) · [Markdown](lessons/de/input-und-output.md)
3. **Tokenizer: Wie Sprache zu Zahlen wird**  
   Zeigt, wie ein Tokenizer Text in wiederverwendbare Stücke zerlegt, über ein festes Vokabular nummeriert und daraus den Zahlen-Input eines Sprachmodells macht.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/tokenizer-ids-vokabular/) · [Markdown](lessons/de/tokenizer-ids-vokabular.md)
4. **Skalar, Vektor, Matrix, Tensor: die Bausteine der Zahlen**  
   Von der Wetter-App zum Chatbot: wie eine Zahl, eine Liste, eine Tabelle und ein Stapel von Tabellen zusammenhängen und warum deine Chatnachricht und dein Foto für ein Modell genau solche Zahlenblöcke sind.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/skalar-vektor-matrix-tensor/) · [Markdown](lessons/de/skalar-vektor-matrix-tensor.md)
5. **Wahrscheinlichkeit und Softmax: Wie ein Modell sich entscheidet**  
   Wie ein Sprachmodell aus seinen Scores Prozente macht, warum es mal das Naheliegende und mal etwas anderes wählt und was die Temperatur damit zu tun hat.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/wahrscheinlichkeit-und-softmax/) · [Markdown](lessons/de/wahrscheinlichkeit-und-softmax.md)
6. **Parameter, Training und Inferenz, Hardware: Wie ein Modell läuft**  
   Was in einem fertigen KI-Modell steckt, was Menschen vor dem Training festlegen, warum Lernen so viel teurer ist als Benutzen und welche Hardware ein Modell braucht.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/parameter-training-inferenz-hardware/) · [Markdown](lessons/de/parameter-training-inferenz-hardware.md)
7. Neuronale Netze: Wie aus vielen kleinen Rechnungen ein Modell wird *(in Vorbereitung)*

### 2. [Der Weg durchs Modell](https://ki-einfach-verstehen.de/de/themenbereich/weg-durchs-modell/)

Ein Prompt geht hinein, ein Token kommt heraus — du folgst Schritt für Schritt allem, was dazwischen passiert.

1. **Was ein KI-Modell eigentlich ist**  
   Warum ein KI-Modell keine Datenbank voller Fakten ist, wie Wissen in seinen Zahlen verteilt steckt und warum daraus kluge Antworten und erfundene Fakten entstehen.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/was-ein-ki-modell-eigentlich-ist/) · [Markdown](lessons/de/was-ein-ki-modell-eigentlich-ist.md)
2. Tokenisierung im Modell: Sequenzen, Spezialtokens, Kontextfenster *(in Vorbereitung)*
3. **Embeddings: wie aus einer Nummer ein bedeutungsvoller Vektor wird**  
   Warum eine Token-ID dem Modell nichts über Bedeutung verrät, wie im Training aus Zufallszahlen ähnliche Steckbriefe für ähnlich verwendete Tokens werden und wozu das Modell zusätzlich den Platz im Satz braucht.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/embeddings/) · [Markdown](lessons/de/embeddings.md)
4. Transformerblöcke und Attention: Wie Kontext eingemischt wird *(in Vorbereitung)*
5. **Output Head: Vom letzten Zustand zur Vorhersage**  
   Wie ein Sprachmodell aus seinem letzten Zustand einen Score für jedes Token berechnet, warum dabei nur die letzte Position zählt und wie so eine Antwort entsteht.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/output-head/) · [Markdown](lessons/de/output-head.md)

### 3. [Wie Lernen funktioniert](https://ki-einfach-verstehen.de/de/themenbereich/wie-lernen-funktioniert/)

Warum ein Modell besser wird: wie es Fehler misst, Verbesserungen rückwärts durch seine Rechenschritte verfolgt und seine Gewichte schrittweise ändert.

1. Aus Text werden viele Übungsaufgaben *(in Vorbereitung)*
2. Forward Pass und Loss: Wie das Modell seinen eigenen Fehler misst *(in Vorbereitung)*
3. Backpropagation und Gradienten: Wie das Modell weiß, was es ändern muss *(in Vorbereitung)*
4. Optimierung: Wer die Gewichte tatsächlich ändert *(in Vorbereitung)*
5. Batch, Epoch, Step, Tokenbudget: Wie man Trainingsfortschritt misst *(in Vorbereitung)*

### 4. [Vom Modell zum Assistenten](https://ki-einfach-verstehen.de/de/themenbereich/vom-modell-zum-assistenten/)

Was aus einem Sprachmodell einen Chat-Assistenten macht — warum er überzeugend falsch liegen kann, was er in einem Gespräch wirklich weiß und wie du seine Antworten prüfst.

1. Vom Textfortsetzer zum Assistenten *(in Vorbereitung)*
2. Warum KI überzeugend falsch liegt *(in Vorbereitung)*
3. Was ein Chatbot in einem Gespräch weiß *(in Vorbereitung)*
4. Versteht KI, was sie sagt? *(in Vorbereitung)*
5. Antworten prüfen: KI im Alltag sicher nutzen *(in Vorbereitung)*

Alle Fachbegriffe kurz erklärt: **[Glossar](https://ki-einfach-verstehen.de/de/glossar/)**
<!-- lessons-toc:end -->

Jeden Baustein gibt es zweimal: die **Website**-Fassung mit interaktiven
Demos, Animationen und Abrufmomenten und eine **Markdown**-Fassung in
[`lessons/`](lessons/), die sich auf GitHub, offline oder in deinen eigenen
Notizen gut liest.

## Mitmachen

Du hast einen Fehler, eine unverständliche Stelle oder eine fehlende Quelle
gefunden? Genau das hilft am meisten. Lies bitte [CONTRIBUTING.md](CONTRIBUTING.md#deutsch):
Am Anfang steht ein Issue, kein Pull Request, denn dieses Repository ist ein
generierter Spiegel. Fragen zu den Inhalten stellst du am besten im
[Community-Forum](https://community.ki-einfach-verstehen.de).

## Lizenz

- **Inhalte** (Bausteintexte, Glossar, Grafiken, Illustrationen, Animationen,
  `lessons/`): [CC BY 4.0](LICENSE-CONTENT.md). Nenne die Quelle so:
  `KI einfach verstehen, <Titel>, CC BY 4.0, <URL>`.
- **Code** (Komponenten, Skripte, Styles): [MIT](LICENSE).

Ausgenommen sind Schriften, Logo und Merch-Designs, siehe
[LICENSE-CONTENT.md](LICENSE-CONTENT.md). Eingebundener Fremdcode behält
seine eigene Lizenz: `src/vendor/qrcodegen.js` ist der
[QR Code generator](https://www.nayuki.io/page/qr-code-generator-library)
von Project Nayuki (MIT, Hinweis in der Datei).

## Über dieses Repository

Hier liegt der Quellcode der Website, gebaut mit [Astro](https://astro.build).
Er wird aus einem privaten Projekt-Repository gespiegelt, in dem auch E-Book
und Videoskripte liegen; nur die Website ist Open Source.

```sh
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # statische Website in dist/
pnpm lint         # Inhaltsprüfungen und Tests
pnpm gen:lessons  # lessons/ und das Inhaltsverzeichnis neu erzeugen
```

Voraussetzung: Node.js 22.12 oder neuer und pnpm.
