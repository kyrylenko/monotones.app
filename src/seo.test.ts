import sitemap from '../public/sitemap.xml?raw';
import robots from '../public/robots.txt?raw';
import headers from '../public/_headers?raw';
import redirects from '../public/_redirects?raw';
import { mixPath } from './constants/starterMixes';
import i18n from './i18n';
import { LEGACY_PAGES, LOCALIZED_PAGES, PAGES, SITE_URL, isLocalizable, localizedPath, pageMeta, pathLanguage, stripLanguage } from './seo';

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
        expect(pageMeta('/mix/deep-work', i18n.t).canonical).toBe(`${SITE_URL}/mix/deep-work`);
        expect(pageMeta('/about', i18n.t).canonical).toBe(`${SITE_URL}/about`);
        expect(pageMeta('/share/ce6', i18n.t).canonical).toBe(`${SITE_URL}/`);
    });

    it('puts Ukrainian pages under /uk with language links between the versions', () => {
        expect(localizedPath('/', 'uk')).toBe('/uk');
        expect(localizedPath('/about', 'uk')).toBe('/uk/about');
        expect(stripLanguage('/uk')).toBe('/');
        expect(stripLanguage('/uk/mix/deep-work')).toBe('/mix/deep-work');
        expect(pathLanguage('/ukulele')).toBe('en');
        expect(isLocalizable('/uk/mix/deep-work')).toBe(true);
        expect(isLocalizable('/share/ce6')).toBe(false);

        expect(pageMeta('/uk/mix/deep-work', i18n.t)).toMatchObject({
            canonical: `${SITE_URL}/uk/mix/deep-work`,
            alternates: { en: `${SITE_URL}/mix/deep-work`, uk: `${SITE_URL}/uk/mix/deep-work` },
        });
        expect(pageMeta('/uk', i18n.t).canonical).toBe(`${SITE_URL}/uk`);
    });

    it('lists the same pages in the sitemap', () => {
        const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
        expect(urls).toEqual(LOCALIZED_PAGES.map(page => pageMeta(page, i18n.t).canonical));
        expect(urls).toHaveLength(PAGES.length * 2);
    });

    it('redirects the former category pages to their starter mix pages', () => {
        const rules = [...redirects.matchAll(/^(\/\S+) (\S+) 301$/gm)].map(m => [m[1], m[2]]);
        expect(rules).toEqual(Object.entries(LEGACY_PAGES).map(([path, id]) => [path, mixPath(id)]));
        rules.forEach(([, target]) => expect(PAGES).toContain(target));
    });

    it('keeps share links out of search results but open to link previews', () => {
        expect(robots).not.toContain('Disallow');
        expect(robots).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
        expect(headers).toMatch(/\/share\/\*\n\s+X-Robots-Tag: noindex/);
    });
});
