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
fit: technical, audio, team, beginner
image: assets/img/my-photo.jpg
video: https://www.youtube.com/watch?v=XXXXXXXXXXX
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
- `fit` feeds the "Find your fit" quiz (see below). Optional, but a position without it never appears in quiz results.
- `image` and `video` are optional (see Photos and video below).
- If a position differs by venue (different times or duties), make one file per venue, each with its own `venues:` line.

## Photos and video
- **Photo:** put the file in `assets/img/` and add `image: assets/img/camera.jpg` to the position. Add `alt: A short description` for screen readers (it falls back to the title). Keep photos under about 300 KB so the page stays fast.
- **Video:** add `video:` with a YouTube or Vimeo link, or a path to an `.mp4` in the repo. If a video is set, it replaces the photo, except that for an `.mp4` the photo becomes its cover image.

## "Find your fit" quiz
The questions and answers live in `config.js`. Each answer adds tags (like `technical` or `team`), and a position scores a point for every tag it shares with the answers, using the tags in its `fit:` line. The top three show up as results. To change the quiz, edit the questions in `config.js`; to change who it recommends, edit each position's `fit:` line.

## Glossary
Add terms to `glossary` in `config.js`. The first mention of each term in a position's text is underlined, and tapping it shows the explanation. All terms are also listed in a Glossary at the bottom of the page.

## Global notes ("One weekend a month", "Come watch first")
These are plain HTML near the top of `index.html`, inside the `notes` section. Edit the text there.

## Remove a position
Delete its file and remove its line from `positions/index.json`.

## Change the sign-up link, contact info, or venues
Edit `config.js`. The headline and intro text are in `index.html`.

## Share a venue link
`https://tgarben.github.io/ccv-production-serve/?venue=adults` (also `junior-high`, `high-school`).

## Publish
Push to `main`. GitHub Pages (Settings → Pages → Deploy from a branch → main / root) serves the files as they are.
