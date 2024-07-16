/**
 * An error which can be thrown by service classes, functions, etc. within
 * the backend. This error helps provide a means of handling errors thrown in
 * backend code with greater specificity, as it includes a `statusCode` property
 * whose value will be an HTTP status code.
 *
 * @example
 * ```
 * export async function GET(request: NextRequest) {
 *   try {
 *     const data = await someAsyncMethodThatCouldThrowAnError();
 *     return NextResponse.json(data, { status: 200 });
 *   } catch (e) {
 *     if (e instanceof ServerError) {
 *       return NextResponse.json({ error: e.message }, { status: e.statusCode });
 *     }
 *
 *     return NextResponse.json({ error: 'Unknown error.' }, { status: 500 });
 *   }
 * }
 * ```
 */
export class ServerError extends Error {
  public readonly name = 'ServerError';
  public readonly statusCode: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode ?? 500;
  }
}
