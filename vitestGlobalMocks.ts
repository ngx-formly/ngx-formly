// Zone.js discovers observer methods by enumeration; Happy DOM uses class methods.
for (const observer of [MutationObserver, IntersectionObserver]) {
  for (const method of ['observe', 'unobserve', 'disconnect', 'takeRecords']) {
    const value = observer.prototype[method];
    if (typeof value === 'function') {
      Object.defineProperty(observer.prototype, method, {
        value,
        enumerable: true,
        configurable: true,
        writable: true,
      });
    }
  }
}

// https://github.com/jsdom/jsdom/issues/1695#issuecomment-449931788
Element.prototype.scrollIntoView = vi.fn();

Object.defineProperty(window, 'origin', { value: '' });
Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>',
});
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

Element.prototype.scrollTo = () => {};
