import { cloneElement, useRef, type ReactElement, type Ref } from 'react';
import { CSSTransition } from 'react-transition-group';

interface MixAnimProps {
    /** Must accept a `ref` (DOM element or component passing it to its root element) */
    children: ReactElement<{ ref?: Ref<HTMLDivElement> }>;
    // Injected by <TransitionGroup>
    in?: boolean;
    onExited?: () => void;
}

// Grow / collapse animation for items of a <TransitionGroup>
const MixAnim = ({ children, ...transitionProps }: MixAnimProps) => {
    const nodeRef = useRef<HTMLDivElement>(null);

    return (
        <CSSTransition nodeRef={nodeRef} classNames='mixanim' timeout={400} {...transitionProps}>
            {cloneElement(children, { ref: nodeRef })}
        </CSSTransition>
    );
};

export default MixAnim;
