# MtnCargo Landing Page

Static one-page website for MtnCargo.

An adventure cargo bike concept focused on:

- Gravel
- Bikepacking
- Off-road exploration
- Outdoor adventures
- One-night trips


## Project Structure
MtnCargo/
├── index.html
├── style.css
├── script.js
├── README.md
│
├── logo.svg
│
└── images/
├── image1.jpg
├── image2.jpg
├── image3.jpg
├── image4.jpg
├── image5.jpg
└── image6.jpg


## Images

The website expects six images:

| File | Usage |
|---|---|
| image1.jpg | Hero image |
| image2.jpg | Adventure / gravel section |
| image3.jpg | Bikepacking section |
| image4.jpg | Outdoor adventure section |
| image5.jpg | Lifestyle section |
| image6.jpg | Closing image |


Recommended image specifications:

- JPG
- sRGB
- Minimum width: 2048px
- Recommended width: 3000px+
- Optimized file size: 500–900 KB


## Logo

Place the logo here:

/logo.svg

Recommended:

- SVG format
- Square aspect ratio
- Transparent background


## Deployment

This project is fully static.

No:

- Node.js
- npm
- build process
- framework

required.


It can be hosted directly with:

- Codeberg Pages
- GitHub Pages
- Netlify
- Cloudflare Pages


## Brevo Integration

The signup form uses Brevo with:

- Double Opt-In
- Email confirmation
- Cloudflare Turnstile protection


The Brevo form is embedded directly inside:

index.html

Do not modify:

- form action URL
- hidden fields
- Turnstile configuration
- Brevo scripts


## Local Testing

Open index.html directly in a browser.

For full testing (recommended):

python3 -m http.server

Then open: 

http://localhost:8000


## Design Direction

MtnCargo follows an editorial outdoor aesthetic:

- Gravel culture
- Bikepacking
- Adventure cycling
- Minimal product communication
- Large photography
- Strong typography


## Future Extensions

Possible additions:

- Product specifications
- Frame details
- Geometry page
- Press section
- Dealer signup
- Rider stories