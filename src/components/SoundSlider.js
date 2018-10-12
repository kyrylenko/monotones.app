import React, { Component } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../App.css';
import { StringUtils } from '../utils/StringUtils'

const utils = new StringUtils();

export class SoundSlider extends Component {
    state = {
        loaded: false
    };
    onSliderChange = (volume) => {
        //console.log("onSliderChange: ", volume);
        this.props.playPauseVolume({
            id: this.props.id,
            isPlay: this.props.isPlay,
            volume
        })
    }

    clickHandler = () => {
        //console.log("clickHandler: ");
        this.props.playPauseVolume({
            id: this.props.id,
            isPlay: !this.props.isPlay,
            volume: this.props.volume,
        })
    }

    initSound = () => {
        this.stream = new Audio(require(`../assets/sounds/${this.props.id}.mp3`));
        //this.stream.loop = true; 
        //this.stream.autoplay = true;
        this.stream.preload = 'none';
        this.stream.volume = this.props.volume;
        //this.stream.load();

        this.stream.addEventListener('timeupdate', function () {
            var buffer = .44
            if (this.currentTime > this.duration - buffer) {
                this.currentTime = 0
                this.play()
            }
        }, false);
        //console.log(this.stream);
    }

    play = () => {
        console.log("will play ", this.props.id);
        this.stream.play().then(_ => {
            if (!this.state.loaded)
                this.setState({ loaded: true })
        }).catch(error => {
            console.log('error loading audio ', this.props.id, error)
        });
    }

    pause = () => {
        console.log("will pause: ", this.props.id);
        this.stream.pause();
        this.stream.src = ''
        this.stream.load();
        this.stream = null;
        this.initSound();

        //this.stream.pause();        
    }

    playPause = () => {
        if (this.props.isPlay && this.props.isGlobalPlay) {
            this.play();
        } else if (!this.stream.paused && this.state.loaded) {
            this.pause();
        }
    }

    componentDidMount() {
        //console.log('SoundSlider did mount ', this.props.id)
        this.initSound();
        this.playPause();
    }

    componentDidUpdate(prevProps, prevState) {
        this.stream.volume = this.props.volume;

        if (prevProps.isPlay !== this.props.isPlay || prevProps.isGlobalPlay !== this.props.isGlobalPlay) {
            //console.log("prevProps.isGlobalPlay/ this.props.isGlobalPlay", prevProps.isGlobalPlay, this.props.isGlobalPlay);
            this.playPause();
        }
    }

    render() {

        return (
            <div>
                <img alt={this.props.title} className="sound-icon"
                    src={!this.state.loaded && this.props.isPlay && this.props.isGlobalPlay ? require('../assets/icons/loading.gif') : require(`../assets/icons/white/${this.props.id}.png`)} title={utils.idToTitle(this.props.title)}
                    style={{ opacity: this.props.isPlay ? 1 : null }}
                    onClick={() => this.clickHandler()}>
                </img>
                {/* https://github.com/react-component/slider  http://react-component.github.io/slider/examples/slider.html*/}
                <Slider
                    max={1}
                    step={0.01}
                    onChange={this.onSliderChange}
                    //defaultValue={0.7}
                    value={this.props.volume}
                    //trackStyle={{ height: 10 }}
                    //railStyle={{ height: 10 }}
                    trackStyle={{ backgroundColor: '#fff' }}
                    handleStyle={{
                        //borderColor: 'blue',
                        height: 24,
                        width: 24,
                        //marginLeft: -14,
                        //marginTop: -9,
                        marginTop: -11,
                    }}
                    style={{ visibility: this.props.isPlay ? 'visible' : 'hidden' }} />
            </div>
        );
    }
}