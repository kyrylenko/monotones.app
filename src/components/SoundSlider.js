import React, { PureComponent } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { StringUtils } from '../utils/StringUtils'
import loading from '../assets/icons/loading.gif'

const utils = new StringUtils();

const isFirefox = typeof InstallTrigger !== 'undefined';

export class SoundSlider extends PureComponent {

    state = {
        isLoaded: false
    };

    onSliderChange = (volume) => {
        this.props.playPauseVolume({
            id: this.props.id,
            isPlay: this.props.isPlay,
            volume
        })
    }

    clickHandler = () => {
        this.props.playPauseVolume({
            id: this.props.id,
            isPlay: !this.props.isPlay,
            volume: this.props.volume,
        })
    }

    initSound = () => {
        this.audio = new Audio(require(`../assets/sounds/${this.props.id}.mp3`));
        this.audio.loop = isFirefox;
        //this.audio.autoplay = true;
        this.audio.preload = 'none';//'auto';//
        this.audio.volume = this.props.volume;

        this.audio.addEventListener('timeupdate', function () {
            //console.log(this.duration, this.currentTime)
            const buffer = .44
            if ((this.currentTime > this.duration - buffer) && !isFirefox) {
                this.currentTime = 0
                this.play()
            }
        }, false);
    }

    play = () => {
        //console.log("will play ", this.props.id);
        this.audio.play()
            .then(_ => {
                if (!this.state.isLoaded) {
                    this.setState({ isLoaded: true })
                }
            }).catch(error => console.log('Error while loading sound ', this.props.id, error));
    }

    pause = () => {
        this.audio.pause();
    }

    playPause = () => {
        if (this.props.isPlay && this.props.isGlobalPlay) {
            this.play();
        } else if (this.state.isLoaded && !this.audio.paused) {
            this.pause();
        }
    }

    componentDidMount() {
        this.initSound();
    }

    componentDidUpdate(prevProps, prevState) {
        this.audio.volume = this.props.volume;

        if (prevProps.isPlay !== this.props.isPlay || prevProps.isGlobalPlay !== this.props.isGlobalPlay || prevState.isLoaded !== this.state.isLoaded) {
            //console.log("prevProps.isGlobalPlay/ this.props.isGlobalPlay", prevProps.isGlobalPlay, this.props.isGlobalPlay);            
            this.playPause();
        }
    }

    render() {
        return (
            <div>
                <img alt={this.props.title} className='sound-icon'
                    src={!this.state.isLoaded && this.props.isPlay && this.props.isGlobalPlay ? loading : require(`../assets/icons/white/${this.props.id}.png`)}
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