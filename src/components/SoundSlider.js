import React, { PureComponent } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { StringUtils } from '../utils/StringUtils'
//import loading from '../assets/icons/loading.gif'

const utils = new StringUtils();

export class SoundSlider extends PureComponent {

    onSliderChange = (volume) => {
        this.props.playPauseVolume({
            id: this.props.id,
            isPlay: this.props.isPlay,
            volume,
            isLoaded: this.props.isLoaded,
        })
    }

    clickHandler = () => {
        this.props.playPauseVolume({
            id: this.props.id,
            isPlay: !this.props.isPlay,
            volume: this.props.volume,
        })
    }

    render() {
        return (
            <div>
                <img alt={this.props.title} className='sound-icon'
                    src={!this.props.isLoaded && this.props.isPlay && this.props.isGlobalPlay
                        ? require('../assets/icons/loading.gif') : require(`../assets/icons/white/${this.props.id}.png`)}
                    title={utils.idToTitle(this.props.title)}
                    style={{ opacity: this.props.isPlay ? 1 : null }}
                    onClick={this.clickHandler}>
                </img>
                <Slider
                    max={1}
                    step={0.01}
                    onChange={this.onSliderChange}
                    value={this.props.volume}
                    trackStyle={{ backgroundColor: '#fff' }}
                    handleStyle={{
                        height: 24,
                        width: 24,
                        marginTop: -11,
                    }}
                    style={{ visibility: this.props.isPlay ? 'visible' : 'hidden' }} />
            </div>
        );
    }
}