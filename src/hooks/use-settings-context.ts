import { createContext, useContext } from 'react';

export type SettingsData = {
    memoColor: string;
    memoSelectedColor: string;
};

export const SettingsContext = createContext<SettingsData | null>(null);

export function useSettingsContext() {
    const contextValue = useContext(SettingsContext);
    if (!contextValue) {
        throw new Error('this component should be wrapped with SettingsContextProvider');
    }
    return contextValue;
}
