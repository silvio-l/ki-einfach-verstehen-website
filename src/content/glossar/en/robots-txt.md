---
title: 'robots.txt'
description: 'A text file on a website in which the operator tells crawlers which areas they may retrieve.'
translationKey: robots-txt
---

The robots.txt is a text file in the root directory of a website. It contains instructions for crawlers, that is, programs that retrieve web pages automatically. There the operator writes, for example, which crawler is meant and which areas it should not retrieve. The file is a request to programs; whether they follow it is up to them. It enforces nothing.

For AI training, the robots.txt matters because it can serve as a [rights reservation](/en/glossary/rights-reservation) in machine-readable form. There are crawler names for this, for example that of Common Crawl, an organization that collects web pages and makes its archive freely available. A line such as “User-agent: CCBot” with “Disallow: /” asks this crawler not to retrieve the whole site.

**An example:** A website sets up a robots.txt that forbids one particular crawler access but does not forbid others. A person visiting the site notices nothing. A collecting program that follows the file leaves this site out for that crawler.

**Not to be confused with protection:** The robots.txt does not technically protect content. Anyone who wants to retrieve the text can ignore the file. Whether the notice has legal effect depends on how the law assesses a machine-readable notice.

**Where you'll come across it:** When you open any large website at its /robots.txt address, and in providers’ explanations of which crawlers they use and how to exclude them.

Introduced in “[Training Data: Copyright and Privacy](/en/lessons/training-data-copyright-and-privacy)” in the section on the reservation only a computer can read.
