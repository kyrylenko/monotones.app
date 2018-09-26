import React, { Component } from 'react';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../App.css';

export class SoundSlider extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isPlay: this.props.enabled,
            volume: 0.7
        };
        //this.url = 'http://streaming.tdiradio.com:8000/house.mp3'
        //this.url = require('./assets/sounds/bleu_whales.mp3')

        this.stream = new Audio(this.props.sound);
        //this.stream.loop = true;
        this.stream.preload = 'none';
        this.stream.volume = this.state.volume;

        this.stream.addEventListener('timeupdate', function () {
            var buffer = .44
            if (this.currentTime > this.duration - buffer) {
                this.currentTime = 0
                this.play()
            }
        }, false);
    }

    onSliderChange = (volume) => {
        console.log("onSliderChange: ", volume);
        this.setState({ volume });
    }

    clickHandler = () => {
        console.log("clickHandler: ");
        this.setState({ isPlay: !this.state.isPlay })
    }

    play = () => {
        console.log("play");
        this.stream.play();
    }

    pause = () => {
        console.log("pause");
        this.stream.pause();
        this.stream.src = ''
        this.stream.load();

        this.stream = null;

        this.stream = new Audio();
        this.stream.src = this.props.sound;
        this.stream.preload = 'none';
        this.stream.pause();
    }

    playPause() {
        if (this.state.isPlay) {// && this.stream.paused
            this.play();
        } else {
            this.pause();
        }
    }

    componentDidMount() {        
        this.playPause();
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("playPause, isPlay, this.stream.paused, volume ", this.state.isPlay, this.stream.paused, this.state.volume);
        this.stream.volume = this.state.volume;

        if (prevState.isPlay !== this.state.isPlay) {
            this.playPause();
        }
    }

    render() {
        return (
            <div className="slider">
                <img alt="Rain" className="sound-icon" data-element="sound" data-name="rain" src={this.props.src} title="Rain"
                    style={{ opacity: this.state.isPlay ? 1 : 0.5 }}
                    onClick={() => this.clickHandler()}>
                </img>
                <Slider
                    max={1}
                    step={0.01}
                    onChange={this.onSliderChange}
                    //defaultValue={0.7}
                    value={this.state.volume}
                    trackStyle={{ height: 10 }}
                    railStyle={{ height: 10 }}
                    handleStyle={{
                        //borderColor: 'blue',
                        height: 28,
                        width: 28,
                        marginLeft: -14,
                        marginTop: -9,
                        //backgroundColor: 'black',
                    }}
                    style={{ visibility: this.state.isPlay ? 'visible' : 'hidden' }} />



                {/*<div className="to-left ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" data-element="volume_slider" data-element-name="rain_slider" style={{ display: 'block' }}>
                    <span className="ui-slider-handle ui-state-default ui-corner-all" style={{ flex: 0.6 }}></span>                    
                </div> */}
            </div>
        );
    }
}