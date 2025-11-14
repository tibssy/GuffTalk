import React from "react";
import { Modal, View, Text, StyleSheet, Button } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface ConfirmationModalProps {
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
}) => {
    const { colors } = useTheme();

    return (
        <Modal visible={visible} transparent={true} animationType="fade">
            <View style={styles.overlay}>
                <View
                    style={[
                        styles.container,
                        {
                            backgroundColor: colors.background,
                            borderColor: colors.inputBorder,
                        },
                    ]}
                >
                    <Text style={[styles.title, { color: colors.text }]}>
                        {title}
                    </Text>
                    <Text style={[styles.message, { color: colors.text }]}>
                        {message}
                    </Text>
                    <View style={styles.buttonContainer}>
                        <Button
                            title="Cancel"
                            onPress={onCancel}
                            color={colors.text}
                        />
                        <Button
                            title="Confirm"
                            onPress={onConfirm}
                            color="crimson"
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: "80%",
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 20,
    },
});

export default ConfirmationModal;
