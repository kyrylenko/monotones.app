import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Slider from 'rc-slider';
import { secToMin } from '../utils/time';
import { timerActions } from '../store/timerSlice';
import { selectTimer } from '../store/selectors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { sliderStyles, sliderValue } from './sliderStyles';
import type { ModalProps } from './modalProps';

const DEFAULT_DURATION = 300; // seconds

const SleepTimerModal = ({ isOpen, onClose }: ModalProps) => {
    const dispatch = useAppDispatch();
    const { timerRun, interval: timeLeft } = useAppSelector(selectTimer);
    const [duration, setDuration] = useState(DEFAULT_DURATION);
    const { minutes, seconds } = secToMin(timerRun ? timeLeft : duration);

    const start = () => {
        dispatch(timerActions.timerStart(duration));
        onClose();
    };

    const stop = () => {
        dispatch(timerActions.timerStop());
        onClose();
    };

    return (
        <Modal show={isOpen} onHide={onClose} size='sm' autoFocus={false} centered={true}>
            <Modal.Header closeButton className='py-2'></Modal.Header>
            <Modal.Body style={{ color: 'black' }}>
                <h5 className='text-center mb-3'>{`Pause in ${minutes}:${seconds} min`}</h5>
                {!timerRun && <Slider
                    className='mx-auto'
                    min={30}
                    max={3600}
                    step={30}
                    onChange={(value) => setDuration(sliderValue(value))}
                    value={duration}
                    styles={sliderStyles}
                    style={{ width: '90%' }} />}
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-center'>
                {timerRun
                    ? <Button variant='secondary' size='lg' onClick={stop}>Cancel Timer</Button>
                    : <Button variant='primary' size='lg' onClick={start}>Start</Button>}
            </Modal.Footer>
        </Modal>
    );
};

export default SleepTimerModal;
