import { lazy, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import RowsView from '../components/RowsView';
import PlayingNowBar from '../components/PlayingNowBar';
import TimerControl from '../components/TimerControl';
import { CategoryNavMobile, CategoryNavWeb } from '../components/CategoryNav';
import MixturesPanel from '../components/MixturesPanel';
import FixedControlsContainer from '../components/FixedControlsContainer';
import SleepScreen from '../components/SleepScreen';
import moon from '../assets/icons/moon.svg';
import useIsMobile from '../hooks/useIsMobile';
import { mainActions } from '../store/mainSlice';
import { selectActiveSounds, selectAllSounds, selectIsGlobalPlay, selectSoundsByCategory } from '../store/selectors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { Category } from '../constants/soundIds';
import type { SoundSetting } from '../types';

const SaveMixtureModal = lazy(() => import('../components/SaveMixtureModal'));
const SleepTimerModal = lazy(() => import('../components/SleepTimerModal'));

// Sound board. `category` (relax, sleep, focus) limits the sounds, all of them are shown without it.
const Home = ({ category }: { category?: Category }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const isMobile = useIsMobile();
    const isGlobalPlay = useAppSelector(selectIsGlobalPlay);
    const hasActiveSounds = useAppSelector(selectActiveSounds).length > 0;
    const allSounds = useAppSelector(selectAllSounds);
    const soundsByCategory = useAppSelector(selectSoundsByCategory);
    const sounds = category ? soundsByCategory[category] : allSounds;

    const [isSaveModalOpen, setSaveModalOpen] = useState(false);
    const [isTimerModalOpen, setTimerModalOpen] = useState(false);
    const [isSleepScreenOpen, setSleepScreenOpen] = useState(false);

    const toggleTimerModal = useCallback(() => setTimerModalOpen(open => !open), []);
    const closeSleepScreen = useCallback(() => setSleepScreenOpen(false), []);

    const playPauseVolume = useCallback((sound: SoundSetting) => dispatch(mainActions.playPauseVolume(sound)), [dispatch]);

    return (
        <>
            {hasActiveSounds && isGlobalPlay && <>
                <div className='timer-div'>
                    <TimerControl onClick={toggleTimerModal} />
                </div>
                <div className='sleep-div'>
                    <img src={moon} alt={t('sleep_screen')} title={t('sleep_screen')} onClick={() => setSleepScreenOpen(true)} />
                </div>
            </>}
            {isMobile
                ? <CategoryNavMobile />
                : <FixedControlsContainer
                    left={<CategoryNavWeb />}
                    right={<MixturesPanel onSaveClick={() => setSaveModalOpen(true)} />} />}
            <RowsView sounds={sounds} playPauseVolume={playPauseVolume} isGlobalPlay={isGlobalPlay} />
            <SaveMixtureModal isOpen={isSaveModalOpen} onClose={() => setSaveModalOpen(false)} />
            <SleepTimerModal isOpen={isTimerModalOpen} onClose={() => setTimerModalOpen(false)} />
            {isSleepScreenOpen && <SleepScreen onClose={closeSleepScreen} onTimerClick={toggleTimerModal} />}
            {hasActiveSounds && isMobile && <PlayingNowBar />}
        </>
    );
};

export default Home;
