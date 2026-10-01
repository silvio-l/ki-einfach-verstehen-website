---
title: 'Label (Target)'
description: "The expected correct output that a model's prediction is compared against during training, also called the target."
translationKey: label
---

A label is the expected correct output that a model's own prediction gets compared against during training. It is also called a **target** because it is the result the prediction should move toward. Together with the matching [input](/en/glossary/input), it forms a [sample](/en/glossary/sample).

For a spam filter, the label is the "spam" or "not spam" information attached to an email. For a language model, the label is usually the piece of text that actually comes next — for the input "The cat", that would be "sat".

**An example:** The ordinary sentence “The cat sat on the sofa.” yields several training samples at once. “The cat sat” gets the label “on,” “The cat sat on” gets “the,” and “The cat sat on the” gets “sofa.” For the spam filter, people had to mark every email by hand. For a language model, the label is already contained in the text itself.

**Not to be confused with the output:** The [output](/en/glossary/output) is what the model computes itself. The label is what would have been correct. The [training algorithm](/en/glossary/training-algorithm) compares the two and adjusts the parameters a little. In use, there is no label: when you ask a chatbot a question, nobody knows the correct next piece.

**Where you'll come across it:** Reports about AI training often mention labeled data, where the correct result is recorded for every input. When people sort images into categories or rate answers so that a model can learn from them, they are assigning labels like these.

Explained in more depth in [Input and Output: What a Function Does](/en/lessons/input-and-output).
