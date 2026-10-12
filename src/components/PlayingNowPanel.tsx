import { useTranslation } from 'react-i18next';
import ActiveSoundIcons from './ActiveSoundIcons';
import save from '../assets/icons/save.svg';
import reset from '../assets/icons/reset.svg';
import { mainActions } from '../store/mainSlice';
import { useAppDispatch } from '../store/hooks';

// Desktop: playing sounds with "save mixture" and "reset" actions
const PlayingNowPanel = ({ onSaveClick }: { onSaveClick: () => void }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    return (
        <>
            <div className='pb-2 caption'>{t('playing_now')}</div>
            <div className='flex-container'>
                <div className='mixture-block me-2' style={{ overflow: 'hidden', width: '100%' }}>
                    <ActiveSoundIcons className='flex-container' />
                </div>
                <div className='flex-container mixture-actions'>
                    <img className='mixture-img' src={save} title={t('save_mixture')} alt={t('save_mixture')} onClick={onSaveClick} />
                    <img className='mixture-img' src={reset} title='Reset all' alt='Reset all' onClick={() => dispatch(mainActions.setSounds([]))} />
                </div>
            </div>
        </>
    );
};

export default PlayingNowPanel;
