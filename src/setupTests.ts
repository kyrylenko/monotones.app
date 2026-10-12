//ref: https://vitest.dev/config/#setupfiles
import '@testing-library/jest-dom/vitest';

//Tests switch to the mobile layout with window.__isMobile = true
window.matchMedia = vi.fn().mockImplementation(query => {
    return {
        get matches() { return window.__isMobile === true; },
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    };
});

//jsdom cannot play media: record what is playing instead
window.__playing = new Set();
Object.defineProperty(HTMLMediaElement.prototype, 'paused', {
    configurable: true,
    get() { return !window.__playing.has(this); },
});
HTMLMediaElement.prototype.play = function () {
    window.__playing.add(this);
    return Promise.resolve();
};
HTMLMediaElement.prototype.pause = function () {
    window.__playing.delete(this);
};

beforeEach(() => {
    window.__isMobile = false;
    window.__playing.clear();
    localStorage.clear();
});
