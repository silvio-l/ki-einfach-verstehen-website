---
title: 'Score'
description: 'A numeric value a model uses to rate a possible answer, such as a class or the next piece of text, before it becomes a probability.'
translationKey: score
---

A score is a numeric value a model uses to rate one possible answer: for image recognition each class, for a language model each possible next piece of text, called a **candidate**. A high score means that this candidate fits well from the model's point of view. A low or negative score means it fits poorly.

A score is neither a probability nor a decision. It only shows how one candidate compares to all the others. A later selection step then chooses one concrete piece of text. A language model's [output](/en/glossary/output) is exactly such a list of scores, one per candidate in the vocabulary. The scores are only turned into probabilities by [softmax](/en/glossary/softmax); in technical language, they are also called **logits** before this step.

**An example:** Image recognition receives a photo of a cat. With made-up numbers, the scores might look like this: cat 6.2, dog 2.9, fox 1.4, car −3.0. A separate step then picks the highest, “cat.”

**Not to be confused with a probability:** Scores can be negative and have no fixed upper limit. A [probability](/en/glossary/probability), by contrast, always lies between 0 and 100 percent, and all the possibilities together add up to 100 percent. Softmax keeps the order of the scores but converts them into such percentages.

**Where you'll come across it:** In everyday life, scores are points in a game or ratings. Technical documentation about language models mostly says logits instead. Behind every piece a chatbot writes sits such a score list.

Explained in more depth in [Input and Output: What a Function Does](/en/lessons/input-and-output).
