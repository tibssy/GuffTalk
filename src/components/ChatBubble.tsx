import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { Message } from "../types/Message";
import { useTheme } from "../context/ThemeContext";

const ChatBubble: React.FC<{ message: Message }> = ({ message }) => {
    const { width } = useWindowDimensions();
    const { colors } = useTheme();
    const isUser = message.role === "user";

    const styles = StyleSheet.create({
        messageRow: {
            flexDirection: "row",
            marginVertical: 4,
            paddingHorizontal: 10,
        },
        userRow: { justifyContent: "flex-end" },
        botRow: { justifyContent: "flex-start" },
        bubble: {
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 12,
        },
        userBubble: {
            backgroundColor: colors.bubbleUser,
            borderBottomRightRadius: 4,
        },
        botBubble: {
            backgroundColor: colors.bubbleBot,
            borderBottomLeftRadius: 4,
        },
        userText: { color: colors.bubbleUserText, fontSize: 16 },
        botText: { color: colors.text, fontSize: 16 },
    });

    return (
        <View
            style={[styles.messageRow, isUser ? styles.userRow : styles.botRow]}
        >
            <View
                style={[
                    styles.bubble,
                    isUser ? styles.userBubble : styles.botBubble,
                    { maxWidth: width * 0.75 },
                ]}
            >
                <Text style={isUser ? styles.userText : styles.botText}>
                    {message.text}
                </Text>
            </View>
        </View>
    );
};

export default ChatBubble;
