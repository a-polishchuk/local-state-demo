import { type ReactNode } from 'react';
import { SettingsContext, type SettingsData } from './hooks/use-settings-context';

const DEFAULT_SETTINGS: SettingsData = {
    memoColor: 'gold',
    memoSelectedColor: 'yellow',
};

export function SettingsContextProvider({ children }: { children: ReactNode }) {
    return <SettingsContext.Provider value={DEFAULT_SETTINGS}>{children}</SettingsContext.Provider>;
}
