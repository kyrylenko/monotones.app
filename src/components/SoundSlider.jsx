import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import utils from '../utils/StringUtils';
import loading from '../assets/icons/loading.gif';
import { iconUrl } from '../assets';

const SoundSlider = React.memo((props) => {

    const onSliderChange = (volume) => {
        props.playPauseVolume({
            id: props.id,
            isPlay: props.isPlay,
            volume,
            isLoaded: props.isLoaded,
        })
    }

    const clickHandler = () => {
        props.playPauseVolume({
            id: props.id,
            isPlay: !props.isPlay,
            volume: props.volume,
        })
    }

    //TODO: add shouldComponentUpdate and do not rerender if isGlobalPlay changed while isPlay is false

    return (
        <>
            <img alt={props.title} className={`sound-icon${props.isPlay && props.isGlobalPlay ? ' breathing' : ''}`}
                src={!props.isLoaded && props.isPlay && props.isGlobalPlay
                    ? loading : iconUrl(props.id)}
                title={utils.idToTitle(props.title)}
                style={{ opacity: props.isPlay ? 1 : null }}
                onClick={clickHandler}>
            </img>
            <Slider
                className='mx-auto'
                max={1}
                step={0.01}
                onChange={onSliderChange}
                value={props.volume}
                styles={{
                    track: { height: '6px', backgroundColor: '#A3D9F0' },
                    rail: { height: '6px', backgroundColor: '#CBE7F3' },
                    handle: {
                        height: 24,
                        width: 24,
                        marginTop: -9,
                    },
                }}
                style={{ visibility: props.isPlay ? 'visible' : 'hidden', width: '80%' }} />
        </>
    );
});

export default SoundSlider;