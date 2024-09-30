import '@testing-library/jest-dom';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import ShareButton from '@/app/share/share-button/share-button';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { Builder } from 'builder-pattern';
import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';
import type { User } from '@/model/types/user';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { SearchParams } from '@/constants/search-params';
import { createId } from '@paralleldrive/cuid2';


jest.mock('next/navigation', () => require('next-router-mock'));


describe('ShareButton', () => {
    mockDialogMethods();
    afterEach(cleanup);
    it('should call the shareChallenge API when clicked', () => {
        
    })
})