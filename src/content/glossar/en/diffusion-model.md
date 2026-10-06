---
title: 'Diffusion model'
description: 'A kind of AI model that generates images by removing image noise in many small steps, steered by a text.'
translationKey: diffusionsmodell
---

A diffusion model is a [model](/en/glossary/model) that generates images. It doesn’t start with a blank canvas but with pure image noise, like a badly disturbed TV picture. In many small steps, it removes part of this noise. After each step, a little more structure is visible, until a finished image stands at the end. In training, the model learned the reverse route: it was given real images that were made noisier step by step and had to compute the noise back out. A text, such as “a cat on a windowsill,” steers the direction the denoising takes.

**An example:** Stable Diffusion is an openly available diffusion model that generates an image from a text input. To make this faster, it doesn’t work directly on the pixels but on a heavily reduced intermediate form of the image.

**Not to be confused with a [language model](/en/glossary/language-model):** A language model generates text piece by piece from front to back. A diffusion model works on the whole image at once and refines it step by step. Both consist of a blueprint and trained [parameters](/en/glossary/parameters), but they compute in different ways.

**Where you'll come across it:** In many image generators that paint pictures from a description, in photo-editing software with AI features, and in reports about AI-generated photos and artworks.

Introduced in [What an AI Model Actually Is](/en/lessons/what-an-ai-model-actually-is).
