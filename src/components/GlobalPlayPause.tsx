import { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import PlayPauseButton from './PlayPauseButton';
import { selectActiveSounds } from '../store/selectors';
import { useAppSelector } from '../store/hooks';

const GlobalPlayPause = () => {
    const nodeRef = useRef<HTMLImageElement>(null);
    const hasActiveSounds = useAppSelector(selectActiveSounds).length > 0;

    if (!hasActiveSounds) {
        return null;
    }

    return (
        <div className='play-div'>
            <CSSTransition
                nodeRef={nodeRef}
                in={true}
                classNames='example'
                appear={true}
                timeout={1000}
                enter={false}
                exit={false}>
                <PlayPauseButton ref={nodeRef} />
            </CSSTransition>
        </div>
    );
};

export default GlobalPlayPause;
