import { render, cleanup } from '@testing-library/react';
import { usePrefetch } from '@/hooks/use-prefetch';
import navigation from 'next/navigation';
import { Builder } from 'builder-pattern';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

jest.mock('next/navigation', () => {
  return {
    ...jest.requireActual('next/navigation'),
    useRouter: jest.fn(),
  };
});

describe('usePrefetch', () => {
  let useRouterSpy: jest.SpyInstance<AppRouterInstance>;
  let router: AppRouterInstance;

  interface TestComponentProps {
    route: string;
  }

  function TestComponent({ route }: TestComponentProps) {
    usePrefetch(route);

    return null;
  }

  beforeEach(() => {
    router = Builder<AppRouterInstance>().prefetch(jest.fn()).build();

    useRouterSpy = jest
      .spyOn(navigation, 'useRouter')
      .mockImplementationOnce(() => {
        return router;
      });
  });

  afterEach(() => {
    useRouterSpy.mockRestore();
    cleanup();
  });

  it('prefetches the provided route.', () => {
    const testRoute = '/test';

    render(<TestComponent route={testRoute} />);

    expect(router.prefetch).toHaveBeenCalledTimes(1);
    expect(router.prefetch).toHaveBeenCalledWith(testRoute, undefined);
  });
});
