import { useTranslation } from 'react-i18next';
import { starterMixes } from '../constants/starterMixes';
import { mainActions } from '../store/mainSlice';
import { selectActiveStarterMix } from '../store/selectors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { Category } from '../constants/soundIds';

// Curated mixes above the sound board, only the ones of the category on a category page.
// They work like saved mixtures: a tap plays the mix, a tap on the active one pauses it.
const StarterMixes = ({ category }: { category?: Category }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const activeId = useAppSelector(selectActiveStarterMix);
    const mixes = starterMixes.filter(mix => !category || mix.category === category);

    return (
        <div className='starter-mixes' role='group' aria-label={t('starter_mixes')}>
            {mixes.map(({ id }) => {
                const isActive = id === activeId;
                return (
                    <button key={id} type='button' className={`starter-mix${isActive ? ' active' : ''}`} aria-pressed={isActive}
                        onClick={() => dispatch(isActive ? mainActions.deactivateMixtures() : mainActions.playStarterMix(id))}>
                        {t(`starter_${id}`)}
                    </button>
                );
            })}
        </div>
    );
};

export default StarterMixes;
