---
title: 'Subword-Token'
description: 'Ein wiederverwendbares Textstück, das kleiner als ein Wort sein kann, sodass sich seltene Wörter aus bekannten Teilen zusammensetzen lassen.'
translationKey: subword-token
---

Ein Subword-Token ist eine Texteinheit, die häufige Wörter kompakt halten und seltene Wörter aus kleineren bekannten Teilen zusammensetzbar machen kann. So könnte ein Tokenizer „unwahrscheinlich“ etwa in „un“, „wahr“ und „scheinlich“ zerlegen, falls diese drei Teile in seinem Vokabular stehen. Je nach Vokabular können auch ganze Wörter oder einzelne Zeichen solche Einheiten sein.

Subword-Verfahren bilden einen Mittelweg zwischen einer unflexiblen Liste ganzer Wörter und sehr langen Folgen einzelner Zeichen.

**Ein Beispiel:** Das Wort „Lernmodell“ könnte in „Lern“ und „modell“ zerfallen. Ein anderer Tokenizer könnte es auch in „L“, „ern“, „mod“, „ell“ zerlegen oder als Ganzes führen. Das Prinzip gleicht einem Baukasten: Häufiges liegt als großes fertiges Stück bereit, Seltenes entsteht aus kleinen Teilen. Ein neuer Bandname landet so nicht als „unbekannt“ im Modell, sondern als Folge bekannter Stücke.

**Nicht verwechseln mit einer Silbe:** Subword-Tokens sehen manchmal wie Silben oder Wortbausteine aus, sind aber keine sprachliche Analyse. Sie entstehen daraus, welche Zeichenfolgen im Trainingsmaterial häufig nebeneinanderstehen, etwa mit [Byte Pair Encoding](/de/glossar/byte-pair-encoding). Ein Token darf deshalb mitten durch eine Silbe, eine Endung oder einen Namen verlaufen.

**Wo du dem Begriff begegnest:** Viele moderne Text-Tokenizer arbeiten mit Subword-Tokens, auch die hinter bekannten Chatbots wie ChatGPT. Du bemerkst das indirekt: Ein seltenes Wort oder eine ungewöhnliche Produktkennung kann in viele kleine Stücke zerfallen und belegt dann mehr Platz im [Kontextfenster](/de/glossar/kontextfenster) als ein geläufiges Wort.

Ausführlicher erklärt in [Tokenizer: Wie Text in Tokens zerfällt](/de/bausteine/tokenizer-ids-vokabular).
