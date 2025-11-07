import React, { useRef } from "react";
import { StyleSheet, FlatList, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { Message } from "../types/Message";
import ChatBubble from "../components/ChatBubble";
import MessageInput from "../components/MessageInput";
import { useTheme } from "../context/ThemeContext";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Message>);

interface ChatViewProps {
    messages: Message[];
    handleSendMessage: (text: string) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ messages, handleSendMessage }) => {
    const { colors } = useTheme();
    const flatListRef = useRef<FlatList>(null);

    const animatedChatBgStyles = useAnimatedStyle(() => ({
        backgroundColor: colors.inputBackground,
    }));

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
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
        <View style={styles.container}>
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
        </View>
    );
};

export default ChatView;
