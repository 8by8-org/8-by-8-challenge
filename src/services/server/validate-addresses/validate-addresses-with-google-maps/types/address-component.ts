import type { NullablePartial } from './nullable-partial';
import type { ComponentName } from './component-name';

export type AddressComponent = NullablePartial<{
  componentName: ComponentName;
  componentType: string;
  confirmationLevel: any;
  inferred: boolean;
  spellCorrected: boolean;
  replaced: boolean;
  unexpected: boolean;
}>;
