import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import Markdown from "react-native-markdown-display";
import { Message } from "../types/Message";
import { useTheme } from "../context/ThemeContext";

interface ChatBubbleProps {
    message: Message;
}

const ChatBubble: React.FC<{ message: Message }> = ({ message }) => {
    const { width } = useWindowDimensions();
    const { colors } = useTheme();
    const isUser = message.role === "user";

    const markdownStyles = StyleSheet.create({
        // General text styles
        body: {
            color: colors.text,
            fontSize: 16,
        },
        fence: {
            backgroundColor: colors.inputBackground,
            color: colors.text,
            padding: 10,
            borderRadius: 8,
            borderColor: colors.inputBorder,
            borderWidth: 1,
        },
        // Code blocks
        code_block: {
            backgroundColor: colors.inputBackground,
            color: colors.text,
            padding: 10,
            borderRadius: 8,
            borderColor: colors.inputBorder,
            borderWidth: 1,
        },
        // Inline code
        code_inline: {
            backgroundColor: colors.inputBackground,
            borderColor: colors.inputBorder,
            color: colors.text,
            borderWidth: 1,
            borderRadius: 4,
            paddingHorizontal: 5,
        },
        // Bold text
        strong: {
            fontWeight: "bold",
        },
        // Links
        link: {
            color: colors.accent,
            textDecorationLine: "underline",
        },
        // Lists
        bullet_list: {
            marginBottom: 10,
        },
    });

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
                {isUser ? (
                    <Text style={styles.userText}>{message.text}</Text>
                ) : (
                    <Markdown style={markdownStyles}>{message.text}</Markdown>
                )}
            </View>
        </View>
    );
};

export default ChatBubble;
