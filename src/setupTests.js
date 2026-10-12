//ref: https://vitest.dev/config/#setupfiles
import '@testing-library/jest-dom/vitest';

window.matchMedia = vi.fn().mockImplementation(query => {
    return {
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    };
});
