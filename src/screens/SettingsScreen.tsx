import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import CustomSwitch from "../components/CustomSwitch";

const SettingsScreen = () => {
    const { colors, isDark, toggleTheme } = useTheme();

    return (
        <View
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <View style={styles.settingRow}>
                <Text style={[styles.text, { color: colors.text }]}>
                    Dark Mode
                </Text>
                <CustomSwitch value={isDark} onValueChange={toggleTheme} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    settingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    text: {
        fontSize: 18,
    },
});

export default SettingsScreen;
