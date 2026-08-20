---
title: "Program, Algorithm, Model — What's the Difference?"
description: 'Clarifies the difference between an algorithm (the procedure) and a model (the result), using the recipe-vs-baked-cake image.'
themenbereich: grundlagen
order: 1
translationKey: programm-algorithmus-modell
---

Before you read on, a quick thought to try for yourself: what do you think actually sets an AI model like a [language model](/en/glossary/language-model) apart from an ordinary computer program — is it the same thing underneath, just more complicated, or something fundamentally different?

## A common misconception

A very common idea goes like this: "An AI model is just an extremely complicated program with a huge number of if-then rules." That sounds plausible — programs really are made of rules, and a language model is constantly making some kind of decision. So why shouldn't there just be an enormous list of rules that someone wrote down underneath it all?

The impression comes easily for another reason, too: in conversation, an AI model really does behave in a rule-like way. It follows grammar, keeps to a reasonably consistent format, sometimes even sticks to recognizable patterns in word choice. Watching a system behave consistently, it's almost automatic to assume there must be a list of rules somewhere that fixes that behavior — just like with a classic program.

The idea isn't pulled out of thin air, either. There really were AI systems that worked exactly that way: so-called [expert systems](/en/glossary/expert-systems), common in the 1980s. Experts entered thousands of if-then rules into a database by hand — something like "If patient has fever AND cough AND no rash, then more likely flu than measles." Systems like that worked reasonably well for narrowly defined tasks, but every new situation needed a new, hand-written rule, and they quickly ran into their limits. Once it became clear that complex, fuzzy tasks — recognizing images, understanding natural language — can barely be captured in hand-written rules at all, that approach hit a wall; the field went through a period of notably reduced interest and funding as a result, before today's example-based approach took over. Modern AI models like language models actually grew, historically, out of a deliberate move away from exactly this hand-written-rule approach.

What actually happens with a trained model is different: with a classic program, a human decided every single rule. With an AI model, no human decides the individual rules — they emerge from examples, in a separate process that runs once, before the model is ever used. To see how that works, it helps to untangle three terms that often get mixed up: program, algorithm, and model.

## Program: the fixed instructions

A **[program](/en/glossary/program)** is a sequence of instructions written by humans. The code determines which computational steps run in which order — and it determines all of that completely before the program ever runs.

*Mental image: a recipe whose steps are already fixed.* Anyone following the recipe knows exactly what happens, and in what order, before they start.

Concretely, a tiny program might look like this: a rule that takes a temperature in Celsius, multiplies it by 9/5, adds 32, and outputs the matching Fahrenheit value.

```
Input: temperature in Celsius
Output: temperature in Fahrenheit

fahrenheit = celsius * 9 / 5 + 32
output(fahrenheit)
```

Every single computational step — multiply, add, output — was already fixed before the program ever ran for the first time. No matter how often you call it with the same Celsius number, it computes exactly the same, predetermined path every time.

## Algorithm: the procedure behind it

An **[algorithm](/en/glossary/algorithm)** is a general, finite solution procedure — the idea behind a program, not the concrete code itself. A sorting algorithm, for instance, describes how to bring unordered values into order; a concrete program is then one possible way of implementing that idea in a specific programming language.

A particularly vivid example: compare two neighboring values in a list, swap them if they're in the wrong order, and repeat until nothing needs swapping anymore.

```
Repeat until nothing gets swapped:
  For each pair of neighboring values in the list:
    If left value > right value:
      Swap the two values
```

That idea — "compare, swap if needed, repeat" — can be implemented in practically any programming language; the algorithm itself doesn't depend on which language it eventually gets written in. That exact distinction between the general idea (algorithm) and the concrete implementation (program) matters again in a moment, when it comes to training algorithms: a training algorithm, too, can be implemented in different programming languages — the underlying idea stays the same.

[Machine learning](/en/glossary/machine-learning) has its own kind of algorithm, too: a **[training algorithm](/en/glossary/training-algorithm)** — a fixed procedure that gets applied to [training examples](/en/glossary/training-data) and produces something new from them.

## Model: the result, not the recipe

A **[model](/en/glossary/model)** is a computational structure whose behavior additionally depends on stored numerical values. Those numbers are called **[parameters](/en/glossary/parameters)** or **weights**. The training algorithm sets them based on examples — not a human deciding each value by hand.

*Mental image: a mixing desk with a huge number of knobs.* The layout of the knobs (the model's architecture) is fixed, but their exact positions (the parameters) only emerge from training.

That lets the recipe image go one step further: the training algorithm is like the recipe, applied **once** to the ingredients (the [training data](/en/glossary/training-data)). The model is the **baked cake** — the result of that single application. And just as a finished cake can no longer be changed the way a recipe can, a finished model can't simply be fixed by editing a line of code. Changing its behavior almost always means retraining it, with different or additional ingredients.

The mixing-desk image above might sound like a couple dozen knobs. In modern language models, it's not a couple dozen — it's billions of individual parameters. The mixing-desk picture still holds; it just operates at a scale that's hard to picture at all. How many parameters a model actually has, and what that means for hardware and compute, is the topic of a later, dedicated lesson — for now it's enough to notice that "lots of knobs" is meant very literally when it comes to real AI models.

<details>
<summary>One level deeper: what formally makes something an algorithm?</summary>

In computer science, a procedure counts as an algorithm if it has three properties: it consists of **finitely many, precisely defined steps**, every step is **executable** (no step demands something impossible or ambiguous), and the procedure **halts after finitely many steps** — it eventually produces a result instead of running forever. A sorting algorithm obviously satisfies this; so does a training algorithm for an AI model, even though "finitely many steps" there quickly runs into the millions.

That third property — halting — is why not every computer program automatically counts as an algorithm in the strict sense: a program that waits indefinitely for new input (a server handling requests, say) never halts on its own. That doesn't matter much for the program/algorithm/model distinction in this lesson, but it's a good example of just how precisely computer scientists draw lines that everyday language draws much more loosely.

</details>

## An example you can hold onto

The terms program, algorithm, and model stay abstract as long as they're only attached to a recipe and a mixing desk. So once more, with an example you know from your own inbox: dealing with spam mail. Say you want to decide whether an incoming email is spam or not.

Programmed the classic way, a first, simple solution might look like this: a human writes a rule such as "If the subject line contains 'WINNER' in all caps, mark the email as spam." That's a program in the sense described above — a human decided in advance what matters.

A trained spam filter works differently. Instead of a hand-written rule, a training algorithm gets shown thousands of emails already labeled "spam" or "not spam." It then adjusts parameters on its own — which words, sender addresses, or sentence patterns actually correlate with spam in practice is nothing a human needs to know or write down beforehand. What comes out is a model that can judge new, unseen emails without a single line anywhere in the system that reads "WINNER in all caps → spam."

Now say the trained spam filter wrongly marks an important email from your boss as spam. With the hand-written rule, you'd know exactly where to look: open the rule, check which condition fired, adjust it. With the trained model, there's no single such spot. The faulty behavior is spread across thousands or millions of parameters that jointly produced this one wrong result — nobody can point and say "here, this exact parameter is to blame." The only reliable fix is retraining with better or additional examples, not a targeted edit in one place.

That's exactly where the practical difference lies: a classic spam filter gets better when someone adds a new rule. A trained spam filter only gets better by being retrained with new examples — the same principle applies, exactly, to a language model like the ones you may have already chatted with, just with vastly more examples and vastly more parameters.

## The same principle in a different domain

To make it clear this distinction isn't just about text: take an [image classifier](/en/glossary/image-classifier) that has to decide whether a photo shows a cat or a dog. Programmed the classic way, a human would have to write rules like "If pointed ears AND narrow pupils AND [more features], then cat" — and even with this simple example you can probably already feel how hard that is to pin down in clean rules: some dog breeds have pointed ears, some cats have floppy ears, and lighting, angle, or framing all change what's even visible in the first place.

A trained model sidesteps this problem entirely. It gets shown thousands of photos already labeled "cat" or "dog," and the training algorithm sets the parameters so that as many training examples as possible end up correctly classified. Nobody explained to the model what "pointed ears" are — which image features actually distinguish cats from dogs is something the training algorithm extracted from the examples itself. That exact shift — from hand-written feature rules to parameters learned from examples — is the same shift that happens with the language model in the example above.

Just as with the spam filter: if the trained model misclassifies a photo, that can't be fixed with a targeted code change. The fix is the same as above — more or better training examples, another training run, a new model. Text, image, or something else entirely: the distinction between program, algorithm, and model from this lesson stays the same in every case.

## Why the distinction matters

In classic programming, a human writes rules, and the computer applies them to data. In machine learning, a human instead writes the training algorithm, the model's structure, and a measure of what counts as a good result — the concrete parameters only emerge from the training examples. That's why an AI model can't be "debugged" the way ordinary code can: there's no single line that contains the faulty behavior, only a pattern spread across a huge number of parameters, shaped by the training data.

That also explains something you've probably already noticed in everyday use of AI chatbots: when a model makes a mistake or gives an answer you didn't want, you can't just "quickly fix it" by phrasing something differently — that only changes your input for this one conversation, not the model itself. That behavior only gets properly fixed once the provider retrains the model on changed or additional training data and releases a new version. That's one reason AI providers regularly ship new model versions instead of simply patching the old one's code. It's also why an AI assistant's behavior sometimes changes without you having changed anything about your own input: the provider rolled out a new, retrained model version in the background. Retraining is no small side task, either — it costs compute time, energy, and, for large models, sometimes considerable amounts of money, which is one reason new model versions don't ship weekly but typically at larger, planned intervals.

That can be put more precisely by keeping two levels apart that are easy to blur in everyday use: the [prompt](/en/glossary/prompt) — what you actually type into a chat window — and the model itself. If you write "always reply in English from now on" in your prompt, or give an assistant a standing instruction some providers call a "system prompt" or "custom instructions," you're only changing the input for that one conversation, not the parameters stored in the model. The model itself doesn't "know" about your instruction afterward; it only takes effect for as long as it's part of what gets sent along with your message. Permanently changing a model, by contrast, always means retraining it — with the ingredients from the cake image further up.

One more term worth placing here, since it comes up constantly in this context: **[AI](/en/glossary/ai)** (Artificial Intelligence) is the umbrella term for systems that solve tasks usually associated with perceiving, language, planning, or decision-making. Not every AI system learns from examples — a trained model is just one (currently especially successful) subset of that broader category. Some older AI systems, like the expert systems mentioned above, do count as AI without counting as machine learning — AI is the broad umbrella term, machine learning just one of several paths into it.

## A note on everyday language

In everyday speech, people often talk about "the algorithm" — as in, "Instagram's algorithm" decides what shows up in your feed. Strictly speaking, that's often imprecise: on many modern platforms, what actually decides which content you see is no longer a step-by-step procedure a human wrote down, but at least partly a trained model that learned, from the behavior of many other users, which content people are likely to be interested in. Language has drifted away from the technical meaning here — "algorithm" has become an everyday catch-all for "some automatic system that decides things for me," regardless of whether a classic algorithm or a trained model is actually behind it. That's rarely a problem in everyday conversation, but it's worth keeping in mind once the precise technical distinctions matter — which is exactly what this lesson is about. The same goes for phrases like "the recommendation algorithm" on streaming or music services — what's usually behind that isn't a hand-written rulebook either, but a model that learned from the behavior of many other listeners which things tend to go together. The word "algorithm" remains the more common one in everyday speech; technically, "model" is usually the more accurate one.

Something similar applies to phrases like "my phone's face recognition" or "autocorrect doesn't recognize this word" — today, a trained model is usually behind those too, though older autocorrect systems really did lean more heavily on fixed word lists and rules. So the everyday phrasing isn't always wrong — just imprecise when it lumps both cases together.

## Why this isn't niche knowledge

This distinction might look like computer-science trivia, but it's practically relevant to every decision you make when working with AI. Once you understand that a model emerges from training data rather than hand-written rules, you also understand why two different AI models can respond differently to the exact same prompt — they were built from different training data and different training algorithms, even if both are supposed to do "the same thing" on the surface. You also understand why an AI provider can announce an "update" to its model without much changing in the underlying program code — the update is usually new training, not new software in the classic sense. And you understand why a model is never quite as predictable as a classic program: its rules live in millions or billions of parameters that emerged from examples, not in a list someone checked line by line.

## The three terms at a glance

- **Program**: instructions written by humans, completely fixed in advance — the recipe.
- **Algorithm**: the general procedure behind it, independent of the concrete implementation — "compare, swap, repeat."
- **Model**: a computational structure whose behavior depends on trained parameters — the result, not the recipe, the baked cake.

If these three lines come back to you from memory the next time someone says "algorithm" but actually means "model," this lesson has done its job.

## A quick self-check

Before moving on, a quick check for yourself: can you answer the following questions from memory, without scrolling back up?

- What determines what happens in a classic program — and what determines it in a trained model?
- How does an algorithm differ from a concrete program?
- Why can't a fully trained model simply be fixed by editing a line of code?
- Why is casual talk of "a platform's algorithm" often technically imprecise?
- What changes about a model when you give it a new instruction in a prompt — and what doesn't?
- Why does the distinction between program, algorithm, and model work the same way for an image classifier as it does for a language model?

If any answer still feels shaky, it's worth a second look at that section — that's exactly what this quick check is for: not to test you, but to show you where a re-read pays off. If every answer came easily, you're well prepared for the next lesson.

## What comes next

Once a model is trained, its role shifts again: it takes an [input](/en/glossary/input) and produces an [output](/en/glossary/output) — just like an ordinary program. The distinction from this lesson still holds (the rules live in learned parameters instead of hand-written code), but in operation — say, while you're chatting with an AI assistant right now — a trained model behaves like an ordinary function again, computing an output from your input.

Exactly how that one computational step — input in, output out — works in detail, and what "input" and "output" even mean for a language model, is still open. That's exactly what the next lesson is about: it takes the distinction from this lesson as given and instead looks closely at what happens in that computational step itself.
