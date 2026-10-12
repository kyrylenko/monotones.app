import React from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
    const { t } = useTranslation();

    return <div style={{ textAlign: 'left' }} className='container about-text violet-headers'>
        <section>
            <h3>{t('your_subtle_companion')}</h3>
            <p>{t('your_subtle_companion_content')}</p>
        </section>
        <section>
            <h4>{t('we_are_creators')}</h4>
            <p className='line-breaks'>{t('we_are_creators_content')}</p>
        </section>
        <section>
            <h4>{t('vision')}</h4>
            <p>{t('vision_content')}</p>
        </section>
        <section>
            <h4>{t('mission')}</h4>
            <p>{t('mission_content')}</p>
        </section>
        <section>
            <h4>{t('values')}</h4>
            <p>{t('values_content')}</p>
        </section>
    </div>
};

export default About;