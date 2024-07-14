export class ServerError extends Error {
  public readonly name = 'ServerError';
  public readonly statusCode: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode ?? 500;
  }
}
