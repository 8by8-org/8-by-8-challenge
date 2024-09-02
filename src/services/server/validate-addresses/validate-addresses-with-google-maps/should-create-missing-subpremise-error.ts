export function shouldCreateMissingSubpremiseError(result: any): boolean {
  return !!result.address.missingComponentTypes?.includes('subpremise');
}
