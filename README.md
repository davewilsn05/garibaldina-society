# Garibaldina Society redesign concept

A self-contained static redesign built from the Society's authentic website archive and the Garibaldina tenant assets in CommonCircle.

- Live site: <https://garibaldina-society.vercel.app/>
- GitHub: <https://github.com/davewilsn05/garibaldina-society>

## Project structure

- `index.html` — semantic one-page site
- `styles.css` — responsive visual system and layouts
- `script.js` — navigation, active states, and progressive reveal behavior
- `assets/` — curated local Society photography, branding, and type
- `vercel.json` — Vercel deployment and security-header configuration

## Instagram carousel

The near-footer carousel uses optimized, locally hosted Society photography and links every card to
[`@garibaldinasociety`](https://www.instagram.com/garibaldinasociety/?hl=en). It is intentionally curated
rather than fetched in the browser: Instagram profile feeds require an authenticated server-side API or a
third-party widget, and temporary image URLs are not reliable site assets.

To refresh the carousel, replace `assets/instagram-01.webp` through `assets/instagram-08.webp` and update the
corresponding alt text in `index.html`.

## Preview locally

Double-click `serve-redesign.command`, or run:

```sh
./serve-redesign.command
```

Open <http://127.0.0.1:8080/>.

The production member portal links point to <https://garibaldina.commoncircle.app/> and its direct dashboard, events, messages, documents, and membership-application routes.
