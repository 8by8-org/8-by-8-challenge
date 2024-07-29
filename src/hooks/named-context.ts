import { Context } from 'react';

export type NamedContext<T> = Context<T> & { displayName: string };
