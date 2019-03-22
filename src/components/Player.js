import { PureComponent } from 'react';

const isFirefox = typeof InstallTrigger !== 'undefined';

class Player extends PureComponent {

    componentDidMount() {
        this.initSound();
    }

    componentDidUpdate(prevProps, prevState) {
        this.audio.volume = this.props.volume;
        if (prevProps.isPlay !== this.props.isPlay || prevProps.isGlobalPlay !== this.props.isGlobalPlay) {
            this.playPause();
        }
    }
    //TODO: consider using shouldComponentUpdate to prevent re-rendering if only isGlobalPlay changed for not played sound
    //shouldComponentUpdate(nextProps, nextState) {
    //}

    initSound = () => {
        this.audio = new Audio(require(`../assets/sounds/${this.props.id}.mp3`));
        this.audio.crossOrigin = 'anonymous';
        this.audio.loop = isFirefox;
        //this.audio.autoplay = true;
        this.audio.preload = 'none';//'auto';//
        this.audio.volume = this.props.volume;

        this.audio.addEventListener('timeupdate', function () {
            const buffer = .44
            if ((this.currentTime > this.duration - buffer) && !isFirefox) {
                this.currentTime = 0
                this.play()
            }
        }, false);
    }

    play = () => {
        this.audio.play()
            .then(_ => {
                this.props.setSoundLoaded(this.props.id);
            }).catch(error => console.log('Error while loading sound ', this.props.id, error));
    }

    playPause = () => {
        if (this.props.isPlay && this.props.isGlobalPlay) {
            this.play();
        } else if (!this.audio.paused) {
            this.audio.pause();
        }
    }

    render() {
        return null;
    }
}

export default Player;