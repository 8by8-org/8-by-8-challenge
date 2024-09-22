import type { Actions } from '@/model/enums/actions';
import type { NextRequest, NextResponse } from 'next/server';

export interface RedirectIfCompletedActionOpts {
  action: Actions;
  redirectTo: string;
}

export interface RedirectIfCompletedAction {
  (
    request: NextRequest,
    opts: RedirectIfCompletedActionOpts,
  ): Promise<NextResponse>;
}
