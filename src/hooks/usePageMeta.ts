import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { pageMeta } from '../seo';

const setMeta = (selector: string, attribute: string, value: string) => {
    document.head.querySelector(selector)?.setAttribute(attribute, value);
};

// Keeps the title, description and canonical URL in the head in step with the page and the language.
// The prerendered HTML already has them in English (scripts/prerender.mjs).
const usePageMeta = () => {
    const { pathname } = useLocation();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const { title, description, canonical } = pageMeta(pathname, t);
        document.title = title;
        setMeta('meta[name="description"]', 'content', description);
        setMeta('link[rel="canonical"]', 'href', canonical);
        setMeta('meta[property="og:title"]', 'content', title);
        setMeta('meta[property="og:description"]', 'content', description);
        setMeta('meta[property="og:url"]', 'content', canonical);
    }, [pathname, t, i18n.language]);
};

export default usePageMeta;
