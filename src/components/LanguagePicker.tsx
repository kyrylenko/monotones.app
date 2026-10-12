import { useTranslation } from 'react-i18next';

const LanguagePicker = () => {
    const { i18n } = useTranslation();
    // Any detected English variant (en-GB, en...) shows as "Eng"
    const value = i18n.resolvedLanguage === 'uk' ? 'uk-UA' : 'en-US';

    return (
        <select id='i18nextLng' onChange={e => i18n.changeLanguage(e.target.value)} value={value}>
            <option value='uk-UA'>Ukr</option>
            <option value='en-US'>Eng</option>
        </select>
    );
};

export default LanguagePicker;
