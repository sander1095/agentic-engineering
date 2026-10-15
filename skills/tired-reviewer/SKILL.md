---
name: tired-reviewer
description: Makes text concise and readable by running a fresh "tired reviewer" over a draft, applying its feedback, and repeating until it has nothing left to complain about. Use when writing, reviewing, or rewriting text a busy person must read, such as bug reports, pull request descriptions, docs, READMEs, release notes, design docs, or emails, or when asked to make text shorter, clearer, less wordy, or more to the point.
license: MIT
metadata:
  author: sander1095
  version: "1.0"
---

# Tired reviewer

Reviewers who already know the context forgive bad writing. Real readers don't: they skim, have no patience, and don't know what you know. This skill simulates that reader with a fresh, context-free reviewer, and loops until it's satisfied.

## Modes

- **Review**: run one round and report the feedback. Don't change the text.
- **Rewrite** (default): run the loop below until the reviewer is happy.

## Loop

1. **Get the facts right first.** Verify claims, versions, links, and code samples before polishing. The reviewer doesn't check facts; you own them.
2. **Write the draft to a file.** The reviewer reads only that file.
3. **List the must-keep constraints.** These are required template sections, required content, and anything the user asked for. Put them in the reviewer prompt so the reviewer doesn't ask to remove them.
4. **Start a fresh reviewer every round** with the prompt below. "Fresh" means no memory of earlier rounds or of your conversation. A reviewer that remembers its earlier feedback checks whether you followed it, instead of reading like a newcomer.
   - If you can't start subagents, review in a separate step yourself: re-read only the file, adopt the persona, and write the feedback down before editing. Tell the user this is weaker than a fresh reviewer.
5. **Triage the feedback.**
   - Apply what makes the text shorter or clearer.
   - The reviewer has no context and can be wrong. Check any factual claim it makes before acting on it. Never trade accuracy or required content for brevity.
   - After changing code samples, commands, or links, re-run or re-check them.
6. **Repeat** until the reply ends with `VERDICT: HAPPY`. Then apply cheap optional suggestions without another round.
   - Stop after 4 rounds and report the remaining disagreements to the user.
7. **Report** the final text, the number of rounds, the notable changes, and any suggestion you declined, with the reason.

## Reviewer prompt

Fill in the `{placeholders}` and pass the prompt verbatim.

```text
Role-play: you're a tired {audience} at the end of a long day, reading {document kind}. You don't want to read lots of prose. You hate hedging, repetition, filler, and beating around the bush. You want to know in seconds: {what the reader needs}.

Read the draft in `{file path}`. Only read that file; don't investigate or run anything else.

Give blunt, concrete feedback as a short bullet list: what to cut, what to shorten, what's confusing, what's missing, and what you'd skip over. Quote the exact text you're talking about. If nothing really bothers you, say so; don't invent nitpicks.

Constraints the author must keep (don't ask to remove these; you can ask to shorten or restructure them):
{constraints, one per bullet}

{Optional context, e.g. "The title will be: ..."}

End your reply with exactly one line: `VERDICT: HAPPY` if you'd read this without complaint, or `VERDICT: NOT HAPPY` otherwise.
```

Suggested values:

| Document | `{audience}` | `{what the reader needs}` |
|---|---|---|
| Bug report | maintainer triaging issues | what's broken, how to reproduce it, what's expected, whether it's a regression |
| Pull request | maintainer reviewing a pull request | what was broken, why, and what changed |
| Docs / README | developer who wants to use this now | what it does, how to start, the gotchas |
| Status update / email | busy stakeholder | what happened, and what they need to do |

## Write it this way the first time

These are the most common points the reviewer raises. Fixing them up front saves rounds.

- Put the problem or answer in the first sentence.
- Show, don't tell. A short example with actual vs. expected output beats paragraphs.
- Say each thing once.
- Don't depend on content the reader may skip, such as a collapsed section or "step 2" defined elsewhere. Name the thing directly.
- Replace internal jargon ("the hook") with the real name, or define it on first use.
- Give exact values you checked ("9.0.21"), not vague ranges ("9.0.x").
- Keep a date or number only if it explains something.
- Mark unverified claims as unverified, or drop them.
- Explain odd lines in code samples with a short comment.
- Don't merge cases that happen under different conditions into one sentence.
- Cut hedges and offers ("I think", "it seems", "happy to change this").
