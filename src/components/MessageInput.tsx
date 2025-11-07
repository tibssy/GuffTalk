import React, { useState } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    Keyboard,
    TouchableOpacity,
    Text,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

interface MessageInputProps {
    onSendMessage: (text: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
    const [text, setText] = useState("");
    const { colors } = useTheme();
    const isSendDisabled = text.trim().length === 0;

    const handleSend = () => {
        if (!isSendDisabled) {
            onSendMessage(text.trim());
            setText("");
            Keyboard.dismiss();
        }
    };

    const styles = StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            backgroundColor: colors.background,
            borderTopColor: colors.inputBorder,
        },
        inputContainer: {
            flex: 1,
            backgroundColor: colors.inputBackground,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.inputBorder,
            marginRight: 10,
        },
        input: {
            height: 40,
            paddingHorizontal: 15,
            fontSize: 16,
            color: colors.inputText,
        },
        sendButton: {
            backgroundColor: colors.accent,
            borderRadius: 12,
            paddingVertical: 10,
            paddingHorizontal: 20,
            justifyContent: "center",
            alignItems: "center",
        },
        sendButtonDisabled: {
            backgroundColor: colors.buttonDisabled,
        },
        sendButtonText: {
            color: "#ffffff",
            fontSize: 16,
            fontWeight: "bold",
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    placeholder="Type a message..."
                    placeholderTextColor="#888"
                />
            </View>
            <TouchableOpacity
                style={[
                    styles.sendButton,
                    isSendDisabled && styles.sendButtonDisabled,
                ]}
                onPress={handleSend}
                disabled={isSendDisabled}
            >
                <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
        </View>
    );
};

export default MessageInput;
