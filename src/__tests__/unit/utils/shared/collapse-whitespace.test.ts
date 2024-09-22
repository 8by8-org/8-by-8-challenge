import { collapseWhitespace } from '@/utils/shared/collapse-whitespace';

describe('collapseWhitespace', () => {
  const whitespace = '   \t\n\r   ';
  const collapsed = 'The quick brown fox jumps over the lazy dog';

  test(`It collapses groups of whitespace characters within a string into 
  single space characters.`, () => {
    const expanded = collapsed.split(' ').join(whitespace);
    expect(collapseWhitespace(expanded)).toBe(collapsed);
  });

  test('It removes whitespace at the start and end of a string.', () => {
    const testString = whitespace + collapsed + whitespace;
    expect(collapseWhitespace(testString)).toBe(collapsed);
  });
});
