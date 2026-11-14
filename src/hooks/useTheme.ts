import { useCallback, useEffect, useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

// Same key and fallback as the inline script in index.html, which applies the theme before the first paint
const STORAGE_KEY = 'theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

const listeners = new Set<() => void>();

const subscribe = (onChange: () => void) => {
    const mediaQuery = window.matchMedia(DARK_QUERY);
    mediaQuery.addEventListener('change', onChange);
    listeners.add(onChange);
    return () => {
        mediaQuery.removeEventListener('change', onChange);
        listeners.delete(onChange);
    };
};

// The user's choice, otherwise the system setting
const getSnapshot = (): Theme => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
        return saved;
    }
    return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
};

// Current theme and a toggle that remembers the choice. Applies the theme to the page (Bootstrap color modes).
const useTheme = () => {
    const theme = useSyncExternalStore(subscribe, getSnapshot);

    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        localStorage.setItem(STORAGE_KEY, theme === 'dark' ? 'light' : 'dark');
        listeners.forEach(listener => listener());
    }, [theme]);

    return { theme, toggleTheme };
};

export default useTheme;
