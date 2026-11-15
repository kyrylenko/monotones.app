import sitemap from '../public/sitemap.xml?raw';
import robots from '../public/robots.txt?raw';
import headers from '../public/_headers?raw';
import i18n from './i18n';
import { PAGES, SITE_URL, pageMeta } from './seo';

describe('seo', () => {
    it('gives every page its own title and description in both languages', async () => {
        for (const language of ['en', 'uk']) {
            await i18n.changeLanguage(language);
            const metas = PAGES.map(page => pageMeta(page, i18n.t));
            expect(new Set(metas.map(m => m.title)).size).toBe(PAGES.length);
            expect(new Set(metas.map(m => m.description)).size).toBe(PAGES.length);
            metas.forEach(m => expect(m.description.length).toBeLessThanOrEqual(160));
        }
        await i18n.changeLanguage('en');
    });

    it('uses canonical URLs without a trailing slash, share links point to the home page', () => {
        expect(pageMeta('/', i18n.t).canonical).toBe(`${SITE_URL}/`);
        expect(pageMeta('/sleep', i18n.t).canonical).toBe(`${SITE_URL}/sleep`);
        expect(pageMeta('/share/ce6', i18n.t).canonical).toBe(`${SITE_URL}/`);
    });

    it('lists the same pages in the sitemap', () => {
        const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
        expect(urls).toEqual(PAGES.map(page => pageMeta(page, i18n.t).canonical));
    });

    it('keeps share links out of search results but open to link previews', () => {
        expect(robots).not.toContain('Disallow');
        expect(robots).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
        expect(headers).toMatch(/\/share\/\*\n\s+X-Robots-Tag: noindex/);
    });
});
