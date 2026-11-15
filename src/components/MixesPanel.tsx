import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { starterMixes } from '../constants/starterMixes';
import defaultValues from '../constants/defaultValues';
import { mainActions } from '../store/mainSlice';
import { selectActiveSounds, selectActiveStarterMix, selectMixtures } from '../store/selectors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { activeMixName } from '../utils/mixName';
import type { SoundId } from '../constants/soundIds';
import type { Sounds } from '../types';

// Mounted again when the suggested name changes, so the field starts from it
const SaveForm = ({ suggestedName }: { suggestedName: string }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [name, setName] = useState(suggestedName);

    const save = (event: FormEvent) => {
        event.preventDefault();
        if (name.trim() !== '') {
            dispatch(mainActions.addMixture(name.trim()));
        }
    };

    return (
        <form className='save-form' onSubmit={save}>
            <input type='text' className='text-input' autoComplete='off' maxLength={defaultValues.mixtureNameMaxLength}
                placeholder={t('mixture_name')} aria-label={t('mixture_name')}
                value={name} onChange={event => setName(event.target.value)} />
            <button type='submit' className='button button-primary'>{t('save')}</button>
        </form>
    );
};

interface MixRowProps {
    name: string;
    soundIds: SoundId[];
    isActive: boolean;
    onClick: () => void;
    onDelete?: () => void;
}

const MixRow = ({ name, soundIds, isActive, onClick, onDelete }: MixRowProps) => {
    const { t } = useTranslation();
    return (
        <li className='mix-row'>
            <button type='button' className='mix-pick' aria-pressed={isActive} onClick={onClick}>
                <span className='mix-name'>{name}</span>
                <small>{soundIds.map(id => t(`sound_${id}`)).join(', ')}</small>
            </button>
            {onDelete && <button type='button' className='icon-button' aria-label={t('delete_mix', { name })} onClick={onDelete}>×</button>}
        </li>
    );
};

const playingIds = (sounds: Sounds) => Object.values(sounds).filter(s => s?.isPlay).map(s => s!.id);

// Saving the current mix, the saved mixtures and the starter mixes. A tap plays a mix, a tap on the playing one pauses it.
const MixesPanel = ({ onPicked }: { onPicked?: () => void }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const mixtures = useAppSelector(selectMixtures);
    const activeStarterMix = useAppSelector(selectActiveStarterMix);
    const hasSounds = useAppSelector(selectActiveSounds).length > 0;
    const suggestedName = useAppSelector(state => activeMixName(state, t)) ?? '';

    const pick = (action: Parameters<typeof dispatch>[0]) => {
        dispatch(action);
        onPicked?.();
    };

    return (
        <div className='mixes'>
            {hasSounds && <SaveForm key={suggestedName} suggestedName={suggestedName} />}
            {mixtures.length > 0 && <>
                <h3 className='list-title'>{t('my_mixtures')}</h3>
                <ul className='mix-list saved-mixes'>
                    {mixtures.map(({ id, isActive, sounds }) => (
                        <MixRow key={id} name={id} soundIds={playingIds(sounds)} isActive={isActive}
                            onClick={() => pick(isActive ? mainActions.deactivateMixtures() : mainActions.switchMixture(id))}
                            onDelete={() => {
                                dispatch(mainActions.deleteMixture(id));
                                // Deleting the playing mixture stops playback, as before the redesign
                                if (isActive) {
                                    dispatch(mainActions.deactivateMixtures());
                                }
                            }} />
                    ))}
                </ul>
            </>}
            <h3 className='list-title'>{t('starter_mixes')}</h3>
            <ul className='mix-list starter-mixes'>
                {starterMixes.map(({ id, volumes }) => (
                    <MixRow key={id} name={t(`starter_${id}`)} soundIds={Object.keys(volumes) as SoundId[]} isActive={id === activeStarterMix}
                        onClick={() => pick(id === activeStarterMix ? mainActions.deactivateMixtures() : mainActions.playStarterMix(id))} />
                ))}
            </ul>
        </div>
    );
};

export default MixesPanel;
