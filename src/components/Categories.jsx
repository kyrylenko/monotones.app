import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function getPath(actual, path) {
    return actual === path ? '/' : path;
};

function getClass(actual, path) {
    return actual === path ? 'active' : '';
};

export const CategoriesWeb = ({ pathname }) => {
    const { t } = useTranslation();
    return (
        <div className='mx-auto' style={{ width: '80px' }}>
            <div className='nav flex-column nav-pills web'>
                <li className='nav-item'>
                    <Link to={getPath(pathname, '/sleep')} title={t('sleep')} className={`nav-link ${getClass(pathname, '/sleep')}`}>{t('sleep')}</Link>
                </li>
                <li className='nav-item my-2'>
                    <Link to={getPath(pathname, '/relax')} title={t('relax')} className={`nav-link ${getClass(pathname, '/relax')}`}>{t('relax')}</Link>
                </li>
                <li className='nav-item'>
                    <Link to={getPath(pathname, '/focus')} title={t('focus')} className={`nav-link ${getClass(pathname, '/focus')}`}>{t('focus')}</Link>
                </li>
            </div>
        </div>
    );
}

export const CategoriesMobile = ({ pathname }) => {
    const { t } = useTranslation();
    return (
        <div className='nav nav-pills' style={{ position: 'sticky', height: '44px' }}>
            <li className='nav-item flex-fill'>
                <Link to={getPath(pathname, '/sleep')} title={t('sleep')} className={`nav-link ${getClass(pathname, '/sleep')}`}>{t('sleep')}</Link>
            </li>
            <li className='nav-item flex-fill'>
                <Link to={getPath(pathname, '/relax')} title={t('relax')} className={`nav-link ${getClass(pathname, '/relax')}`}>{t('relax')}</Link>
            </li>
            <li className='nav-item flex-fill'>
                <Link to={getPath(pathname, '/focus')} title={t('focus')} className={`nav-link ${getClass(pathname, '/focus')}`}>{t('focus')}</Link>
            </li>
        </div>
    );
}