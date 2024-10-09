'use client';
import { Button, type ButtonProps } from '../button';
import { usePrefetch } from '@/hooks/use-prefetch';
import { useRouter } from 'next/navigation';

type LinkButtonProps = Omit<ButtonProps, 'type' | 'onClick'> & {
  href: string;
};

/**
 * A button that prefetches a given route upon mount and then navigates to that
 * route when clicked.
 *
 * @param props - {@link LinkButtonProps}
 */
export function LinkButton(props: LinkButtonProps) {
  const router = useRouter();
  usePrefetch(props.href);

  return (
    <Button
      {...props}
      type="button"
      onClick={() => {
        router.push(props.href);
      }}
    >
      {props.children}
    </Button>
  );
}
