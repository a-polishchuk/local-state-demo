import { type MemoData, type NewMemoData } from './Memo';

export type ReducerState = {
    memos: MemoData[];
    selectedMemoId: string | null;
};

export type Action =
    | {
          type: 'add';
          data: NewMemoData;
      }
    | {
          type: 'update';
          data: MemoData;
      }
    | {
          type: 'delete';
          memoId: string;
      }
    | {
          type: 'clear';
      }
    | {
          type: 'select';
          memoId: string;
      }
    | {
          type: 'deselect';
          memoId: string;
      };

export function reducer(state: ReducerState, action: Action): ReducerState {
    switch (action.type) {
        case 'add':
            return add(state, action.data);
        case 'update':
            return update(state, action.data);
        case 'select':
            return select(state, action.memoId);
        case 'deselect':
            return deselect(state, action.memoId);
        case 'delete':
            return deleteMemo(state, action.memoId);
        case 'clear':
            return initialState();
    }
}

function add(state: ReducerState, data: NewMemoData): ReducerState {
    const newState = structuredClone(state);
    newState.memos.push({
        id: new Date().toISOString() + Math.random(),
        ...data,
    });
    return newState;
}

function update(state: ReducerState, memoData: MemoData): ReducerState {
    const newState = structuredClone(state);
    const index = newState.memos.findIndex((memo) => memo.id === memoData.id);

    if (index === -1) {
        throw new Error(`Cannot find memo with id ${memoData.id}`);
    }

    newState.memos[index] = structuredClone(memoData);
    return newState;
}

function select(state: ReducerState, memoId: string): ReducerState {
    const newState = structuredClone(state);
    newState.selectedMemoId = memoId;
    return newState;
}

function deselect(state: ReducerState, memoId: string): ReducerState {
    if (memoId !== state.selectedMemoId) {
        return state;
    }
    const newState = structuredClone(state);
    newState.selectedMemoId = null;
    return newState;
}

function deleteMemo(state: ReducerState, memoId: string): ReducerState {
    const newState = structuredClone(state);
    newState.memos = newState.memos.filter((memo) => memo.id !== memoId);
    if (newState.selectedMemoId === memoId) {
        newState.selectedMemoId = null;
    }
    return newState;
}

export function initialState(): ReducerState {
    return {
        memos: [],
        selectedMemoId: null,
    };
}

const MAX_ANGLE = 10;

export function createPosition(left: number, top: number) {
    return {
        left,
        top,
        rotation: Math.random() * MAX_ANGLE * 2 - MAX_ANGLE,
    };
}
