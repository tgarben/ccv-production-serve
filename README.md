# CCV Production: Serving Positions

Plain HTML, CSS and JavaScript. There is no build step. Each position is a Markdown file that the page loads and displays.

## Preview locally
Open the folder in VS Code and use **Live Server** (right-click `index.html` → Open with Live Server). Opening `index.html` by double-clicking won't work, because browsers block loading the position files that way.

## Venues, leads and schedules (`config.js`)
Each venue (Junior High, High School, Adults) is listed in `config.js` with:
- `room`: where it meets. Adults and High School share the Auditorium.
- `minAge`: shown when someone picks that venue.
- `leadName`, `leadRole` (optional), `leadEmail`: the contact for that venue. The "Ready to jump in?" section switches to the lead of the venue someone picked.
- `schedule`: the typical weekend (call time, run-through, services). It shows on every position in that venue, so a time change is made once, here.

Other settings in `config.js`: the sign-up link, the email subject, the quiz questions and the glossary terms.

## Update a position
Edit its file in `positions/` (e.g. `positions/lighting.md`) and commit. On GitHub you can do this with the pencil icon.

## Add a position
1. Create `positions/something.md`:

```
---
title: Position Name
venues: High School, Adults
order: 7
summary: One short line shown on the card.
gear: Students Venue: Thing used there | Auditorium: Thing used there
fit: technical, team, beginner
---

## What you do
...

## Skills & training
...
```

2. Add `"something.md"` to the list in `positions/index.json`. A file that isn't listed there won't show up.

- `venues` is optional. Leave it out to show the position in every venue. Names must match `config.js`.
- `order` sorts the cards (1 is first).
- `gear` is optional. Name the room, then what's used there, and separate rooms with `|`. When someone picks a venue, only that room's line shows.
- `fit` feeds the "Find your fit" quiz (see below). A position without it never appears in quiz results.
- `level: experienced` marks a position that isn't for first-timers. The quiz won't recommend it to someone who answers that they have no experience.
- `image` and `video` are optional (see Photos and video below).
- The card also shows "A typical weekend" and "Who you serve with" automatically, from `config.js`.
- `team` is optional. If you add it to positions, the cards are grouped under team headings.

## Remove a position
Delete its file and remove its line from `positions/index.json`.

## Photos and video
- **Photo:** put the file in `assets/img/` and add `image: assets/img/camera.jpg` to the position. Add `alt: A short description` for screen readers (it falls back to the title). Keep photos under about 300 KB so the page stays fast.
- **Video:** add `video:` with a YouTube or Vimeo link, or a path to an `.mp4` in the repo. If a video is set, it replaces the photo, except that for an `.mp4` the photo becomes its cover image.

## "Find your fit" quiz
The questions and answers live in `config.js`. Each answer adds tags (like `technical` or `team`), and a position scores a point for every tag it shares with the answers, using the tags in its `fit:` line. The top three show up as results, limited to positions in the venue the visitor has picked and, for someone with no experience, to positions that aren't marked `level: experienced`. Ties go to the more specific position (the one with fewer tags to match). If nothing matches, the first few positions are shown as places to start. To change the quiz, edit the questions in `config.js`; to change who it recommends, edit each position's `fit:` line.

## Glossary
Add terms to `glossary` in `config.js`. The first mention of each term in a card is underlined, and tapping it shows the explanation. All terms are also listed in a Glossary at the bottom of the page.

## Global notes
"One weekend a month", "Come watch first" and "Before you serve" are plain HTML near the top of `index.html`, inside the `notes` section. Edit the text there.

## Share a venue link
`https://tgarben.github.io/ccv-production-serve/?venue=adults` (also `junior-high`, `high-school`).

## CCV brand assets
`assets/ccv/` holds files copied from ccv.church (logo, favicon, orange strip, and two photos used in the hero and the bottom call-to-action). The page uses the free Google font Heebo, which CCV's site also uses for body text.

## Publish
Push to `main`. GitHub Pages (Settings → Pages → Deploy from a branch → main / root) serves the files as they are.
