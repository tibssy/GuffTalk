import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface ProgressBarProps {
    progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    const { colors } = useTheme();
    const percentage = Math.round(progress * 100);

    return (
        <View>
            <View
                style={[styles.track, { backgroundColor: colors.inputBorder }]}
            >
                <View
                    style={[
                        styles.bar,
                        {
                            width: `${percentage}%`,
                            backgroundColor: colors.accent,
                        },
                    ]}
                />
            </View>
            <Text style={[styles.text, { color: colors.text }]}>
                {percentage}%
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    track: {
        height: 10,
        borderRadius: 5,
        overflow: "hidden",
        marginTop: 5,
    },
    bar: {
        height: "100%",
    },
    text: {
        alignSelf: "center",
        marginTop: 5,
        fontSize: 12,
    },
});

export default ProgressBar;
