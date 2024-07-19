/**
 * Schedules Promises that can be resolved sequentially. Use this class to
 * predictably test asynchronous processes.
 */
export class PromiseScheduler {
  private promiseResolvers: Array<() => void> = [];

  /**
   * The number of scheduled Promises that have yet to be resolved.
   */
  public get scheduledPromises(): number {
    return this.promiseResolvers.length;
  }

  /**
   * Creates a scheduled Promise and adds it to the list of Promises to be
   * resolved.
   *
   * @param value - The value to be returned when the Promise resolves.
   * @returns - A Promise which will resolve in sequence when `resolveFirst()`
   * or `resolveAll()` is called.
   */
  public createScheduledPromise<T>(value: T): Promise<T> {
    return new Promise<T>(resolve => {
      const resolver: () => void = () => resolve(value);
      this.promiseResolvers.push(resolver);
    });
  }

  /**
   * Removes the first Promise from the queue and resolves it.
   */
  public resolveFirst(): void {
    const resolver = this.promiseResolvers.shift();
    resolver && resolver();
  }

  /**
   * Sequentially removes and resolves all Promises in the queue.
   */
  public resolveAll(): void {
    while (this.scheduledPromises > 0) {
      this.resolveFirst();
    }
  }
}
