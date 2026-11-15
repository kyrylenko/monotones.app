import type { CSSProperties } from 'react';

interface SliderProps {
    value: number;
    onChange: (value: number) => void;
    /** Accessible name, e.g. "Campfire volume" */
    label: string;
    min?: number;
    max?: number;
    step?: number;
    /** Text read by screen readers instead of the raw value, e.g. "5:00" */
    valueText?: string;
    className?: string;
    style?: CSSProperties;
}

// Native range input with the app's look; keyboard and screen readers work out of the box
const Slider = ({ value, onChange, label, min = 0, max = 1, step = 0.01, valueText, className, style }: SliderProps) => {
    const fill = max > min ? (value - min) / (max - min) * 100 : 0;

    return (
        <input
            type='range'
            className={`slider${className ? ` ${className}` : ''}`}
            min={min}
            max={max}
            step={step}
            value={value}
            aria-label={label}
            aria-valuetext={valueText}
            onChange={event => onChange(Number(event.target.value))}
            style={{ ...style, '--fill': `${fill}%` } as CSSProperties} />
    );
};

export default Slider;
