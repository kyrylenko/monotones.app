// querySelector that fails the test with a readable message instead of returning null
export const $ = <E extends Element = HTMLElement>(selector: string, root: ParentNode = document): E => {
    const element = root.querySelector<E>(selector);
    if (!element) {
        throw new Error(`Element not found: ${selector}`);
    }
    return element;
};
