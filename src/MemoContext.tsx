import { type ReactNode, useReducer } from 'react';
import { initialState, reducer } from './reducer';
import { MemoContext, type MemoContextType } from './hooks/use-memo-context';

export function MemoContextProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState());
    const { memos, selectedMemoId } = state;

    const contextValue: MemoContextType = {
        memos,
        selectedMemoId,
        dispatch,
    };

    return <MemoContext.Provider value={contextValue}>{children}</MemoContext.Provider>;
}
