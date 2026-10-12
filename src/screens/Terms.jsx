import React from 'react';
import { useTranslation } from 'react-i18next';

const Terms = () => {
    const { t } = useTranslation();

    return <div style={{ textAlign: 'left' }} className='container about-text'>
        <section>
            <h3 >{t('privacy_policy')}</h3>
            <p>{t('privacy_policy_content')}</p>
        </section>
        <section>
            <h4>{t('information_collection_and_use')}</h4>
            <p>{t('information_collection_and_use_content')}</p>
        </section>
        <section>
            <h4>{t('log_data')}</h4>
            <p>{t('log_data_content')}</p>
        </section>
        <section>
            <h4>{t('сookies')}</h4>
            <p>{t('сookies_content')}</p>
        </section>

        <section>
            <h4>{t('service_providers')}</h4>
            <div>
                {t('service_providers_header')}
                <br></br>
                <ul>
                    <li>{t('service_providers_header')}</li>
                    <li>{t('service_providers_one')}</li>
                    <li>{t('service_providers_two')}</li>
                    <li>{t('service_providers_three')}</li>
                    <li>{t('service_providers_four')}</li>
                    <li>{t('service_providers_five')}</li>
                </ul>
            </div>
        </section>
        <section>
            <h4>{t('security')}</h4>
            <p>{t('security_content')}</p>
        </section>
        <section>
            <h4>{t('links_to_other_sites')}</h4>
            <p>{t('links_to_other_sites_content')}</p>
        </section>
        <section>
            <h4>{t('childrens_privacy')}</h4>
            <p>{t('childrens_privacy_content')}</p>
        </section>
        <section>
            <h4>{t('changes_to_this_privacy_policy')}</h4>
            <p>{t('changes_to_this_privacy_policy_content')}</p>
        </section>
        <section>
            <h4>{t('contact_us')}</h4>
            <p>{t('contact_us_content')}</p>
            <ul>
                <li>{t('email')}: <a target='_blank' rel='noopener noreferrer' href='mailto:contact@monotones.app'>contact@monotones.app</a></li>
                <li>{t('cell')}: +380959242349</li>
            </ul>
        </section>
    </div>
};

export default Terms;