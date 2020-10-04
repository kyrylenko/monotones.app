import React from 'react';
import i18n from "i18next";

const lookupLocalStorage = 'i18nextLng';

const LanguagePicker = () => {
    const language = window ? window.localStorage.getItem(lookupLocalStorage) || 'en-US' : 'en-US';

    function handleChange(e) {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <select id={lookupLocalStorage} onChange={handleChange} value={language}>
            <option value="uk-UA" >Ukr</option>
            <option value="en-US">Eng</option>
        </select>
    );
};

export default LanguagePicker;