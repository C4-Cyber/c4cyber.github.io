# C4 Cyber - company website

Static single-page marketing site for **C4 Cyber Pty Ltd**, hosted on GitHub Pages at
[c4cyber.com.au](https://c4cyber.com.au).

## Stack
Plain HTML/CSS/JS - no build step. Fonts via Google Fonts. Deploys as-is to GitHub Pages.

## Structure
```
index.html          # the whole site (single page, anchored sections)
404.html            # branded not-found page
CNAME               # custom domain (c4cyber.com.au)
.nojekyll           # tell Pages to serve files verbatim (skip Jekyll)
robots.txt          # allows all crawlers, points to sitemap
sitemap.xml
assets/
  css/styles.css    # all styling (CSS variables at top for theming)
  js/main.js        # nav, mobile menu, scroll reveals
  img/              # logo mark, horizontal logo, favicons
```

## Editing common things
- **Colours / theme** - CSS variables at the top of `assets/css/styles.css` (`:root`).
- **Services** - the `.cards` block in `index.html` (`#services`).
- **Contact details / address / ABN** - footer + contact section in `index.html`,
  and the JSON-LD block in `<head>`.
- **Copy** - all inline in `index.html`.

## Local preview
```bash
cd c4cyber-website
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages
This repo maps to the apex domain `c4cyber.com.au` (DNS already points at GitHub Pages
`185.199.108-111.153`). Publish by pushing to the Pages branch of the site repo:

```bash
git init
git add -A
git commit -m "Launch new C4 Cyber website"
git branch -M main
git remote add origin https://github.com/<owner>/<repo>.git
git push -u origin main --force   # replaces the old placeholder
```

Then in the repo: **Settings → Pages → Build and deployment → Deploy from a branch →
`main` / root**. The `CNAME` file keeps the custom domain, and "Enforce HTTPS" should
stay enabled.
