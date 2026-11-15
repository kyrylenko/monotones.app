import type { TFunction } from 'i18next';

export const SITE_URL = 'https://monotones.app';

// Pages search engines should index. Each is prerendered at build time (scripts/prerender.mjs) and listed in public/sitemap.xml.
export const PAGES = ['/', '/sleep', '/relax', '/focus', '/about', '/terms'] as const;
export type Page = (typeof PAGES)[number];

const KEYS = {
    '/': 'home', '/sleep': 'sleep', '/relax': 'relax', '/focus': 'focus', '/about': 'about', '/terms': 'terms',
} as const satisfies Record<Page, string>;

export const isPage = (path: string): path is Page => (PAGES as readonly string[]).includes(path);

export interface PageMeta {
    title: string;
    description: string;
    /** Absolute URL, without a trailing slash except for the home page */
    canonical: string;
}

// Title, description and canonical URL of a page; other paths (e.g. share links) get the home page's
export const pageMeta = (path: string, t: TFunction): PageMeta => {
    const page = isPage(path) ? path : '/';
    const key = KEYS[page];
    return {
        title: t(`meta_title_${key}`),
        description: t(`meta_desc_${key}`),
        canonical: page === '/' ? `${SITE_URL}/` : `${SITE_URL}${page}`,
    };
};
