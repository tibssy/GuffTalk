import "react-native-get-random-values";
import "./global.css";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MainScreen from "./src/screens/MainScreen";
import { ThemeProvider } from "./src/context/ThemeContext";
import { LlamaProvider } from "./src/context/LlamaContext";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
    "SafeAreaView has been deprecated. Please use 'react-native-safe-area-context' instead.",
]);

export default function App() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <LlamaProvider>
                    <MainScreen />
                </LlamaProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}
