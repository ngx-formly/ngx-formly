// Zone.js discovers MutationObserver methods by enumeration; Happy DOM uses class methods.
for (const method of ['observe', 'disconnect', 'takeRecords']) {
  Object.defineProperty(MutationObserver.prototype, method, {
    value: MutationObserver.prototype[method],
    enumerable: true,
    configurable: true,
    writable: true,
  });
}

// https://github.com/jsdom/jsdom/issues/1695#issuecomment-449931788
Element.prototype.scrollIntoView = jest.fn();

Object.defineProperty(window, 'origin', { value: '' });
Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>',
});
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

Element.prototype.scrollTo = () => {};
