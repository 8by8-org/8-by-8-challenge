import type { Option } from '../types/option';

/**
 * Returns the index of the first option whose text begins with the provided
 * character or -1 if no such option exists. Case-insensitive.
 */
export function findOptionIndexByFirstChar(options: Option[], char: string) {
  return options.findIndex(option =>
    option.text.toLowerCase().startsWith(char.toLowerCase()),
  );
}
