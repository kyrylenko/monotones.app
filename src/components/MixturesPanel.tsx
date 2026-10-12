import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { TransitionGroup } from 'react-transition-group';
import MixAnim from './MixAnim';
import Mixture from './Mixture';
import PlayingNowPanel from './PlayingNowPanel';
import { mainActions } from '../store/mainSlice';
import { selectActiveSounds, selectMixtures } from '../store/selectors';

// Desktop side panel: what is playing now and the saved mixtures
const MixturesPanel = ({ onSaveClick }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const hasActiveSounds = useSelector(selectActiveSounds).length > 0;
    const mixtures = useSelector(selectMixtures);

    return (
        <>
            {hasActiveSounds && <PlayingNowPanel onSaveClick={onSaveClick} />}
            {mixtures.length > 0 && <div className='mixtures card mt-5'>
                <div className='card-header'>{t('my_mixtures')}</div>
                <div className='list-group'>
                    <TransitionGroup>
                        {mixtures.map(({ id, isActive }) => (
                            <MixAnim key={id}>
                                <Mixture
                                    title={id}
                                    isActive={isActive}
                                    onPlay={() => dispatch(mainActions.switchMixture(id))}
                                    onPause={() => dispatch(mainActions.deactivateMixtures())}
                                    onDelete={() => dispatch(mainActions.deleteMixture(id))} />
                            </MixAnim>
                        ))}
                    </TransitionGroup>
                </div>
            </div>}
        </>
    );
};

export default MixturesPanel;
