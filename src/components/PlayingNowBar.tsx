import ActiveSoundIcons from './ActiveSoundIcons';

// Mobile: playing sounds pinned to the bottom of the screen
const PlayingNowBar = () => (
    <div className='fixed-bottom'>
        <div className='container-fluid'>
            <div style={{ marginTop: '5px' }} className='row'>
                <div style={{ overflow: 'hidden' }} className='col playing-now-bar'>
                    <ActiveSoundIcons className='d-flex justify-content-center' />
                </div>
            </div>
        </div>
    </div>
);

export default PlayingNowBar;
