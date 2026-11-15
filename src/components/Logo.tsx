// "Orbit" mark: a waning moon inside its orbit, with one sound on the ring. Drawn in currentColor.
// public/favicon.svg and the app icons use the same shapes.
export const LogoMark = ({ size = 32 }: { size?: number }) => (
    <svg width={size} height={size} viewBox='0 0 32 32' aria-hidden='true' className='logo-mark'>
        <circle cx='16' cy='16' r='13' fill='none' stroke='currentColor' strokeWidth='1.4' opacity='0.6' />
        <path d='M16 9A7 7 0 0 0 16 23A8.5 8.5 0 0 1 16 9Z' fill='currentColor' />
        <circle cx='26.6' cy='8.4' r='2.6' fill='currentColor' />
    </svg>
);

// Mark with the "monotones" wordmark
const Logo = () => (
    <span className='logo'>
        <LogoMark />
        <span className='logo-wordmark'>monotones</span>
    </span>
);

export default Logo;
