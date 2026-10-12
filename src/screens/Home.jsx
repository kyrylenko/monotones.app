import React, { lazy, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RowsView from '../components/RowsView';
import PlayingNowBar from '../components/PlayingNowBar';
import TimerControl from '../components/TimerControl';
import { CategoryNavMobile, CategoryNavWeb } from '../components/CategoryNav';
import MixturesPanel from '../components/MixturesPanel';
import FixedControlsContainer from '../components/FixedControlsContainer';
import useIsMobile from '../hooks/useIsMobile';
import { mainActions } from '../store/mainSlice';
import { selectActiveSounds, selectAllSounds, selectIsGlobalPlay, selectSoundsByCategory } from '../store/selectors';

const SaveMixtureModal = lazy(() => import('../components/SaveMixtureModal'));
const SleepTimerModal = lazy(() => import('../components/SleepTimerModal'));

// Sound board. `category` (relax, sleep, focus) limits the sounds, all of them are shown without it.
const Home = ({ category }) => {
    const dispatch = useDispatch();
    const isMobile = useIsMobile();
    const isGlobalPlay = useSelector(selectIsGlobalPlay);
    const hasActiveSounds = useSelector(selectActiveSounds).length > 0;
    const allSounds = useSelector(selectAllSounds);
    const soundsByCategory = useSelector(selectSoundsByCategory);
    const sounds = category ? soundsByCategory[category] : allSounds;

    const [isSaveModalOpen, setSaveModalOpen] = useState(false);
    const [isTimerModalOpen, setTimerModalOpen] = useState(false);

    const playPauseVolume = useCallback((sound) => dispatch(mainActions.playPauseVolume(sound)), [dispatch]);

    return (
        <>
            {hasActiveSounds && isGlobalPlay && <div className='timer-div'>
                <TimerControl onClick={() => setTimerModalOpen(open => !open)} />
            </div>}
            {isMobile
                ? <CategoryNavMobile />
                : <FixedControlsContainer
                    left={<CategoryNavWeb />}
                    right={<MixturesPanel onSaveClick={() => setSaveModalOpen(true)} />} />}
            <RowsView sounds={sounds} playPauseVolume={playPauseVolume} isGlobalPlay={isGlobalPlay} />
            <SaveMixtureModal isOpen={isSaveModalOpen} onClose={() => setSaveModalOpen(false)} />
            <SleepTimerModal isOpen={isTimerModalOpen} onClose={() => setTimerModalOpen(false)} />
            {hasActiveSounds && isMobile && <PlayingNowBar />}
        </>
    );
};

export default Home;
