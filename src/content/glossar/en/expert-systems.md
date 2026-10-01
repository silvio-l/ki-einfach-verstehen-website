---
title: 'Expert systems'
description: 'Early AI systems that captured the knowledge of specialists in many hand-written if-then rules, rather than learning from examples.'
translationKey: expertensysteme
---

Expert systems are AI systems in which experts encode knowledge as many hand-written **if-then rules**: conditions and the conclusion to use when they are met. A rule might read, "If patient has fever AND cough AND no rash, then more likely flu than measles." They were especially common in the 1980s and worked reasonably well for narrowly defined tasks, but every new situation needed a new, hand-written rule.

**An example:** Picture a system for doctors that has collected many rules like the one above. It asks about symptoms, checks which rules apply, and states the conclusion. If you want to know why it says “flu”, you can look up the rule that fired. If a combination of symptoms turns up that no rule covers, someone has to write a new rule first.

**Not to be confused with a trained model:** In an expert system, a human decides every rule individually. In a [model](/en/glossary/model), the "rules" (more precisely, the [parameters](/en/glossary/parameters)) emerge from training examples, without a human writing them down one by one. So there's no line to look up, only numbers. Fixed rules haven't disappeared entirely, though: some systems today combine trained models with rule-based filters.

**Where you'll come across it:** In accounts of the history of [AI](/en/glossary/ai), where expert systems count among the first truly successful forms of AI software. And indirectly in the widespread idea that AI is a giant rulebook. That picture really existed, and it describes expert systems fairly well, but not today's trained models.

Explained in more depth in ["Program, Algorithm, Model Compared"](/en/lessons/program-algorithm-model).
