import ActiveSoundIcons from './ActiveSoundIcons';
import colors from '../constants/colors';

// Mobile: playing sounds pinned to the bottom of the screen
const PlayingNowBar = () => (
    <div className='fixed-bottom'>
        <div className='container-fluid'>
            <div style={{ marginTop: '5px' }} className='row'>
                <div style={{ overflow: 'hidden', backgroundColor: colors.themeActive }} className='col'>
                    <ActiveSoundIcons className='d-flex justify-content-center' />
                </div>
            </div>
        </div>
    </div>
);

export default PlayingNowBar;
