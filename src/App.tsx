import { useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { type DragItem, ITEM_TYPE, Memo } from './Memo';
import { MemoContextProvider } from './MemoContext';
import { createPosition } from './reducer';
import { SettingsContextProvider } from './SettingsContext';
import { useMemoContext } from './hooks/use-memo-context';
import { useWindowEvent } from './hooks/use-window-event';
import { useState } from 'react';

export function App() {
    return (
        <MemoContextProvider>
            <SettingsContextProvider>
                <DndProvider backend={HTML5Backend}>
                    <AppInner />
                </DndProvider>
            </SettingsContextProvider>
        </MemoContextProvider>
    );
}

function AppInner() {
    const { memos, selectedMemoId, dispatch } = useMemoContext();
    const [isToolbarOpen, setIsToolbarOpen] = useState(true);

    const toggleToolbar = () => {
        setIsToolbarOpen((val) => !val);
    };

    const addMemo = () => {
        dispatch({
            type: 'add',
            data: {
                message: 'Click me to edit',
                position: createPosition(100, 100),
            },
        });
    };

    const deleteSelected = () => {
        if (!selectedMemoId) {
            throw new Error(`selectedId is ${selectedMemoId}`);
        }
        dispatch({
            type: 'delete',
            memoId: selectedMemoId,
        });
    };

    const clear = () => {
        dispatch({
            type: 'clear',
        });
    };

    const [, drop] = useDrop<DragItem>({
        accept: ITEM_TYPE,
        drop(item, monitor) {
            const delta = monitor.getDifferenceFromInitialOffset();
            const dx = delta?.x || 0;
            const dy = delta?.y || 0;
            const newLeft = Math.round(item.left + dx);
            const newTop = Math.round(item.top + dy);
            const memo = memos.find((m) => m.id === item.id);

            if (!memo) {
                throw new Error(`memo with id ${item.id} was not found!`);
            }

            dispatch({
                type: 'update',
                data: {
                    ...memo,
                    position: createPosition(newLeft, newTop),
                },
            });
        },
    });

    useWindowEvent('keydown', (e: KeyboardEvent) => {
        if (!selectedMemoId) {
            return;
        }
        if (e.key.toLowerCase() === 'd' && e.shiftKey) {
            dispatch({
                type: 'delete',
                memoId: selectedMemoId,
            });
        }
    });

    return (
        <>
            <div className="toolbar">
                <button onClick={toggleToolbar}>{isToolbarOpen ? '<<' : '>>'}</button>
                {isToolbarOpen && (
                    <>
                        <button onClick={() => addMemo()}>Add Memo</button>
                        {memos.length > 0 && <button onClick={() => clear()}>Clear</button>}
                        {selectedMemoId && <button onClick={() => deleteSelected()}>Delete</button>}
                    </>
                )}
            </div>
            <div
                className="memos"
                ref={(element) => {
                    drop(element);
                }}
            >
                {memos.map((memo) => (
                    <Memo key={memo.id} {...memo} />
                ))}
            </div>
        </>
    );
}
