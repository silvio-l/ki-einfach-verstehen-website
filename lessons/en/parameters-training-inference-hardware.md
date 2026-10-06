<!-- Generated from src/content/bausteine/en/parameters-training-inference-hardware.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Parameters, Training vs. Inference, Hardware: How a Model Runs

> Reading copy for GitHub. The full version with interactive demos, animations and recall moments is on the website: **[Parameters, Training vs. Inference, Hardware: How a Model Runs](https://ki-einfach-verstehen.de/en/lessons/parameters-training-inference-hardware/)**
>
> Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.en) · Credit it as: KI einfach verstehen, “Parameters, Training vs. Inference, Hardware: How a Model Runs”, CC BY 4.0, https://ki-einfach-verstehen.de/en/lessons/parameters-training-inference-hardware/

What is inside a finished AI model, what people decide before training, why learning costs so much more than using, and what hardware a model needs.

The previous lesson introduced temperature, a setting that is not trained. The scores themselves come from the model’s parameters, and training sets those. What would such a model look like if you could hold it in your hand?

You almost can. Some companies publish models for download. Meta, for example, released its language model Llama 3.1 in 2024. The smallest version, Llama 3.1 8B, comes as roughly 16 gigabytes of weight files in the usual format of the Hugging Face platform. What is inside those 16 gigabytes? Why did they take over a million hours of computing time to make? And why does a small model run on a phone while a large chatbot needs a data center?

## What is inside a model file

Download Llama 3.1 8B and you get mainly two kinds of files. One is tiny, under a kilobyte. It is a kind of blueprint of the model, listing for example how many entries its vocabulary has. The other kind are the weight files, here four of them totalling 16 gigabytes. They hold numbers, about eight billion of them: the parameters that training has set. No sentence or fact appears in them as plain text.

![On the left a small card labeled blueprint with entries such as vocabulary and computing stages, under one kilobyte; on the right a large block of numbers, about eight billion parameters, about 16 gigabytes](../../public/bausteine/parameter-training-inferenz-hardware/model-file.svg)

*A downloaded model consists of two parts: a small blueprint and a huge number of numbers.*

The first lesson gave you an image for these two parts: the mixing desk. The small file names the device’s build type and dimensions, such as how many computing stages it has. This blueprint is called the model’s **[architecture](https://ki-einfach-verstehen.de/en/glossary/architecture/)**. The computing steps themselves are known to the software that loads the model. The large files record where every single fader sits: the parameters. Unlike on a real desk, none of these faders has a label.

What do you think: if two models have exactly the same architecture, do they also behave the same?

Not necessarily. Meta also offers Llama 3.1 8B Instruct. Both versions have the same architecture and exactly as many parameters. The base version has only had basic training: predicting the next text piece. The Instruct version was then trained further to respond to questions and instructions like a chatbot. The accompanying files differ slightly too, for example in how a conversation is turned into text for the model. But the real difference is in the numbers: same desk, different fader positions, different behavior. The chatbot you write to came about the same way: further training moved a base model’s faders to new positions.

Eight billion faders sounds like a lot. How many do the large models have, and how much space does that take?

## Billions of faders: how big a model is

The name gives away the size: the “8B” in Llama 3.1 8B stands for 8 billion parameters, so 8 billion faders on the desk.

Each number takes up space. Llama 3.1 stores every parameter in 2 bytes. You know the byte from the lesson on tokenizers: it is the usual unit for counting memory. A gigabyte is a billion bytes. So eight billion numbers at 2 bytes each are 16 billion bytes, about 16 gigabytes, exactly the size of the weight files. Hence a simple rule of thumb: billions of parameters times 2 gives the memory needed in gigabytes.

Try the rule yourself: Meta also offers the model with 70 billion parameters. How much memory does that need?

About 140 gigabytes. The largest version has 405 billion parameters and so comes to about 810 gigabytes.

![Bar chart: GPT-2 1.5 billion parameters 3 gigabytes, Llama 3.1 8B 16 gigabytes, Llama 3.1 70B 140 gigabytes, GPT-3 175 billion 350 gigabytes, Llama 3.1 405B 810 gigabytes](../../public/bausteine/parameter-training-inferenz-hardware/model-sizes.svg)

*Memory needed at 2 bytes per parameter: from GPT-2 to the largest Llama 3.1, it grows from 3 to about 810 gigabytes.*

The largest GPT-2 from 2019 had 1.5 billion parameters and would need 3 gigabytes by the rule. GPT-3, a predecessor of the models behind ChatGPT, has 175 billion: 350 gigabytes at 2 bytes per number, over a hundred times as much. The rule counts only the parameters. Using a model takes extra memory for intermediate results, a great deal in long conversations. So the rule gives a lower bound.

With this rule you can read a model’s name: the number before the B times two is the minimum in gigabytes, as long as every number is stored in 2 bytes, as with Llama 3.1. Careful with names like Llama-4-Scout-17B-16E: “16E” stands for 16 so-called experts, groups of faders of which only some compute for each text piece. The 17B counts only the faders that compute for a text piece. Space is still needed for all of them, 109 billion according to the model description, so about 218 gigabytes.

But who decided on eight billion faders for Llama 3.1 8B, not nine? Not training, that much is certain.

## What is fixed before training

Before any fader moves, people have made many decisions. Training sets the faders, but it builds no new desk. How many faders there are, how many entries the vocabulary has, how many tokens fit into the context window: all this is fixed before training. GPT-2’s developers, for example, doubled its predecessor’s context window from 512 to 1024 tokens.

Such settings are called **[hyperparameters](https://ki-einfach-verstehen.de/en/glossary/hyperparameter/)**. The difference: people fix hyperparameters, training sets parameters. The architecture from the first section consists of such decisions. Then there are settings that only concern training. At the mixing desk, hyperparameters would be the decisions made before the sound check moves the first fader, such as how many channels the desk should have. The sound check, setting the faders, is what training does for the model.

One hyperparameter acts directly on training: the **[learning rate](https://ki-einfach-verstehen.de/en/glossary/learning-rate/)**. In the first lesson, the training algorithm moved the spam filter’s weights a “small step” after every error. The learning rate sets the size of that step. What do you think happens if the step is very big?

Then every correction overshoots. The weight of “prize” would jump far up after an ad email and far down after the next library email, never finding the point where both sides balance. If the step is too small, training barely progresses. Experts often find the right learning rate only by trial runs with several values.

And temperature from the previous lesson? Some count it as a hyperparameter too. One difference matters more: the learning rate acts only during training and leaves its traces in the parameters. Temperature is set only when the model is used, anew for every request, and leaves the model unchanged.

It seems obvious: more parameters, better model. But size is also decided before training, and it has a price: the more faders, the more computation each piece of training text costs. At the AI lab DeepMind, Chinchilla, with 70 billion parameters, got as much computing time as the same team’s Gopher, four times its size. With a quarter of the faders, each text piece costs less computation, so the same time sufficed for four times as much text. Chinchilla performed better and was cheaper to run, too. So how good a model gets depends not only on the number of faders, but also on how much text sets them.

<details>
<summary>One level deeper: how GPT-3 was set up</summary>

The 2020 GPT-3 paper lists, among others, these hyperparameters for the largest model:

- **96 layers.** A layer is a computing stage that further processes the previous one’s result. Every token passes through all 96 in turn.
- **12,288 numbers per token.** The length of the vector representing each token along the way.
- **A context window of 2048 tokens.**
- **A learning rate of at most 0.00006.** It was ramped up slowly at first and lowered step by step later; this plan, too, was fixed in advance. The learning rate is a factor: the training algorithm calculates how each parameter should change and scales that correction down by the factor before adjusting.
- **A batch of 3.2 million tokens.** The model is not adjusted after every text piece; the training algorithm collects the corrections from 3.2 million tokens, then adjusts once.

GPT-3 saw about 300 billion tokens in training. None of these values was learned. Layer count and vector length set the size of the desk: the 175 billion parameters follow from them. The learning rate and the batch determine how the sound check goes.

</details>

Once all decisions are made, training begins. Why does it take so long, when an answer appears in the chat window within seconds?

## Learning costs more than using

A concert has two phases at the mixing desk. First, at the sound check, the band plays a few bars. The sound engineer listens, notices what is off, pushes faders, and the band plays again. During the concert, the desk simply processes whatever comes in. The sound check stands for training. Using the finished model is called **[inference](https://ki-einfach-verstehen.de/en/glossary/inference/)**: the concert. Every question you ask a chatbot triggers inference.

![Seen from behind: a sound engineer reaches for a fader on a large mixing desk; in front of her empty rows of seats, on stage a band with guitar, drums and bass](../../public/bausteine/parameter-training-inferenz-hardware/soundcheck.webp)

*The sound check before the concert: first the faders are set, then they stay put.*

Here the image falls a little short. At a sound check, a person pushes a few faders by ear. In training, no person sets anything; an algorithm calculates, for all the billions of faders at once, where each should go. And at a real desk, the engineer still steps in during the concert. Not so with the model: during inference, no fader moves, whatever you type. So a chatbot learns nothing while you write to it? Right, your conversation does not change the model. What it “remembers” in it is sent along as input with every message, as in the lesson on input and output. New versions only come from separate, later training runs. Some providers also use stored conversations for them when the matching setting is on.

Why does one cost so much more than the other? During inference, the model computes once with its numbers for each text piece: input in, score list out. Training adds two steps for every example. The training algorithm compares the score list with the text piece that actually follows. Then it calculates which way to adjust every single parameter. For Llama 3.1 8B, that is eight billion corrections each time a portion of training text has been computed.

![Top, training: compute, compare with the correct piece, adjust all parameters, then start again. Bottom, inference: input, compute with fixed parameters, score list](../../public/bausteine/parameter-training-inferenz-hardware/training-inference.svg)

*Training is a loop of computing, comparing and adjusting. Inference is only the first step, with fixed numbers.*

And training needs a huge number of examples. Llama 3.1 was trained on about 15 trillion tokens. For the smallest version, Meta reports 1.46 million hours of computing time on graphics chips. A single chip would be busy for over 160 years. So training runs on thousands of chips at once; for the largest Llama 3.1, over 16,000. This effort happens once for each version. After that, the version is used over and over, and no parameter changes. A single request is cheap by comparison. But because millions of people ask questions, using models also takes large data centers in total.

In training, memory does not stop at the parameters either. For every fader, the training algorithm has to remember its calculated correction plus a few helper values. Even without intermediate results, training needs about eight times the space of merely using the model: for Llama 3.1 8B, well over 100 gigabytes instead of 16.

<details>
<summary>One level deeper: what training also keeps in memory</summary>

First, each parameter’s correction from the last computing step, the gradient: in which direction and how strongly it should change. Second, the popular training method Adam keeps a memory. For every parameter, it keeps two running averages: one over the direction of the latest corrections and one over their size. Third, the computing uses 2-byte numbers, but a more precise 4-byte copy of all parameters is kept. Otherwise tiny corrections could vanish in rounding, like the rounding from the lesson on input and output.

The paper on the memory technique ZeRO breaks it down: 2 bytes for the parameter, 2 for its gradient, 12 for the precise copy and the two Adam values. That makes 16 bytes per parameter, eight times as much as for inference. Others arrive at 18 bytes. For Llama 3.1 8B, 16 bytes give about 130 gigabytes, more than one 80-gigabyte data-center chip holds. Add the intermediate results of every computing stage, which training must keep to calculate the gradients. Techniques like ZeRO therefore spread all this data across many chips.

</details>

So training is a job for large data centers. But what does a finished model run on when you use it?

## Space and speed: what hardware a model needs

Some phones run a language model on the device itself; Apple’s, for example, has about 3 billion parameters. Large chatbots run in data centers. Are phones simply too slow?

Here the mixing desk image ends: a desk is a device, a model just a file of blueprint and numbers. “Running” means a chip loads all fader positions and computes with them. A graphics chip computes fastest with numbers in its own adjacent memory, the **[GPU memory](https://ki-einfach-verstehen.de/en/glossary/gpu-memory/)**, often called VRAM. Since a model like Llama 3.1 computes with all its parameters for every new text piece, they must fit there for it to run quickly.

![Computer chip](../../public/bausteine/parameter-training-inferenz-hardware/chip.svg)

*A graphics chip computes with the numbers in its own fast memory.*

The gaming graphics card GeForce RTX 4090 has 24 gigabytes of GPU memory; Llama 3.1 8B, at 16 gigabytes, fits. A data-center chip like Nvidia’s H100 has 80 gigabytes in its common version. The largest Llama 3.1, about 810 gigabytes, needs several chips. So the first limit is space, not speed.

A phone has no GPU memory of its own. Model, system and all apps share the same memory (RAM): 8 to 16 gigabytes on current Pixel phones. By the rule of thumb, a 3-billion-parameter model would need 6 gigabytes, almost all the room on an 8-gigabyte phone. So how does it fit? The answer is **[quantization](https://ki-einfach-verstehen.de/en/glossary/quantization/)**: every number is stored with fewer digits, that is, rounded more coarsely. This is counted in bits, the smallest yes-or-no units of memory. A byte has 8, so 2 bytes have 16.

8 bits instead of 16 halve the space; 4 bits leave a quarter. Apple even shrinks most of its phone model to 2 bits per number, an eighth. Instead of 6 gigabytes, it needs little more than three quarters of one. Coarser numbers can cost some accuracy, depending on the method. At 8 bits, the loss is often barely measurable, even for models the size of GPT-3.

That completes the chain: parameters times bytes per number gives the space, which decides whether a model fits on a phone, a graphics card or only in a data center.

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/parameters-training-inference-hardware/)

<details>
<summary>One level deeper: why the answer appears piece by piece</summary>

A language model produces its answer one text piece at a time. Each new piece takes one pass through the whole model, and all of Llama’s parameters have to travel from GPU memory to the chip’s compute units. With single requests, this loading takes longer than the computing.

Memory bandwidth is how many gigabytes memory can deliver per second. For the H100 in its common SXM version, the manufacturer gives 3.35 terabytes per second, or 3350 gigabytes. A rough estimate with Llama 3.1 8B: 3350 divided by 16 is about 209. With 16-bit numbers, a single request on this chip thus hardly gets beyond about 200 text pieces per second, however fast it computes. Quantized numbers mean less to load and a higher limit. In practice, a request manages fewer pieces, because intermediate results for the text so far must be loaded too.

So data centers process many people’s requests together, in the batch from the lesson on input and output: the chip loads the parameters once and uses them for all requests in that step.

</details>

That answers the opening question: the 16 gigabytes of Llama 3.1 8B hold a small blueprint and about eight billion numbers. People decided beforehand how the desk is built and how the sound check goes. Training then took over a million chip hours to set the faders. Using the finished model just means computing with fixed numbers, and whether that happens on a phone or in a data center depends first on space.

One question remains. No sentence is written in these billions of numbers. So how can a model know that Paris is the capital of France? That is the topic of the next part: what an AI model really is, and why it is not a database of facts.

---

Source: https://ki-einfach-verstehen.de/en/lessons/parameters-training-inference-hardware/

← Previous: [Probability and Softmax: How a Model Decides](./probability-and-softmax.md) · [All lessons](../../README.md#contents)
