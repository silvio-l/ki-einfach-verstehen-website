---
title: 'Image classifier'
description: 'A trained model that assigns images to one of several predefined categories, such as "cat" or "dog".'
translationKey: bildklassifikator
---

An image classifier is a trained [model](/en/glossary/model) that takes an image as input and assigns it to one of several categories set in advance, such as "cat" or "dog." The [training algorithm](/en/glossary/training-algorithm) sets the [parameters](/en/glossary/parameters) using thousands of already-categorized images; no human decides in advance which image features tell the categories apart.

To the model, a photo is a set of numbers: the brightness and color values of its pixels. Its immediate output isn't a word but a [score](/en/glossary/score) for each category. A separate step then picks the highest.

**An example:** A classifier knows the categories cat, dog, fox and car. For a photo of a cat it outputs something like cat 6.2, dog 2.9, fox 1.4 and car −3.0 (made-up values), and the screen shows "cat." It knows no other answers, so even a photo of a horse lands in one of the four: the one with the highest score.

**Not to be confused with an image generator:** An image classifier sorts existing images and creates no new ones. It's closer to a trained [spam filter](/en/glossary/spam-filter): both sort an input into a fixed list of categories, just with images instead of emails as [training data](/en/glossary/training-data). A [language model](/en/glossary/language-model) also picks from a fixed list, its [vocabulary](/en/glossary/vocabulary), in every round. New text only comes about because the chosen piece is appended and the loop repeats.

**Where you'll come across it:** You'll more often read "image recognition" than the technical term. The idea is at work in apps that name a plant or an animal from a photo.

More on this in ["Input and Output: What a Function Does"](/en/lessons/input-and-output).
