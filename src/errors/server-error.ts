export class ServerError extends Error {
  public readonly name = 'ServerError';
  public readonly statusCode: number;

  constructor(message: string, statusCode: number | undefined) {
    super(message);
    this.statusCode = statusCode ?? 500;
  }
}
