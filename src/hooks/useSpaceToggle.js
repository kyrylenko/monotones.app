import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toggleGlobalPlay } from '../store/thunks';

// Play / pause everything with the space key, unless the user is typing
const useSpaceToggle = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === ' ' && event.target.tagName !== 'INPUT') {
                dispatch(toggleGlobalPlay());
                event.preventDefault();
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [dispatch]);
};

export default useSpaceToggle;
