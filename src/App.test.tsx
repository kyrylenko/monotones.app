import { screen, fireEvent, waitFor, within, act } from '@testing-library/react';
import { renderApp, seedPersistedState, readPersistedState, playingSounds } from './test/renderApp';
import { $ } from './test/dom';
import { timerActions } from './store/timerSlice';
import { idToTitle } from './utils/sounds';
import type { SoundId } from './constants/soundIds';

const tray = () => screen.getByRole('group', { name: 'Sounds' });
const chips = () => within(tray()).getAllByRole('button');
const chip = (id: SoundId) => within(tray()).getByRole('button', { name: idToTitle(id) });
const toggleSound = (id: SoundId) => fireEvent.click(chip(id));
/** Sounds in the orbit, in their order around the moon */
const orbit = () => [...document.querySelectorAll<HTMLElement>('.orb')].map(orb => orb.dataset.sound);
const orb = (id: SoundId) => screen.getByRole('slider', { name: `${idToTitle(id)} volume` });
const playButton = () => $('.play-button');
const clickPlayButton = () => fireEvent.click(playButton());
const dock = () => screen.getByRole('navigation', { name: 'Playback' });
const openTimer = () => fireEvent.click(within(dock()).getByRole('button', { name: /Timer|min$/ }));

const mixButton = (name: string) => {
    const button = [...document.querySelectorAll<HTMLElement>('.mix-pick')].find(b => b.querySelector('.mix-name')?.textContent === name);
    if (!button) {
        throw new Error(`Mix not found: ${name}`);
    }
    return button;
};
const mixtureNames = () => [...document.querySelectorAll('.saved-mixes .mix-name')].map(s => s.textContent);

const saveMixture = async (name: string) => {
    const input = screen.getByPlaceholderText('Mixture name');
    fireEvent.change(input, { target: { value: name } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(mixtureNames()).toContain(name));
};

const openMenu = () => fireEvent.click(screen.getByRole('button', { name: 'Menu' }));

describe('App', () => {
    describe('sounds', () => {
        it('shows all 28 sounds in the tray, the sleep sounds first', async () => {
            await renderApp();

            expect(chips()).toHaveLength(28);
            expect(chips().slice(0, 3).map(c => c.textContent)).toEqual(['White noise', 'Brown noise', 'Summer night']);
            expect(orbit()).toEqual([]);
            expect(screen.getByText('Tap a sound to place it in the sky')).toBeInTheDocument();
        });

        it.each(['/sleep', '/relax', '/focus'])('%s shows the same sounds, there are no categories', async (path) => {
            await renderApp({ path });

            expect(chips()).toHaveLength(28);
            expect(screen.queryByRole('link', { name: 'Sleep' })).toBeNull();
        });

        it('a tap places a sound in the orbit and plays it', async () => {
            const { store } = await renderApp();

            toggleSound('campfire');

            await waitFor(() => expect(playingSounds()).toEqual(['campfire']));
            expect(orbit()).toEqual(['campfire']);
            expect(chip('campfire')).toHaveAttribute('aria-pressed', 'true');
            expect(playButton()).toHaveAttribute('aria-label', 'Pause');
            expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Your mix');
            expect(store.getState().main.sounds.campfire).toEqual({ id: 'campfire', isPlay: true, volume: 0.3, isLoaded: true });
        });

        it('a second tap takes the sound out', async () => {
            await renderApp();

            toggleSound('campfire');
            toggleSound('farm');
            await waitFor(() => expect(playingSounds()).toEqual(['campfire', 'farm']));

            toggleSound('campfire');
            await waitFor(() => expect(playingSounds()).toEqual(['farm']));
            expect(orbit()).toEqual(['farm']);
        });

        it('takes up to 6 sounds', async () => {
            await renderApp();
            const six: SoundId[] = ['campfire', 'farm', 'heartbeat', 'white_noise', 'subway', 'keyboard'];
            six.forEach(toggleSound);

            toggleSound('october_rain');

            expect(orbit()).toEqual(six);
            expect(chip('october_rain')).toHaveAttribute('aria-pressed', 'false');
            expect(screen.getByRole('status')).toHaveTextContent('Up to 6 sounds. Remove one to add October rain.');
            expect(screen.getByText('6 of 6 sounds. Drag one out to make room.')).toBeInTheDocument();
        });

        it('the arrow keys change the volume of a sound in the orbit, Delete removes it', async () => {
            const { store } = await renderApp();
            toggleSound('campfire');
            await waitFor(() => expect(playingSounds()).toEqual(['campfire']));
            const [audio] = window.__playing;

            // volume 0.3 sits at 55% of the dial (volume = position²)
            expect(orb('campfire')).toHaveAttribute('aria-valuenow', '55');
            fireEvent.keyDown(orb('campfire'), { key: 'ArrowUp' });

            await waitFor(() => expect(store.getState().main.sounds.campfire?.volume).toBeCloseTo(0.357, 3));
            expect(audio.volume).toBeCloseTo(0.357, 3);
            expect(orb('campfire')).toHaveAttribute('aria-valuenow', '60');

            fireEvent.keyDown(orb('campfire'), { key: 'Delete' });
            await waitFor(() => expect(playingSounds()).toEqual([]));
            expect(orbit()).toEqual([]);
        });

        it('dragging a sound toward the moon makes it louder, past the outer ring removes it', async () => {
            const { store } = await renderApp();
            toggleSound('campfire');
            const target = orb('campfire');
            // jsdom has no layout: the stage counts as 360 × 480, the moon at (180, 234), the outer ring at 134 px
            fireEvent.pointerDown(target, { clientX: 180, clientY: 120 });
            fireEvent.pointerMove(target, { clientX: 180, clientY: 150 });
            fireEvent.pointerUp(target);
            expect(store.getState().main.sounds.campfire?.volume).toBeGreaterThan(0.5);
            expect(store.getState().main.isGlobalPlay).toBe(true);

            fireEvent.pointerDown(target, { clientX: 180, clientY: 150 });
            fireEvent.pointerMove(target, { clientX: 180, clientY: 20 });
            expect(target).toHaveTextContent('Release to remove');
            fireEvent.pointerUp(target);

            await waitFor(() => expect(orbit()).toEqual([]));
            expect(store.getState().main.sounds.campfire?.isPlay).toBe(false);
        });

        it('the play button and the moon pause and resume all sounds', async () => {
            await renderApp();
            toggleSound('campfire');
            toggleSound('farm');
            await waitFor(() => expect(playingSounds()).toHaveLength(2));

            clickPlayButton();
            await waitFor(() => expect(playingSounds()).toEqual([]));
            expect(playButton()).toHaveAttribute('aria-label', 'Play');

            fireEvent.click($('.moon-button'));
            await waitFor(() => expect(playingSounds()).toEqual(['campfire', 'farm']));
            expect($('.moon-button')).toHaveAttribute('aria-label', 'Pause');
        });

        it('pressing play with an empty sky asks for a sound', async () => {
            await renderApp();

            clickPlayButton();

            expect(screen.getByRole('status')).toHaveTextContent('Tap a sound to start');
        });

        it('the space key toggles global play, except on controls and while typing', async () => {
            await renderApp();
            toggleSound('campfire');
            await waitFor(() => expect(playingSounds()).toEqual(['campfire']));

            fireEvent.keyDown(document, { key: ' ', code: 'Space', keyCode: 32 });
            await waitFor(() => expect(playingSounds()).toEqual([]));

            fireEvent.keyDown(document, { key: ' ', code: 'Space', keyCode: 32 });
            await waitFor(() => expect(playingSounds()).toEqual(['campfire']));

            // a focused button is pressed with space, that must not toggle playback as well
            fireEvent.keyDown(chip('farm'), { key: ' ', code: 'Space', keyCode: 32 });
            fireEvent.keyDown(screen.getByPlaceholderText('Mixture name'), { key: ' ', code: 'Space', keyCode: 32 });
            expect(playingSounds()).toEqual(['campfire']);
        });
    });

    describe('mixtures', () => {
        it('saves, switches, deactivates and deletes mixtures', async () => {
            await renderApp();

            toggleSound('campfire');
            await saveMixture('Evening');
            expect(mixtureNames()).toEqual(['Evening']);
            expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Evening');

            toggleSound('campfire');
            toggleSound('farm');
            await saveMixture('Morning');
            expect(mixtureNames()).toEqual(['Morning', 'Evening']);
            await waitFor(() => expect(playingSounds()).toEqual(['farm']));

            fireEvent.click(mixButton('Evening'));
            await waitFor(() => expect(playingSounds()).toEqual(['campfire']));
            expect(mixButton('Evening')).toHaveAttribute('aria-pressed', 'true');

            //clicking the active mixture pauses everything
            fireEvent.click(mixButton('Evening'));
            await waitFor(() => expect(playingSounds()).toEqual([]));

            fireEvent.click(screen.getByRole('button', { name: 'Delete Morning' }));
            await waitFor(() => expect(mixtureNames()).toEqual(['Evening']));
        });

        it('does not save a mixture without a name', async () => {
            await renderApp();
            toggleSound('campfire');

            fireEvent.click(screen.getByRole('button', { name: 'Save' }));

            expect(mixtureNames()).toEqual([]);
        });

        it('saves with the Enter key', async () => {
            await renderApp();
            toggleSound('campfire');

            const input = screen.getByPlaceholderText('Mixture name');
            fireEvent.change(input, { target: { value: 'Night' } });
            //Enter in a form field submits the form
            fireEvent.submit(input);

            await waitFor(() => expect(mixtureNames()).toEqual(['Night']));
        });

        it('opens in a sheet on phones and closes when a mix is picked', async () => {
            window.__isMobile = true;
            await renderApp();
            expect(screen.queryByRole('complementary', { name: 'Mixes' })).toBeNull();

            fireEvent.click(within(dock()).getByRole('button', { name: 'Mixes' }));
            const sheet = screen.getByRole('dialog', { name: 'Mixes' });
            fireEvent.click(within(sheet).getByRole('button', { name: /^Rainy evening/ }));

            expect(screen.queryByRole('dialog', { name: 'Mixes' })).toBeNull();
            await waitFor(() => expect(playingSounds()).toEqual(['campfire', 'october_rain', 'vinyl_cracks']));
        });
    });

    describe('starter mixes', () => {
        const starterMixNames = () => [...document.querySelectorAll('.starter-mixes .mix-name')].map(s => s.textContent);

        it('lists all six with their sounds', async () => {
            await renderApp();

            expect(starterMixNames()).toEqual(['Baby\'s first night', 'Starry night', 'Rainy evening', 'Summer meadow', 'Deep work', 'Night train']);
            expect(mixButton('Rainy evening')).toHaveTextContent('October rain, Campfire, Vinyl cracks');
        });

        it('a tap plays the mix with its volumes like a saved mixture, a second tap pauses it', async () => {
            const { store } = await renderApp();

            fireEvent.click(mixButton('Rainy evening'));

            await waitFor(() => expect(playingSounds()).toEqual(['campfire', 'october_rain', 'vinyl_cracks']));
            expect(mixButton('Rainy evening')).toHaveAttribute('aria-pressed', 'true');
            expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Rainy evening');
            expect(store.getState().main.sounds.october_rain?.volume).toBe(0.4);
            expect(playButton()).toHaveAttribute('aria-label', 'Pause');

            fireEvent.click(mixButton('Night train'));
            await waitFor(() => expect(playingSounds()).toEqual(['inside_train', 'october_rain']));
            expect(mixButton('Rainy evening')).toHaveAttribute('aria-pressed', 'false');

            fireEvent.click(mixButton('Night train'));
            await waitFor(() => expect(playingSounds()).toEqual([]));
            expect(mixButton('Night train')).toHaveAttribute('aria-pressed', 'false');
        });

        it('can be saved as an own mixture and changed', async () => {
            await renderApp();
            fireEvent.click(mixButton('Rainy evening'));

            expect(screen.getByPlaceholderText('Mixture name')).toHaveValue('Rainy evening');
            fireEvent.click(screen.getByRole('button', { name: 'Save' }));
            await waitFor(() => expect(mixtureNames()).toEqual(['Rainy evening']));
            expect(within($('.saved-mixes')).getByRole('button', { name: /^Rainy evening/ })).toHaveAttribute('aria-pressed', 'true');
            expect(within($('.starter-mixes')).getByRole('button', { name: /^Rainy evening/ })).toHaveAttribute('aria-pressed', 'false');

            //changing a sound detaches from the mix, saving under the same name updates the own mixture
            toggleSound('vinyl_cracks');
            await saveMixture('Rainy evening');
            expect(mixtureNames()).toEqual(['Rainy evening']);
            fireEvent.click(mixButton('Deep work'));
            fireEvent.click(within($('.saved-mixes')).getByRole('button', { name: /^Rainy evening/ }));
            await waitFor(() => expect(playingSounds()).toEqual(['campfire', 'october_rain']));
        });
    });

    describe('sleep timer', () => {
        afterEach(() => vi.useRealTimers());
        const tick = (seconds: number) => { for (let i = 0; i < seconds; i++) act(() => vi.advanceTimersByTime(1000)); };

        it('counts down from the chosen duration and pauses all sounds at the end', async () => {
            const { store } = await renderApp();
            toggleSound('campfire');
            await waitFor(() => expect(playingSounds()).toEqual(['campfire']));

            openTimer();
            vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
            fireEvent.click(within(screen.getByRole('dialog', { name: 'Sleep timer' })).getByRole('button', { name: '15 min' }));
            expect(screen.queryByRole('dialog')).toBeNull();

            tick(61);
            expect(store.getState().timer.interval).toBe(839);
            expect(within(dock()).getByRole('button', { name: '14 min' })).toBeInTheDocument();
            expect($('.timer-arc')).toBeInTheDocument();

            openTimer();
            expect(screen.getByText('13:59 left')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: '15 min' })).toHaveAttribute('aria-pressed', 'true');
            fireEvent.keyDown(document, { key: 'Escape' });

            act(() => store.dispatch(timerActions.timerStart(2)));
            tick(2);
            await waitFor(() => expect(playingSounds()).toEqual([]));
            expect(playButton()).toHaveAttribute('aria-label', 'Play');
            expect(document.querySelector('.timer-arc')).toBeNull();
        });

        it('starts playback when it is set while paused', async () => {
            const { store } = await renderApp();
            toggleSound('campfire');
            clickPlayButton();
            await waitFor(() => expect(playingSounds()).toEqual([]));

            openTimer();
            fireEvent.click(screen.getByRole('button', { name: '30 min' }));

            await waitFor(() => expect(playingSounds()).toEqual(['campfire']));
            expect(store.getState().timer).toEqual({ timerRun: true, interval: 1800 });
        });

        it('fades the sounds out during the last seconds and restores the volume for the next play', async () => {
            const { store } = await renderApp();
            toggleSound('campfire');
            await waitFor(() => expect(playingSounds()).toEqual(['campfire']));
            const [audio] = window.__playing;
            const volume = store.getState().main.sounds.campfire!.volume;
            expect(audio.volume).toBeCloseTo(volume);

            vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
            act(() => store.dispatch(timerActions.timerStart(60)));

            tick(30);
            expect(audio.volume).toBeCloseTo(volume);

            tick(15);
            expect(audio.volume).toBeLessThan(volume / 2);
            expect(audio.volume).toBeGreaterThan(0);

            tick(14);
            expect(audio.volume).toBeLessThan(volume / 100);
            expect(playingSounds()).toEqual(['campfire']);

            tick(1);
            expect(playingSounds()).toEqual([]);
            tick(1);
            expect(audio.volume).toBeCloseTo(volume);
            expect(store.getState().main.sounds.campfire!.volume).toBe(volume);
        });

        it('restores the full volume when cancelled during the fade', async () => {
            const { store } = await renderApp();
            toggleSound('campfire');
            await waitFor(() => expect(playingSounds()).toEqual(['campfire']));
            const [audio] = window.__playing;
            const volume = audio.volume;

            vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
            act(() => store.dispatch(timerActions.timerStart(20)));
            tick(2);
            expect(audio.volume).toBeLessThan(volume);

            act(() => store.dispatch(timerActions.timerStop()));
            tick(1);

            expect(audio.volume).toBeCloseTo(volume);
            expect(playingSounds()).toEqual(['campfire']);
        });

        it('can be turned off', async () => {
            const { store } = await renderApp();
            toggleSound('campfire');
            openTimer();
            fireEvent.click(screen.getByRole('button', { name: '45 min' }));
            await waitFor(() => expect(store.getState().timer.timerRun).toBe(true));

            openTimer();
            fireEvent.click(screen.getByRole('button', { name: 'Off' }));

            await waitFor(() => expect(store.getState().timer.timerRun).toBe(false));
            expect(playingSounds()).toEqual(['campfire']);
        });

        it('is stopped when playback is paused', async () => {
            const { store } = await renderApp();
            toggleSound('campfire');
            openTimer();
            fireEvent.click(screen.getByRole('button', { name: '15 min' }));
            await waitFor(() => expect(store.getState().timer.timerRun).toBe(true));

            clickPlayButton();

            expect(store.getState().timer.timerRun).toBe(false);
        });
    });

    describe('night mode', () => {
        it('has one dark theme and no theme switch', async () => {
            await renderApp();

            expect(screen.queryByRole('button', { name: /theme/i })).toBeNull();
            expect(document.documentElement).not.toHaveAttribute('data-bs-theme');
            expect(within(screen.getByRole('link', { name: 'Monotones' })).getByText('monotones')).toBeInTheDocument();
        });

        it('dims everything but the sky, a tap anywhere wakes the screen and playback goes on', async () => {
            await renderApp();
            toggleSound('campfire');
            await waitFor(() => expect(playingSounds()).toEqual(['campfire']));

            fireEvent.click(within(dock()).getByRole('button', { name: 'Dim' }));
            expect(document.body).toHaveClass('is-dim');

            fireEvent.click(screen.getByRole('button', { name: 'Tap anywhere to wake' }));
            expect(document.body).not.toHaveClass('is-dim');
            expect(playingSounds()).toEqual(['campfire']);
        });

        it('Escape wakes the dim screen', async () => {
            await renderApp();
            fireEvent.click(within(dock()).getByRole('button', { name: 'Dim' }));

            fireEvent.keyDown(document, { key: 'Escape' });

            expect(document.body).not.toHaveClass('is-dim');
            expect(screen.queryByRole('button', { name: 'Tap anywhere to wake' })).toBeNull();
        });
    });

    describe('sharing', () => {
        const share = () => fireEvent.click(within(dock()).getByRole('button', { name: 'Share' }));

        it('builds a share link from the playing sounds', async () => {
            await renderApp();
            toggleSound('keyboard');
            toggleSound('campfire');

            share();

            expect(await screen.findByDisplayValue('https://monotones.app/share/ce6kb6')).toBeInTheDocument();
        });

        it('adds the name of the active saved mixture', async () => {
            await renderApp();
            toggleSound('campfire');
            await saveMixture('Evening');

            share();

            expect(await screen.findByDisplayValue('https://monotones.app/share/ce6?name=Evening')).toBeInTheDocument();
        });

        it('adds the name of the active starter mix', async () => {
            await renderApp();
            fireEvent.click(mixButton('Rainy evening'));

            share();

            expect(await screen.findByDisplayValue('https://monotones.app/share/ce6on8vs2?name=Rainy%20evening')).toBeInTheDocument();
        });

        it('opening a link with volumes and a name shows the name and lets the recipient save the mix', async () => {
            const { store } = await renderApp({ path: '/share/ce8kb2?name=Evening%20tea' });

            await waitFor(() => expect(store.getState().main.sounds).toEqual({
                campfire: { id: 'campfire', isPlay: true, volume: 0.4 },
                keyboard: { id: 'keyboard', isPlay: true, volume: 0.1 },
            }));
            expect(await screen.findByRole('status')).toHaveTextContent('"Evening tea" was shared with you');
            expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Evening tea');
            expect(playButton()).toHaveAttribute('aria-label', 'Play');

            fireEvent.click(within(screen.getByRole('status')).getByRole('button', { name: 'Save mixture' }));

            await waitFor(() => expect(mixtureNames()).toEqual(['Evening tea']));
            expect(screen.queryByRole('status')).toBeNull();
            expect(store.getState().main.mixtures[0].sounds.campfire?.volume).toBe(0.4);
        });

        it('the shared mix name can be dismissed', async () => {
            await renderApp({ path: '/share/ce8?name=Evening' });
            await screen.findByRole('status');

            fireEvent.click(screen.getByRole('button', { name: 'Close' }));

            expect(screen.queryByRole('status')).toBeNull();
            expect(orbit()).toEqual(['campfire']);
        });

        it('shares the home page when nothing plays', async () => {
            await renderApp();

            share();

            expect(await screen.findByDisplayValue('https://monotones.app')).toBeInTheDocument();
        });

        it('uses the system share sheet where there is one', async () => {
            const shareSheet = vi.fn().mockResolvedValue(undefined);
            Object.defineProperty(navigator, 'share', { value: shareSheet, configurable: true });
            try {
                await renderApp();
                toggleSound('campfire');

                share();

                await waitFor(() => expect(shareSheet).toHaveBeenCalledWith({ title: 'Monotones', url: 'https://monotones.app/share/ce6' }));
                expect(screen.queryByRole('dialog')).toBeNull();
            } finally {
                delete (navigator as { share?: unknown }).share;
            }
        });

        it('copies the link when there is no share sheet', async () => {
            const writeText = vi.fn().mockResolvedValue(undefined);
            Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
            await renderApp();
            toggleSound('campfire');

            share();
            fireEvent.click(await screen.findByRole('button', { name: 'Copy' }));

            expect(writeText).toHaveBeenCalledWith('https://monotones.app/share/ce6');
            expect(await screen.findByText('Link copied')).toBeInTheDocument();
            fireEvent.keyDown(document, { key: 'Escape' });
            expect(screen.queryByRole('dialog')).toBeNull();
        });

        it('opening a share link applies its sounds and redirects home', async () => {
            const { store } = await renderApp({ path: '/share/kbcezz' });

            await waitFor(() => expect(Object.keys(store.getState().main.sounds)).toEqual(['keyboard', 'campfire']));
            await waitFor(() => expect(chips()).toHaveLength(28));
            expect(orbit()).toEqual(['keyboard', 'campfire']);
            //shared sounds wait for the user to press play
            expect(playButton()).toHaveAttribute('aria-label', 'Play');
        });
    });

    describe('generated sounds', () => {
        //jsdom has no Web Audio: record which noise sources are playing
        const playingNoise = new Set<object>();
        const node = () => ({ gain: { value: 1 }, connect: (next: unknown) => next });
        class FakeAudioContext {
            state = 'running';
            sampleRate = 100;
            destination = {};
            createGain = node;
            resume = () => Promise.resolve();
            createBuffer = (channels: number, length: number) => ({
                numberOfChannels: channels,
                getChannelData: () => new Float32Array(length),
            });
            createBufferSource = () => {
                const source = {
                    connect: () => {},
                    disconnect: () => {},
                    start: () => playingNoise.add(source),
                    stop: () => playingNoise.delete(source),
                };
                return source;
            };
        }

        beforeEach(() => {
            playingNoise.clear();
            vi.stubGlobal('AudioContext', FakeAudioContext);
        });
        afterEach(() => vi.unstubAllGlobals());

        it('plays brown noise without an mp3, shares and pauses it like the others', async () => {
            const { store } = await renderApp();

            toggleSound('brown_noise');

            await waitFor(() => expect(store.getState().main.sounds.brown_noise?.isLoaded).toBe(true));
            expect(playingNoise.size).toBe(1);
            expect(playingSounds()).toEqual([]);
            expect(orbit()).toEqual(['brown_noise']);

            fireEvent.click(within(dock()).getByRole('button', { name: 'Share' }));
            expect(await screen.findByDisplayValue('https://monotones.app/share/bn6')).toBeInTheDocument();

            clickPlayButton();
            await waitFor(() => expect(playingNoise.size).toBe(0));
        });
    });

    describe('pages and language', () => {
        it('opens About and Terms from the menu', async () => {
            await renderApp();

            openMenu();
            fireEvent.click(screen.getByRole('link', { name: 'About' }));
            expect(await screen.findByRole('heading', { name: 'Your subtle companion' })).toBeInTheDocument();
            expect(screen.queryByRole('group', { name: 'Sounds' })).toBeNull();
            expect(screen.queryByRole('dialog')).toBeNull();

            openMenu();
            fireEvent.click(screen.getByRole('link', { name: 'Terms' }));
            expect(await screen.findByRole('heading', { name: 'Privacy Policy' })).toBeInTheDocument();
        });

        it('switches the language', async () => {
            await renderApp();
            openMenu();

            fireEvent.change($('#i18nextLng'), { target: { value: 'uk-UA' } });
            expect(await screen.findByRole('link', { name: 'Про нас' })).toBeInTheDocument();
            expect(screen.getByRole('group', { name: 'Звуки' })).toHaveTextContent('Білий шум');
            expect(document.querySelector('#i18nextLng')).toHaveValue('uk-UA');

            fireEvent.change($('#i18nextLng'), { target: { value: 'en-US' } });
            expect(await screen.findByRole('link', { name: 'About' })).toBeInTheDocument();
        });
    });

    describe('persistence', () => {
        it('restores state saved by previous versions of the app', async () => {
            const campfire = { id: 'campfire', isPlay: true, volume: 0.5, isLoaded: true };
            seedPersistedState({
                main: {
                    sounds: { campfire },
                    mixtures: [{ id: 'Evening', sounds: { campfire }, isActive: true }],
                },
                //timerRun and interval are never persisted
                timer: {},
                loading: {},
            });

            const { store } = await renderApp();

            expect(mixtureNames()).toEqual(['Evening']);
            expect(orbit()).toEqual(['campfire']);
            //play state is not persisted: the user has to press play
            expect(playButton()).toHaveAttribute('aria-label', 'Play');
            expect(playingSounds()).toEqual([]);
            //fields that are not saved get their defaults back
            expect(store.getState().main.isGlobalPlay).toBe(false);
            expect(store.getState().timer).toEqual({ timerRun: false, interval: 1 });
        });

        it('loads saved mixes with more than 6 sounds whole', async () => {
            const ids: SoundId[] = ['campfire', 'farm', 'heartbeat', 'white_noise', 'subway', 'keyboard', 'october_rain'];
            const sounds = Object.fromEntries(ids.map(id => [id, { id, isPlay: true, volume: 0.3 }]));
            seedPersistedState({ main: { sounds, mixtures: [{ id: 'Big', sounds, isActive: false }] }, timer: {}, loading: {} });

            await renderApp();
            fireEvent.click(mixButton('Big'));

            await waitFor(() => expect(playingSounds()).toHaveLength(7));
            expect(orbit()).toHaveLength(7);
        });

        it('replaces the removed pink noise with brown noise in saved sounds and mixtures', async () => {
            const campfire = { id: 'campfire', isPlay: true, volume: 0.5, isLoaded: true };
            const pinkNoise = { id: 'pink_noise', isPlay: true, volume: 0.7, isLoaded: true };
            seedPersistedState({
                main: {
                    sounds: { campfire, pink_noise: pinkNoise },
                    mixtures: [{ id: 'Night', sounds: { pink_noise: pinkNoise }, isActive: true }],
                },
                timer: {},
                loading: {},
            });

            const { store } = await renderApp();

            const brownNoise = { id: 'brown_noise', isPlay: true, volume: 0.7, isLoaded: false };
            expect(store.getState().main.sounds).toEqual({ campfire, brown_noise: brownNoise });
            expect(store.getState().main.mixtures[0].sounds).toEqual({ brown_noise: brownNoise });
            expect(orbit()).toEqual(['campfire', 'brown_noise']);
            expect(within(tray()).queryByRole('button', { name: 'Pink noise' })).toBeNull();
        });

        it('saves sounds and mixtures but not the play and timer state', async () => {
            const { persistor, store } = await renderApp();
            toggleSound('campfire');
            await saveMixture('Evening');
            openTimer();
            fireEvent.click(screen.getByRole('button', { name: '15 min' }));
            await waitFor(() => expect(store.getState().timer.timerRun).toBe(true));

            await persistor.flush();
            const saved = readPersistedState();

            expect(saved.main.sounds?.campfire).toMatchObject({ id: 'campfire', isPlay: true });
            expect(saved.main.mixtures?.map(m => m.id)).toEqual(['Evening']);
            expect(saved.main).not.toHaveProperty('isGlobalPlay');
            expect(saved.timer).not.toHaveProperty('timerRun');
            expect(saved.timer).not.toHaveProperty('interval');
            expect(saved._persist).toMatchObject({ version: 2 });
        });
    });

    describe('fixed bugs', () => {
        afterEach(() => vi.useRealTimers());

        it('taking a sound out while it is still loading does not break the app', async () => {
            const { store } = await renderApp();

            toggleSound('campfire');
            toggleSound('campfire');
            await act(() => Promise.resolve());

            expect(store.getState().main.sounds.campfire?.isPlay).toBe(false);
            toggleSound('campfire');
            await waitFor(() => expect(playingSounds()).toEqual(['campfire']));
        });

        it('the sleep timer keeps counting on other pages', async () => {
            const { store } = await renderApp();
            toggleSound('campfire');
            openTimer();

            vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
            fireEvent.click(screen.getByRole('button', { name: '15 min' }));
            openMenu();
            fireEvent.click(screen.getByRole('link', { name: 'About' }));
            await screen.findByRole('heading', { name: 'Your subtle companion' });

            for (let i = 0; i < 3; i++) act(() => vi.advanceTimersByTime(1000));
            expect(store.getState().timer.interval).toBe(897);
        });

        it('coming back home after the timer finished does not pause playback again', async () => {
            const { store } = await renderApp();
            toggleSound('campfire');
            openTimer();
            vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
            fireEvent.click(screen.getByRole('button', { name: '15 min' }));
            act(() => store.dispatch({ type: 'timer/timerStart', payload: 1 }));
            act(() => vi.advanceTimersByTime(1000));
            await waitFor(() => expect(playingSounds()).toEqual([]));

            clickPlayButton();
            await waitFor(() => expect(playingSounds()).toEqual(['campfire']));
            openMenu();
            fireEvent.click(screen.getByRole('link', { name: 'About' }));
            await screen.findByRole('heading', { name: 'Your subtle companion' });
            fireEvent.click(screen.getByRole('link', { name: 'Monotones' }));
            await waitFor(() => expect(chips()).toHaveLength(28));

            expect(playingSounds()).toEqual(['campfire']);
        });

        it('the save field does not reuse the previous name', async () => {
            const { store } = await renderApp();
            toggleSound('campfire');
            await saveMixture('Evening');
            toggleSound('farm');

            //saving without a name used to silently overwrite "Evening" with the current sounds
            expect(screen.getByPlaceholderText('Mixture name')).toHaveValue('');
            fireEvent.click(screen.getByRole('button', { name: 'Save' }));

            expect(mixtureNames()).toEqual(['Evening']);
            expect(Object.keys(store.getState().main.mixtures[0].sounds)).toEqual(['campfire']);
        });

        it('the language picker shows English for any English variant', async () => {
            await renderApp({ language: 'en-GB' });
            openMenu();

            expect(document.querySelector('#i18nextLng')).toHaveValue('en-US');
        });
    });

    describe('kept behaviour', () => {
        it('deleting the active mixture stops playback and leaves no mixture active', async () => {
            await renderApp();
            toggleSound('campfire');
            await saveMixture('A');
            toggleSound('farm');
            await saveMixture('B');
            await waitFor(() => expect(playingSounds()).toEqual(['campfire', 'farm']));

            fireEvent.click(screen.getByRole('button', { name: 'Delete B' }));

            await waitFor(() => expect(mixtureNames()).toEqual(['A']));
            expect(document.querySelector('.saved-mixes [aria-pressed=true]')).toBeNull();
            await waitFor(() => expect(playingSounds()).toEqual([]));
        });
    });
});
