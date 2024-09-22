import type { ProcessableResponse } from '../types/processable-response';

export function shouldCreateMissingSubpremiseError(
  response: ProcessableResponse,
): boolean {
  return !!response.result.address.missingComponentTypes?.includes(
    'subpremise',
  );
}
