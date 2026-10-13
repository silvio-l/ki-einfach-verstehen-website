<!-- Generated from src/content/bausteine/en/does-ai-understand-what-it-says.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Does AI Understand What It Says?

> Reading copy for GitHub. The full version with interactive demos, animations and recall moments is on the website: **[Does AI Understand What It Says?](https://ki-einfach-verstehen.de/en/lessons/does-ai-understand-what-it-says/)**
>
> Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.en) · Credit it as: KI einfach verstehen, “Does AI Understand What It Says?”, CC BY 4.0, https://ki-einfach-verstehen.de/en/lessons/does-ai-understand-what-it-says/

Experts disagree on whether language models understand. What the findings show, what they do not show, and why a fluent answer proves neither side.

## A fluent answer and the question that follows

You ask a chatbot to explain something. Its answer is so clear that you barely question it. An example (made up): you ask why the sky looks blue during the day, and the answer reads like a textbook. The wording alone cannot tell you whether the explanation is correct.

The lesson [Why Prediction Is More Than Parroting](./why-prediction-is-more-than-parroting.md) left one question unanswered: whether a model has anything comparable to a human feel for language.

How would you test this in a person? You give them a new task they have not seen before. In humans, a good answer is often taken as a sign that they have understood something. For a machine, a fluent answer is not enough for that. There are research findings on this, but their meaning is disputed.

## The field is divided, and the question is the cause

In spring 2022, researchers in natural language processing surveyed their own field. One statement read: a generative model trained only on text could, given enough data and computing power, understand natural language in a non-trivial sense. The respondents were asked to agree or disagree. The survey did not say what “understand” means and asked respondents to state their own preferred definition. The authors deliberately avoided a fixed definition, because otherwise the answers could depend on the definition chosen. The authors report that some respondents objected to any fixed definition.

327 answers from experts who had regularly co-authored ACL publications were evaluated; the exact criteria are in the source. Of the respondents who took a clear position, 51 percent agreed and 49 percent disagreed. “Agree” and “somewhat agree” count together, and likewise on the other side; those who chose “not informed”, “question meaningless” or “no answer” are left out. The answers are therefore split.

The survey asks about a model that could exist, rather than the chatbot on your phone. It also leaves “understand” undefined, and that is where much of the disagreement lies.

Each finding answers only one of three sub-questions. The first asks whether the model answers new questions correctly. The second asks whether structures inside it represent things in the world, such as a game board. The third asks whether words have a connection to the world. The dispute is about which of these questions “understand” means. The last section returns to this.

![Three columns, Against, For and Counter-evidence, with two or three arguments or findings each.](../../public/bausteine/versteht-ki-was-sie-sagt/positions-findings.svg)

*The debate in three columns: arguments against, findings for and counter-evidence. The following sections explain each entry. The last section shows what they mean for the question of understanding.*

## Against: An octopus on the cable

The best-known thought experiment against the claim that language models understand comes from Emily Bender and Alexander Koller (2020). Every element in it stands for something specific. An octopus listens to an undersea cable that connects two islands. Two people talk to each other on the islands, and the cable carries only their messages. The octopus stands for a model that sees only text: the messages are word sequences, the cable is the training text. It learns their patterns so well that it answers convincingly. Then one of the two is attacked by a bear. The bear stands for a situation outside the text, that is, for the world. The person under attack has only a few sticks and asks the octopus for a weapon. The octopus can imitate the words, but cannot help, because it does not know what the person means.

![An orange octopus grips a cable that leads to two rocky islands.](../../public/bausteine/versteht-ki-was-sie-sagt/oktopus-am-kabel.webp)

*An octopus on the undersea cable, listening only to the messages. The picture is a thought experiment from one side, not a description of a model.*

The argument is that a system trained only on form has, in principle, no way to learn meaning. It does not deny that a model can give useful answers. It denies that meaning arises from form alone. Form is the words and their order; meaning is what they refer to. This is an argument made by one side of the debate, rather than a measured fact. It concerns systems that process only text; the thought experiment includes no other kinds of input. Whether the same argument applies to systems that also process other inputs is disputed.

The term “stochastic parrot” comes from Emily Bender, Timnit Gebru and colleagues (2021). It means a system that assembles word sequences from its training texts according to probabilities, without any link to meaning. The term is a warning about the dangers of large language models, not proof of what the model contains.

Another thought experiment comes from John Searle (1980): the Chinese Room. The description follows the Stanford Encyclopedia of Philosophy, not the original paper. A person sits in a room, receives Chinese characters and follows a rule book that tells them which characters to hand back. To outsiders the answer looks like that of a person who speaks Chinese, but the person in the room understands not a word. Searle concludes that following such rules alone does not create an understanding of language.

One counterargument is that the person, rule book and room together might understand something, even if the person alone does not. This objection is called the Systems Reply.

## For: structures can be found in the model

How can you check whether a model contains more than word sequences? Researchers use a [probe](https://ki-einfach-verstehen.de/en/glossary/probe/): a separate tool that reads the numbers produced inside the model as it processes each input. The probe tries to identify a state, such as the arrangement of pieces on a board, from those numbers. If it succeeds, the information is there to be read. The probe does not become part of the model or change it.

An intervention is a second, different measurement: one changes the numbers in a targeted way and checks whether the model's answer changes.

Kenneth Li and colleagues (2023) did this with a model that had seen only move sequences of the board game Othello and knew no rules. It has eight layers and learned to predict legal moves. A probe could read the state of the board from the intermediate values. To check whether the probe merely computes the board itself, the authors used a network with random weights, that is, an untrained network. In this untrained network, they compared two probes: a nonlinear probe can recognise more complex patterns, while a linear probe is limited to simpler relationships. The nonlinear probe found little more than the linear one. If it had worked out the board itself, it should have found much more even in this untrained network. The small difference suggests that the probe was reading information already present rather than calculating it itself. Interventions on these numbers also changed the predicted moves; in this model the representation was therefore important for the prediction.

Nanda, Lee and Wattenberg (2023) then showed that the same information becomes easier to read when the board is described in terms of “my colour” and “the opponent's colour” rather than black and white. This change of perspective explains how the two findings fit together. The board has 64 squares, and the model knows it only from the move sequences. Is such a structure more than mere form? This question remains open, even in the octopus thought experiment.

Gurnee and Tegmark (2024) explored similar questions with text. Using probes, they could identify places and points in time in the internal numbers of Llama-2, a language model from Meta. The data sets comprised place names, death years of historical figures, works of art and headlines. From individual “space” and “time neurons”, spatial and temporal coordinates could be read off reliably. The authors themselves write: that the information is readable does not mean the model actually uses it.

These findings provide the strongest support for the idea that a model contains more than word sequences. Whether large language models actually use these structures when producing answers still needs to be tested. The findings alone cannot tell you that.

![Schema: intermediate values of the model, a probe as a reading device, beside a game board as the state.](../../public/bausteine/versteht-ki-was-sie-sagt/probe-schema.svg)

*How a probe works: it reads the numbers produced inside the model and uses them to identify a state, such as a board position. Information that can be read is not necessarily used by the model. The probe itself does not change the numbers.*

## Counter-evidence: where the findings break

Vafa and colleagues (2024) trained their models only on turns taken during New York taxi rides. In nearly 100 percent of cases the next turn was a valid one. The predictions yielded a city map barely resembling Manhattan: it had impossible directions and overpasses over other streets. A model can thus predict well without a coherent picture of the city. These were specially trained models; the finding says nothing about today's chatbots.

Another challenge is the [reversal curse](https://ki-einfach-verstehen.de/en/glossary/reversal-curse/). Berglund and colleagues (2024) trained two language models further on new texts: GPT-3 (a model from OpenAI) and Llama-1 (a model from Meta). This further training is called fine-tuning. These texts contained invented facts: “Uriah Hawthorne is the composer of Abyssal Melodies.” The reverse question was no better than a guess. In training, the sentence appeared in one direction, so the reversal was missing. With the sentence in the prompt, before your question, and three correctly answered examples, GPT-3-series models derived the reverse almost always.

A 2026 preprint (Coda-Forno et al.), accepted at an ICLR 2026 workshop, examines models trained specially for the study, as well as the pretrained BERT and Gemma-3 4B (four billion parameters). With BERT, which reads words from both sides, they find little evidence that success rests on a single, direction-independent representation of a fact. The normal version of Gemma-3 4B, which reads only left to right, almost completely fails at reversal. The version with masking (hiding words for it to guess) copes better; for it and for BERT, their measurements point to the reverse direction of a fact being stored separately. Example: from “Ms. Berger is Jonas’s mother”, “Jonas’s mother is Ms. Berger” does not follow automatically.

A picture for the problem: an open notebook, written on the left and blank on the right. Whoever has read only the left page knows nothing of the right. The limit of the picture: a model has no pages.

![An open notebook: written lines on the left, an empty page on the right.](../../public/bausteine/versteht-ki-was-sie-sagt/notizblatt-nur-eine-seite.webp)

*An open notebook with writing on the left and a blank page on the right. It does not show how a model stores knowledge: a model has no pages.*

Berglund and colleagues tested knowledge about real, well-known people: they asked GPT-4 from OpenAI about the parents of the 1,000 most popular people from a film database (IMDB), and the reverse question. The source names an example pair (Figure 1): the parent question asks who the mother of Tom Cruise is, and the child question who the child of Mary Lee Pfeiffer is. The authors note that the exact wording can change results. The study does not say which GPT-4 version it used.

Guess first: for which question did GPT-4 answer correctly more often, the parent question or the child question?

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/does-ai-understand-what-it-says/)

**Solution:**

The hit rate counts questions, not single answers: a question is correct if at least one of ten answers is right. For the parent question, asked for all 1,000 people, it was 79 percent. The child question was asked only of the 1,573 pairs where GPT-4 had named the parent; there the rate was 33 percent. The authors suspect GPT-4 may be trained to protect information about individuals, and so may not answer some parent questions. Then the gap to the child question would be larger than the numbers show. So they also tested Llama-1 from Meta, a base model not tuned for this protection. There they measured not a hit rate but the probability of the right answer; measured this way, the parent question came out clearly ahead at every model size.

![Two bars: parent question 79 percent, child question 33 percent correct.](../../public/bausteine/versteht-ki-was-sie-sagt/reversal-bars.svg)

*GPT-4's hit rate for the parent question (79 percent, all 1,000 people) and the child question (33 percent, only the 1,573 pairs), after Berglund et al. (2024). The bars show the values the study reports (abstract and section 2.2).*

The finding does not prove that models fail to understand relations. It only shows that GPT-4 answers the reversal less often for these people. GPT-4's training data are unknown; the reversal may have been in training. Then this would be no direct test of the reversal curse.

## What you mean by “understanding”

What do you think an impressive but incorrect answer tells you about whether the model understands? To judge that, it helps to separate the three meanings of “understanding”.

The findings address three different questions rather than the single question in the survey. If “understanding” means answering new questions correctly, the models’ accurate predictions, including the taxi turns, count in its favour. The city map and the reversal findings show the limits of that evidence. If it means having internal structures that represent things, the Othello results and the probes offer support. If it means connecting words to the world, the octopus argument raises the strongest objection: on that argument, form alone cannot provide meaning.

A fluent sentence does not prove that the model understands, or that it does not. A mistake is no proof either: a wrong answer does not show that nothing was understood. Fluency alone tells you about the wording of an answer. To find out whether the model understands the subject, researchers need tests designed to examine that question.

Try it out on six arguments that come up in the debate.

**Exercise: Assign the arguments**

Place each statement in the column whose evidence or argument supports it: **Against**, **For** or **Counter-evidence**. If none fits because the conclusion goes beyond the findings, mark it as a **fallacy**. Name the relevant finding or argument.

- **A.** “A system that sees only text has no access to meaning.”
- **B.** “In a model that learned only Othello moves, a board representation can be read out.”
- **C.** “Readability proves that the model uses the representation.”
- **D.** “A model knows “A is B” and therefore also “B is A”.”
- **E.** “The city map from the taxi rides is almost right, so the model knows the city.”
- **F.** “Half of the experts agree, so the question is settled.”

**Solution:**

**A: Against**, octopus on the cable (Bender & Koller, 2020). A system that sees only form has no route to meaning.

**B: For**, Othello model (Li et al., 2023). The probe reads a board representation from the intermediate values.

**C: Fallacy.** The authors Gurnee and Tegmark write this themselves: readable does not mean used. The statement fits no column, because it confuses readability with use.

**D: Fallacy.** The reversal curse shows the opposite: what is learned works in the direction of learning, and with the invented facts the reversal was missing. With context it works.

**E: Fallacy.** The city map (Vafa et al., 2024) shows that good predictions are possible without a coherent inner picture. The statement infers the picture from the prediction, which the finding does not carry.

**F: Fallacy.** A majority does not decide a factual question. The survey itself warns that the answers can depend on the definition chosen.

When a model learns patterns from texts, it also matters which texts those are. Whose texts may be used for training, and what remains of them in the model? That is the subject of the next lesson.

---

Source: https://ki-einfach-verstehen.de/en/lessons/does-ai-understand-what-it-says/

← Previous: [From Chatbot to Agent: How AI Works through a Task](./from-chatbot-to-agent.md) · [All lessons](../../README.md#contents) · Next: [Training Data: Copyright and Privacy](./training-data-copyright-and-privacy.md) →
