/**
 * Mocks HTMLElement scroll methods as they are undefined by default in
 * jest-environment-jsdom.
 */
export function mockScrollMethods() {
  window.scroll = jest.fn();
  window.scrollBy = jest.fn();
  window.scrollTo = jest.fn();
  HTMLElement.prototype.scroll = jest.fn();
  HTMLElement.prototype.scrollTo = jest.fn();
  HTMLElement.prototype.scrollBy = jest.fn();
  HTMLElement.prototype.scrollIntoView = jest.fn();
}
