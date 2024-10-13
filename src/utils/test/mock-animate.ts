export function mockAnimate() {
  HTMLElement.prototype.animate = jest.fn();
}
