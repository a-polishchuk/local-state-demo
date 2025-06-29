import { createContext, useContext, type Dispatch } from 'react';
import type { MemoData } from '../Memo';
import type { Action } from '../reducer';

export type MemoContextType = {
    memos: MemoData[];
    selectedMemoId: string | null;
    dispatch: Dispatch<Action>;
};

export const MemoContext = createContext<MemoContextType | null>(null);

export function useMemoContext() {
    const contextValue = useContext(MemoContext);
    if (!contextValue) {
        throw new Error('this component should be wrapped with MemoContextProvider');
    }
    return contextValue;
}
