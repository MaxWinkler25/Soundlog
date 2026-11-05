# Max’s Soundlog — Render deployment

This is the complete site and build folder for a **Render Static Site**. The build uses only Node.js built-ins: no packages, API keys, backend, or start command are required.

> **Before publishing:** `data.json` currently contains a reconstructed example, not Max’s full original listening history. Replace it with the original JSON if you want exact, complete statistics. The site and its full `data.json` will be publicly accessible to anyone who can reach the site.

## Deploy on Render

1. Download and extract the ZIP. Upload **the contents of the `Soundlog-Render` folder** to the root of a GitHub, GitLab, or Bitbucket repository. Include the `assets` folder, `build.js`, `data.json`, and all the other source files. Do not upload the ZIP as a single file to the repository.
2. In the [Render Dashboard](https://dashboard.render.com/), choose **New → Static Site** and connect that repository.
3. Select the branch containing the files, such as `main`. If these files are at the repository root, leave **Root Directory** blank.
4. Enter these settings:
   - **Build Command:** `node build.js`
   - **Publish Directory:** `public`
5. Click **Deploy Static Site** (or **Create Static Site**). When the build completes, Render displays the new `onrender.com` URL.

Alternatively, use **New → Blueprint** and connect the repo; `render.yaml` describes the same Static Site settings. No paid web service or database is needed for the website itself. Render’s included usage limits and plans may change; check your dashboard for current details.

## Update the listening history

Replace the **root `data.json`** with your real date-keyed JSON, then commit and push the change to the branch connected to Render. With automatic deploys enabled, Render rebuilds the site and refreshes its embedded fallback on every push. Do not edit `public/data.json` alone; the next build overwrites it from the root file. The site reads the published `data.json` when visitors load it.

## Build and preview locally

You need Node.js. From this folder run:

```bash
node build.js
```

The finished files are `public/index.html` and `public/data.json`. To preview them over HTTP, if you also have Python installed:

```bash
python3 -m http.server 8000 --directory public
```

Then visit `http://localhost:8000`. You can also open `public/index.html` directly; it uses the embedded copy of the JSON.

## What is included

- `render.yaml` — optional Render Blueprint for a Static Site.
- `build.js` — generates the standalone HTML and copies the current JSON into `public`.
- `data.json` — the owner-editable listening history; `example-data.json` is a format reference.
- `index.template.html`, `app.js`, `site.css`, and `assets/` — source, fonts, and sample cover thumbnails.
- `public/` — already-built files. Render rebuilds these from the root source files at deploy time.

The website supports English and German, System/Light/Dark theme options, custom accessible dropdowns, date filters, browsing, details, and original JSON. No visitor import button is provided.
