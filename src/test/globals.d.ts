// Test-only globals set up in src/setupTests.ts
declare global {
    interface Window {
        /** Switches useIsMobile to the mobile layout */
        __isMobile?: boolean;
        /** Makes the system color scheme dark (prefers-color-scheme) */
        __prefersDark?: boolean;
        /** Web Audio sources currently playing (faked in src/setupTests.ts): the decoded file url and the volume */
        __playing: Set<{ buffer?: { url?: string }; loop: boolean; loopStart: number; loopEnd: number; volume: number }>;
    }
}

export {};
