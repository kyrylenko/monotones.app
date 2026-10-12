import { useSyncExternalStore } from 'react';

const MOBILE_QUERY = '(max-width: 768px)';

const subscribe = (onChange: () => void) => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
};

const getSnapshot = () => window.matchMedia(MOBILE_QUERY).matches;

const useIsMobile = () => useSyncExternalStore(subscribe, getSnapshot);

export default useIsMobile;
