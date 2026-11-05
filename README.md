# Max's Soundlog

A shareable listening-history site for Max. Friends can browse tracks, artists, albums, shows, and daily listening history without an account. The website reads the date-keyed JSON from `data.json` and does not provide a visitor upload button.

> **Before sharing:** the current `data.json` is a reconstructed excerpt of the example from the request, not the full original history. Its artist and album entries were reconstructed from tracks. Replace it with the original JSON for exact, complete results.

## Update your music

1. Replace the contents of **`data.json`** with your original JSON object, using the same format as `example-data.json`.
2. Preview the website with a local web server:
   ```bash
   cd soundlog
   python3 -m http.server 8000
   ```
3. Open `http://localhost:8000`. Refresh after changing `data.json` to see the updated history.

When the website is served over HTTP, it reads `data.json` each time the page loads. Previously imported data in a visitor's browser is ignored.

## Share with friends

Publish **both `index.html` and `data.json` in the same folder** on a static host such as GitHub Pages or Netlify, then share the website link. The website does not automatically upload or publish itself.

The published JSON, including all original fields and listening history, is accessible to anyone with the link. Remove anything you do not want to share before publishing. Cover art may load from Spotify or the image URLs in the JSON.

### Share a single HTML file instead

The HTML includes an embedded copy of the data for direct file opening and restricted previews. After changing `data.json`, run this command before sharing `index.html` by itself:

```bash
python3 build.py
```

The builder packages the current `data.json`, styles, code, fonts, and example cover thumbnails into `index.html`. A directly opened HTML file cannot automatically read the neighboring JSON file because of browser security restrictions. When hosted over HTTP, changing `data.json` does not require a rebuild, but rebuilding also updates the embedded fallback.

## Dropdown menus

Use the custom date, theme, language, and sorting menus with a mouse, touch, or keyboard. Arrow keys move through choices, Enter or Space selects, and Escape closes the menu without changing it.

## Language

English is the default. Visitors can switch between **English** and **Deutsch** using the language menu at the top. The choice is saved in their browser when storage is available; track names and original JSON fields remain unchanged.

## Light and dark mode

The theme follows each visitor’s device setting by default. Use the **System / Light / Dark** menu at the top to choose a mode; the choice is saved in that browser when storage is available.

## About the numbers

- **Total playback** is the sum of the daily `playbackMs` values. Zero remains zero.
- **Plays** are summed from each track or episode's `count`.
- **Item time** is summed from the item's `ms`, separately from playback. Negative or missing durations are treated as unknown but remain visible in the original JSON.
- Items are grouped by their original JSON keys. Podcasts, non-Spotify keys, missing artist URIs, Spotify image URIs, and standard image URLs are supported.
- Date ranges are measured back from the latest recorded date, not from the current day.

## Editing the design

`app.js`, `site.css`, and `index.template.html` are the readable source files. Run `python3 build.py` after changing them to rebuild `index.html`. Fonts and example cover thumbnails used by the builder are in `.buildassets/`.
