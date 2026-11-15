import type { TFunction } from 'i18next';
import { mixPath, starterMixes, type StarterMixId } from './constants/starterMixes';

export const SITE_URL = 'https://monotones.app';

// English pages have no prefix, Ukrainian ones start with /uk: /uk, /uk/mix/rainy-evening, /uk/about
export const LANGUAGES = ['en', 'uk'] as const;
export type Language = (typeof LANGUAGES)[number];

// Pages search engines should index, without the language prefix: the sound screen, one page per starter mix, About and Terms.
// Each is prerendered in both languages at build time (scripts/prerender.mjs) and listed in public/sitemap.xml.
export const PAGES: string[] = ['/', ...starterMixes.map(mix => mixPath(mix.id)), '/about', '/terms'];

/** Every indexable URL path: the pages in English, then in Ukrainian */
export const LOCALIZED_PAGES: string[] = LANGUAGES.flatMap(language => PAGES.map(page => localizedPath(page, language)));

// The former category pages now lead to the closest starter mix (301 in public/_redirects, client-side in App.tsx)
export const LEGACY_PAGES: Record<string, StarterMixId> = {
    '/sleep': 'babys_first_night',
    '/relax': 'rainy_evening',
    '/focus': 'deep_work',
};

export const pathLanguage = (path: string): Language => path === '/uk' || path.startsWith('/uk/') ? 'uk' : 'en';

/** '/uk/about' => '/about', '/uk' => '/' */
export const stripLanguage = (path: string): string => pathLanguage(path) === 'uk' ? path.slice(3) || '/' : path;

export function localizedPath(path: string, language: Language): string {
    if (language === 'en') {
        return path;
    }
    return path === '/' ? '/uk' : `/uk${path}`;
}

/** A page that exists in both languages (not share links) */
export const isLocalizable = (path: string): boolean => PAGES.includes(stripLanguage(path));

export const toLanguage = (code: string | undefined): Language => code?.startsWith('uk') ? 'uk' : 'en';

export interface PageMeta {
    title: string;
    description: string;
    /** Absolute URL, without a trailing slash except for the English home page */
    canonical: string;
    /** The same page in each language, for hreflang links */
    alternates: Record<Language, string>;
}

// Title and description (in the language of `t`), canonical URL and language versions of a page.
// Other paths (e.g. share links) get the home page's.
export const pageMeta = (path: string, t: TFunction): PageMeta => {
    const page = isLocalizable(path) ? stripLanguage(path) : '/';
    const url = (language: Language) => `${SITE_URL}${localizedPath(page, language)}`;
    const alternates = { en: url('en'), uk: url('uk') };
    const canonical = alternates[pathLanguage(isLocalizable(path) ? path : '/')];

    const mix = starterMixes.find(m => mixPath(m.id) === page);
    if (mix) {
        return { title: t(`meta_title_mix_${mix.id}`), description: t(`meta_desc_mix_${mix.id}`), canonical, alternates };
    }
    if (page === '/about' || page === '/terms') {
        const key = page.slice(1) as 'about' | 'terms';
        return { title: t(`meta_title_${key}`), description: t(`meta_desc_${key}`), canonical, alternates };
    }
    return { title: t('meta_title_home'), description: t('meta_desc_home'), canonical, alternates };
};
