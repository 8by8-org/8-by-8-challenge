export function canProcessResponse(response: any) {
  return !!(
    response?.result?.verdict && response?.result?.address?.addressComponents
  );
}
