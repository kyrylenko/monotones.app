import React, { Component } from 'react';
import SharePopover from './SharePopover';
import { all } from '../constants/soundIds';
import { withTranslation } from 'react-i18next';

class Share extends Component {

    state = {
        popover: false,
        shareUrl: window.location.origin,
    };

    togglePopover = () => this.setState({ popover: !this.state.popover });

    share = () => {
        const activeIds = Object.values(this.props.reduxSounds).filter(x => x.isPlay).map(x => x.id);

        if (activeIds.length > 0) {
            const activeAbbrs = Object.entries(all)
                .filter(x => activeIds.some(s => s === x[1])).map(x => x[0]);

            const parameter = activeAbbrs.reduce((acc, item) => acc += item);
            this.setState({
                shareUrl: `https://monotones.app/share/${parameter}`,
                popover: true
            });
        } else {
            this.setState({
                shareUrl: `https://monotones.app`,
                popover: true
            });
        }
    };

    render() {
        const { t } = this.props;
        return (
            <>
                <div className={this.props.className} title={t('share_sounds')} id='popover' onClick={this.share} style={{ cursor: 'pointer' }}>
                    {t('share')}
                </div>
                <SharePopover isOpen={this.state.popover} toggle={this.togglePopover} url={this.state.shareUrl} />
            </>
        );
    }
}

export default withTranslation()(Share);