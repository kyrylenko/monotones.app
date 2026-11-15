import { useLayoutEffect, useState, type RefObject } from 'react';

// Width and height of an element, updated when it resizes
const useElementSize = (ref: RefObject<HTMLElement | null>) => {
    const [size, setSize] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        const element = ref.current;
        if (!element) {
            return;
        }
        const measure = () => setSize(prev => {
            const { width, height } = element.getBoundingClientRect();
            return prev.width === width && prev.height === height ? prev : { width, height };
        });
        measure();
        if (typeof ResizeObserver === 'undefined') {
            return;
        }
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        return () => observer.disconnect();
    }, [ref]);

    return size;
};

export default useElementSize;
