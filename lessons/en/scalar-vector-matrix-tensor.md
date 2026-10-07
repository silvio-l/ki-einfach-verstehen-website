<!-- Generated from src/content/bausteine/en/scalar-vector-matrix-tensor.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Scalar, Vector, Matrix, Tensor: the Building Blocks of Numbers

> Reading copy for GitHub. The full version with interactive demos, animations and recall moments is on the website: **[Scalar, Vector, Matrix, Tensor: the Building Blocks of Numbers](https://ki-einfach-verstehen.de/en/lessons/scalar-vector-matrix-tensor/)**
>
> Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.en) · Credit it as: KI einfach verstehen, “Scalar, Vector, Matrix, Tensor: the Building Blocks of Numbers”, CC BY 4.0, https://ki-einfach-verstehen.de/en/lessons/scalar-vector-matrix-tensor/

From the weather app to the chatbot: how a number, a list, a table, and a stack of tables relate to each other, and why your chat message and your photo are exactly such blocks of numbers for a model.

You type into a chatbot: “The cats sit.” From the previous lesson, you know what happens first. The [tokenizer](https://ki-einfach-verstehen.de/en/glossary/tokenizer/) splits the sentence into [tokens](https://ki-einfach-verstehen.de/en/glossary/token/), and every token gets a number: “The”, for example, gets 417. On its own, though, the model can do little with that number. It uses it as an address and fetches a long list of learned numbers with it. In the smallest version of GPT-2, that is 768 numbers per token, so for the five tokens from the previous lesson's example already 3,840. The models behind today's chatbots work with even longer lists.

How does a model keep track of so many numbers? The answer is unspectacular: it arranges them, always following the same few patterns. You already know these patterns, from your weather app.

## A number and a list

The weather app reports 18 degrees for noon today. That is a single number, and nothing more is needed to answer the question “How warm is it?” A single number is called a **[scalar](https://ki-einfach-verstehen.de/en/glossary/scalar/)**.

![On the left a single thermometer, in the middle a row of seven weather tiles, on the right a grid of weather tiles in four rows and seven columns](../../public/bausteine/skalar-vektor-matrix-tensor/wetter.webp)

*The same weather data, just arranged differently: one number for today, a row for the week, a table for several cities.*

The weekly forecast shows seven values, one for each day: 18, 21, 19, 15, 14, 17, 20 (made-up values). Here, not only each number counts but also its order. The 15 belongs to Thursday because it is in fourth place. Swap two numbers and the forecast is wrong for two days, even though the same numbers are still there. An ordered list of numbers is called a **[vector](https://ki-einfach-verstehen.de/en/glossary/vector/)**. Every number has its fixed place in it, and **the place is part of the information**.

And your chat? The 768 numbers the model fetches for the token “The” form exactly such an ordered list, so a vector. And at the end, every possible next text piece gets a single rating, the [score](https://ki-einfach-verstehen.de/en/glossary/score/) from the lesson on input and output. Each individual score is a scalar.

## Many lists in rows: the matrix

Now you want to compare the week for four cities: Berlin, Hamburg, Cologne, and Munich. The clearest layout is a table with one row per city and one column per day. To find a particular number, you need two pieces of information: city and day. Such a table is called a **[matrix](https://ki-einfach-verstehen.de/en/glossary/matrix/)**. Each of its rows is again a vector, namely one city's week.

![Top left the single number 18 as a scalar with no axis, top right a row of seven temperatures from Monday to Sunday as a vector of shape 7, below it a table with four cities and seven days as a matrix of shape 4 × 7; the first row for Berlin matches the weekly row](../../public/bausteine/skalar-vektor-matrix-tensor/number-list-table.svg)

*Scalar, vector, matrix: the same temperatures, once as a single number, once as a row for the week, once as a table for four cities.*

The numbers themselves have stayed temperatures throughout. **Only their arrangement changed:** on their own, in a row, or in a table. That is exactly what the three terms tell apart.

Your chat has such a table, too. Your sentence “The cats sit.” consists of five tokens, and each one brings its list of 768 numbers. Write the five lists as rows one below the other, and you get a table with five rows, one per token: a matrix. A later section shows how the model finds these rows.

Before you read on: the weather service measures not only temperature but also wind and rain, for the same four cities and seven days. How would you store these numbers so nothing gets mixed up?

## Stacking tables: the tensor

The obvious solution: three tables of the same layout, one for temperature, one for wind, one for rain. Lay them on top of each other and you get a stack. To find a number in it, you now need three pieces of information: which measure, which city, which day. “Wind, Cologne, Friday” leads to exactly one number.

![Three offset tables lying on top of each other, labeled Temperature, Wind, and Rain, each with four cities as rows and seven days as columns; arrows name the three axes measure, city, and day, and next to them the shape 3 × 4 × 7](../../public/bausteine/skalar-vektor-matrix-tensor/tensor-stack.svg)

*A tensor as a stack: three tables of the same layout for temperature, wind, and rain. Every number has an address made of measure, city, and day.*

For such blocks of numbers with more than two directions, there is the word **[tensor](https://ki-einfach-verstehen.de/en/glossary/tensor/)**. With AI models, it is even used for every block of numbers, no matter how many directions it has. Scalar, vector, and matrix then count as tensors, too. All numbers in a tensor are of the same kind, for example all decimal numbers. That way, the chip can handle every number with the same move.

The word sounds like something out of a physics degree, and it does come from physics and mathematics. There it stands for a stricter concept with its own rules of calculation. **With AI models, though, it simply means a block of numbers.** If you can read a weather table, you can understand a tensor.

![A photo of a cat on a sofa, fanning out toward the back into three translucent layers of equal size in red, green, and blue](../../public/bausteine/skalar-vektor-matrix-tensor/farbschichten.webp)

*A photo for the model: it splits into three layers of equal size, one for red, one for green, one for blue. Each layer is a table of color values.*

You have probably sent a tensor yourself. When you show a chatbot a photo and ask what is in it, the model gets exactly such a stack. Often the photo is first scaled down or split into small pieces, but that does not change the structure of three color tables. A photo consists of pixels, and every pixel has three color values: how much red, how much green, and how much blue, each a number from 0 to 255. For the model, these values are often converted into decimals between 0 and 1 and sorted. All red values go into one table, all green values into a second, all blue values into a third. Each table is as high and as wide as the photo. Three tables of the same layout on top of each other: that is the same structure as the weather stack, only with colors instead of measures.

A photo 400 pixels high and 600 pixels wide already makes a fairly large stack. How do you describe such a block briefly, without listing everything each time?

## Axes and shape: the profile of a block of numbers

Every direction in which a block extends is called an **axis**. The weekly list has one axis, the days. The city table has two, cities and days. The weather stack has three: measure, city, and day. A single scalar has no axis, because it extends in no direction. That is why it is a tensor, too, just one without an axis.

![Ruler](../../public/bausteine/skalar-vektor-matrix-tensor/lineal.svg)

*The shape is the ruler of a block of numbers: it states how long each axis is.*

The **shape** of a block states how many entries each axis has. The weekly list has shape 7, the city table 4 × 7, the weather stack 3 × 4 × 7. You can read two things from the shape. The number of values tells you how many axes the block has. And if you multiply the values, you get the number of entries: 3 · 4 · 7 = 84 numbers in the weather stack.

Now the photo. It has shape 3 × 400 × 600: three colors, 400 rows, 600 columns. Three values, so three axes. How many numbers is that? Work it out yourself before you read on. It is 720,000, and that for a rather small photo. Your sentence “The cats sit.” has shape 5 × 768, which makes 3,840 numbers. Anyone who works with AI models describes every block of numbers this way. The shape is its profile.

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/scalar-vector-matrix-tensor/)

<details>
<summary>One level deeper: isn't a vector an arrow?</summary>

Many people know vectors from school as arrows, and there that is true: two or three numbers can be drawn as an arrow in a plane or in space. With AI models, a vector is first of all an ordered list of numbers, and it can be 768 numbers long. Mathematically, it is still an arrow, but drawing it would take a space with 768 coordinates instead of two or three. Nobody can picture that. The list, on the other hand, works with two numbers just as it does with 768.

The word “dimension” is similarly confusing. Some use it for the number of axes (“a three-dimensional block”), others for the length of an axis (“a vector with 768 dimensions” is a list of 768 numbers). This lesson therefore says “axis” for the direction and “length” for the number of entries.

</details>

One answer is still missing: where do the 768 numbers for “The” come from in the first place?

## From token to block of numbers

Picture a thick reference book. It has one page for every text piece the [language model](https://ki-einfach-verstehen.de/en/glossary/language-model/) knows, so for every entry in its [vocabulary](https://ki-einfach-verstehen.de/en/glossary/vocabulary/). Each page holds a list of 768 numbers. In the smallest version of GPT-2, this book has 50,257 pages.

The [token ID](https://ki-einfach-verstehen.de/en/glossary/token-id/) is simply the page number. When 417 comes in for “The”, the model opens page 417 and takes the list printed there. **In this step, nothing is calculated, only looked up.**

In the computer, the book is a large table, and every page is a row in it. So the book is a matrix of shape 50,257 × 768.

![Animation: token IDs select rows from the vocabulary table, and the rows form the sentence matrix](../../public/bausteine/skalar-vektor-matrix-tensor/row-lookup.static.svg)

[▶ watch the animation on the website](https://ki-einfach-verstehen.de/en/lessons/scalar-vector-matrix-tensor/)

*Each token ID selects one row of the large table; the rows land in order, one below the other, in the matrix for the sentence.*

For your sentence “The cats sit.”, this happens five times, once per token. Each token opens its page, and the five lists are written one below the other in the same order. That gives the table with five rows you already know from the matrix section.

Who wrote the numbers into the book? No person did. They belong to the model's [parameters](https://ki-einfach-verstehen.de/en/glossary/parameters/) and were set step by step during training. So an independently trained model with the same vocabulary has entirely different numbers on page 417.

This is where the comparison with the weather falls short. In the weather table, every number has a name: Monday, Hamburg, wind. On page 417, a single number usually has none. Nobody decided that, say, the 312th number means “animal.” What the list expresses only emerges during training. That comes later.

![A stack of equally sized, slightly offset sheets; on the top one, five rows of small colored boxes](../../public/bausteine/skalar-vektor-matrix-tensor/stapel.webp)

*Several sentences at once: the tables of the individual sentences become a stack, just like the weather tables earlier.*

During training, many sentences are usually sent through the model at once. Each sentence is a table like this one. These tables are stacked, just like the weather tables earlier, and that makes a tensor. That completes the chain: the token ID is a page number. Each page delivers a list, so a vector. Your whole sentence gives a table, so a matrix. And many sentences on top of each other give a stack, so a tensor with three axes.

<details>
<summary>One level deeper: when sentences differ in length</summary>

A stack needs layers of equal size. Real sentences are rarely the same length. A made-up example: “The cats sit.” has five tokens, a second sentence has eight. Their tables have the shapes 5 × 768 and 8 × 768, and two tables of different heights do not make a clean stack.

So the shorter sentence is filled up, which is called padding. It gets three extra positions at the end, each holding a special **padding token** that only takes up space. Now both sentences are eight tokens long, and the stack has the shape 2 × 8 × 768: two sentences, eight positions, 768 numbers per position.

To keep the padding from counting as text, the model also gets a second, much smaller table, the **mask** (attention mask). It has the shape 2 × 8 and contains only ones and zeros. A 1 means “a real token is here”, a 0 means “only padding here”:

| | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| :--- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| Sentence 1 | 1 | 1 | 1 | 1 | 1 | 0 | 0 | 0 |
| Sentence 2 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |

The model ignores the positions marked 0.

In the other direction, there is an upper limit: the [context window](https://ki-einfach-verstehen.de/en/glossary/context-window/) from the lesson on tokenizers, meaning the number of positions a model can process at once. For GPT-2, it is 1,024. A longer text does not fit and is cut off, which is called truncation: whatever goes beyond the limit is dropped. Depending on the setting, that is the end or the beginning. If the beginning is dropped, you get the effect from the lesson on tokenizers: in a long chat, a chatbot seems to forget what came at the very start. Together, padding and truncation make sure every block has a fixed, rectangular shape.

</details>

## Why models compute in blocks of numbers

Whether sentence, photo, or weather data: for the model, everything is a block of numbers with axes and a shape. Why the effort? **Because this way the same calculation can be applied to a great many numbers at once.**

Suppose all 28 temperatures in the city table are to be converted from Celsius to Fahrenheit. It is the same move for every number, and no calculation has to wait for another. Graphics processors, the chips large models usually run on, are built for exactly that. They carry out thousands of similar calculations in parallel instead of one after another. For that, the chip must be able to divide up the work beforehand. Because every number in the block has a fixed address, this works without searching: one processing unit takes the Berlin row, the next the Hamburg row, and each knows right away where its numbers are. A neatly shaped block is the ideal chunk of work for them. The 28 temperatures are a small bite, the 720,000 numbers of the photo a big one, but following the same pattern.

Inside the model itself, the moves are more involved. There, not every number is converted on its own. Instead, many numbers of a row are combined with learned numbers. These learned numbers also sit in tables of fixed shape, just like the large lookup table. The principle stays the same: blocks of the same layout, many similar calculations at once.

This affects every question you ask a large chatbot. It is not answered on your phone but in a data center with such chips. There, the blocks of numbers from your message run through the model, and each block is processed in large portions in parallel instead of number by number. Even the training of the models behind ChatGPT ran on tens of thousands of such chips. That is why models compute in tensors. The mathematics behind it is not mysterious: blocks of numbers of the same layout are simply the fastest to process.

At the model's exit, too, there is a block of numbers: the score list from the lesson on input and output. For the next text piece, it contains 50,257 [scores](https://ki-einfach-verstehen.de/en/glossary/score/), one for every vocabulary entry. Now it has its name: it is a vector.

That answers the question from the beginning: a model keeps the thousands of numbers in your sentence under control because they sit in blocks of fixed shape. Every number has an address, and because all blocks are built the same way, the chip can process many of them at once. What remains open is what the model does with the score vector at the end. Scores like 7.1 or −2.3 are not yet probabilities. How they turn into the decision for the next token is shown in the next lesson.

---

Source: https://ki-einfach-verstehen.de/en/lessons/scalar-vector-matrix-tensor/

← Previous: [Tokenizers: How Language Becomes Numbers](./tokenizer-ids-vocabulary.md) · [All lessons](../../README.md#contents) · Next: [Probability and Softmax: How a Model Decides](./probability-and-softmax.md) →
