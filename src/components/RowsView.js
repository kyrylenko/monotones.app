import React from 'react';
import PropTypes from 'prop-types'
import SoundSlider from '../components/SoundSlider';

const RowsView = React.memo((props) => {

    const rows = [];

    for (let i = 0; i < props.sounds.length - 1; i += 2) {

        const j = i + 1;
        const sLeft = props.sounds[i];
        const sRight = props.sounds[j];

        const row = <div key={i} className='sounds-row row'>
            <div className='d-none d-sm-block col-sm-2 col-md-2 col-lg-2'></div>
            <div className='text-center col-6 col-sm-4 col-md-3 col-lg-3'>
                <SoundSlider
                    id={sLeft.id}
                    isGlobalPlay={props.isGlobalPlay}
                    isPlay={sLeft.isPlay}
                    isLoaded={sLeft.isLoaded}
                    volume={sLeft.volume}
                    title={sLeft.id}
                    playPauseVolume={props.playPauseVolume} />
            </div>
            <div className='d-none d-sm-none d-md-block col-sm-2 col-md-2 col-lg-2'></div>
            <div className='text-center col-6 col-sm-4 col-md-3 col-lg-3'>
                <SoundSlider
                    id={sRight.id}
                    isGlobalPlay={props.isGlobalPlay}
                    isPlay={sRight.isPlay}
                    isLoaded={sRight.isLoaded}
                    volume={sRight.volume}
                    title={sRight.id}
                    playPauseVolume={props.playPauseVolume} />
            </div>
            <div className='d-none d-sm-block col-sm-2 col-md-2 col-lg-2'></div>
        </div>;

        rows.push(row);
    }

    return (
        <div className='container'>
            {rows}
        </div>
    );

});

RowsView.propTypes = {
    playPauseVolume: PropTypes.func.isRequired,
    isGlobalPlay: PropTypes.bool.isRequired,
    sounds: PropTypes.array.isRequired
}

export default RowsView;