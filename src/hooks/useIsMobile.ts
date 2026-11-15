import { useSyncExternalStore } from 'react';

// Below this width the mixes open in a sheet; above it they stay in a side panel
const MOBILE_QUERY = '(max-width: 959px)';

const subscribe = (onChange: () => void) => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
};

const getSnapshot = () => window.matchMedia(MOBILE_QUERY).matches;

// The build-time prerender has no screen: it renders the desktop layout, which lists every sound and mix
const getServerSnapshot = () => false;

const useIsMobile = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

export default useIsMobile;
