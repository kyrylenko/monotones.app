import type { SliderProps } from 'rc-slider';

// Shared look of the volume and timer sliders, colors depend on the theme (see App.css)
export const sliderStyles: SliderProps['styles'] = {
    track: { height: '6px', backgroundColor: 'var(--slider-track)' },
    rail: { height: '6px', backgroundColor: 'var(--slider-rail)' },
    handle: {
        height: 24,
        width: 24,
        marginTop: -9,
    },
};

// Our sliders are never ranges, rc-slider still types the value as `number | number[]`
export const sliderValue = (value: number | number[]): number => Array.isArray(value) ? value[0] : value;
