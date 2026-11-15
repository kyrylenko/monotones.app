import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Dialog from './Dialog';
import Logo from './Logo';
import LanguagePicker from './LanguagePicker';
import { useLocalizedPath } from '../hooks/useUrlLanguage';
import constants from '../constants/defaultValues';
import { activeMixName } from '../utils/mixName';
import { selectActiveSounds } from '../store/selectors';
import { useAppSelector } from '../store/hooks';

const DONATE_URL = 'https://www.patreon.com/monotones';

// Name of the mix in the sky, or "Your mix" for the user's own changes
const MixTitle = () => {
    const { t } = useTranslation();
    const name = useAppSelector(state => activeMixName(state, t));
    const hasSounds = useAppSelector(selectActiveSounds).length > 0;
    return <h1 className='mix-title'>{hasSounds ? name ?? t('your_mix') : ''}</h1>;
};

// Logo, the mix name on the sound screen, and a menu with help, language and the other pages
const Header = ({ showMixTitle }: { showMixTitle: boolean }) => {
    const { t } = useTranslation();
    const [isMenuOpen, setMenuOpen] = useState(false);
    const page = useLocalizedPath();
    const close = () => setMenuOpen(false);

    return (
        <header className='app-header'>
            <Link to={page('/')} className='home-link' aria-label={constants.appName}>
                <Logo />
            </Link>
            {showMixTitle ? <MixTitle /> : <span />}
            <button type='button' className='icon-button menu-button' aria-label={t('menu')} onClick={() => setMenuOpen(true)}>
                <svg viewBox='0 0 24 24' aria-hidden='true'><path d='M5 9h14M5 15h14' /></svg>
            </button>
            <Dialog isOpen={isMenuOpen} onClose={close} title={t('how_it_works')}>
                <ul className='help-list'>
                    <li>{t('help_add', { max: constants.maxSounds })}</li>
                    <li>{t('help_volume')}</li>
                    <li>{t('help_play')}</li>
                    <li>{t('help_keyboard')}</li>
                </ul>
                <label className='list-title' htmlFor='i18nextLng'>{t('language')}</label>
                <LanguagePicker />
                <nav className='menu-links'>
                    <NavLink to={page('/about')} onClick={close}>{t('about')}</NavLink>
                    <NavLink to={page('/terms')} onClick={close}>{t('terms')}</NavLink>
                    <a href='mailto:contact@monotones.app' target='_blank' rel='noopener noreferrer'>{t('contact')}</a>
                    <a href={DONATE_URL} target='_blank' rel='noopener noreferrer' title={t('buy_us_coffee')}>{t('donate')}</a>
                </nav>
            </Dialog>
        </header>
    );
};

export default Header;
