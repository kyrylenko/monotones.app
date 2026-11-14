import { useTranslation } from 'react-i18next';
import { mainActions } from '../store/mainSlice';
import { selectSharedMixName } from '../store/selectors';
import { useAppDispatch, useAppSelector } from '../store/hooks';

// Name of a mix opened from a share link, with a button to save it as an own mixture
const SharedMixBanner = ({ onSave }: { onSave: () => void }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const name = useAppSelector(selectSharedMixName);

    if (!name) {
        return null;
    }

    return (
        <div className='shared-mix' role='status'>
            <span>{t('shared_with_you', { name })}</span>
            <button type='button' className='btn btn-primary btn-sm' onClick={onSave}>{t('save_mixture')}</button>
            <button type='button' className='btn-close' aria-label={t('close')} onClick={() => dispatch(mainActions.setSharedMixName(null))} />
        </div>
    );
};

export default SharedMixBanner;
