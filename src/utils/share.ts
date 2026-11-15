// Opens the system share sheet. Resolves false when it is not available or failed, so the caller can offer the link to copy.
// Cancelling the sheet counts as done.
export const shareLink = async (url: string, title: string): Promise<boolean> => {
    if (typeof navigator.share !== 'function') {
        return false;
    }
    try {
        await navigator.share({ title, url });
        return true;
    } catch (error) {
        return error instanceof DOMException && error.name === 'AbortError';
    }
};

// Copies text to the clipboard; false where the browser does not allow it
export const copyText = async (text: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
};
