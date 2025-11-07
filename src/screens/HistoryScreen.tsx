import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

const HistoryScreen = () => {
    const { colors } = useTheme();
    return (
        <View
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <Text style={[styles.text, { color: colors.text }]}>
                Conversation History
            </Text>
        </View>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    text: { fontSize: 24, fontWeight: "bold" },
});
export default HistoryScreen;
