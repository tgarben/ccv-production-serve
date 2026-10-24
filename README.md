# CCV Production: Serving Positions

Plain HTML, CSS and JavaScript. There is no build step. Each position is a Markdown file that the page loads and displays.

## Preview locally
Open the folder in VS Code and use **Live Server** (right-click `index.html` → Open with Live Server). Opening `index.html` by double-clicking won't work, because browsers block loading the position files that way.

## Update a position
Edit its file in `positions/` (e.g. `positions/lighting.md`) and commit. On GitHub you can do this with the pencil icon.

## Add a position
1. Create `positions/something.md`:

```
---
title: Position Name
team: Audio
order: 3
venues: Junior High, High School, Adults
summary: One short line shown on the card.
---

## What you do
...

## A typical weekend
- 7:30 AM: ...

## Skills & training
...

## Who you serve with
...
```

2. Add `"something.md"` to the list in `positions/index.json`. A file that isn't listed there won't show up.

- `team` groups cards under a heading; a new team name makes a new section.
- `order` sorts cards within a team (1 is first).
- `venues` is optional. Leave it out to show the position in every venue. Names must match `config.js`.
- If a position differs by venue (different times or duties), make one file per venue, each with its own `venues:` line.

## Remove a position
Delete its file and remove its line from `positions/index.json`.

## Change the sign-up link, contact info, or venues
Edit `config.js`. The headline and intro text are in `index.html`.

## Share a venue link
`https://tgarben.github.io/ccv-production-serve/?venue=adults` (also `junior-high`, `high-school`).

## Publish
Push to `main`. GitHub Pages (Settings → Pages → Deploy from a branch → main / root) serves the files as they are.
