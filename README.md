# MtnCargo Landing Page

Static one-page website for MtnCargo — an adventure cargo bike concept for
gravel, bikepacking, off-road exploration and one-night trips.

**Editing the texts?** You do not need this file. See **[CONTENT.md](CONTENT.md)**.

---

## Project structure

```
.
├── index.html            One-pager
├── imprint.html          Imprint / Impressum (renders content/imprint.*.md)
├── privacy.html          Privacy policy / Datenschutz (renders content/privacy.*.md)
│
├── style.css             All styling
├── i18n.js               Content loading, markdown rendering, language switch
├── script.js             Scroll reveal, parallax, anchor scrolling
│
├── content/              ← all visible text lives here
│   ├── site.en.md
│   ├── site.de.md
│   ├── imprint.en.md
│   ├── imprint.de.md
│   ├── privacy.en.md
│   └── privacy.de.md
│
├── logo.svg
├── images/
│   └── image1.jpg … image6.jpg
│
├── CONTENT.md            Guide for editors
└── README.md
```

---

## Content and languages

All text is stored as Markdown in `content/`, separated from the markup so
that non-developers can edit it on GitHub. `i18n.js` fetches the file for
the active language, converts it to HTML and injects it into the page.

- **Default language: English.** There is no browser-language sniffing.
- Visitors switch languages with the discreet `EN / DE` control in the
  top right corner.
- The choice is remembered in `localStorage` and applied on the next visit.
- A language can also be linked directly: `?lang=de` / `?lang=en`.
- Switching triggers a page reload. This is intentional — it keeps the
  captcha language, the meta tags and Brevo's hidden `locale` field
  consistent instead of patching third-party widgets in place.
- If a translated file fails to load, the site falls back to English.

Only a small, safe subset of Markdown is supported (bold, italic, links,
headings, lists, line breaks). Raw HTML in the content files is escaped on
purpose, so a typo by an editor can never break or compromise the page.

### Adding a third language

1. Copy `content/site.en.md` to `content/site.<code>.md` and translate it.
   Do the same for `imprint` and `privacy`.
2. Add the code to `LANGS` at the top of `i18n.js`.
3. Add the Brevo validation strings for it to `brevoFallback` in `i18n.js`.

---

## Images

| File | Usage |
|---|---|
| `image1.jpg` | Hero |
| `image2.jpg` | Adventure / gravel section |
| `image3.jpg` | Bikepacking section |
| `image4.jpg` | Outdoor adventure section |
| `image5.jpg` | Lifestyle section |
| `image6.jpg` | Closing image |

Recommended: JPG, sRGB, 2400–3000 px wide, 250–600 KB each. Keep an eye on
the total weight — this is a photography-led page and images dominate the
load time.

---

## Signup form (Brevo)

The form is the official Brevo embed. Three things it depends on:

1. `https://sibforms.com/forms/end-form/build/sib-styles.css` in `<head>`
2. `https://sibforms.com/forms/end-form/build/main.js` at the end of `<body>`
3. `https://challenges.cloudflare.com/turnstile/v0/api.js` for the captcha,
   plus the `window.LOCALE` / error-message globals set immediately before it

> These three scripts were missing at one point, which silently broke the
> form: the markup rendered fine but nothing was ever submitted. If the form
> stops working, check for them first.

Do **not** change:

- the `action` URL of `#sib-form`
- the element ids `sib-form`, `sib-container`, `sib-captcha`,
  `error-message`, `success-message`
- the hidden fields `email_address_check` (honeypot) and `locale`
- the Turnstile `data-sitekey`
- the `type="text"` on the email input — Brevo validates it itself, and
  native browser validation would fire first with a competing message

Appearance is controlled entirely from `style.css` (section
*Brevo form overrides*). The corner radius of the input and the submit
button comes from the `--radius-control` token in `:root`.

No Brevo login is required for the form to work — the `action` URL is
public. A login is only needed to read the collected contacts, to change
the double opt-in emails or to generate a new form URL.

---

## Local development

The content is fetched at runtime, so opening `index.html` directly from
the file system will not work. Serve the folder instead:

```
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

---

## Deployment

Fully static — no Node.js, no npm, no build step. Works on GitHub Pages,
Codeberg Pages, Netlify or Cloudflare Pages.

For GitHub Pages: *Settings → Pages → Source: Deploy from a branch → main / root*.

---

## Design direction

Editorial outdoor aesthetic: gravel culture, bikepacking, minimal product
communication, large photography, strong typography.

---

## Possible future extensions

- Product specifications and frame details
- Geometry page
- Press section
- Dealer signup
- Rider stories
