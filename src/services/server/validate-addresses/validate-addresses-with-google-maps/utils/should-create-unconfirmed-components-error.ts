import type { ProcessableResponse } from '../types/processable-response';

export function shouldCreateUnconfirmedComponentsError(
  response: ProcessableResponse,
): boolean {
  return !!response.result.verdict.hasUnconfirmedComponents;
}
