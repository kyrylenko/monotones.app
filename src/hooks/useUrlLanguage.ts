import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isLocalizable, localizedPath, pathLanguage, stripLanguage, toLanguage } from '../seo';

// The URL sets the language of a page: /about is English, /uk/about Ukrainian.
// On the first page of a visit, a Ukrainian visitor (saved choice or browser language) is sent to the Ukrainian URL.
// Share links have no language and keep the current one.
const useUrlLanguage = () => {
    const { pathname, search } = useLocation();
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const isFirstPage = useRef(true);

    useEffect(() => {
        if (!isLocalizable(pathname)) {
            return;
        }
        const urlLanguage = pathLanguage(pathname);
        if (isFirstPage.current) {
            isFirstPage.current = false;
            const preferred = toLanguage(i18n.resolvedLanguage);
            if (urlLanguage === 'en' && preferred === 'uk') {
                navigate(localizedPath(stripLanguage(pathname), 'uk') + search, { replace: true });
                return;
            }
        }
        if (toLanguage(i18n.resolvedLanguage) !== urlLanguage) {
            i18n.changeLanguage(urlLanguage);
        }
    }, [pathname, search, navigate, i18n]);
};

/** Turns a page path ('/about') into the URL of the current language ('/uk/about') */
export const useLocalizedPath = () => {
    const { i18n } = useTranslation();
    return (path: string) => localizedPath(path, toLanguage(i18n.resolvedLanguage));
};

export default useUrlLanguage;
