import { useTranslation } from 'react-i18next';
import useTheme from '../hooks/useTheme';

// Switches between the light and the dark theme, the label names the theme it switches to
const ThemeToggle = () => {
    const { t } = useTranslation();
    const { theme, toggleTheme } = useTheme();

    return (
        <button type='button' className='theme-toggle' onClick={toggleTheme}>
            {theme === 'dark' ? t('light_theme') : t('dark_theme')}
        </button>
    );
};

export default ThemeToggle;
