// An AudioParam that follows its scheduled automation (set, linear ramp, value curve) against a clock in seconds
type Event =
    | { kind: 'set'; time: number; value: number }
    | { kind: 'ramp'; time: number; value: number }
    | { kind: 'curve'; time: number; curve: Float32Array; duration: number };

export class FakeAudioParam {
    events: Event[] = [];
    private base: number;
    private clock: () => number;

    constructor(value: number, clock: () => number) {
        this.base = value;
        this.clock = clock;
    }

    set value(value: number) {
        this.base = value;
        this.events = [];
    }

    get value(): number {
        const now = this.clock();
        let value = this.base;
        let previousTime = -Infinity;
        for (const event of this.events) {
            if (event.kind === 'ramp') {
                if (now < event.time) {
                    const progress = previousTime === -Infinity ? 1 : (now - previousTime) / (event.time - previousTime);
                    return value + (event.value - value) * Math.max(0, progress);
                }
                value = event.value;
            } else if (now < event.time) {
                break;
            } else if (event.kind === 'set') {
                value = event.value;
            } else {
                const progress = (now - event.time) / event.duration;
                if (progress < 1) {
                    return event.curve[Math.floor(progress * (event.curve.length - 1))];
                }
                value = event.curve[event.curve.length - 1];
            }
            previousTime = event.time;
        }
        return value;
    }

    private add(event: Event) {
        this.events.push(event);
        this.events.sort((a, b) => a.time - b.time);
        return this;
    }

    setValueAtTime(value: number, time: number) {
        return this.add({ kind: 'set', time, value });
    }

    linearRampToValueAtTime(value: number, time: number) {
        return this.add({ kind: 'ramp', time, value });
    }

    setValueCurveAtTime(curve: Float32Array, time: number, duration: number) {
        return this.add({ kind: 'curve', time, curve, duration });
    }

    // Also cancels a curve that is still running, like the Web Audio spec says
    cancelScheduledValues(time: number) {
        this.base = this.value;
        this.events = this.events.filter(event => event.time < time && !(event.kind === 'curve' && event.time + event.duration > time));
        return this;
    }
}
