import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Button,
    Alert,
} from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import { useTheme } from "../context/ThemeContext";
import { useLlama } from "../context/LlamaContext";
import CustomSwitch from "../components/CustomSwitch";
import ModelCard from "../components/ModelCard";
import ConfirmationModal from "../components/ConfirmationModal";
import { Model } from "../types/Model";

const modelsDir = FileSystem.documentDirectory + "models/";

const SectionHeader = ({ title }: { title: string }) => {
    const { colors } = useTheme();
    return (
        <Text style={[styles.sectionHeader, { color: colors.text }]}>
            {title}
        </Text>
    );
};

const SettingRow = ({ children }: { children: React.ReactNode }) => {
    const { colors } = useTheme();
    return (
        <View
            style={[
                styles.settingRow,
                { borderBottomColor: colors.inputBorder },
            ]}
        >
            {children}
        </View>
    );
};

// --- Initial Model Data ---
const INITIAL_MODELS: Model[] = [
    {
        id: "gemma-270m",
        name: "Gemma 3 270M Instruct",
        size: "270 MB",
        url: "https://huggingface.co/unsloth/gemma-3-270m-it-GGUF/resolve/main/gemma-3-270m-it-Q4_K_M.gguf?download=true",
        fileName: "gemma-3-270m-it-Q4_K_M.gguf",
        status: "not_downloaded",
        isActive: false,
    },
    {
        id: "gemma-1b",
        name: "Gemma 3 1B Instruct",
        size: "800 MB",
        url: "https://huggingface.co/unsloth/gemma-3-1b-it-GGUF/resolve/main/gemma-3-1b-it-Q4_K_M.gguf?download=true",
        fileName: "gemma-3-1b-it-Q4_K_M.gguf",
        status: "not_downloaded",
        isActive: false,
    },
    {
        id: "gemma-3-4B",
        name: "gemma 3 4B Instruct",
        size: "2.49 GB",
        url: "https://huggingface.co/unsloth/gemma-3-4b-it-GGUF/resolve/main/gemma-3-4b-it-Q4_K_M.gguf?download=true",
        fileName: "gemma-3-4b-it-Q4_K_M.gguf",
        status: "not_downloaded",
        isActive: false,
    },
    {
        id: "gemma-3n-E2B",
        name: "gemma 3n E2B Instruct",
        size: "2.48 GB",
        url: "https://huggingface.co/unsloth/gemma-3n-E2B-it-GGUF/resolve/main/gemma-3n-E2B-it-Q3_K_M.gguf?download=true",
        fileName: "gemma-3n-E2B-it-Q3_K_M.gguf",
        status: "not_downloaded",
        isActive: false,
    },
    {
        id: "Qwen3-0.6B",
        name: "Qwen3 0.6B",
        size: "397 MB",
        url: "https://huggingface.co/unsloth/Qwen3-0.6B-GGUF/resolve/main/Qwen3-0.6B-Q4_K_M.gguf?download=true",
        fileName: "Qwen3-0.6B-Q4_K_M.gguf",
        status: "not_downloaded",
        isActive: false,
    },
    {
        id: "Llama-3.2-1B",
        name: "Llama 3.2 1B Instruct",
        size: "808 MB",
        url: "https://huggingface.co/unsloth/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf?download=true",
        fileName: "Llama-3.2-1B-Instruct-Q4_K_M.gguf",
        status: "not_downloaded",
        isActive: false,
    },
    {
        id: "Llama-3.2-3B",
        name: "Llama 3.2 3B Instruct",
        size: "2.02 GB",
        url: "https://huggingface.co/unsloth/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf?download=true",
        fileName: "Llama-3.2-3B-Instruct-Q4_K_M.gguf",
        status: "not_downloaded",
        isActive: false,
    },
    {
        id: "MobileLLM-R1",
        name: "MobileLLM R1 950M",
        size: "619 MB",
        url: "https://huggingface.co/DevQuasar/facebook.MobileLLM-R1-950M-GGUF/resolve/main/facebook.MobileLLM-R1-950M.Q4_K_M.gguf?download=true",
        fileName: "facebook.MobileLLM-R1-950M.Q4_K_M.gguf",
        status: "not_downloaded",
        isActive: false,
    },
];

const SettingsScreen = () => {
    const { colors, isDark, toggleTheme } = useTheme();
    const [models, setModels] = useState<Model[]>(INITIAL_MODELS);
    const [modalVisible, setModalVisible] = useState(false);
    const [modelToDelete, setModelToDelete] = useState<string | null>(null);
    const { loadModel, status: llamaStatus } = useLlama();
    const [loadingModelId, setLoadingModelId] = useState<string | null>(null);
    const [downloadResumables] = useState<
        Record<string, FileSystem.DownloadResumable>
    >({});

    const updateModelState = (id: string, updates: Partial<Model>) => {
        setModels((prevModels) =>
            prevModels.map((m) => (m.id === id ? { ...m, ...updates } : m))
        );
    };

    const handleDownload = async (modelId: string) => {
        const model = models.find((m) => m.id === modelId);
        if (!model || model.status === "downloading") return;

        const dirInfo = await FileSystem.getInfoAsync(modelsDir);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(modelsDir, {
                intermediates: true,
            });
        }

        const fileUri = modelsDir + model.fileName;

        const callback = (
            downloadProgress: FileSystem.DownloadProgressData
        ) => {
            const progress =
                downloadProgress.totalBytesWritten /
                downloadProgress.totalBytesExpectedToWrite;
            updateModelState(modelId, { progress });
        };

        const downloadResumable = FileSystem.createDownloadResumable(
            model.url,
            fileUri,
            {},
            callback
        );
        downloadResumables[modelId] = downloadResumable;

        updateModelState(modelId, { status: "downloading", progress: 0 });

        try {
            const result = await downloadResumable.downloadAsync();
            if (result?.uri) {
                console.log("Finished downloading to ", result.uri);
                updateModelState(modelId, {
                    status: "downloaded",
                    progress: 1,
                });
            }
        } catch (e) {
            console.error(e);
            updateModelState(modelId, { status: "not_downloaded" });
        }
    };

    const handleDeletePress = (modelId: string) => {
        setModelToDelete(modelId);
        setModalVisible(true);
    };

    const confirmDelete = async () => {
        if (!modelToDelete) return;

        const model = models.find((m) => m.id === modelToDelete);
        if (model) {
            try {
                const fileUri = modelsDir + model.fileName;
                await FileSystem.deleteAsync(fileUri);
                console.log("Deleted:", fileUri);
                updateModelState(modelToDelete, {
                    status: "not_downloaded",
                    progress: 0,
                    isActive: false,
                });
            } catch (e) {
                console.error("Couldn't delete file:", e);
                Alert.alert("Error", "Could not delete the model file.");
            }
        }
        setModalVisible(false);
        setModelToDelete(null);
    };

    const handleSetActive = async (modelId: string) => {
        const model = models.find((m) => m.id === modelId);
        if (!model || model.status !== "downloaded") return;

        setLoadingModelId(modelId);
        const modelPath = modelsDir + model.fileName;

        try {
            const fileInfo = await FileSystem.getInfoAsync(
                modelsDir + model.fileName
            );

            if (!fileInfo.exists) {
                Alert.alert(
                    "File Not Found",
                    `The model file does not exist at the expected path. Please try re-downloading.`
                );
                setLoadingModelId(null);
                return;
            }
        } catch (e) {
            Alert.alert(
                "File System Error",
                "Could not verify the model file's existence."
            );
            setLoadingModelId(null);
            return;
        }

        await loadModel(modelPath);
        setLoadingModelId(null);
    };

    const getButtonTitle = (model: Model) => {
        if (loadingModelId === model.id || llamaStatus === "loading")
            return "Loading...";
        if (model.isActive) return "Active";
        return "Set as Active";
    };

    useEffect(() => {
        const checkForFiles = async () => {
            for (const model of models) {
                const fileUri = modelsDir + model.fileName;
                const fileInfo = await FileSystem.getInfoAsync(fileUri);
                if (fileInfo.exists) {
                    updateModelState(model.id, {
                        status: "downloaded",
                        progress: 1,
                    });
                }
            }
        };
        checkForFiles();
    }, []);

    return (
        <>
            <ScrollView
                style={[
                    styles.container,
                    { backgroundColor: colors.background },
                ]}
            >
                {/* --- Appearance Section --- */}
                <SectionHeader title="Appearance" />
                <SettingRow>
                    <Text style={[styles.text, { color: colors.text }]}>
                        Dark Mode
                    </Text>
                    <CustomSwitch value={isDark} onValueChange={toggleTheme} />
                </SettingRow>

                <SettingRow>
                    <Text style={[styles.text, { color: colors.text }]}>
                        Accent Color
                    </Text>
                    {/* Placeholder for color swatches */}
                    <View style={{ flexDirection: "row", gap: 10 }}>
                        <View
                            style={[
                                styles.colorSwatch,
                                { backgroundColor: "#B7D085" },
                            ]}
                        />
                        <View
                            style={[
                                styles.colorSwatch,
                                { backgroundColor: "#3584e4" },
                            ]}
                        />
                        <View
                            style={[
                                styles.colorSwatch,
                                { backgroundColor: "#e49235" },
                            ]}
                        />
                    </View>
                </SettingRow>

                {/* --- Chat & AI Behavior Section --- */}
                <SectionHeader title="Chat & AI Behavior" />
                <SettingRow>
                    <Text style={[styles.text, { color: colors.text }]}>
                        Streaming Response
                    </Text>
                    <CustomSwitch value={true} onValueChange={() => {}} />
                </SettingRow>
                <SettingRow>
                    <Text style={[styles.text, { color: colors.text }]}>
                        AI Answer Suggestions
                    </Text>
                    <CustomSwitch value={false} onValueChange={() => {}} />
                </SettingRow>
                <SettingRow>
                    <Text style={[styles.text, { color: colors.text }]}>
                        Save Chat History
                    </Text>
                    <CustomSwitch value={true} onValueChange={() => {}} />
                </SettingRow>
                <Button
                    title="Clear All History"
                    color="crimson"
                    onPress={() => {}}
                />

                {/* --- Model Management Section --- */}
                <SectionHeader title="Model Management" />
                {models.map((model) => (
                    <ModelCard
                        key={model.id}
                        model={{ ...model, buttonTitle: getButtonTitle(model) }}
                        onDownload={handleDownload}
                        onDelete={handleDeletePress}
                        onSetActive={handleSetActive}
                    />
                ))}
            </ScrollView>
            <ConfirmationModal
                visible={modalVisible}
                title="Confirm Deletion"
                message={`Are you sure you want to delete this model file? This action cannot be undone.`}
                onConfirm={confirmDelete}
                onCancel={() => setModalVisible(false)}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 15 },
    sectionHeader: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 25,
        marginBottom: 10,
    },
    settingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
    },
    text: { fontSize: 16 },
    colorSwatch: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    modelCard: {
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        backgroundColor: "#ffffff20",
    },
});

export default SettingsScreen;
