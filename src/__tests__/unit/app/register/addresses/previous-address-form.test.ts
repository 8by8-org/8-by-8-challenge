import { PreviousAddressForm } from '@/app/register/addresses/previous-address/previous-address-form';
import { clearAllPersistentFormElements } from 'fully-formed';

describe('PreviousAddressForm', () => {
  let form: InstanceType<typeof PreviousAddressForm>;

  beforeEach(() => {
    form = new PreviousAddressForm();
  });

  afterEach(clearAllPersistentFormElements);

  test(`The value of the state field is updated when the value of the zip code
  field changes, the zip code field is valid, and the zip code maps to a US
  state.`, () => {
    form.fields.zip.setValue('94043');
    expect(form.fields.state.state.value).toBe('CA');
  });

  test(`The value of the state field is not updated when the state of the zip
  code field is updated but its value is unchanged.`, () => {
    form.fields.zip.setValue('94043');
    expect(form.fields.state.state.value).toBe('CA');

    form.fields.state.setValue('PA');
    form.fields.zip.focus();
    expect(form.fields.state.state.value).toBe('PA');
  });

  test(`The value of the state field is not updated when the value of the zip
  code field changes but it is invalid.`, () => {
    form.fields.state.setValue('TX');
    form.fields.zip.setValue('1234');
    expect(form.fields.state.state.value).toBe('TX');
  });

  test(`The value of the state field is not updated when the state of the zip
  code field is updated but the zip code does not map to any US states or
  territories.`, () => {
    form.fields.state.setValue('CA');
    form.fields.zip.setValue('00000');
    expect(form.fields.state.state.value).toBe('CA');
  });

  test(`The value of the state field is not updated when the state of the zip
  code field is updated but the zip code does not map to a US state.`, () => {
    form.fields.state.setValue('CA');
    form.fields.zip.setValue('00901');
    expect(form.fields.state.state.value).toBe('CA');
  });
});
