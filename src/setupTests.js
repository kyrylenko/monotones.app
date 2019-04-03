//red: https://facebook.github.io/create-react-app/docs/running-tests#src-setuptestsjs
window.matchMedia = jest.fn().mockImplementation(query => {
    return {
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
    };
});