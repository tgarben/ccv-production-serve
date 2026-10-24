# CCV Production: Serving Positions

A simple site listing the Production serving positions. It is built by GitHub Pages (Jekyll), so there is nothing to install.

## Update a position
1. In GitHub, open the `_positions` folder and click a file (e.g. `lighting.md`).
2. Click the pencil icon, edit, then **Commit changes**.
3. The site updates in about a minute.

## Add a position
In `_positions`, click **Add file → Create new file**, name it `something.md`, and paste:

```
---
title: Position Name
team: Audio          # groups the card under this heading; a new team name makes a new section
order: 3             # sorts within a team (1 is first)
venues: Junior High, High School, Adults   # optional; leave this line out to show in all venues
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

## Venues
Venues (Junior High, High School, Adults) are listed in `_config.yml`. Visitors get filter buttons at the top, and you can share a direct link such as `.../ccv-production-serve/?venue=adults`.

In a position, add `venues: High School, Adults` to show it only there (names must match `_config.yml`). Leave the line out to show it everywhere. If a position differs by venue (different times or duties), make one file per venue, each with its own `venues:` line.

## Remove a position
Delete its file in `_positions`.

## Change the sign-up link, email, or intro text
Edit `_config.yml`.

## Publish
Push to GitHub, then **Settings → Pages → Deploy from a branch → main / (root)**.
