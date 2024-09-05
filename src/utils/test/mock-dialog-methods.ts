/**
 * Mocks HTMLDialogElement methods as they are not supported by our test framework at this time.
 */
export function mockDialogMethods() {
  HTMLDialogElement.prototype.showModal = jest.fn(function mock(
    this: HTMLDialogElement,
  ) {
    this.open = true;
  });

  HTMLDialogElement.prototype.close = jest.fn(function mock(
    this: HTMLDialogElement,
  ) {
    this.open = false;
  });
}
