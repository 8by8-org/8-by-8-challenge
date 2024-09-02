export function shouldCreateUnconfirmedComponentsError(result: any): boolean {
  return !!result.verdict.hasUnconfirmedComponents;
}
