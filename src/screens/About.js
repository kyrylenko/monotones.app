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
            <h4>Vision</h4>
            <p>We believe, that there is always a way to elevate the quality of one's life and we know, how to do it. With Monotones we collected and continue to collect the most relevant and useful sounds together with developing new functionality for you to combine our tools with your creativity and not only help you to find inner peace, but share your experience with others, forming a community of beautiful and mindful people.</p>
        </section>
        <section>
            <h4>Mission</h4>
            <p>Among crazy amount of anger, frustration, and anxiousness we built an island of tones. We can see, how those tones help us in everyday life and want to share that experience of better living. We analyzed every other solution, tested it and built our own insight, which helped to increase usability and usefulness of Monotones. Now we want to spread it among different communities to simply help hundreds of other people to live a better life. Guess, this is how we see our mission of making this world a better place to live.</p>
        </section>
        <section>
            <h4>Values</h4>
            <p>We value innovativeness, as we always crave to find the best cognitive solution to achieve needed results and turn into instrument, which would be easy to use.</p>
            <p>We appreciate respect, as this is what we feel towards our users. That is why we decided not to ever distract aesthetics of sound and image with any kind of advertisement or anything else, what may cause anxiousness and frustration.</p>
            <p>We believe in creativity as we are visionaries. This is why we not only collected the best sounds and tested them, but created a beautiful visual world, which brings a feeling of calmness and gives a perception of harmony.</p>
        </section>
    </div>
};

export default About;