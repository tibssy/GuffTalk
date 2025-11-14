import React, { useState, useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import {
    StyleSheet,
    View,
    Text,
    useWindowDimensions,
    Pressable,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import {
    SafeAreaView as RNSafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";
import { useLlama } from "../context/LlamaContext";
import { v4 as uuidv4 } from "uuid";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Message } from "../types/Message";
import { useTheme } from "../context/ThemeContext";
import ChatView from "../views/ChatView";
import HistoryScreen from "./HistoryScreen";
import SettingsScreen from "./SettingsScreen";

const AnimatedSafeAreaView = Animated.createAnimatedComponent(RNSafeAreaView);

type ActiveView = "chat" | "history" | "settings";

// fade animation style for icon
const useIconAnimation = (
    visibleOnView: ActiveView,
    activeView: ActiveView
) => {
    return useAnimatedStyle(() => {
        return {
            opacity: withTiming(activeView === visibleOnView ? 1 : 0, {
                duration: 500,
            }),
            // disable touch events for hidden icons
            pointerEvents: activeView === visibleOnView ? "auto" : "none",
        };
    });
};

const MainScreen = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: uuidv4(),
            text: "Hello!",
            role: "bot",
            timestamp: new Date(),
        },
    ]);
    const { colors, isDark } = useTheme();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const [activeView, setActiveView] = useState<ActiveView>("chat");
    const position = useSharedValue(-width);
    const historyIconStyle = useIconAnimation("chat", activeView);
    const newChatIconStyle = useIconAnimation("history", activeView);
    const settingsBackIconStyle = useIconAnimation("settings", activeView);
    const settingsIconStyle = useIconAnimation("chat", activeView);
    const historyBackIconStyle = useIconAnimation("history", activeView);
    const saveIconStyle = useIconAnimation("settings", activeView);
    const { generateResponse, isGenerating, status: llamaStatus } = useLlama();

    useEffect(() => {
        // NavigationBar.setPositionAsync("relative");
        NavigationBar.setBackgroundColorAsync(colors.background);
    }, [isDark]);

    useEffect(() => {
        let targetPosition = -width;
        if (activeView === "history") targetPosition = 0;
        if (activeView === "settings") targetPosition = -width * 2;
        position.value = withTiming(targetPosition, { duration: 250 });
    }, [activeView, width, position]);

    const animatedContainerStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: position.value }],
    }));
    const animatedRootBgStyles = useAnimatedStyle(() => ({
        backgroundColor: colors.background,
    }));

    const handleSendMessage = async (text: string) => {
        if (llamaStatus !== "loaded" || isGenerating) {
            Alert.alert(
                "AI Not Ready",
                "Please wait for the AI to finish loading or generating a response."
            );
            return;
        }

        const userMessage: Message = {
            id: uuidv4(),
            text,
            role: "user",
            timestamp: new Date(),
        };

        const newMessages: Message[] = [
            ...messages,
            userMessage,
            { id: uuidv4(), text: "", role: "bot", timestamp: new Date() },
        ];

        setMessages(newMessages);
        await generateResponse(newMessages.slice(0, -1), setMessages);
    };

    const goBackToChat = () => setActiveView("chat");
    const handleNewChat = () =>
        Alert.alert("New Chat", "This will start a new conversation.");
    const handleSaveSettings = () =>
        Alert.alert("Settings Saved", "Your preferences have been updated.");

    return (
        <AnimatedSafeAreaView
            style={[{ flex: 1 }, animatedRootBgStyles]}
            edges={["left", "right", "top"]}
        >
            <StatusBar
                barStyle={isDark ? "light-content" : "dark-content"}
                backgroundColor={colors.background}
                translucent={true}
            />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View
                    style={[
                        styles.container,
                        // { paddingTop: insets.top }
                    ]}
                >
                    {/* --- DYNAMIC HEADER --- */}
                    <View style={styles.header}>
                        {/* --- Left Icon Slot --- */}
                        <View style={styles.iconSlot}>
                            {/* History Icon (Visible on Chat Screen) */}
                            <Animated.View
                                style={[styles.iconContainer, historyIconStyle]}
                            >
                                <Pressable
                                    onPress={() => setActiveView("history")}
                                >
                                    <MaterialCommunityIcons
                                        name="history"
                                        size={26}
                                        color={colors.text}
                                    />
                                </Pressable>
                            </Animated.View>
                            {/* New Chat Icon (Visible on History Screen) */}
                            <Animated.View
                                style={[styles.iconContainer, newChatIconStyle]}
                            >
                                <Pressable onPress={handleNewChat}>
                                    <MaterialCommunityIcons
                                        name="plus-circle-outline"
                                        size={26}
                                        color={colors.text}
                                    />
                                </Pressable>
                            </Animated.View>
                            {/* Back Arrow (Visible on Settings Screen) */}
                            <Animated.View
                                style={[
                                    styles.iconContainer,
                                    settingsBackIconStyle,
                                ]}
                            >
                                <Pressable onPress={goBackToChat}>
                                    <MaterialCommunityIcons
                                        name="arrow-left"
                                        size={26}
                                        color={colors.text}
                                    />
                                </Pressable>
                            </Animated.View>
                        </View>

                        <Text
                            style={[styles.headerTitle, { color: colors.text }]}
                        >
                            GuffTalk
                        </Text>

                        {/* --- Right Icon Slot --- */}
                        <View style={styles.iconSlot}>
                            {/* Settings Icon (Visible on Chat Screen) */}
                            <Animated.View
                                style={[
                                    styles.iconContainer,
                                    settingsIconStyle,
                                ]}
                            >
                                <Pressable
                                    onPress={() => setActiveView("settings")}
                                >
                                    <MaterialCommunityIcons
                                        name="cog"
                                        size={26}
                                        color={colors.text}
                                    />
                                </Pressable>
                            </Animated.View>
                            {/* Back Arrow (Visible on History Screen) */}
                            <Animated.View
                                style={[
                                    styles.iconContainer,
                                    historyBackIconStyle,
                                ]}
                            >
                                <Pressable onPress={goBackToChat}>
                                    <MaterialCommunityIcons
                                        name="arrow-right"
                                        size={26}
                                        color={colors.text}
                                    />
                                </Pressable>
                            </Animated.View>
                            {/* Save Icon (Visible on Settings Screen) */}
                            <Animated.View
                                style={[styles.iconContainer, saveIconStyle]}
                            >
                                <Pressable onPress={handleSaveSettings}>
                                    <MaterialCommunityIcons
                                        name="content-save"
                                        size={26}
                                        color={colors.text}
                                    />
                                </Pressable>
                            </Animated.View>
                        </View>
                    </View>

                    {/* --- ANIMATED CONTENT --- */}
                    <Animated.View
                        style={[styles.contentSlider, animatedContainerStyle]}
                    >
                        <View style={{ width }}>
                            <HistoryScreen />
                        </View>
                        <View style={{ width }}>
                            <ChatView
                                messages={messages}
                                handleSendMessage={handleSendMessage}
                                isGenerating={isGenerating}
                            />
                        </View>
                        <View style={{ width }}>
                            <SettingsScreen />
                        </View>
                    </Animated.View>
                </View>
            </KeyboardAvoidingView>
        </AnimatedSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, overflow: "hidden" },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    headerTitle: { fontSize: 20, fontWeight: "bold" },
    iconSlot: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    iconContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
    },
    contentSlider: {
        flex: 1,
        flexDirection: "row",
        width: "300%",
        alignSelf: "flex-start",
    },
});

export default MainScreen;
