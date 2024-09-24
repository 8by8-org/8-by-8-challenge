import { useMultiPipe, ValidityUtils, type IForm } from 'fully-formed';

export function useHasFieldWithCautionValidity(form: IForm) {
  return useMultiPipe(Object.values(form.fields), states => {
    return states.some(state => ValidityUtils.isCaution(state));
  });
}
