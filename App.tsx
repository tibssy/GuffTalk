import "react-native-get-random-values";
import "./global.css";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ChatScreen from "./src/screens/ChatScreen";
import { ThemeProvider } from "./src/context/ThemeContext";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
    "SafeAreaView has been deprecated. Please use 'react-native-safe-area-context' instead.",
]);

export default function App() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <ChatScreen />
            </ThemeProvider>
        </SafeAreaProvider>
    );
}
