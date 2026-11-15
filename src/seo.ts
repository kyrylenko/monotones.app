import type { TFunction } from 'i18next';
import { mixPath, starterMixes, type StarterMixId } from './constants/starterMixes';

export const SITE_URL = 'https://monotones.app';

// Pages search engines should index: the sound screen, one page per starter mix, About and Terms.
// Each is prerendered at build time (scripts/prerender.mjs) and listed in public/sitemap.xml.
export const PAGES: string[] = ['/', ...starterMixes.map(mix => mixPath(mix.id)), '/about', '/terms'];

// The former category pages now lead to the closest starter mix (301 in public/_redirects, client-side in App.tsx)
export const LEGACY_PAGES: Record<string, StarterMixId> = {
    '/sleep': 'babys_first_night',
    '/relax': 'rainy_evening',
    '/focus': 'deep_work',
};

export interface PageMeta {
    title: string;
    description: string;
    /** Absolute URL, without a trailing slash except for the home page */
    canonical: string;
}

// Title, description and canonical URL of a page; other paths (e.g. share links) get the home page's
export const pageMeta = (path: string, t: TFunction): PageMeta => {
    const mix = starterMixes.find(m => mixPath(m.id) === path);
    if (mix) {
        return {
            title: t(`meta_title_mix_${mix.id}`),
            description: t(`meta_desc_mix_${mix.id}`),
            canonical: `${SITE_URL}${path}`,
        };
    }
    if (path === '/about' || path === '/terms') {
        const key = path.slice(1) as 'about' | 'terms';
        return { title: t(`meta_title_${key}`), description: t(`meta_desc_${key}`), canonical: `${SITE_URL}${path}` };
    }
    return { title: t('meta_title_home'), description: t('meta_desc_home'), canonical: `${SITE_URL}/` };
};
