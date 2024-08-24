'use client';
import { useExclude, type Excludable } from 'fully-formed';
import type { ReactNode } from 'react';

interface ExcludableContentProps {
  excludableField: Excludable;
  children?: ReactNode;
}

/**
 * Accepts an {@link Excludable} field and child components. When the field is
 * excluded, the child components will not be rendered.
 *
 * @param props - {@link ExcludableContentProps}
 * @returns child components if the field is included, `null` if the field is
 * excluded.
 */
export function ExcludableContent({
  excludableField,
  children,
}: ExcludableContentProps) {
  const exclude = useExclude(excludableField);

  return <>{exclude ? null : children}</>;
}
