---
title: 'Embedding'
description: 'Die gelernte Zahlenliste, die ein Sprachmodell für jedes Token nachschlägt; ähnlich verwendete Tokens bekommen ähnliche Embeddings.'
translationKey: embedding
---

Ein Embedding ist die lange Liste gelernter Zahlen, die ein [Sprachmodell](/de/glossar/sprachmodell) für ein [Token](/de/glossar/token) verwendet, also ein [Vektor](/de/glossar/vektor). Die [Token-ID](/de/glossar/token-id) sagt nur, welches Textstück gemeint ist; das Modell benutzt sie als Zeilennummer und holt sich das Embedding aus der [Embedding-Matrix](/de/glossar/embedding-matrix). Vor dem Training stehen dort Zufallszahlen. Das Training stellt sie so nach, dass Vorhersagen besser passen, und dabei bekommen Tokens, die in ähnlichen Umgebungen stehen, ähnliche Embeddings. Die einzelnen Zahlen haben dabei meist keinen Namen.

**Ein Beispiel:** Bei GPT-2 hat jedes Embedding 768 Zahlen. Die nächsten Nachbarn von „apple“ sind Obstwörter wie „peach“ und „lemon“, die von „Apple“ dagegen „iPhone“ und „iOS“, denn großgeschrieben ist es ein anderes Token.

**Nicht verwechseln mit Text-Embeddings für die Suche:** Manche Modelle verwandeln einen ganzen Text in einen einzigen Vektor, etwa um ähnliche Dokumente zu finden. Das heißt ebenfalls Embedding, ist aber etwas anderes als die Zeile pro Token am Eingang eines Sprachmodells.

**Wo du dem Begriff begegnest:** In Erklärungen, wie Sprachmodelle Text in Zahlen verwandeln, und in Beschreibungen von Suchfunktionen, die „mit Embeddings“ arbeiten.

Eingeführt in [Embeddings: wie aus einer Nummer ein gelernter Vektor wird](/de/bausteine/embeddings).
