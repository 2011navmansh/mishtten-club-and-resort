# MISHTTEN CLUB & RESORT — Website

A dark golden luxury ("Noir Royale · Golden") website for Mishtten Club & Resort,
Near Kota, Munderi, Semli Patpariya, Jhalawar, Rajasthan 326001.

## Pages
| File | Page |
|---|---|
| index.html | Home — hero video, rooms rail, experiences, dining, wedding band, reviews, gallery, FAQ |
| about.html | Story, founders, values, journey timeline |
| rooms.html | 5 room categories (full detail rows) + in-room standards |
| dining.html | Rajsi (fine dining), Aarna (pool side), Andaz-e-Shahi (jacuzzi hall), private dining |
| menu.html | Full Rajsi menu card — 24 sections, 235 items + PDF download |
| amenities.html | 6 groups — Wellness, Comfort, Dining, Family, Safety, Services |
| weddings.html | Venues, two-day package, ritual timeline, glimpse gallery |
| events.html | Venues, occasions, services |
| gallery.html | 40 photos with category filter + lightbox |
| contact.html | Contact cards, booking form (WhatsApp), map, directions |

## Theme & Design
- Deep golden-black "Noir Royale" look — Cinzel (display) + Manrope (body) + Noto Serif Devanagari.
- Dark by default; light "Champagne" mode via the moon/sun button in the header
  (saved as `mishtten-theme` in localStorage).
- Aurora orbs, glassmorphism, gold gradients, reveal-on-scroll animations.

## Tech
- Pure HTML + CSS + vanilla JS. No frameworks, no build step.
- `css/main.css` — full design system (tokens, components, responsive).
- `js/main.js` — loader, theme toggle, drawer, reveals, counters, quotes slider,
  room rail drag, gallery filter + lightbox, menu scroll-sync, booking form → WhatsApp,
  newsletter, back-to-top.

## Run locally
```
python -m http.server 8801 --bind 127.0.0.1
```
Then open http://127.0.0.1:8801

## Media
All images/videos are hotlinked from the resort's own CDN. To replace any media,
see `media-links.txt` — it lists every asset, page by page.

## Config
- WhatsApp / Call number: `js/main.js` → `var WHATSAPP = "917230066807";`
- Phones: +91 72300 66807 / +91 72300 66805 · mishttenclubandresort@gmail.com
- Socials: instagram.com/mishttenresort · facebook.com/mishttenresort · youtube.com/@MishttenClubResort
- Menu prices: Govt. taxes extra as applicable.

## GOLD EDITION v3 (motion layer, latest)
- No custom cursor (removed by request — native cursor arrow).
- Lerp-smoothed native wheel scrolling (position: sticky safe), parallax layers
  (`.hero__media`, `.band__bg`, `.cta__bg`, collage), hero scroll fade,
  staggered grid reveals, media curtain-lift veils, gold line-draw on section
  headings, magnetic buttons, kicker decode effect.
- Search "GOLD EDITION v3" at the end of `css/main.css` / `js/main.js`.

## GOLD EDITION v2
- English-only content — no Hindi/Devanagari or Hinglish words anywhere.
- Cinematic polish: page-transition curtain, gold dust in hero,
  letter-by-letter headline reveals, MISHTTEN outline watermarks, vertical hero labels,
  palace-crenellation section edges, gold corner brackets on cards, 3D tilt on cards,
  bigger display typography, btn auto-shine.
- All v2 layers are append-only: end of `css/main.css` (search "GOLD EDITION v2")
  and end of `js/main.js`. Animations start when `body.is-live` is set (post-loader).
