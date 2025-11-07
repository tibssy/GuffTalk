import React, { createContext, useState, useContext } from "react";
import { useColorScheme } from "react-native";
import { darkColors, lightColors } from "../constants/Colors";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    isDark: boolean;
    toggleTheme: () => void;
    colors: typeof lightColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const systemTheme = useColorScheme() || "light";
    const [theme, setTheme] = useState<Theme>(systemTheme);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    const isDark = theme === "dark";
    const colors = isDark ? darkColors : lightColors;

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
