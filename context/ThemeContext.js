// React theme context provider and hooks.
import React, { createContext, useState, useContext, useEffect } from 'react';
import { initDB } from '../private/database/offline/connect';
import { COLORS, DARK_COLORS } from '../public/global';

// React context object for theme context.
const ThemeContext = createContext();

/**
 * Provides theme values and dark/light mode toggling to descendant components.
 */
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light'); // default

    useEffect(() => {
        loadTheme();
    }, []);

    /**
     * Load Theme.
     */
    const loadTheme = async () => {
        try {
            const db = await initDB();
            const res = await db.getAllAsync("SELECT VALUE FROM SETTINGS WHERE SETTING_ID = 'THEME'");
            if (res.length > 0) {
                setTheme(res[0].VALUE);
            }
        } catch (error) {
            console.log("Error loading theme:", error);
        }
    };

    /**
     * Toggles  theme in application state.
     */
    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        try {
            const db = await initDB();
            await db.runAsync("UPDATE SETTINGS SET VALUE = ? WHERE SETTING_ID = 'THEME'", [newTheme]);
        } catch (error) {
            console.log("Error saving theme:", error);
        }
    };

    const colors = theme === 'light' ? COLORS : DARK_COLORS;

    return (
        <ThemeContext.Provider value={{ theme, colors, isDarkMode: theme === 'dark', toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Custom hook to read theme context values from the React ThemeProvider.
 */
export const useTheme = () => useContext(ThemeContext);
