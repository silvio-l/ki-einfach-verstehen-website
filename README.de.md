[English](README.md) · **Deutsch**

<!-- TODO(demo-gif): Banner durch ein kurzes GIF einer Live-Demo (z. B. Tokenizer) ersetzen, sobald eines aufgenommen ist. -->
<p align="center">
  <a href="https://ki-einfach-verstehen.de/de/">
    <img src="public/og-image-de.jpg" alt="KI einfach verstehen: KI verständlich erklärt, ohne an der Oberfläche stehen zu bleiben" width="720">
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

Die Begriffe, auf denen alles aufbaut: was Programm und Modell trennt und was hinter Wahrscheinlichkeiten, Vektoren, Hardware und neuronalen Netzen steckt.

1. **Programm, Algorithmus, Modell im Vergleich**  
   Wie unterscheiden sich Programm, Algorithmus und Modell? Klassische Software folgt Regeln, die ein Mensch aufschreibt. Ein KI-Modell besteht aus einem festen Rechenweg und Zahlen, die im Training eingestellt wurden.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/programm-algorithmus-modell/) · [Markdown](lessons/de/programm-algorithmus-modell.md)
2. **Input und Output: Was ein Modell aus einer Eingabe macht**  
   Was bekommt ein KI-Modell hinein, und was kommt heraus? Vom Spamfilter bis zum Chatbot: Oft kommt eine Liste von Bewertungen heraus.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/input-und-output/) · [Markdown](lessons/de/input-und-output.md)
3. **Tokenizer: Wie Text in Tokens zerfällt**  
   Zeigt, wie ein Tokenizer Text in Stücke zerlegt, die er vorher durch Zählen gelernt hat, und warum die Zahl der Tokens nicht die Zahl der Wörter ist.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/tokenizer-ids-vokabular/) · [Markdown](lessons/de/tokenizer-ids-vokabular.md)
4. **Token-IDs: Was eine Nummer bedeutet**  
   Zeigt, was eine Token-ID ist: eine Nummer, die nur im Vokabular ihres Tokenizers gilt. Außerdem erklärt der Baustein, warum jedes Modell genau zu dem Tokenizer passt, mit dem es trainiert wurde, und warum die Nummer selbst nichts über das Stück verrät.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/token-ids-und-vokabular/) · [Markdown](lessons/de/token-ids-und-vokabular.md)
5. **Skalar, Vektor, Matrix, Tensor: die Bausteine der Zahlen**  
   Von der Wetter-App zum Chatbot: wie Zahl, Liste, Tabelle und Tabellenstapel zusammenhängen und warum dein Chat für ein Modell genau so ein Zahlenblock ist.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/skalar-vektor-matrix-tensor/) · [Markdown](lessons/de/skalar-vektor-matrix-tensor.md)
6. **Wahrscheinlichkeit und Softmax: Wie ein Modell sich entscheidet**  
   Wie ein Sprachmodell aus seinen Scores Anteile macht, warum es mal das Naheliegende und mal etwas anderes wählt und was die Temperatur daran ändert.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/wahrscheinlichkeit-und-softmax/) · [Markdown](lessons/de/wahrscheinlichkeit-und-softmax.md)
7. **Parameter, Training und Benutzen: Wie ein Modell lernt**  
   Was in einer Modelldatei steckt, was Menschen vor dem Training festlegen, wie das Training aus dem Fehler ableitet, in welche Richtung jeder Regler bewegt werden muss und warum Lernen teurer ist als Benutzen.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/parameter-training-inferenz-hardware/) · [Markdown](lessons/de/parameter-training-inferenz-hardware.md)
8. **Modellgröße und Hardware: Wo ein Modell Platz findet**  
   Wie viel Speicher ein KI-Modell braucht, warum zuerst der Platz und nicht das Tempo entscheidet, wie Quantisierung Modelle verkleinert und warum Training noch viel mehr Speicher braucht.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/modellgroesse-und-hardware/) · [Markdown](lessons/de/modellgroesse-und-hardware.md)
9. **Das künstliche Neuron: Wie aus einer Summe eine Ausgabe wird**  
   Was ein künstliches Neuron ausrechnet: Gewichte, Grundregler und Untergrenze. Mit dem Spamfilter aus dem ersten Baustein lässt sich alles von Hand nachrechnen.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/kuenstliches-neuron/) · [Markdown](lessons/de/kuenstliches-neuron.md)

### 2. [Der Weg durchs Modell](https://ki-einfach-verstehen.de/de/themenbereich/weg-durchs-modell/)

Ein Prompt geht hinein, ein Token kommt heraus — du folgst Schritt für Schritt allem, was dazwischen passiert.

1. **Was ein KI-Modell eigentlich ist**  
   Was ist ein KI-Modell? Keine Datenbank voller Fakten, sondern Milliarden Zahlen, in denen Wissen verteilt steckt. Daraus entstehen Antworten und Erfindungen.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/was-ein-ki-modell-eigentlich-ist/) · [Markdown](lessons/de/was-ein-ki-modell-eigentlich-ist.md)
2. **Schichten: Wie aus vielen Neuronen ein Netz wird**  
   Viele Neuronen rechnen mit denselben Zahlen, und ihre Ausgaben werden zu den Eingaben der nächsten Schicht. Warum die Untergrenze einen Gipfel möglich macht, den zwei Schichten ohne sie nicht bilden, und was eine Angabe wie „96 Schichten“ meint.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/schichten/) · [Markdown](lessons/de/schichten.md)
3. **Tokenisierung im Modell: Wie dein Chat zu einer Tokenfolge wird**  
   Wie aus einem Chat mit Rollen eine einzige Tokenfolge wird, wozu Spezial-Tokens dienen und was alles ins Kontextfenster passen muss.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/tokenisierung-im-modell/) · [Markdown](lessons/de/tokenisierung-im-modell.md)
4. **Embeddings: wie aus einer Nummer ein gelernter Vektor wird**  
   Warum eine Token-ID nichts über Ähnlichkeit verrät, wie im Training aus Zufallszahlen ähnliche Steckbriefe für ähnlich verwendete Tokens werden und was ein großes Vokabular kostet.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/embeddings/) · [Markdown](lessons/de/embeddings.md)
5. **Transformerblöcke und Attention: Wie Kontext eingemischt wird**  
   Wie ein Sprachmodell die Information früherer Wörter in jedes Token einmischt, warum es nicht nach vorne schauen darf und wie viele Blöcke dabei arbeiten.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/transformerbloecke-und-attention/) · [Markdown](lessons/de/transformerbloecke-und-attention.md)
6. **Output Head: Vom letzten Zustand zur Vorhersage**  
   Wie ein Sprachmodell aus seinem letzten Zustand einen Score für jedes Token berechnet und warum dabei nur die letzte Position zählt.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/output-head/) · [Markdown](lessons/de/output-head.md)

### 3. [Wie Lernen funktioniert](https://ki-einfach-verstehen.de/de/themenbereich/wie-lernen-funktioniert/)

Wie lernt eine KI? Sie misst ihren Fehler, verfolgt Verbesserungen rückwärts durch ihre Rechenschritte und ändert ihre Gewichte Schritt für Schritt.

1. **Aus Text werden viele Übungsaufgaben**  
   Warum für das Training eines Sprachmodells niemand Lösungen aufschreibt, wie aus vielen Texten Folgen fester Länge werden und welcher Text überhaupt hineinkommt.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/aus-text-werden-uebungsaufgaben/) · [Markdown](lessons/de/aus-text-werden-uebungsaufgaben.md)
2. **Forward Pass und Loss: Wie das Modell seinen eigenen Fehler misst**  
   Wie aus den Prozenten eines Sprachmodells für das tatsächlich folgende Token Strafpunkte werden, wie daraus eine einzige Zahl für einen ganzen Stapel Text entsteht und was diese Zahl nicht misst.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/forward-pass-und-loss/) · [Markdown](lessons/de/forward-pass-und-loss.md)
3. **Backpropagation und Gradienten: Wie das Modell weiß, was es ändern muss**  
   Wie das Training aus einer einzigen Fehlerzahl für jeden Regler Richtung und Stärke ausrechnet, warum dafür ein Rückweg durch das Modell genügt und warum dabei noch kein Regler bewegt wird.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/backpropagation-und-gradienten/) · [Markdown](lessons/de/backpropagation-und-gradienten.md)
4. **Optimierung: Wer die Gewichte tatsächlich ändert**  
   Wie der Optimierer aus den Zetteln der Backpropagation echte Schritte macht: mit Schwung, mit einer eigenen Schrittweite für jeden Regler, mit einem leisen Zug Richtung null und nach einem Plan für die Lernrate.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/optimierung-der-gewichte/) · [Markdown](lessons/de/optimierung-der-gewichte.md)
5. **Batch, Epoch, Step, Tokenbudget: Wie man Trainingsfortschritt misst**  
   Wie man ein Training in Schritten und Tokens zählt, warum ein Sprachmodell wie GPT-3 manche Quellen nicht einmal halb und andere mehrfach sieht, woran ein zurückgehaltener Prüftext echtes Lernen erkennt und wie viel Text auf wie viele Regler kommt.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/batch-epoch-step-tokenbudget/) · [Markdown](lessons/de/batch-epoch-step-tokenbudget.md)

### 4. [Vom Modell zum Assistenten](https://ki-einfach-verstehen.de/de/themenbereich/vom-modell-zum-assistenten/)

Was aus einem Sprachmodell einen Chat-Assistenten macht, warum er überzeugend falsch liegen kann und wie du seine Antworten prüfst.

1. **Warum Vorhersagen mehr ist als Nachplappern**  
   Wie ein Modell, das nur das nächste Token vorhersagt, eine Mail schreiben kann, die es so noch nie gab: warum gute Vorhersage Regeln statt Kopien verlangt, wo wörtliches Auswendiglernen trotzdem vorkommt und wo neue Aufgaben scheitern.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/warum-vorhersagen-mehr-ist-als-nachplappern/) · [Markdown](lessons/de/warum-vorhersagen-mehr-ist-als-nachplappern.md)
2. **Vom Textfortsetzer zum Assistenten: Was das Nachtraining aus einem Modell macht**  
   Warum ein Grundmodell Fragen fortsetzt statt sie zu beantworten, was das Nachtraining ändert und woher ein Chatbot sein Datum und seine Vorgaben hat.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/vom-textfortsetzer-zum-assistenten/) · [Markdown](lessons/de/vom-textfortsetzer-zum-assistenten.md)
3. **Wie ein Modell „nachdenkt“: Zwischenschritte, die es selbst schreibt**  
   Warum ein Modell vor der Antwort Zwischenschritte als Text schreibt, warum das manche Aufgaben lösbar macht und wer festlegt, ob und wie lange es denkt.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/wie-ein-modell-nachdenkt/) · [Markdown](lessons/de/wie-ein-modell-nachdenkt.md)
4. **Warum KI überzeugend falsch liegt: Wenn Raten sich lohnt und Sicherheit im Ton nichts beweist**  
   Warum ein Chatbot lieber eine falsche Antwort gibt als „weiß ich nicht“, warum Nachfragen ihn oft umstimmen und warum erfundene Quellen echt aussehen.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/warum-ki-ueberzeugend-falsch-liegt/) · [Markdown](lessons/de/warum-ki-ueberzeugend-falsch-liegt.md)
5. **Was ein Chatbot in einem Gespräch weiß: Vier Quellen, ein Kontextfenster**  
   Woher kommen Antworten im Chat? Aus den im Training eingestellten Reglern, dem Text im Kontextfenster, Werkzeugen oder gespeicherten Notizen. Davon hängt ab, wie verlässlich eine Antwort ist.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/was-ein-chatbot-im-gespraech-weiss/) · [Markdown](lessons/de/was-ein-chatbot-im-gespraech-weiss.md)
6. **Vom Chatbot zum Agenten: Wie KI eine Aufgabe abarbeitet**  
   Ein Modell schreibt nur Text und führt nichts aus. Wie daraus ein Agent wird, der in einer Schleife Werkzeuge nutzt, wer dabei was tut und warum das Ende eines Laufs noch nichts über das Ergebnis sagt.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/vom-chatbot-zum-agenten/) · [Markdown](lessons/de/vom-chatbot-zum-agenten.md)
7. **Versteht KI, was sie sagt?**  
   Die Fachwelt ist sich uneins, ob Sprachmodelle verstehen. Was die Befunde zeigen, was sie nicht zeigen und warum eine flüssige Antwort weder dafür noch dagegen spricht.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/versteht-ki-was-sie-sagt/) · [Markdown](lessons/de/versteht-ki-was-sie-sagt.md)
8. **Trainingsdaten: Urheberrecht und Datenschutz**  
   Wessen Texte in ein Training dürfen, wie ein Vorbehalt wirkt, warum die erste Frage bei der Kopie liegt und was im Modell bleiben kann. Stand 12.10.2026, keine Rechtsberatung.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/trainingsdaten-urheberrecht-und-datenschutz/) · [Markdown](lessons/de/trainingsdaten-urheberrecht-und-datenschutz.md)
9. **Antworten prüfen: KI im Alltag sicher nutzen**  
   Wann eine Chatbot-Antwort geprüft werden muss, warum eine Nachfrage beim selben Bot dafür nicht reicht und welcher Prüfschritt zu welchem Fehler passt.  
   [Website](https://ki-einfach-verstehen.de/de/bausteine/antworten-pruefen/) · [Markdown](lessons/de/antworten-pruefen.md)

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
