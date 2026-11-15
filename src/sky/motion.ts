// iOS asks before a page may read the tilt sensor, and only from a tap. Elsewhere the events just arrive (or never do).
type PermissionRequest = () => Promise<'granted' | 'denied'>;

let asked = false;

export const requestMotionPermission = () => {
    if (asked || typeof DeviceOrientationEvent === 'undefined') {
        return;
    }
    asked = true;
    const request = (DeviceOrientationEvent as unknown as { requestPermission?: PermissionRequest }).requestPermission;
    request?.().catch(() => undefined);
};
