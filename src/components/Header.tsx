import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Share from './Share';
import constants from '../constants/defaultValues';
import logo from '../logo.png';
import useIsMobile from '../hooks/useIsMobile';

const DONATE_URL = 'https://www.patreon.com/monotones';

const DonateLink = ({ className }: { className: string }) => {
    const { t } = useTranslation();
    return <a href={DONATE_URL} target='_blank' rel='noopener noreferrer' className={className} title={t('buy_us_coffee')}>{t('donate')}</a>;
};

const HeaderWeb = () => (
    <header className='container-fluid'>
        <div className='row justify-content-end'>
            <div className='col-4'>
                <Link to='/' title={constants.appName}>
                    <img src={logo} className='app-logo' alt={constants.appName} />
                </Link>
            </div>
            <div className='col-4 d-flex justify-content-end align-items-center app-title'>
                <Share className='top-bar-item px-lg-5 px-4' />
                <DonateLink className='top-bar-item px-lg-5 px-4' />
            </div>
        </div>
    </header>
);

const HeaderMobile = () => (
    <header className='d-flex justify-content-around align-items-center'>
        <Share className='top-bar-item' />
        <Link to='/' title={constants.appName}>
            <img src={logo} alt={constants.appName} style={{ height: '45px' }} />
        </Link>
        <DonateLink className='top-bar-item' />
    </header>
);

const Header = () => useIsMobile() ? <HeaderMobile /> : <HeaderWeb />;

export default Header;
