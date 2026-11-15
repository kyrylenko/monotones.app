// Writes the indexable pages into the build as static HTML: build/index.html, build/sleep.html, build/about.html, ...
// Cloudflare serves /about from about.html. Every page keeps the app's scripts, which take over in the browser.
// Run after `vite build` and `vite build --ssr src/prerender.tsx --outDir build-ssr` (see "build" in package.json).
import { readFile, rm, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const { PAGES, renderPage } = await import(pathToFileURL(resolve(root, 'build-ssr/prerender.js')).href);
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
    const { html, title, description, canonical } = await renderPage(path);
    let page = template;
    page = replaceOnce(page, /<title>[^<]*<\/title>/, `<title>${escape(title)}</title>\n  <link rel="canonical" href="${canonical}">`);
    page = replaceOnce(page, /<meta name="description" content="[^"]*">/, `<meta name="description" content="${escape(description)}">`);
    page = replaceOnce(page, /<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escape(title)}">`);
    page = replaceOnce(page, /<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escape(description)}">`);
    page = replaceOnce(page, /<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${canonical}">`);
    page = replaceOnce(page, /<div id="root"><\/div>/, `<div id="root">${html}</div>`);

    const file = path === '/' ? 'index.html' : `${path.slice(1)}.html`;
    await writeFile(resolve(root, 'build', file), page);
    console.log(`prerendered ${path} -> build/${file}`);
}

await rm(resolve(root, 'build-ssr'), { recursive: true, force: true });
