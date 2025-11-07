import React, { useState, useRef } from "react";
import {
    StyleSheet,
    View,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Text,
} from "react-native";
import {
    SafeAreaView as RNSafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import Animated, {
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";
import { v4 as uuidv4 } from "uuid";

import { Message } from "../types/Message";
import ChatBubble from "../components/ChatBubble";
import MessageInput from "../components/MessageInput";
import CustomSwitch from "../components/CustomSwitch";
import { useTheme } from "../context/ThemeContext";

const AnimatedSafeAreaView = Animated.createAnimatedComponent(RNSafeAreaView);
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Message>);

const ChatScreen = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: uuidv4(),
            text: "Hello! The theme transitions are now animated and the status bar color is fixed on Android.",
            role: "bot",
            timestamp: new Date(),
        },
    ]);

    const flatListRef = useRef<FlatList>(null);
    const insets = useSafeAreaInsets();
    const { colors, isDark, toggleTheme } = useTheme();

    const animatedRootBgStyles = useAnimatedStyle(() => {
        return {
            backgroundColor: withTiming(colors.background, { duration: 300 }),
        };
    });

    const animatedChatBgStyles = useAnimatedStyle(() => {
        return {
            backgroundColor: withTiming(colors.inputBackground, {
                duration: 300,
            }),
        };
    });

    const handleSendMessage = (text: string) => {
        const userMessage: Message = {
            id: uuidv4(),
            text,
            role: "user",
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setTimeout(() => {
            const botResponse: Message = {
                id: uuidv4(),
                text: `You said: "${text}". I am a simulated response.`,
                role: "bot",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botResponse]);
        }, 1000);
    };

    const styles = StyleSheet.create({
        container: { flex: 1 },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 15,
            paddingVertical: 10,
        },
        headerTitle: { fontSize: 18, fontWeight: "bold" },
        themeSwitcher: { flexDirection: "row", alignItems: "center", gap: 8 },
        messageList: {
            flex: 1,
            marginHorizontal: 10,
            marginVertical: 5,
            borderRadius: 12,
            overflow: "hidden",
            borderWidth: 1,
        },
    });

    return (
        <AnimatedSafeAreaView
            style={[{ flex: 1 }, animatedRootBgStyles]}
            edges={["left", "right", "bottom"]}
        >
            <StatusBar
                barStyle={isDark ? "light-content" : "dark-content"}
                backgroundColor={colors.background}
                translucent={true}
            />
            <KeyboardAvoidingView
                style={[styles.container, { paddingTop: insets.top }]}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={0}
            >
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>
                        GuffTalk
                    </Text>
                    <View style={styles.themeSwitcher}>
                        <Text style={{ color: colors.text }}>Dark Mode</Text>
                        <CustomSwitch
                            value={isDark}
                            onValueChange={toggleTheme}
                        />
                    </View>
                </View>

                <AnimatedFlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={({ item }) => <ChatBubble message={item} />}
                    keyExtractor={(item) => item.id}
                    style={[
                        styles.messageList,
                        animatedChatBgStyles,
                        { borderColor: colors.inputBorder },
                    ]}
                    contentContainerStyle={{ paddingVertical: 10 }}
                    onContentSizeChange={() =>
                        flatListRef.current?.scrollToEnd({ animated: true })
                    }
                    onLayout={() =>
                        flatListRef.current?.scrollToEnd({ animated: true })
                    }
                />

                <MessageInput onSendMessage={handleSendMessage} />
            </KeyboardAvoidingView>
        </AnimatedSafeAreaView>
    );
};

export default ChatScreen;
