import type { Option } from '../types/option';

export function findOptionIndexByFirstChar(options: Option[], char: string) {
  return options.findIndex(option =>
    option.text.toLowerCase().startsWith(char),
  );
}
