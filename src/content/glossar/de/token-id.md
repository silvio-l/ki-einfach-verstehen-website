---
title: 'Token-ID'
description: 'Die feste Nummer eines Tokens im Vokabular eines bestimmten Tokenizers. Mit dieser Nummer arbeitet das Modell anstelle des Textes.'
translationKey: token-id
---

Eine Token-ID ist eine ganze Zahl, die im [Vokabular](/de/glossar/vokabular) eines bestimmten Tokenizers (des Verfahrens, das Text in Textstücke zerlegt) fest zu einem [Token](/de/glossar/token), also einem Textstück, gehört. Für das Modell ist sie eine Nachschlageadresse.

Allein hat die Zahl keine Bedeutung. Ein anderer Tokenizer kann dieselbe ID anders belegen: Die 417 steht in einem ausgedachten Mini-Vokabular für „Die“, im echten Vokabular von GPT-2, einem Sprachmodell von OpenAI, dagegen für „el“.

**Ein Beispiel:** Das Zeichen ␣ steht hier für ein Leerzeichen, das zu einem Textstück gehört. Im erfundenen Mini-Vokabular hat jedes Textstück eine eigene Nummer. Aus „Die Katze sitzt.“ werden fünf Textstücke, denn „␣Katze“ fehlt im Vokabular; es gibt nur „␣Kat“ und „ze“. Daraus entsteht die Folge 417, 82, 903, 771, 13. Genau diese Zahlen bekommt das [Modell](/de/glossar/modell) als Eingabe. Für die Antwort bewertet es, welches Textstück als Nächstes passen könnte. Aus diesen Bewertungen wird eine Nummer ausgewählt, und der [Tokenizer](/de/glossar/tokenizer) macht daraus wieder Text.

**Nicht verwechseln mit einem Bedeutungswert:** Die 417 misst keine Bedeutung. Sie ist nur die Nummer auf einer Karteikarte. Mit IDs zu rechnen ergibt deshalb keinen Sinn: die Summe 417 + 82 = 499 bedeutet nichts. Welche Informationen ein Modell mit einer ID verbindet, steckt in seinen trainierten [Parametern](/de/glossar/parameter). Über die Nummer findet es dort eine Gruppe gelernter Zahlen.

**Wo du dem Begriff begegnest:** Im Chatfenster siehst du Token-IDs meist nicht. Du begegnest ihnen eher in Werkzeugen, die zeigen, wie Text zerfällt, oder beim Programmieren, wenn ein Programm Text in Tokens zerlegt.

Mehr dazu: [Token-IDs: Was eine Nummer bedeutet](/de/bausteine/token-ids-und-vokabular).
