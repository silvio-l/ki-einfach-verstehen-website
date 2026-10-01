---
title: 'Temperature'
description: 'A setting by which the scores are divided before softmax: low values make the selection more predictable, high values more varied.'
translationKey: temperatur
---

Temperature is a setting for choosing the next text piece. Before [softmax](/en/glossary/softmax), all [scores](/en/glossary/score) are divided by it. A temperature below 1 increases the differences between the scores, and the most likely piece gets even more. A temperature above 1 reduces them, and less likely pieces come up more often during [sampling](/en/glossary/sampling). Dividing by 0 is impossible, so at temperature 0 providers take the most likely piece by convention.

**An example:** For “The cat …”, the scores at temperature 1 give shares of 72, 27 and 1 percent for “sat”, “slept” and “flew”. At temperature 0.5 this becomes 88, 12 and 0.03 percent. At temperature 2 it is 57, 35 and 8 percent, and “flew” comes up about every 13th spin instead of every hundredth.

**Not to be confused with a parameter:** Temperature is not one of the model's [parameters](/en/glossary/parameters) and is not trained. It changes neither the model nor the scores it calculates; dividing them at selection time only decides how much their differences count. So a high temperature doesn't make a model smarter. It gives less likely pieces more chances, good surprises and nonsense alike.

**Where you'll come across it:** In the settings of programming interfaces, usually with values between 0 and 1 or 0 and 2. Low values are often recommended for tasks with one right answer, higher ones for creative tasks. Chat apps usually have no slider, and for some newer models the provider sets the value itself. Even temperature 0 does not guarantee identical answers, because the computation in the data center can fluctuate slightly.

Introduced in [Probability and Softmax: How a Model Decides](/en/lessons/probability-and-softmax).
