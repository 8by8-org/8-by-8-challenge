'use client';
import Link from 'next/link';
import { useContextSafely } from '../../../../hooks/use-context-safely';
import { HeaderContext } from '../../header-context';
import type { ReactNode } from 'react';

type HamburgerLinkProps = {
  href: string;
  className?: string;
  children?: ReactNode;
};

export function HamburgerLink({
  href,
  className,
  children,
}: HamburgerLinkProps) {
  const { closeHamburgerMenu } = useContextSafely(
    HeaderContext,
    'HamburgerLink',
  );
  return (
    <li>
      <Link onClick={closeHamburgerMenu} href={href} className={className}>
        {children}
      </Link>
    </li>
  );
}
