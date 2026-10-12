import React, { Component } from 'react';
import Overlay from 'react-bootstrap/Overlay';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Tooltip from 'react-bootstrap/Tooltip';
import {
    FacebookShareButton,
    TwitterShareButton,
    FacebookIcon,
    TwitterIcon,
} from 'react-share';
import { withTranslation } from 'react-i18next';

class SharePopover extends Component {

    state = {
        copied: false,
    };

    selectAndCopy = (e) => {
        e.target.select();
        document.execCommand('copy');
        this.setState({ copied: true });
    };

    render() {
        const { t } = this.props;
        return (
            <Overlay placement='left' show={this.props.isOpen} target={this.props.target} rootClose onHide={this.props.toggle}>
                <Popover id='share-popover'>
                    <Popover.Header style={{ color: 'black' }}>{t('share_sounds')}</Popover.Header>
                    <Popover.Body>
                        <OverlayTrigger placement='top' overlay={<Tooltip id='copy-tooltip'>{this.state.copied ? 'Copied!' : 'Click to copy'}</Tooltip>}>
                            <input type='url' className='form-control' onFocus={this.selectAndCopy} onBlur={() => this.setState({ copied: false })} defaultValue={this.props.url}></input>
                        </OverlayTrigger>
                        <div className='d-flex justify-content-center my-2'>
                            <FacebookShareButton
                                url={this.props.url}
                                className='share-button mx-1'>
                                <FacebookIcon
                                    size={32}
                                    round />
                            </FacebookShareButton>
                            <TwitterShareButton
                                url={this.props.url}
                                className='share-button mx-1'>
                                <TwitterIcon
                                    size={32}
                                    round />
                            </TwitterShareButton>
                        </div>
                    </Popover.Body>
                </Popover>
            </Overlay>
        );
    }
};

export default withTranslation()(SharePopover);

