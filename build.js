/* Build the standalone site and its JSON into Render's publish directory.
   Uses only Node.js built-ins; no npm install or external network is needed. */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const font = name => fs.readFileSync(path.join(root, 'assets', name)).toString('base64');

// Escape closing tags so JSON values can never terminate their script element.
const inlineJSON = value => JSON.stringify(value).replace(/<\//g, '<\\/');
let data;
try {
  data = JSON.parse(read('data.json'));
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('The top-level value must be an object keyed by dates.');
  }
} catch (error) {
  console.error('Unable to build: data.json is invalid. ' + error.message);
  process.exit(1);
}
const covers = JSON.parse(read('assets/covers.json'));
const latin = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const ext = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C4,U+2113,U+2C60-2C7F,U+A720-A7FF';
const fontCSS = [
  `@font-face{font-family:'DM Sans';font-style:normal;font-weight:100 900;font-display:swap;src:url(data:font/woff2;base64,${font('dmsans-latin.woff2')}) format('woff2');unicode-range:${latin}}`,
  `@font-face{font-family:'DM Sans';font-style:normal;font-weight:100 900;font-display:swap;src:url(data:font/woff2;base64,${font('dmsans-ext.woff2')}) format('woff2');unicode-range:${ext}}`,
  `@font-face{font-family:'DM Serif Display';font-style:italic;font-weight:400;font-display:swap;src:url(data:font/woff2;base64,${font('dmserif-latin.woff2')}) format('woff2');unicode-range:${latin}}`,
  `@font-face{font-family:'DM Serif Display';font-style:italic;font-weight:400;font-display:swap;src:url(data:font/woff2;base64,${font('dmserif-ext.woff2')}) format('woff2');unicode-range:${ext}}`
].join('\n');
const replacements = [
  ['/*__FONT_CSS__*/', fontCSS],
  ['/*__SITE_CSS__*/', read('site.css')],
  ['/*__EMBEDDED_JSON__*/', inlineJSON(data)],
  ['/*__COVERS_JSON__*/', inlineJSON(covers)],
  ['/*__APP_JS__*/', read('app.js').replace(/<\/script/g, '<\\/script')]
];
let html = read('index.template.html');
for (const [marker, value] of replacements) {
  if (html.split(marker).length !== 2) throw new Error(`Expected exactly one ${marker} in index.template.html`);
  html = html.replace(marker, () => value);
}
const output = path.join(root, 'public');
fs.mkdirSync(output, {recursive:true});
fs.writeFileSync(path.join(output, 'index.html'), html, 'utf8');
fs.copyFileSync(path.join(root, 'data.json'), path.join(output, 'data.json'));
console.log('Built public/index.html and public/data.json for Render.');
