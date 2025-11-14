import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import ProgressBar from "./ProgressBar";
import { Model } from "../types/Model";

interface ModelCardProps {
    model: Model;
    onDownload: (modelId: string) => void;
    onDelete: (modelId: string) => void;
    onSetActive: (modelId: string) => void;
}

const ModelCard: React.FC<ModelCardProps> = ({
    model,
    onDownload,
    onDelete,
    onSetActive,
}) => {
    const { colors } = useTheme();

    const renderAction = () => {
        switch (model.status) {
            case "downloading":
                return <ProgressBar progress={model.progress || 0} />;
            case "downloaded":
                return (
                    <View style={styles.buttonRow}>
                        <Button
                            title={
                                model.buttonTitle ||
                                (model.isActive ? "Active" : "Set as Active")
                            }
                            disabled={model.isActive}
                            onPress={() => onSetActive(model.id)}
                            color={colors.accent}
                        />
                        <MaterialCommunityIcons
                            name="delete"
                            size={28}
                            color="crimson"
                            onPress={() => onDelete(model.id)}
                        />
                    </View>
                );
            case "not_downloaded":
            default:
                return (
                    <Button
                        title="Download"
                        onPress={() => onDownload(model.id)}
                        color={colors.accent}
                    />
                );
        }
    };

    return (
        <View
            style={[
                styles.modelCard,
                {
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.inputBorder,
                },
            ]}
        >
            <Text style={[styles.text, { color: colors.text }]}>
                {model.name}
            </Text>
            <Text
                style={{ color: colors.text, fontSize: 12, marginVertical: 5 }}
            >
                {model.size}
            </Text>
            {renderAction()}
        </View>
    );
};

const styles = StyleSheet.create({
    modelCard: {
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
    },
    text: { fontSize: 16, fontWeight: "bold" },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
});

export default ModelCard;
