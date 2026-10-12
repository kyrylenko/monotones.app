import type { Ref } from 'react';
import trash from '../assets/icons/delete.svg';

interface MixtureProps {
    /** Used by the list animation (MixAnim) */
    ref?: Ref<HTMLDivElement>;
    title: string;
    isActive: boolean;
    onPlay: () => void;
    onPause: () => void;
    onDelete: () => void;
}

const Mixture = ({ ref, title, isActive, onPlay, onPause, onDelete }: MixtureProps) => (
    <div
        ref={ref}
        title={isActive ? 'Pause mixture' : 'Play mixture'}
        onClick={isActive ? onPause : onPlay}
        className={`list-group-item d-flex justify-content-between align-items-center ${isActive ? 'active' : ''}`}>
        <span>{title}</span>
        <img onClick={onDelete} className='mixture-action-btn' src={trash} title='Delete mixture' alt='Delete mixture' />
    </div>
);

export default Mixture;
