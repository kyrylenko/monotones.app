import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Category } from '../constants/soundIds';

const CATEGORIES: Category[] = ['sleep', 'relax', 'focus'];

// Clicking the active category goes back to all sounds
const CategoryLink = ({ category }: { category: Category }) => {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const path = `/${category}`;
    const isActive = pathname === path;

    return (
        <Link to={isActive ? '/' : path} title={t(category)} className={`nav-link ${isActive ? 'active' : ''}`}>
            {t(category)}
        </Link>
    );
};

export const CategoryNavWeb = () => (
    <div className='mx-auto' style={{ width: '80px' }}>
        <ul className='nav flex-column nav-pills web'>
            {CATEGORIES.map((category, i) => (
                <li key={category} className={`nav-item${i === 1 ? ' my-2' : ''}`}>
                    <CategoryLink category={category} />
                </li>
            ))}
        </ul>
    </div>
);

export const CategoryNavMobile = () => (
    <ul className='nav nav-pills' style={{ position: 'sticky', height: '44px' }}>
        {CATEGORIES.map(category => (
            <li key={category} className='nav-item flex-fill'>
                <CategoryLink category={category} />
            </li>
        ))}
    </ul>
);
