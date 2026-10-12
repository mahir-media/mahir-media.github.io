<div align="center">

<a href="https://mahir-media.github.io">
  <img src="assets/og-image.png" alt="Mahir Media. Smart. Bold. Creative. Click to open the live website." width="720">
</a>

### Bespoke websites for businesses that refuse to blend in.

[**Visit the live website**](https://mahir-media.github.io) &nbsp;|&nbsp; [Start a project](https://mahir-media.github.io/#contact) &nbsp;|&nbsp; [LinkedIn](https://www.linkedin.com/in/sourav-burman/)

</div>

---

## About

Mahir Media is a Kolkata digital studio that designs and builds one-of-a-kind websites. This repository is the studio's own website, and it doubles as a living case study of the work: a 3D brand mark, a scroll-driven story and a contact flow, all written by hand without a framework.

## Highlights

- **3D brand mark.** The twin-heart infinity mark is rebuilt as a gold 3D object with Three.js. It reacts to the pointer and turns as you scroll.
- **Scroll-driven story.** GSAP ScrollTrigger drives a pinned hero, a horizontal work section on desktop and a circular reveal into the process section.
- **Light and dark themes.** The choice is remembered between visits.
- **Ambient sound and soft haptics.** A quiet piano loop with a clear on/off control, plus gentle tap sounds and vibration on supported phones.
- **Contact bubble.** A floating call to action opens a short form. Enquiries land in a Google Sheet and in the studio's inbox.
- **Built with accessibility in mind.** Semantic HTML, visible keyboard focus, labelled controls and full support for reduced-motion preferences.
- **Search and sharing ready.** Open Graph and Twitter cards, JSON-LD organisation data, sitemap, robots file and a branded 404 page.
- **No framework, no build step.** Static files that deploy straight to GitHub Pages.

## Tech stack

| Layer | Tools |
| --- | --- |
| Markup, styling, behaviour | HTML5, CSS3, vanilla JavaScript |
| Scroll animation | GSAP 3 and ScrollTrigger |
| 3D | Three.js r128 |
| Typography | Playfair Display and Montserrat (Google Fonts) |
| Contact form | Google Apps Script writing to Google Sheets |
| Hosting | GitHub Pages |

## Project structure

```text
.
├── index.html            Page structure, SEO metadata and structured data
├── style.css             Design tokens, layout, light and dark themes
├── script.js             3D scene, scroll story, cursor, sound and contact form
├── 404.html              Branded not-found page
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── mark.svg          Twin-heart infinity mark, traced to vector
│   ├── wordmark.png      Mahir Media wordmark
│   ├── og-image.png      Social sharing card (1200 x 630)
│   ├── photo.webp        Founder portrait
│   └── audio/piano.mp3   Ambient loop (licensed separately)
└── docs/
    └── form_to_sheet.gs  Google Apps Script behind the contact form
```

## Run it locally

```bash
git clone https://github.com/mahir-media/mahir-media.github.io.git
cd mahir-media.github.io
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` directly also works, but a local server is closer to production.

## Customise

- **Add a project.** In `index.html`, copy one `<article class="panel">` inside `#work` and edit it.
- **Add testimonials.** Only publish real, permissioned quotes, as a new section after `#work`.
- **Change the colours.** Edit the variables in `:root` at the top of `style.css`. `--ac` is the gold accent and `--em` is the ember accent.
- **Change the music.** Replace `assets/audio/piano.mp3`.
- **Contact form.** Follow the steps at the top of `docs/form_to_sheet.gs`, then put the web app URL in the `data-ep` attribute of the form in `index.html`.

## Deployment

The site is served by GitHub Pages from the `main` branch, root folder (Settings > Pages).

To use a custom domain:

1. Add the domain under Settings > Pages > Custom domain. This creates a `CNAME` file.
2. At your DNS provider, add four `A` records for the apex domain pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, and a `CNAME` record for `www` pointing to `mahir-media.github.io`.
3. Tick **Enforce HTTPS** once GitHub offers it.
4. Update the site URL used in the canonical link, Open Graph tags, `sitemap.xml` and `robots.txt`.

## Credits and licence

Designed and built by [Sourav Burman](https://www.linkedin.com/in/sourav-burman/) for Mahir Media.

&copy; 2026 Mahir Media. All rights reserved. The ambient piano track is licensed separately and is not covered by this repository.
