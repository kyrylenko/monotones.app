import { screen, fireEvent, waitFor, within, act } from '@testing-library/react';
import { renderApp, seedPersistedState, readPersistedState, playingSounds } from './test/renderApp';
import { $ } from './test/dom';
import { timerActions } from './store/timerSlice';
import type { SoundId } from './constants/soundIds';

const soundIcons = () => document.querySelectorAll('img.sound-icon');
const soundIcon = (id: SoundId) => $(`img.sound-icon[alt=${id}]`);
const globalButton = () => document.querySelector('.play-div img');
const clickGlobalButton = () => fireEvent.click($('.play-div img'));
const playingNow = () => [...document.querySelectorAll('.mixture-block img')].map(i => i.id);

const toggleSound = (id: SoundId) => fireEvent.click(soundIcon(id));

const saveMixture = async (name: string) => {
    fireEvent.click(screen.getByAltText('Save mixture'));
    const input = await screen.findByPlaceholderText('Mixture name');
    fireEvent.change(input, { target: { value: name } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(screen.queryByPlaceholderText('Mixture name')).not.toBeInTheDocument());
};

const mixtureNames = () => [...document.querySelectorAll('.mixtures .list-group-item span')].map(s => s.textContent);

describe('App', () => {
    describe('sounds', () => {
        it('shows all 28 sounds on the home page', async () => {
            await renderApp();

            expect(soundIcons()).toHaveLength(28);
            expect(globalButton()).toBeNull();
        });

        it.each([
            ['/sleep', 8, 'summer_night'],
            ['/relax', 12, 'summer_day'],
            ['/focus', 8, 'thunderstorm'],
        ])('shows only the %s category', async (path, count, firstId) => {
            await renderApp({ path });

            expect(soundIcons()).toHaveLength(count);
            expect(soundIcons()[0]).toHaveAttribute('alt', firstId);
        });

        it('category links toggle between the category and all sounds', async () => {
            await renderApp();

            fireEvent.click(screen.getByRole('link', { name: 'Sleep' }));
            expect(soundIcons()).toHaveLength(8);
            expect(screen.getByRole('link', { name: 'Sleep' })).toHaveClass('active');

            fireEvent.click(screen.getByRole('link', { name: 'Sleep' }));
            expect(soundIcons()).toHaveLength(28);
        });

        it('clicking a sound plays it and shows the global pause button', async () => {
            const { store } = await renderApp();

            toggleSound('campfire');

            await waitFor(() => expect(playingSounds()).toEqual(['campfire']));
            expect(globalButton()).toHaveAttribute('alt', 'Pause');
            expect(playingNow()).toEqual(['campfire']);
            expect(store.getState().main.sounds.campfire).toEqual({ id: 'campfire', isPlay: true, volume: 0.3, isLoaded: true });
        });

        it('clicking a playing sound stops it', async () => {
            await renderApp();

            toggleSound('campfire');
            toggleSound('farm');
            await waitFor(() => expect(playingSounds()).toEqual(['campfire', 'farm']));

            toggleSound('campfire');
            await waitFor(() => expect(playingSounds()).toEqual(['farm']));
            //the icon leaves "Playing now" after its exit animation
            await waitFor(() => expect(playingNow()).toEqual(['farm']));
        });

        it('the volume slider changes the audio volume', async () => {
            const { store } = await renderApp();
            toggleSound('campfire');

            const slider = $('[role=slider]', soundIcon('campfire').parentElement!);
            fireEvent.keyDown(slider, { key: 'ArrowRight', keyCode: 39 });

            await waitFor(() => expect(store.getState().main.sounds.campfire?.volume).toBeCloseTo(0.31));
            const audio = [...window.__playing][0];
            expect(audio.volume).toBeCloseTo(0.31);
        });

        it('the global button pauses and resumes all sounds', async () => {
            await renderApp();
            toggleSound('campfire');
            toggleSound('farm');
            await waitFor(() => expect(playingSounds()).toHaveLength(2));

            clickGlobalButton();
            await waitFor(() => expect(playingSounds()).toEqual([]));
            expect(globalButton()).toHaveAttribute('alt', 'Play');

            clickGlobalButton();
            await waitFor(() => expect(playingSounds()).toEqual(['campfire', 'farm']));
        });

        it('the space key toggles global play, except while typing', async () => {
            await renderApp();
            toggleSound('campfire');
            await waitFor(() => expect(playingSounds()).toEqual(['campfire']));

            fireEvent.keyDown(document, { key: ' ', code: 'Space', keyCode: 32 });
            await waitFor(() => expect(playingSounds()).toEqual([]));

            fireEvent.keyDown(document, { key: ' ', code: 'Space', keyCode: 32 });
            await waitFor(() => expect(playingSounds()).toEqual(['campfire']));

            const input = document.createElement('input');
            document.body.appendChild(input);
            fireEvent.keyDown(input, { key: ' ', code: 'Space', keyCode: 32 });
            expect(playingSounds()).toEqual(['campfire']);
            input.remove();
        });

        it('pausing a sound in "Playing now" stops it', async () => {
            await renderApp();
            toggleSound('campfire');
            toggleSound('farm');

            fireEvent.click($('.mixture-block img#campfire'));

            await waitFor(() => expect(playingSounds()).toEqual(['farm']));
        });

        it('"Reset all" removes every sound', async () => {
            const { store } = await renderApp();
            toggleSound('campfire');
            await waitFor(() => expect(store.getState().main.sounds.campfire?.isLoaded).toBe(true));

            fireEvent.click(screen.getByAltText('Reset all'));

            await waitFor(() => expect(playingSounds()).toEqual([]));
            expect(store.getState().main.sounds).toEqual({});
            expect(globalButton()).toBeNull();
        });
    });

    describe('mixtures', () => {
        it('saves, switches, deactivates and deletes mixtures', async () => {
            await renderApp();

            toggleSound('campfire');
            await saveMixture('Evening');
            expect(mixtureNames()).toEqual(['Evening']);

            toggleSound('campfire');
            toggleSound('farm');
            await saveMixture('Morning');
            expect(mixtureNames()).toEqual(['Morning', 'Evening']);
            await waitFor(() => expect(playingSounds()).toEqual(['farm']));

            fireEvent.click(screen.getByText('Evening'));
            await waitFor(() => expect(playingSounds()).toEqual(['campfire']));
            expect(screen.getByText('Evening').parentElement).toHaveClass('active');

            //clicking the active mixture pauses everything
            fireEvent.click(screen.getByText('Evening'));
            await waitFor(() => expect(playingSounds()).toEqual([]));

            const morning = screen.getByText('Morning').parentElement!;
            fireEvent.click(within(morning).getByAltText('Delete mixture'));
            await waitFor(() => expect(mixtureNames()).toEqual(['Evening']));
        });

        it('does not save a mixture without a name', async () => {
            await renderApp();
            toggleSound('campfire');

            fireEvent.click(screen.getByAltText('Save mixture'));
            await screen.findByPlaceholderText('Mixture name');
            fireEvent.click(screen.getByRole('button', { name: 'Save' }));

            await waitFor(() => expect(screen.queryByPlaceholderText('Mixture name')).not.toBeInTheDocument());
            expect(document.querySelector('.mixtures')).toBeNull();
        });

        it('saves with the Enter key', async () => {
            await renderApp();
            toggleSound('campfire');

            fireEvent.click(screen.getByAltText('Save mixture'));
            const input = await screen.findByPlaceholderText('Mixture name');
            fireEvent.change(input, { target: { value: 'Night' } });
            fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', keyCode: 13 });
            fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

            await waitFor(() => expect(mixtureNames()).toEqual(['Night']));
        });
    });

    describe('sleep timer', () => {
        afterEach(() => vi.useRealTimers());

        it('counts down and pauses all sounds at the end', async () => {
            await renderApp();
            toggleSound('campfire');
            await waitFor(() => expect(playingSounds()).toEqual(['campfire']));

            fireEvent.click(screen.getByAltText('Timer'));
            expect(await screen.findByText('Pause in 05:00 min')).toBeInTheDocument();

            vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
            fireEvent.click(screen.getByRole('button', { name: 'Start' }));

            //one act() per second: the app re-renders between ticks like in a browser
            const tick = (seconds: number) => { for (let i = 0; i < seconds; i++) act(() => vi.advanceTimersByTime(1000)); };
            tick(2);
            expect(document.querySelector('.timer .clock')).toHaveTextContent('04:58');

            tick(298);
            await waitFor(() => expect(playingSounds()).toEqual([]));
            expect(globalButton()).toHaveAttribute('alt', 'Play');
            expect(document.querySelector('.timer-div')).toBeNull();
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
            const tick = (seconds: number) => { for (let i = 0; i < seconds; i++) act(() => vi.advanceTimersByTime(1000)); };

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
            for (let i = 0; i < 2; i++) act(() => vi.advanceTimersByTime(1000));
            expect(audio.volume).toBeLessThan(volume);

            act(() => store.dispatch(timerActions.timerStop()));
            act(() => vi.advanceTimersByTime(1000));

            expect(audio.volume).toBeCloseTo(volume);
            expect(playingSounds()).toEqual(['campfire']);
        });

        it('can be cancelled', async () => {
            const { store } = await renderApp();
            toggleSound('campfire');

            fireEvent.click(screen.getByAltText('Timer'));
            fireEvent.click(await screen.findByRole('button', { name: 'Start' }));
            await waitFor(() => expect(store.getState().timer.timerRun).toBe(true));

            fireEvent.click($('.timer'));
            fireEvent.click(await screen.findByRole('button', { name: 'Cancel Timer' }));

            await waitFor(() => expect(store.getState().timer.timerRun).toBe(false));
            expect(playingSounds()).toEqual(['campfire']);
        });

        it('is stopped when the global pause button is clicked', async () => {
            const { store } = await renderApp();
            toggleSound('campfire');
            fireEvent.click(screen.getByAltText('Timer'));
            fireEvent.click(await screen.findByRole('button', { name: 'Start' }));
            await waitFor(() => expect(store.getState().timer.timerRun).toBe(true));

            clickGlobalButton();

            expect(store.getState().timer.timerRun).toBe(false);
        });
    });

    describe('sharing', () => {
        it('builds a share link from the playing sounds', async () => {
            await renderApp();
            toggleSound('keyboard');
            toggleSound('campfire');

            fireEvent.click(screen.getByText('Share'));

            expect(await screen.findByDisplayValue('https://monotones.app/share/cekb')).toBeInTheDocument();
        });

        it('shares the home page when nothing plays', async () => {
            await renderApp();

            fireEvent.click(screen.getByText('Share'));

            expect(await screen.findByDisplayValue('https://monotones.app')).toBeInTheDocument();
        });

        it('opening a share link applies its sounds and redirects home', async () => {
            const { store } = await renderApp({ path: '/share/kbcezz' });

            await waitFor(() => expect(Object.keys(store.getState().main.sounds)).toEqual(['keyboard', 'campfire']));
            await waitFor(() => expect(soundIcons()).toHaveLength(28));
            expect(playingNow()).toEqual(['keyboard', 'campfire']);
            //shared sounds wait for the user to press play
            expect(globalButton()).toHaveAttribute('alt', 'Play');
        });
    });

    describe('pages and language', () => {
        it('opens About and Terms from the footer', async () => {
            await renderApp();

            fireEvent.click(screen.getByRole('link', { name: 'About' }));
            expect(await screen.findByRole('heading', { name: 'Your subtle companion' })).toBeInTheDocument();
            expect(soundIcons()).toHaveLength(0);

            fireEvent.click(screen.getByRole('link', { name: 'Terms' }));
            expect(await screen.findByRole('heading', { name: 'Privacy Policy' })).toBeInTheDocument();
        });

        it('switches the language', async () => {
            await renderApp();

            fireEvent.change($('#i18nextLng'), { target: { value: 'uk-UA' } });
            expect(await screen.findByRole('link', { name: 'Про нас' })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'Сон' })).toBeInTheDocument();
            expect(document.querySelector('#i18nextLng')).toHaveValue('uk-UA');

            fireEvent.change($('#i18nextLng'), { target: { value: 'en-US' } });
            expect(await screen.findByRole('link', { name: 'About' })).toBeInTheDocument();
        });
    });

    describe('mobile layout', () => {
        it('uses the mobile header, category bar and "playing now" bar', async () => {
            window.__isMobile = true;
            await renderApp();

            expect(document.querySelector('header .app-logo')).toBeNull();
            expect(document.querySelectorAll('.nav-pills .flex-fill')).toHaveLength(3);
            expect(document.querySelector('.fixed-controlls')).toBeNull();
            expect(document.querySelector('.fixed-bottom')).toBeNull();

            toggleSound('campfire');

            const bar = $('.fixed-bottom');
            expect([...bar.querySelectorAll('img')].map(i => i.id)).toEqual(['campfire']);
            fireEvent.click($('img#campfire', bar));
            await waitFor(() => expect(document.querySelector('.fixed-bottom')).toBeNull());
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
            expect(playingNow()).toEqual(['campfire']);
            //play state is not persisted: the user has to press play
            expect(globalButton()).toHaveAttribute('alt', 'Play');
            expect(playingSounds()).toEqual([]);
            //fields that are not saved get their defaults back
            expect(store.getState().main.isGlobalPlay).toBe(false);
            expect(store.getState().timer).toEqual({ timerRun: false, interval: 1 });
            expect(document.querySelector('.timer-div')).toBeNull();
        });

        it('saves sounds and mixtures but not the play and timer state', async () => {
            const { persistor, store } = await renderApp();
            toggleSound('campfire');
            await saveMixture('Evening');
            fireEvent.click(screen.getByAltText('Timer'));
            fireEvent.click(await screen.findByRole('button', { name: 'Start' }));
            await waitFor(() => expect(store.getState().timer.timerRun).toBe(true));

            await persistor.flush();
            const saved = readPersistedState();

            expect(saved.main.sounds?.campfire).toMatchObject({ id: 'campfire', isPlay: true });
            expect(saved.main.mixtures?.map(m => m.id)).toEqual(['Evening']);
            expect(saved.main).not.toHaveProperty('isGlobalPlay');
            expect(saved.timer).not.toHaveProperty('timerRun');
            expect(saved.timer).not.toHaveProperty('interval');
            expect(saved._persist).toMatchObject({ version: 1 });
        });
    });

    describe('fixed bugs', () => {
        afterEach(() => vi.useRealTimers());

        it('"Reset all" while a sound is still loading does not break the app', async () => {
            const { store } = await renderApp();

            toggleSound('campfire');
            fireEvent.click(screen.getByAltText('Reset all'));
            await act(() => Promise.resolve());

            expect(store.getState().main.sounds).toEqual({});
            expect(soundIcons()).toHaveLength(28);
            toggleSound('campfire');
            await waitFor(() => expect(playingSounds()).toEqual(['campfire']));
        });

        it('the sleep timer keeps counting on other pages', async () => {
            const { store } = await renderApp();
            toggleSound('campfire');
            fireEvent.click(screen.getByAltText('Timer'));
            await screen.findByRole('button', { name: 'Start' });

            vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
            fireEvent.click(screen.getByRole('button', { name: 'Start' }));
            fireEvent.click(screen.getByRole('link', { name: 'About' }));
            await screen.findByRole('heading', { name: 'Your subtle companion' });

            for (let i = 0; i < 3; i++) act(() => vi.advanceTimersByTime(1000));
            expect(store.getState().timer.interval).toBe(297);
        });

        it('coming back home after the timer finished does not pause playback again', async () => {
            const { store } = await renderApp();
            toggleSound('campfire');
            fireEvent.click(screen.getByAltText('Timer'));
            await screen.findByRole('button', { name: 'Start' });
            vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
            fireEvent.click(screen.getByRole('button', { name: 'Start' }));
            act(() => store.dispatch({ type: 'timer/timerStart', payload: 1 }));
            act(() => vi.advanceTimersByTime(1000));
            await waitFor(() => expect(playingSounds()).toEqual([]));

            clickGlobalButton();
            await waitFor(() => expect(playingSounds()).toEqual(['campfire']));
            fireEvent.click(screen.getByRole('link', { name: 'About' }));
            await screen.findByRole('heading', { name: 'Your subtle companion' });
            fireEvent.click($('header a[href="/"]'));
            await waitFor(() => expect(soundIcons()).toHaveLength(28));

            expect(playingSounds()).toEqual(['campfire']);
        });

        it('the save dialog does not reuse the previous name', async () => {
            const { store } = await renderApp();
            toggleSound('campfire');
            await saveMixture('Evening');
            toggleSound('farm');

            //saving without a name used to silently overwrite "Evening" with the current sounds
            fireEvent.click(screen.getByAltText('Save mixture'));
            const input = await screen.findByPlaceholderText('Mixture name');
            expect(input).toHaveValue('');
            fireEvent.click(screen.getByRole('button', { name: 'Save' }));

            await waitFor(() => expect(screen.queryByPlaceholderText('Mixture name')).not.toBeInTheDocument());
            expect(mixtureNames()).toEqual(['Evening']);
            expect(Object.keys(store.getState().main.mixtures[0].sounds)).toEqual(['campfire']);
        });

        it('the language picker shows English for any English variant', async () => {
            await renderApp({ language: 'en-GB' });

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

            const active = screen.getByText('B').parentElement!;
            fireEvent.click(within(active).getByAltText('Delete mixture'));

            await waitFor(() => expect(mixtureNames()).toEqual(['A']));
            expect(document.querySelector('.mixtures .active')).toBeNull();
            await waitFor(() => expect(playingSounds()).toEqual([]));
        });
    });
});
