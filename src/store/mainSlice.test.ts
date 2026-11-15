import { mainReducer as reducer, mainActions as actions, type MainState } from './mainSlice';
import { all, type SoundId } from '../constants/soundIds';
import defaultValues from '../constants/defaultValues';
import type { Mixture, SharedSound, SoundSetting, Sounds } from '../types';

const deepFreeze = <T extends object>(obj: T): T => {
    Object.values(obj).forEach(v => typeof v === 'object' && v !== null && deepFreeze(v));
    return Object.freeze(obj);
};

const sound = (id: SoundId, extra: Partial<SoundSetting> = {}): SoundSetting => ({ id, isPlay: true, volume: 0.3, ...extra });

const mixture = (id: string, sounds: Sounds, isActive = false): Mixture => ({ id, sounds, isActive });

const shared = (...codes: string[]): SharedSound[] => codes.map(code => ({ code, volume: 0.3 }));

const baseState: MainState = {
    isGlobalPlay: false,
    sounds: {},
    mixtures: [],
    activeStarterMix: null,
    sharedMixName: null,
};

describe('mainReducer', () => {
    it('returns the initial state', () => {
        expect(reducer(undefined, { type: '@@INIT' })).toEqual(baseState);
    });

    it('returns the same state for unknown actions', () => {
        const state = { ...baseState, isGlobalPlay: true };
        expect(reducer(state, { type: 'UNKNOWN' })).toBe(state);
    });

    describe('globalPlayPause', () => {
        it('sets isGlobalPlay', () => {
            expect(reducer(baseState, actions.globalPlayPause(true)).isGlobalPlay).toBe(true);
            expect(reducer({ ...baseState, isGlobalPlay: true }, actions.globalPlayPause(false)).isGlobalPlay).toBe(false);
        });
    });

    describe('playPauseVolume', () => {
        it('stores the sound and starts global play when the sound plays', () => {
            const next = reducer(baseState, actions.playPauseVolume(sound('campfire')));

            expect(next.sounds).toEqual({ campfire: sound('campfire') });
            expect(next.isGlobalPlay).toBe(true);
        });

        it('keeps isGlobalPlay when the sound is paused', () => {
            const paused = sound('campfire', { isPlay: false });

            expect(reducer(baseState, actions.playPauseVolume(paused)).isGlobalPlay).toBe(false);
            expect(reducer({ ...baseState, isGlobalPlay: true }, actions.playPauseVolume(paused)).isGlobalPlay).toBe(true);
        });

        it('replaces the whole sound entry (e.g. volume change)', () => {
            const state = { ...baseState, sounds: { campfire: sound('campfire', { isLoaded: true }) } };
            const next = reducer(state, actions.playPauseVolume({ id: 'campfire', isPlay: true, volume: 0.8 }));

            expect(next.sounds.campfire).toEqual({ id: 'campfire', isPlay: true, volume: 0.8 });
        });

        it('deactivates the active mixture', () => {
            const state = { ...baseState, mixtures: [mixture('A', {}, true), mixture('B', {})] };
            const next = reducer(state, actions.playPauseVolume(sound('campfire')));

            expect(next.mixtures.map(m => m.isActive)).toEqual([false, false]);
        });
    });

    describe('setVolume', () => {
        it('changes the volume without starting playback and deactivates the mixture', () => {
            const state = { ...baseState, sounds: { campfire: sound('campfire') }, mixtures: [mixture('A', {}, true)] };
            const next = reducer(state, actions.setVolume({ id: 'campfire', volume: 0.6 }));
            expect(next.sounds.campfire).toEqual(sound('campfire', { volume: 0.6 }));
            expect(next.isGlobalPlay).toBe(false);
            expect(next.mixtures[0].isActive).toBe(false);
        });

        it('ignores sounds that are not in the mix', () => {
            expect(reducer(baseState, actions.setVolume({ id: 'campfire', volume: 0.6 })).sounds).toEqual({});
        });
    });

    describe('mix limit', () => {
        const playing = (count: number) => Object.fromEntries(Object.values(all).slice(0, count)
            .map(id => [id, { id, isPlay: true, volume: 0.3 }]));

        it('does not add a sound to a full mix but still changes the volume of a sound in it', () => {
            const state = { ...baseState, sounds: playing(defaultValues.maxSounds) };
            const [first] = Object.keys(state.sounds) as SoundId[];
            const extra = Object.values(all)[defaultValues.maxSounds];

            expect(reducer(state, actions.playPauseVolume({ id: extra, isPlay: true, volume: 0.3 }))).toBe(state);
            expect(reducer(state, actions.playPauseVolume({ id: first, isPlay: true, volume: 0.9 })).sounds[first]?.volume).toBe(0.9);
        });

        it('loads shared mixes with more sounds whole', () => {
            const codes = Object.keys(all).slice(0, 8).map(code => ({ code, volume: 0.3 }));
            expect(Object.keys(reducer(undefined, actions.setSounds(codes)).sounds)).toHaveLength(8);
        });
    });

    describe('setSounds', () => {
        it('maps share codes to playing sounds with their volumes', () => {
            const next = reducer(baseState, actions.setSounds([{ code: 'kb', volume: 0.4 }, { code: 'ce', volume: 0 }]));

            expect(next.sounds).toEqual({
                keyboard: sound('keyboard', { volume: 0.4 }),
                campfire: sound('campfire', { volume: 0 }),
            });
        });

        it('ignores unknown codes and replaces previous sounds', () => {
            const state = { ...baseState, sounds: { farm: sound('farm') } };
            const next = reducer(state, actions.setSounds(shared('zz', 'ce')));

            expect(next.sounds).toEqual({ campfire: sound('campfire') });
        });

        it('clears all sounds with an empty list', () => {
            const state = { ...baseState, sounds: { farm: sound('farm') } };
            expect(reducer(state, actions.setSounds([])).sounds).toEqual({});
        });

        it('does not change isGlobalPlay and deactivates mixtures', () => {
            const state = { ...baseState, mixtures: [mixture('A', {}, true)] };
            const next = reducer(state, actions.setSounds(shared('ce')));

            expect(next.isGlobalPlay).toBe(false);
            expect(next.mixtures[0].isActive).toBe(false);
        });
    });

    describe('setSharedMixName', () => {
        it('sets and clears the name', () => {
            const next = reducer(baseState, actions.setSharedMixName('Evening'));
            expect(next.sharedMixName).toBe('Evening');
            expect(reducer(next, actions.setSharedMixName(null)).sharedMixName).toBeNull();
        });

        it.each([
            ['a sound change', actions.playPauseVolume(sound('campfire'))],
            ['another shared link', actions.setSounds(shared('kb'))],
            ['saving it', actions.addMixture('Evening')],
            ['a starter mix', actions.playStarterMix('deep_work')],
        ])('is cleared by %s', (_, action) => {
            const state = reducer(baseState, actions.setSharedMixName('Evening'));
            expect(reducer(state, action).sharedMixName).toBeNull();
        });
    });

    describe('setSoundLoaded', () => {
        it('marks the sound as loaded and keeps other fields', () => {
            const state = { ...baseState, sounds: { campfire: sound('campfire') } };
            const next = reducer(state, actions.setSoundLoaded('campfire'));

            expect(next.sounds.campfire).toEqual(sound('campfire', { isLoaded: true }));
        });

        //Regression: a file finishing loading after "Reset all" created a sound without a volume
        it('ignores sounds that were removed while loading', () => {
            expect(reducer(baseState, actions.setSoundLoaded('campfire')).sounds).toEqual({});
        });
    });

    describe('pauseSound', () => {
        it('pauses one sound and deactivates mixtures', () => {
            const state = {
                ...baseState,
                isGlobalPlay: true,
                sounds: { campfire: sound('campfire'), farm: sound('farm') },
                mixtures: [mixture('A', {}, true)],
            };
            const next = reducer(state, actions.pauseSound('campfire'));

            expect(next.sounds.campfire?.isPlay).toBe(false);
            expect(next.sounds.farm?.isPlay).toBe(true);
            expect(next.isGlobalPlay).toBe(true);
            expect(next.mixtures[0].isActive).toBe(false);
        });
    });

    describe('addMixture', () => {
        it('saves the current sounds as a new active mixture on top', () => {
            const sounds = { campfire: sound('campfire') };
            const state = { ...baseState, sounds, mixtures: [mixture('Old', {}, true)] };
            const next = reducer(state, actions.addMixture('New'));

            expect(next.mixtures).toEqual([
                mixture('New', sounds, true),
                mixture('Old', {}, false),
            ]);
        });

        it('replaces a mixture with the same title', () => {
            const state = {
                ...baseState,
                sounds: { farm: sound('farm') },
                mixtures: [mixture('A', {}), mixture('B', { campfire: sound('campfire') })],
            };
            const next = reducer(state, actions.addMixture('B'));

            expect(next.mixtures.map(m => m.id)).toEqual(['B', 'A']);
            expect(next.mixtures[0].sounds).toEqual({ farm: sound('farm') });
        });

        it('copies the sounds instead of sharing the reference', () => {
            const state = { ...baseState, sounds: { campfire: sound('campfire') } };
            const next = reducer(state, actions.addMixture('A'));

            expect(next.mixtures[0].sounds).not.toBe(state.sounds);
        });
    });

    describe('deleteMixture', () => {
        const sA = { campfire: sound('campfire') };
        const sB = { farm: sound('farm') };
        const sC = { subway: sound('subway') };

        it('removes an inactive mixture and keeps the active one and current sounds', () => {
            const state = { ...baseState, sounds: sA, mixtures: [mixture('A', sA, true), mixture('B', sB)] };
            const next = reducer(state, actions.deleteMixture('B'));

            expect(next.mixtures).toEqual([mixture('A', sA, true)]);
            expect(next.sounds).toEqual(sA);
        });

        it('activates the first remaining mixture and loads its sounds when the active one is deleted', () => {
            const state = {
                ...baseState,
                sounds: sA,
                mixtures: [mixture('A', sA, true), mixture('B', sB), mixture('C', sC)],
            };
            const next = reducer(state, actions.deleteMixture('A'));

            expect(next.mixtures).toEqual([mixture('B', sB, true), mixture('C', sC)]);
            expect(next.sounds).toEqual(sB);
        });

        it('activates the first remaining mixture even when none was active', () => {
            const current = { subway: sound('subway') };
            const state = { ...baseState, sounds: current, mixtures: [mixture('A', sA), mixture('B', sB)] };
            const next = reducer(state, actions.deleteMixture('B'));

            expect(next.mixtures).toEqual([mixture('A', sA, true)]);
            expect(next.sounds).toEqual(sA);
        });

        it('keeps the current sounds when the last mixture is deleted', () => {
            const state = { ...baseState, sounds: sB, mixtures: [mixture('A', sA, true)] };
            const next = reducer(state, actions.deleteMixture('A'));

            expect(next.mixtures).toEqual([]);
            expect(next.sounds).toEqual(sB);
        });

        it('copies the mixture sounds instead of sharing the reference', () => {
            const state = { ...baseState, mixtures: [mixture('A', sA), mixture('B', sB)] };
            const next = reducer(state, actions.deleteMixture('B'));

            expect(next.sounds).toEqual(sA);
            expect(next.sounds).not.toBe(next.mixtures[0].sounds);
        });
    });

    describe('switchMixture', () => {
        const sA = { campfire: sound('campfire') };
        const sB = { farm: sound('farm') };

        it('loads the mixture sounds, activates it and starts playing', () => {
            const state = { ...baseState, sounds: sA, mixtures: [mixture('A', sA, true), mixture('B', sB)] };
            const next = reducer(state, actions.switchMixture('B'));

            expect(next.sounds).toEqual(sB);
            expect(next.sounds).not.toBe(sB);
            expect(next.isGlobalPlay).toBe(true);
            expect(next.mixtures.map(m => m.isActive)).toEqual([false, true]);
        });

        it('does nothing when the mixture is already active', () => {
            const state = { ...baseState, mixtures: [mixture('A', sA, true)] };
            expect(reducer(state, actions.switchMixture('A'))).toEqual(state);
        });

        it('does nothing for an unknown mixture', () => {
            const state = { ...baseState, mixtures: [mixture('A', sA)] };
            expect(reducer(state, actions.switchMixture('X'))).toEqual(state);
        });
    });

    describe('openStarterMix', () => {
        it('loads the mix with its volumes and activates it without playing', () => {
            const state = { ...baseState, isGlobalPlay: true, sounds: { farm: sound('farm') }, mixtures: [mixture('A', {}, true)] };
            const next = reducer(state, actions.openStarterMix('rainy_evening'));
            expect(Object.keys(next.sounds)).toEqual(['october_rain', 'campfire', 'vinyl_cracks']);
            expect(next.sounds.october_rain?.volume).toBe(0.4);
            expect(next.activeStarterMix).toBe('rainy_evening');
            expect(next.mixtures[0].isActive).toBe(false);
            expect(next.isGlobalPlay).toBe(false);
        });

        it('keeps an active mix playing', () => {
            const playing = reducer({ ...baseState, isGlobalPlay: true }, actions.playStarterMix('deep_work'));
            expect(reducer(playing, actions.openStarterMix('deep_work'))).toBe(playing);
        });
    });

    describe('deactivateMixtures', () => {
        it('deactivates all mixtures and stops playing, keeping the sounds', () => {
            const sA = { campfire: sound('campfire') };
            const state = { ...baseState, isGlobalPlay: true, sounds: sA, mixtures: [mixture('A', sA, true)] };
            const next = reducer(state, actions.deactivateMixtures());

            expect(next.isGlobalPlay).toBe(false);
            expect(next.sounds).toEqual(sA);
            expect(next.mixtures[0].isActive).toBe(false);
        });
    });

    describe('playStarterMix', () => {
        it('loads the mix with its tuned volumes, activates it and starts playing', () => {
            const state = { ...baseState, sounds: { campfire: sound('campfire') }, mixtures: [mixture('A', {}, true)] };
            const next = reducer(state, actions.playStarterMix('deep_work'));

            expect(next.sounds).toEqual({
                deep_space: { id: 'deep_space', isPlay: true, volume: 0.3 },
                thunderstorm: { id: 'thunderstorm', isPlay: true, volume: 0.3 },
            });
            expect(next.isGlobalPlay).toBe(true);
            expect(next.activeStarterMix).toBe('deep_work');
            expect(next.mixtures[0].isActive).toBe(false);
        });

        it('does nothing when the mix is already active', () => {
            const state = reducer(baseState, actions.playStarterMix('deep_work'));
            expect(reducer(state, actions.playStarterMix('deep_work'))).toBe(state);
        });

        it.each([
            ['a sound change', actions.playPauseVolume(sound('campfire'))],
            ['pausing a sound', actions.pauseSound('deep_space')],
            ['a shared link', actions.setSounds(shared('kb'))],
            ['saving a mixture', actions.addMixture('Mine')],
            ['deactivating', actions.deactivateMixtures()],
        ])('is deactivated by %s', (_, action) => {
            const state = reducer(baseState, actions.playStarterMix('deep_work'));
            expect(reducer(state, action).activeStarterMix).toBeNull();
        });

        it('is deactivated by switching to a saved mixture', () => {
            const state = reducer({ ...baseState, mixtures: [mixture('A', { farm: sound('farm') })] }, actions.playStarterMix('deep_work'));
            expect(reducer(state, actions.switchMixture('A')).activeStarterMix).toBeNull();
        });
    });

    it('never mutates the previous state', () => {
        const sA = { campfire: sound('campfire') };
        const sB = { farm: sound('farm') };
        const state = deepFreeze({
            isGlobalPlay: true,
            sounds: sA,
            mixtures: [mixture('A', sA, true), mixture('B', sB)],
            activeStarterMix: null,
            sharedMixName: null,
        });

        expect(() => [
            actions.playStarterMix('deep_work'),
            actions.setSharedMixName('X'),
            actions.addMixture('C'),
            actions.deleteMixture('A'),
            actions.switchMixture('B'),
            actions.deactivateMixtures(),
            actions.playPauseVolume(sound('subway')),
            actions.pauseSound('campfire'),
            actions.setSounds(shared('kb')),
            actions.setSoundLoaded('campfire'),
            actions.globalPlayPause(false),
        ].forEach(action => reducer(state, action))).not.toThrow();
    });
});
