import { useState, type FocusEvent, type RefObject } from 'react';
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
import { useTranslation } from 'react-i18next';

interface SharePopoverProps {
    isOpen: boolean;
    onClose: () => void;
    target: RefObject<HTMLElement | null>;
    url: string;
}

const SharePopover = ({ isOpen, onClose, target, url }: SharePopoverProps) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const selectAndCopy = (e: FocusEvent<HTMLInputElement>) => {
        e.target.select();
        document.execCommand('copy');
        setCopied(true);
    };

    return (
        <Overlay placement='left' show={isOpen} target={target} rootClose onHide={onClose}>
            <Popover id='share-popover'>
                <Popover.Header style={{ color: 'black' }}>{t('share_sounds')}</Popover.Header>
                <Popover.Body>
                    <OverlayTrigger placement='top' overlay={<Tooltip id='copy-tooltip'>{copied ? 'Copied!' : 'Click to copy'}</Tooltip>}>
                        <input type='url' className='form-control' onFocus={selectAndCopy} onBlur={() => setCopied(false)} defaultValue={url} />
                    </OverlayTrigger>
                    <div className='d-flex justify-content-center my-2'>
                        <FacebookShareButton url={url} className='share-button mx-1'>
                            <FacebookIcon size={32} round />
                        </FacebookShareButton>
                        <TwitterShareButton url={url} className='share-button mx-1'>
                            <TwitterIcon size={32} round />
                        </TwitterShareButton>
                    </div>
                </Popover.Body>
            </Popover>
        </Overlay>
    );
};

export default SharePopover;
