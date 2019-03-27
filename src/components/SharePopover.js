import React, { Component } from 'react';
import { Popover, PopoverHeader, PopoverBody, Tooltip } from 'reactstrap';
import {
    FacebookShareButton,
    GooglePlusShareButton,
    TwitterShareButton,
    FacebookIcon,
    TwitterIcon,
    GooglePlusIcon
} from 'react-share';

export default class SharePopover extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tooltip: false,
            copied: false,
        };
    }

    toggleTooltip = () => this.setState({ tooltip: !this.state.tooltip });

    selectAndCopy = (e) => {
        e.target.select();
        document.execCommand('copy');
        this.setState({ copied: true });
    };

    render() {
        return (
            <Popover placement={'left'} isOpen={this.props.isOpen} target={'popover'} toggle={this.props.toggle}>
                <PopoverHeader style={{ color: 'black' }}>Share sounds</PopoverHeader>
                <PopoverBody>
                    <input type='url' className='form-control' onFocus={this.selectAndCopy} onBlur={() => this.setState({ copied: false })} id='tooltip' defaultValue={this.props.url}></input>
                    <div className='d-flex justify-content-center my-2'>
                        <FacebookShareButton
                            url={this.props.url}
                            className='share-button mx-1'>
                            <FacebookIcon
                                size={32}
                                round />
                        </FacebookShareButton>
                        <GooglePlusShareButton
                            url={this.props.url}
                            className='share-button mx-1'>
                            <GooglePlusIcon
                                size={32}
                                round />
                        </GooglePlusShareButton>
                        <TwitterShareButton
                            url={this.props.url}
                            className='share-button mx-1'>
                            <TwitterIcon
                                size={32}
                                round />
                        </TwitterShareButton>
                    </div>
                </PopoverBody>
                <Tooltip placement='top' isOpen={this.state.tooltip} target='tooltip' toggle={this.toggleTooltip}>
                    {this.state.copied ? 'Copied!' : 'Click to copy'}
                </Tooltip>
            </Popover>
        );
    }
};

