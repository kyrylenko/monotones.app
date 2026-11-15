import { useTranslation } from 'react-i18next';
import { iconUrl } from '../assets';
import { trayOrder } from '../constants/soundIds';
import defaultValues from '../constants/defaultValues';
import { mainActions } from '../store/mainSlice';
import { selectActiveSounds, selectAllSounds } from '../store/selectors';
import { useAppDispatch, useAppSelector } from '../store/hooks';

// All sounds: a tap places a sound in the orbit (and plays), a second tap takes it out.
// A row that scrolls sideways on phones, a grid in the side panel on desktop.
const SoundTray = ({ onNotice }: { onNotice: (text: string) => void }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const sounds = useAppSelector(selectAllSounds);
    const isFull = useAppSelector(selectActiveSounds).length >= defaultValues.maxSounds;
    const byId = Object.fromEntries(sounds.map(sound => [sound.id, sound]));

    return (
        <div className={`tray${isFull ? ' is-full' : ''}`} role='group' aria-label={t('sounds')}>
            <h2 className='panel-title'>{t('sounds')}</h2>
            {trayOrder.map(id => {
                const { isPlay, volume } = byId[id];
                const name = t(`sound_${id}`);
                const toggle = () => {
                    if (isPlay) {
                        dispatch(mainActions.pauseSound(id));
                    } else if (isFull) {
                        onNotice(t('limit_reached', { max: defaultValues.maxSounds, name }));
                    } else {
                        dispatch(mainActions.playPauseVolume({ id, isPlay: true, volume }));
                    }
                };
                return (
                    <button key={id} type='button' className='chip' aria-pressed={isPlay} onClick={toggle}>
                        <img src={iconUrl(id)} alt='' />
                        <span>{name}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default SoundTray;
