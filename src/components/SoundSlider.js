import React, { Component } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../App.css';

export class SoundSlider extends Component {

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
        //console.log("will play ", this.props.id);
        this.stream.play();
    }

    pause = () => {
        //console.log("will pause: ", this.props.id);
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
        } else if (!this.stream.paused) {
            this.pause();
        }
    }

    idToTitle = (string) => {
        const newStr = `${string[0].toUpperCase()}${string.slice(1)}`
        return newStr.replace(/_/g, " ");
    }

    componentDidMount() {
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
                <img alt={this.props.title} className="sound-icon" src={require(`../assets/icons/white/${this.props.id}.png`)} title={this.idToTitle(this.props.title)}
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