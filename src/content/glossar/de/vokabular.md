---
title: 'Vokabular'
description: 'Die feste Liste aller Einträge, die ein Tokenizer kennt und aus denen ein Modell seine Antworten zusammensetzt.'
translationKey: vokabular
---

Das Vokabular eines Tokenizers ist die feste Liste aller Einträge, die er kennt, meist Textstücke. Jedes dieser Textstücke ist ein [Token](/de/glossar/token). Das Modell, zu dem er gehört, rechnet mit genau diesen Einträgen. Das OpenAI-Sprachmodell GPT-2 enthält 50.257 solcher Einträge. Ein [Tokenizer](/de/glossar/tokenizer) zerlegt Text in Einträge dieses Vokabulars und ordnet jedem Stück eine [Token-ID](/de/glossar/token-id) zu, also eine Nummer.

**Ein Beispiel:** Das Vokabular ist wie ein Baukasten mit allen Klötzen, die der Tokenizer kennt. Das Verfahren [Byte Pair Encoding](/de/glossar/byte-pair-encoding) zählt dafür, welche Paare in einer großen Textsammlung häufig nebeneinanderstehen. Die Größe steht von vornherein fest. Bei GPT-2 beginnt der Baukasten mit den 256 einzelnen Bytes (kleinen Speichereinheiten), aus denen sich jeder Text darstellen lässt. Dann sucht das Verfahren das häufigste Paar benachbarter Klötze und klebt es zusammen. So geht es weiter, bis das Vokabular seine Größe erreicht. Zum Beispiel könnten »e« und »n« zu »en« werden. Welche Paare der echte Tokenizer zuerst zusammenklebt, lässt sich daraus nicht ablesen.

**Nicht verwechseln mit einem Wörterbuch:** Im Vokabular steht nicht, was die Einträge bedeuten, und nicht jedes Wort ist enthalten. Viele Einträge sind Wortteile oder Satzzeichen. Andere sind [Spezial-Tokens](/de/glossar/spezial-token), Einträge für Struktur, etwa das Ende einer Nachricht, nicht für Text.

**Wo du dem Begriff begegnest:** Bei vielen Modellen steht die Zahl der Einträge in den technischen Angaben; bei kommerziellen fehlt sie oft. Hat ein neues Modell einen eigenen Tokenizer, ergibt derselbe Satz andere Token-IDs und oft eine andere Zahl Tokens. Rechnet ein Anbieter pro Token ab, wird ein Text mit mehr Tokens teurer. Mehr Tokens füllen zudem schneller das [Kontextfenster](/de/glossar/kontextfenster).

Mehr zur Zerlegung: [Tokenizer: Wie Text in Tokens zerfällt](/de/bausteine/tokenizer-ids-vokabular). Zu den Nummern: [Token-IDs: Was eine Nummer bedeutet](/de/bausteine/token-ids-und-vokabular).
