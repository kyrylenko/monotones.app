// Writes the indexable pages into the build as static HTML, in both languages: build/index.html, build/mix/rainy-evening.html,
// build/about.html, build/uk.html, build/uk/mix/rainy-evening.html, ...
// Cloudflare serves /about from about.html and /mix/rainy-evening from mix/rainy-evening.html. Every page keeps the app's scripts, which take over in the browser.
// Run after `vite build` and `vite build --ssr src/prerender.tsx --outDir build-ssr` (see "build" in package.json).
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const { PAGES, pathLanguage, renderPage } = await import(pathToFileURL(resolve(root, 'build-ssr/prerender.js')).href);
const template = await readFile(resolve(root, 'build/index.html'), 'utf8');

const escape = text => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Replaces exactly one match, so a changed index.html fails the build instead of shipping wrong tags
const replaceOnce = (html, pattern, replacement) => {
    const matches = html.match(new RegExp(pattern.source, 'g')) ?? [];
    if (matches.length !== 1) {
        throw new Error(`Expected one match of ${pattern} in index.html, found ${matches.length}`);
    }
    return html.replace(pattern, replacement);
};

for (const path of PAGES) {
    const { html, title, description, canonical, alternates } = await renderPage(path);
    let page = template;
    page = replaceOnce(page, /<html lang="en">/, `<html lang="${pathLanguage(path)}">`);
    page = replaceOnce(page, /<title>[^<]*<\/title>/, `<title>${escape(title)}</title>
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="en" href="${alternates.en}">
  <link rel="alternate" hreflang="uk" href="${alternates.uk}">
  <link rel="alternate" hreflang="x-default" href="${alternates.en}">`);
    page = replaceOnce(page, /<meta name="description" content="[^"]*">/, `<meta name="description" content="${escape(description)}">`);
    page = replaceOnce(page, /<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escape(title)}">`);
    page = replaceOnce(page, /<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escape(description)}">`);
    page = replaceOnce(page, /<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${canonical}">`);
    page = replaceOnce(page, /<div id="root"><\/div>/, `<div id="root">${html}</div>`);

    const file = path === '/' ? 'index.html' : `${path.slice(1)}.html`;
    await mkdir(dirname(resolve(root, 'build', file)), { recursive: true });
    await writeFile(resolve(root, 'build', file), page);
    console.log(`prerendered ${path} -> build/${file}`);
}

await rm(resolve(root, 'build-ssr'), { recursive: true, force: true });
