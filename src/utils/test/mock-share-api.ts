export function mockShareAPI() {
  Object.defineProperty(navigator, 'share', {
    value: jest.fn(),
    writable: true,
  });

  Object.defineProperty(navigator, 'canShare', {
    value: jest.fn(),
    writable: true,
  });
}
