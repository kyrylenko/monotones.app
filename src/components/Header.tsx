import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Share from './Share';
import Logo from './Logo';
import constants from '../constants/defaultValues';

const DONATE_URL = 'https://www.patreon.com/monotones';

const Header = () => {
    const { t } = useTranslation();

    return (
        <header className='site-header'>
            <Link to='/' className='home-link' aria-label={constants.appName} title={constants.appName}>
                <Logo />
            </Link>
            <nav className='header-actions'>
                <Share className='header-link' />
                <a href={DONATE_URL} target='_blank' rel='noopener noreferrer' className='header-link' title={t('buy_us_coffee')}>{t('donate')}</a>
            </nav>
        </header>
    );
};

export default Header;
