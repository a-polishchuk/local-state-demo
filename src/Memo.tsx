import type { CSSProperties, FocusEventHandler } from 'react';
import { useDrag } from 'react-dnd';
import { useMemoContext } from './hooks/use-memo-context';
import { useSettingsContext } from './hooks/use-settings-context';
import { useWindowEvent } from './hooks/use-window-event';

export type NewMemoData = {
    message: string;
    position: {
        left: number;
        top: number;
        rotation: number;
    };
};

export type MemoData = NewMemoData & { id: string };

export const ITEM_TYPE = 'memo';

export type DragItem = {
    id: string;
    left: number;
    top: number;
};

export function Memo(memoData: MemoData) {
    const { id, message, position } = memoData;
    const { left, top } = position;
    const { dispatch, selectedMemoId } = useMemoContext();
    const { memoColor, memoSelectedColor } = useSettingsContext();
    const isSelected = selectedMemoId === id;

    const [{ isDragging }, drag] = useDrag({
        type: ITEM_TYPE,
        item: { id, left, top },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const style: CSSProperties = {
        backgroundColor: isSelected ? memoSelectedColor : memoColor,
        position: 'absolute',
        left,
        top,
        transform: `rotate(${position.rotation}deg)`,
        opacity: isDragging ? 0.5 : 1,
    };

    const onFocus = () => {
        dispatch({
            type: 'select',
            memoId: id,
        });
    };

    const onBlur: FocusEventHandler<HTMLDivElement> = (e) => {
        dispatch({
            type: 'update',
            data: {
                ...memoData,
                message: e.target.textContent ?? '',
            },
        });
    };

    useWindowEvent('keydown', (e: KeyboardEvent) => {
        if (!isSelected) {
            return;
        }
        if (e.key.toLowerCase() === 'd' && e.shiftKey) {
            dispatch({
                type: 'delete',
                memoId: id,
            });
        }
    });

    return (
        <div
            ref={(element) => {
                drag(element);
            }}
            className="memo"
            contentEditable="plaintext-only"
            suppressContentEditableWarning
            style={style}
            onFocus={onFocus}
            onBlur={onBlur}
        >
            {message}
        </div>
    );
}
