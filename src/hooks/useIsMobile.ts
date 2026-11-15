import { useSyncExternalStore } from 'react';

// Below this width the mixes open in a sheet; above it they stay in a side panel
const MOBILE_QUERY = '(max-width: 959px)';

const subscribe = (onChange: () => void) => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
};

const getSnapshot = () => window.matchMedia(MOBILE_QUERY).matches;

const useIsMobile = () => useSyncExternalStore(subscribe, getSnapshot);

export default useIsMobile;
