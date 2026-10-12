import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { toggleGlobalPlay } from '../store/thunks';

// Play / pause everything with the space key, unless the user is typing
const useSpaceToggle = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === ' ' && (event.target as HTMLElement).tagName !== 'INPUT') {
                dispatch(toggleGlobalPlay());
                event.preventDefault();
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [dispatch]);
};

export default useSpaceToggle;
