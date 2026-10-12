import React, { cloneElement, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

//Grow / collapse animation for items of a <TransitionGroup>.
//The child must accept a `ref` (DOM element or component forwarding it to its root element).
const MixAnim = ({ children, ...props }) => {
    const nodeRef = useRef(null);

    return (
        <CSSTransition nodeRef={nodeRef} classNames='mixanim' timeout={400} {...props}>
            {cloneElement(children, { ref: nodeRef })}
        </CSSTransition>
    );
};

export default MixAnim;
