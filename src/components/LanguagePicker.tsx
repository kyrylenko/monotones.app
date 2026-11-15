import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isLocalizable, localizedPath, stripLanguage, toLanguage } from '../seo';

// On a page that exists in both languages, switching opens that page in the other language (/about <=> /uk/about)
const LanguagePicker = () => {
    const { i18n } = useTranslation();
    const { pathname, search } = useLocation();
    const navigate = useNavigate();
    // Any detected English variant (en-GB, en...) shows as "Eng"
    const value = i18n.resolvedLanguage === 'uk' ? 'uk-UA' : 'en-US';

    const change = (code: string) => {
        if (isLocalizable(pathname)) {
            navigate(localizedPath(stripLanguage(pathname), toLanguage(code)) + search);
        }
        i18n.changeLanguage(toLanguage(code));
    };

    return (
        <select id='i18nextLng' onChange={e => change(e.target.value)} value={value}>
            <option value='uk-UA'>Ukr</option>
            <option value='en-US'>Eng</option>
        </select>
    );
};

export default LanguagePicker;
