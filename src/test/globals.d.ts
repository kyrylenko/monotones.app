// Test-only globals set up in src/setupTests.ts
declare global {
    interface Window {
        /** Switches useIsMobile to the mobile layout */
        __isMobile?: boolean;
        /** <audio> elements currently playing (jsdom cannot play media) */
        __playing: Set<HTMLMediaElement>;
    }
}

export {};
