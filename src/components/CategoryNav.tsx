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
        <Link to={isActive ? '/' : path} title={t(category)} className={`category-link${isActive ? ' active' : ''}`}>
            {t(category)}
        </Link>
    );
};

export const CategoryNavWeb = () => (
    <ul className='category-nav vertical'>
        {CATEGORIES.map(category => (
            <li key={category}>
                <CategoryLink category={category} />
            </li>
        ))}
    </ul>
);

export const CategoryNavMobile = () => (
    <ul className='category-nav horizontal'>
        {CATEGORIES.map(category => (
            <li key={category}>
                <CategoryLink category={category} />
            </li>
        ))}
    </ul>
);
