---
title: "Program, Algorithm, Model — What's the Difference?"
description: 'Clarifies the difference between an algorithm (the procedure) and a model (the result), using the recipe-vs-baked-cake image.'
themenbereich: grundlagen
order: 1
translationKey: programm-algorithmus-modell
---

Before you read on, a quick thought to try for yourself: what do you think actually sets an AI model like a language model apart from an ordinary computer program — is it the same thing underneath, just more complicated, or something fundamentally different?

## A common misconception

A very common idea goes like this: "An AI model is just an extremely complicated program with a huge number of if-then rules." That sounds plausible — programs really are made of rules, and a language model is constantly making some kind of decision. So why shouldn't there just be an enormous list of rules that someone wrote down underneath it all?

What actually happens is different: with a classic program, a human decided every single rule. With an AI model, no human decides the individual rules — they emerge from examples, in a separate process that runs once, before the model is ever used. To see how that works, it helps to untangle three terms that often get mixed up: program, algorithm, and model.

## Program: the fixed instructions

A **[program](/en/glossary/program)** is a sequence of instructions written by humans. The code determines which computational steps run in which order — and it determines all of that completely before the program ever runs.

*Mental image: a recipe whose steps are already fixed.* Anyone following the recipe knows exactly what happens, and in what order, before they start.

## Algorithm: the procedure behind it

An **[algorithm](/en/glossary/algorithm)** is a general, finite solution procedure — the idea behind a program, not the concrete code itself. A sorting algorithm, for instance, describes how to bring unordered values into order; a concrete program is then one possible way of implementing that idea in a specific programming language.

Machine learning has its own kind of algorithm, too: a **[training algorithm](/en/glossary/training-algorithm)** — a fixed procedure that gets applied to training examples and produces something new from them.

## Model: the result, not the recipe

A **[model](/en/glossary/model)** is a computational structure whose behavior additionally depends on stored numerical values. Those numbers are called **[parameters](/en/glossary/parameters)** or **weights**. The training algorithm sets them based on examples — not a human deciding each value by hand.

*Mental image: a mixing desk with a huge number of knobs.* The layout of the knobs (the model's architecture) is fixed, but their exact positions (the parameters) only emerge from training.

That lets the recipe image go one step further: the training algorithm is like the recipe, applied **once** to the ingredients (the training data). The model is the **baked cake** — the result of that single application. And just as a finished cake can no longer be changed the way a recipe can, a finished model can't simply be fixed by editing a line of code. Changing its behavior almost always means retraining it, with different or additional ingredients.

<details>
<summary>One level deeper: what formally makes something an algorithm?</summary>

In computer science, a procedure counts as an algorithm if it has three properties: it consists of **finitely many, precisely defined steps**, every step is **executable** (no step demands something impossible or ambiguous), and the procedure **halts after finitely many steps** — it eventually produces a result instead of running forever. A sorting algorithm obviously satisfies this; so does a training algorithm for an AI model, even though "finitely many steps" there quickly runs into the millions.

</details>

## Why the distinction matters

In classic programming, a human writes rules, and the computer applies them to data. In machine learning, a human instead writes the training algorithm, the model's structure, and a measure of what counts as a good result — the concrete parameters only emerge from the training examples. That's why an AI model can't be "debugged" the way ordinary code can: there's no single line that contains the faulty behavior, only a pattern spread across a huge number of parameters, shaped by the training data.

One more term worth placing here, since it comes up constantly in this context: **[AI](/en/glossary/ai)** (Artificial Intelligence) is the umbrella term for systems that solve tasks usually associated with perceiving, language, planning, or decision-making. Not every AI system learns from examples — a trained model is just one (currently especially successful) subset of that broader category.

## What comes next

Once a model is trained, its role shifts again: it takes an input and produces an output — just like an ordinary program. The distinction from this lesson still holds (the rules live in learned parameters instead of hand-written code), but in operation — say, while you're chatting with an AI assistant right now — a trained model behaves like an ordinary function again. That's exactly what the next lesson is about.
