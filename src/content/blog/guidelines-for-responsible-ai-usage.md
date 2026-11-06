---
title: 'Guidelines for responsible AI usage'
description: 'Why AI-assisted development quietly shifts cost from writing to understanding, and eight guidelines for keeping ownership of your codebase.'
pubDate: 2026-10-23
tags: ['ai', 'software engineering', 'code review']
---

> I originally wrote this for a team I was part of, but the advice applies to any team using AI tools.

## Motivation

The widespread adoption of Copilot-style agents within code editors or through command line interfaces has made code generation both fast and accessible. However, software development revolves around more than just producing code; it is the process of designing, creating, testing, and maintaining software applications to meet specific user needs or business objectives (Dooley, 2017). This highlights that software projects consist of more than just their source code, which does not inherently capture intent, design decisions, architectural choices, or deliberate trade-offs. The Danish computer scientist Peter Naur conceptualised a software system as a shared mental model of how it works, why it works that way, and how it should evolve. The act of programming then becomes a form of collective, collaborative theory building (Naur, 1985). Under this view, source code is reduced to a lossy, imperfect written representation of that theory. However, the process of writing source code remains a critical part of building and developing the shared mental model.

By automating code generation, we have implicitly shifted the primary cognitive load of software development from creation to comprehension and verification. While AI tools can be incredibly useful in analyzing code, we humans must still comprehend the code in order to preserve the shared mental model. Without that shared understanding, we are left with nothing more than raw source code, lacking the context needed to evolve the system. In doing so, we introduce what has been named *cognitive debt* (Storey, 2026). There is compelling evidence showing that AI usage is increasing cognitive debt:

- **More time is spent in reviews:** In teams with high degrees of AI adoption, developers merge ~98% more pull requests (PRs), but the PR review time rises by approximately 91%. Thus, the productivity benefits don't show up at the company level (Faros AI, 2025). We should not mistake individual speed-up for team productivity (Forsgren et al., 2021). A larger follow-up study found that time spent in review went up 156–441% as adoption of AI tools increased (Faros AI, 2026).
- **AI can amplify a team's existing strengths, but also its weaknesses:** As an example, AI adoption has been tied to lower delivery stability (DORA, 2024). Therefore, healthy organizational practices are necessary to obtain a positive return on AI adoption. This includes, but is not limited to, strong version control practices, working in small batches, and having developed testing frameworks (DORA, 2025).
- **How you feel might be a lie:** AI can feel like a productivity booster, but the actual productivity benefits depend very much on the type of task. Findings show that developers using AI genuinely work faster, feel more efficient, productive, and satisfied (Kalliamvakou, 2022; Noy & Zhang, 2023; Peng et al., 2023). However, those results come from low-context, low-stakes tasks (e.g. bounded greenfield projects) that do not account for maintenance, debugging, or review (Peng et al., 2023). On large mature open-source codebases, experienced developers were measured 19% slower with AI, while believing they were 20% faster (METR, 2025), proving that self-assessment can be very unreliable. What feels right isn't necessarily so.
- **Codebases are already showing signs of ownership loss:** Code churn and use of copy-pasted code instead of equivalent existing code (code duplication) are increasing (Faros AI, 2026; GitClear, 2024). We also see that higher AI adoption yields more bugs and higher incident rates per change (Faros AI, 2025; Faros AI, 2026). Furthermore, more PRs are merged without any review at all, possibly hinting at maintainers not being able to keep up with the volume of AI generated code (Faros AI, 2026). This amounts to more technical debt, which is already one of the highest frustration points for developers (Stack Overflow, 2024). Furthermore, in some experiments heavy Large Language Model (LLM) use directly lowers the felt ownership of the output (Kosmyna et al., 2025).

The problem is of course not the technology in itself as the concept of cognitive debt existed long before AI (the term "bus factor" was already used in the 90s). The challenge is AI usage that quietly moves the cost from writing to understanding without anyone deciding that trade-off is acceptable. As a result, you get reviewer overload (Noda et al., 2023), review backlogs, and PRs nobody fully understands.

Open-source projects take wildly different approaches to remedy this. Some outright ban AI usage in contributions, while others enforce an AI usage policy. An example of such a policy can be found on the repository for the terminal emulator Ghostty. One of the main rules from that policy is "if you can't explain what your changes do and how they interact with the greater system without the aid of AI tools, do not contribute to this project" (Ghostty, 2026). The project owner of Ghostty also maintains that low-effort AI output just shifts the burden of validation onto the maintainer (Ghostty, 2026), so contributors must be able to explain any line and design decision in review. Low-effort contributions that are obviously AI generated are outright refused (Ghostty, 2026). Another example is LLVM, which names unreviewed AI output as an "extractive contribution", since it extracts more from maintainers in terms of required work than it adds in terms of value to the project. A way to make a contribution less extractive is to reduce its size or complexity, or even increase the usefulness/value (LLVM Project, 2026).

Much like Ghostty and LLVM, I think we should welcome the use of AI, but keeping ownership of our projects takes sensible guidelines for how we use the technology. What follows are the ones I would argue for. They are not hard rules, but a starting point for a shared agreement within your own team.

## Guidelines for responsible AI usage

### 1. The one rule to rule them all

> You are responsible for every line you submit. If you cannot explain why a line is correct and why it belongs, it does not go in.

Note that this principle applies both to the author of the PR, but also the reviewer(s) of the PR. Only by building a shared understanding of the merged code can we ensure cognitive debt does not increase. Note also that the principle is not mentioning AI produced code specifically. This is deliberate, since that is beside the point. Code quality and shared understanding are the main goal we are working towards. We therefore do not treat "this looks AI-written" as a red flag on its own! However, we should push back if the size and/or clarity of a diff is not where we want it to be, regardless of whoever produced the line.

The PR submitter usually has more context around the change than the reviewer (Google Engineering, 2024). Therefore, the goal of the review process is not only to hunt for defects, but for the team to understand the change, transfer knowledge, offer alternative solutions, and increase awareness (Bacchelli & Bird, 2013).

As for the usage of AI tools in generating code, it is well known that the output is not deterministic (run the same prompt twice and you might get different results) and is not guaranteed to produce correct results. Even the tool vendors admit as much: it is called a copilot, not an autopilot. It is therefore crucial that if you use AI to generate changes, you have a baseline competence in what you are changing (Douglas, 2023).

### 2. Use AI deliberately, critically, and judiciously

LLMs are not uniformly helpful, since their benefit depends very much on the task at hand (Peng et al., 2023; METR, 2025). These are some examples of tasks where we can expect AI to be helpful:

- Boilerplate, scaffolding, test stubs, and repetitive transforms, where it offloads extraneous effort (Kalliamvakou, 2022).
- Exploring an unfamiliar API, library, or corner of the codebase.
- First-draft implementations of a spec you already wrote yourself.
- Small well-scoped, well-defined tasks.

This is by no means an exhaustive list of all suitable use cases, and you might find more. On the opposite end, there are some use cases where you should slow down and do the thinking yourself:

- Architecture and interface decisions.
- Anything touching AuthN/AuthZ, sensitive data, or a data migration.
- Complex, high-context changes in a mature codebase, where AI has been measured to slow experienced developers down and to struggle with testing, docs, and linting standards (METR, 2025). This is aggravated by the fact that a model's effective context window is far smaller than its advertised maximum, with accuracy often degrading severely within around 1000 tokens (Paulsen, 2025).
- In languages or domains you are not able to evaluate truthfulness or accuracy yourself (Douglas, 2023).
- Anywhere you'd want to defend design decisions, deliberate choices, and not just the source code, in six months' time.

### 3. Have a plan

For anything bigger than a small, well-scoped fix, either use plan mode, or write a short plan (problem definition, desired approach, scope, and perhaps more importantly, what is *not* in scope) before letting an agent generate code. It is much cheaper (both in token cost, and in cognitive engagement) to correct a plan, than to correct and revise a 600-line diff. Using LLMs to generate code with good results is authoritarian in nature: experienced practitioners treat it "like a digital intern, hired to type code for me based on my detailed instructions." (Willison, 2025). Good practices like these are what let AI amplify productivity instead of amplifying the mess (DORA, 2025).

How you feed context to the agent matters as much as having a plan. Prefer showing concrete examples over merely describing what you want: much of what makes in-context prompting work is that demonstrations convey the target format, the input distribution, and the space of valid answers, rather than instruction labels alone (Min et al., 2022). Be careful with negative instructions, since LLMs handle negation poorly and can be insensitive to a "do not" as readily as they follow it (Truong et al., 2023); prefer stating what *should* happen. Finally, resist bolting large repository-overview context files onto every task: providing such files has been found to not generally improve task success while increasing inference cost by over 20% (Gloaguen et al., 2026).

### 4. Verify the output

Verification of the generated results is the job of the submitter. This is not a task which is to be delegated to the reviewer. Optimizing your own output at the reviewer's expense is a net loss for the team (Forsgren et al., 2021)!

- **Test AI-generated code thoroughly:** With AI, robust testing becomes even more crucial than before (DORA, 2024). You especially need to manually check that the code runs as expected: "if you haven't seen it run, it's not a working system" (Willison, 2025).
- **Do extensive (manual) self-reviews:** AI output needs deliberate human scrutiny. Using another model to review the generated code is a decent start, but it is not sufficient (Pearce et al., 2022; Douglas, 2023). While models have become better, they still can make "deeply inhuman" mistakes, like hallucinating libraries or methods (Willison, 2025). We also observe that teams going from low to high AI adoption have an increase in their incident-to-PR ratios of around 242%, meaning every merged change has a higher risk of causing an incident in production (Faros AI, 2026). This can be remedied by thorough reviews.
- **Ensure that generated code adheres to the codebase:** Anecdotally, AI agents can struggle with local practices within a project (customs and conventions the team has adopted). It is therefore recommended to keep a close watch on possible breaches of such customs. As an example, comments might not wrap correctly with respect to the selected line width.
- **Do not trust the output blindly; do the work needed to verify:** When using AI tooling, the responsibility shifts from writing code to checking code (verification, integration, and supervision of what the model gave you (Lee et al., 2025)). The more confidence you have in the tool's ability to perform a task, the less critical thinking effort is applied to the output (Lee et al., 2025). With respect to security, this shows up as an increase of insecure code while still maintaining confidence in the code being secure (Perry et al., 2023).
- **Look for security holes (when relevant):** AI generated code is trained on both secure and insecure code. As a result, generated code may include insecure patterns found in the CWE top 25 (Pearce et al., 2022). In one study, ~25% of Copilot snippets carried a security weakness (Fu et al., 2025). Furthermore, these weaknesses are almost never raised by the agent unless specifically prompted for (Perry et al., 2023). In addition to plain security weaknesses, AI agents may hallucinate dependencies, which is becoming a real supply-chain attack vector (Willison, 2025). Thus, both security scanning and human security reviews cannot be overlooked (Pearce et al., 2022).

### 5. Keep pull requests reviewable

We are all familiar with the "looks good to me" pull request trope: PRs with 100 lines of code changed get 30 review comments, whereas PRs with 1000 lines of code changed just get a "LGTM!". As the diff grows, reviewer effectiveness drops. On the contrary, small diffs are reviewed faster and more thoroughly (Google Engineering, 2024; Sadowski et al., 2018). This is something that obviously predates AI, but AI has made it incredibly easy to generate larger, complex, broadly and deeply spanning PRs. To avoid this, we can:

- **Ensure the PR is small enough:** A Cisco/SmartBear study found that the optimal range for catching defects is around 200–400 lines of code changed. Within that range, about 70–90% of defects are caught within reasonable review time. This diminishes when the size grows larger (Cohen, 2006). Google's practice strengthens this mantra: Around 100 lines of code changed is comfortable, whereas 1000 lines of code is usually too big (Google Engineering, 2024).
- **Keep PRs focused on a single concern:** This is also advised by Google's practices (Google Engineering, 2024). Unscoped, under-documented diffs drive cognitive load up (Noda et al., 2023).
- **Aim to separate features and refactors into separate PRs:** Although this is not always possible, it should be a goal we aim for. Intermingling feature changes and refactor changes increases the cognitive load for the reviewer, making it harder/more time demanding to review (Noda et al., 2023). Which in turn can be a blocker for the rest of the team (Noda et al., 2023). At the very least, such changes need to be in separate commits.
- **Structure commits as logical, self-contained pieces:** This is one of the main arguments for conventional commits: they push you towards keeping commits atomic. Reviewing a slightly too big PR can often be way easier when doing it commit-by-commit (given that the commits are atomic).
- **Remove "Co-authored-by" / "Generated with" comments:** The AI tool cannot answer questions about the commits in review, so the extra information is not adding any valuable context. It can be valuable to know that a section was authored by an AI, but that is a topic for the next section.

### 6. Make the reviewer's job easier: put effort into the pull request description

We should strive to make the reviewer's life easier by providing more context about the changes in the pull request description. Remember, you as an author have more context around the changes than the reviewer who might be looking at the changes for the first time (Google Engineering, 2024). A pull request template is a good way to make this a habit, prompting for why the PR is needed, what it changes, and which issues it relates to. Whether you use one or not, a good description should communicate the following:

- **Intent:** Why is the pull request needed? What problems does it solve?
- **Overview:** What was changed? High-level description of what changes were implemented. No need to go deep into the low-level details here; we do not want a wall of text.
- **Risk areas:** Which changes would hurt most if they have a bug? No need for a complete risk analysis, just give the reviewer a heads-up into where meticulousness is required.
- **Uncertain areas:** Are there parts of the code which are not fully verified, that you are unsure about, or do not completely understand? Are you aware of any edge cases which are left out? Call out those areas, so the reviewer knows where to focus extra attention.
- **AI usage:** If AI generated or substantially rewrote parts of the PR, mention those areas and changes. This is also to point out for the reviewer where extra scrutiny might be needed. Real projects already require this (Ghostty, 2026).
- **Related issues:** Which issues are related to the PR. This can add more context about the intent and why the changes are done in the way they are done.

### 7. Be mindful about the team's total review capacity

We should treat review capacity within teams as a precious, finite resource. This is of course not an argument for submitting fewer pull requests, but it is a reminder that the review process can quickly become a bottleneck. Especially so in teams with high AI adoption (Faros AI, 2025). Notably, shorter tenure within the project or company (which does not imply general inexperience) correlates with higher AI use (Faros AI, 2025). As a result, the review load tends to fall disproportionately on the few tenured team members who have the deep context needed to evaluate the changes.

- **Rotate heavy reviews:** Do not let heavy reviews default to whoever is fastest to respond.
- **Normalize sizing feedback:** "This PR needs to be split up before I can review it properly" is a valid review outcome. The responsibility of the PR size and structure belongs to the author, and is also subject to review.
- **Leverage pair programming as review:** If you anticipate extensive changes, consider pivoting to pair programming instead of handing off a massive PR.
- **Match detail to AI usage:** The more AI-generated a PR is, the more detailed its description must be. The burden of verification belongs to the author, not the reviewer (Forsgren et al., 2021; Bacchelli & Bird, 2013).
- **Measure and assess:** Track PR and review metrics to make informed decisions. Indicators such as median PR size, time-to-first-review, time-to-merge, and code churn rate help evaluate whether a team is "moving too fast" and if its total review capacity remains sustainable.

### 8. Protect your brain: mind the cognitive cost

Remember, we are motivated by wanting to preserve ownership and comprehension of our projects to keep being able to evolve the shared mental model. We have outlined how high AI usage can decrease this shared comprehension across the team, but the same effect rings true for our own individual comprehension as well. Lately, there has been increased attention on how AI usage might affect our thinking. For instance, in a controlled EEG study, heavier LLM use was associated with a lower degree of cognitive activity during an essay writing task. Moreover, this result persisted even after removing access to the LLM (Kosmyna et al., 2025). Users of LLMs also reported the lowest sense of ownership of the text and struggled to accurately quote their own work (Kosmyna et al., 2025). When we let an LLM handle the hardest parts of problem-solving, we bypass the working memory strain our brains require to build long-term retention. We remove the cognitive friction, but that friction is precisely what we need to actually learn. We end up trading long-term technical mastery for immediate speed. Sometimes that might be an acceptable trade-off, but it should be a conscious decision we make.

Furthermore, we must be aware of the dopamine feedback loop: using AI to solve a problem often yields an immediate solution, triggering a dopamine spike in our brain. Over time, this conditioning lowers our tolerance for cognitive friction, tempting us to reach for LLMs for very minor obstacles and problems. In doing so, we risk offloading our primary asset: our critical thinking. Survey studies support this, showing that higher confidence in the AI tool correlates directly with lower degrees of critical thinking (Lee et al., 2025; Gerlich, 2025). These individual effects compound at the team level: an outsized focus on speed and output can amplify cognitive load, add new oversight labor, and raise expectations around pace, contributing to stress, burnout, and diminished work-life balance (Guizani et al., 2026).

- **Remember you have brakes:** Treat "I let AI handle something I do not quite understand" as a signal to slow down, not to speed up.
- **Guard your friction tolerance threshold:** Be mindful of when you reach for an AI tool. Forcing yourself through the initial friction builds real comprehension; at worst, it helps you write a better, more informed prompt.
- **Keep your skills sharpened:** Practice writing code without AI assistance regularly. This helps you keep your problem-solving capabilities and critical thinking active.

## References

- Bacchelli, A., & Bird, C. (2013). [Expectations, outcomes, and challenges of modern code review](https://www.microsoft.com/en-us/research/publication/expectations-outcomes-and-challenges-of-modern-code-review/). In *Proceedings of the 35th International Conference on Software Engineering (ICSE 2013)* (pp. 712–721). IEEE.
- Cohen, J. (2006). [Best kept secrets of peer code review (Cisco Systems case study); Best practices for peer code review](https://smartbear.com/learn/code-review/best-practices-for-peer-code-review/). SmartBear Software.
- Dooley, J. F. (2017). [Software development, design and coding: With patterns, debugging, unit testing, and refactoring](https://doi.org/10.1007/978-1-4842-3153-1). Apress.
- DORA, & Google Cloud. (2024). [2024 Accelerate State of DevOps Report](https://dora.dev/research/2024/dora-report/). Google Cloud.
- DORA, & Google Cloud. (2025). [State of AI-assisted software development 2025](https://dora.dev/research/2025/dora-report/). Google Cloud.
- Douglas, B. (2023, September 7). [Responsible AI pair programming with GitHub Copilot](https://github.blog/ai-and-ml/github-copilot/responsible-ai-pair-programming-with-github-copilot/). The GitHub Blog.
- Faros AI. (2025). [The AI productivity paradox: How AI coding assistants affect software engineering teams](https://www.faros.ai/blog/ai-software-engineering).
- Faros AI. (2026). [The AI engineering report 2026: The acceleration whiplash](https://www.faros.ai/blog/ai-acceleration-whiplash-takeaways).
- Forsgren, N., Storey, M.-A., Maddila, C., Zimmermann, T., Houck, B., & Butler, J. (2021). [The SPACE of developer productivity: There's more to it than you think](https://queue.acm.org/detail.cfm?id=3454124). *ACM Queue, 19*(1), 20–48.
- Fu, Y., Liang, P., Tahir, A., Li, Z., Shahin, M., Yu, J., & Chen, J. (2025). [Security weaknesses of Copilot-generated code in GitHub projects: An empirical study](https://doi.org/10.1145/3716848). *ACM Transactions on Software Engineering and Methodology, 34*(2), 1–28.
- Gerlich, M. (2025). [AI tools in society: Impacts on cognitive offloading and the future of critical thinking](https://doi.org/10.3390/soc15010006). *Societies, 15*(1), Article 6.
- Ghostty. (2026, February 3). [AI usage policy](https://github.com/ghostty-org/ghostty/blob/00c33eaf72af6c9b93d9fd8d54b6f7086612a95b/AI_POLICY.md) [Documentation file]. GitHub.
- GitClear. (2024). [Coding on Copilot: 2023 data suggests downward pressure on code quality](https://www.gitclear.com/coding_on_copilot_data_shows_ais_downward_pressure_on_code_quality).
- Gloaguen, T., Mündler, N., Müller, M., Raychev, V., & Vechev, M. (2026). [Evaluating AGENTS.md: Are repository-level context files helpful for coding agents?](https://arxiv.org/abs/2602.11988) arXiv.
- Google Engineering. (2024). [Small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html). Google Engineering Practices Documentation.
- Guizani, M., Subasinghage, M., Licorish, S. A., & Ouhbi, S. (2026). [At what cost? Software developers' well-being in the age of GenAI](https://arxiv.org/abs/2605.22349). In *Proceedings of the 34th ACM International Conference on the Foundations of Software Engineering (FSE 2026 Companion)*. ACM.
- Kalliamvakou, E. (2022, September 7). [Research: Quantifying GitHub Copilot's impact on developer productivity and happiness](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/). The GitHub Blog.
- Kosmyna, N., Hauptmann, E., Yuan, Y. T., Situ, J., Liao, X.-H., Beresnitzky, A. V., Braunstein, I., & Maes, P. (2025). [Your brain on ChatGPT: Accumulation of cognitive debt when using an AI assistant for essay writing task](https://arxiv.org/abs/2506.08872). arXiv.
- LLVM Project. (2026, March 5). [LLVM AI tool use policy](https://github.com/llvm/llvm-project/blob/6695f1d97f9615e6bbe5a5d40ea4496b7e84a3d9/llvm/docs/AIToolPolicy.md) [Documentation file]. GitHub.
- Lee, H.-P., Sarkar, A., Tankelevitch, L., Drosos, I., Rintel, S., Banks, R., & Wilson, N. (2025). [The impact of generative AI on critical thinking: Self-reported reductions in cognitive effort and confidence effects from a survey of knowledge workers](https://doi.org/10.1145/3706598.3713778). In *Proceedings of the 2025 CHI Conference on Human Factors in Computing Systems (CHI '25)*. ACM.
- METR. (2025, July 10). [Measuring the impact of early-2025 AI on experienced open-source developer productivity](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/).
- Min, S., Lyu, X., Holtzman, A., Artetxe, M., Lewis, M., Hajishirzi, H., & Zettlemoyer, L. (2022). [Rethinking the role of demonstrations: What makes in-context learning work?](https://aclanthology.org/2022.emnlp-main.759/) In *Proceedings of the 2022 Conference on Empirical Methods in Natural Language Processing (EMNLP 2022)* (pp. 11048–11064). Association for Computational Linguistics.
- Naur, P. (1985). [Programming as theory building](https://doi.org/10.1016/0165-6074(85)90032-8). *Microprocessing and Microprogramming, 15*(5), 253–261.
- Noda, A., Storey, M.-A., Forsgren, N., & Greiler, M. (2023). [DevEx: What actually drives productivity](https://queue.acm.org/detail.cfm?id=3595878). *ACM Queue, 21*(2), 28–42.
- Noy, S., & Zhang, W. (2023). [Experimental evidence on the productivity effects of generative artificial intelligence](https://doi.org/10.1126/science.adh2586). *Science, 381*(6654), 187–192.
- Paulsen, N. (2025). [Context is what you need: The maximum effective context window for real world limits of LLMs](https://arxiv.org/abs/2509.21361). arXiv.
- Pearce, H., Ahmad, B., Tan, B., Dolan-Gavitt, B., & Karri, R. (2022). [Asleep at the keyboard? Assessing the security of GitHub Copilot's code contributions](https://arxiv.org/abs/2108.09293). In *2022 IEEE Symposium on Security and Privacy (SP)* (pp. 754–768). IEEE.
- Peng, S., Kalliamvakou, E., Cihon, P., & Demirer, M. (2023). [The impact of AI on developer productivity: Evidence from GitHub Copilot](https://arxiv.org/abs/2302.06590) (Working Paper No. 2302.06590). arXiv.
- Perry, N., Srivastava, M., Kumar, D., & Boneh, D. (2023). [Do users write more insecure code with AI assistants?](https://arxiv.org/abs/2211.03622) In *Proceedings of the 2023 ACM SIGSAC Conference on Computer and Communications Security (CCS '23)* (pp. 2785–2799). ACM.
- Sadowski, C., Söderberg, E., Church, L., Sipiol, M., & Bacchelli, A. (2018). [Modern code review: A case study at Google](https://research.google/pubs/modern-code-review-a-case-study-at-google/). In *Proceedings of the 40th International Conference on Software Engineering: Software Engineering in Practice (ICSE-SEIP 2018)* (pp. 181–190). ACM.
- Stack Overflow. (2024). [Stack Overflow developer survey 2024](https://survey.stackoverflow.co/2024/professional-developers).
- Storey, M.-A. (2026). [From technical debt to cognitive and intent debt: Rethinking software health in the age of AI](https://arxiv.org/abs/2603.22106). arXiv.
- Truong, T. H., Baldwin, T., Verspoor, K., & Cohn, T. (2023). [Language models are not naysayers: An analysis of language models on negation benchmarks](https://aclanthology.org/2023.starsem-1.10/). In *Proceedings of the 12th Joint Conference on Lexical and Computational Semantics (\*SEM 2023)* (pp. 108–119). Association for Computational Linguistics.
- Willison, S. (2025, March 11). [Here's how I use LLMs to help me write code](https://simonwillison.net/2025/Mar/11/using-llms-for-code/). Simon Willison's Weblog.
