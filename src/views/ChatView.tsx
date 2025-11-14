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
    isGenerating: boolean;
}

const ChatView: React.FC<ChatViewProps> = ({
    messages,
    handleSendMessage,
    isGenerating,
}) => {
    const { colors } = useTheme();
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
                inverted={true}
                data={[...messages].reverse()}
                renderItem={({ item }) => <ChatBubble message={item} />}
                keyExtractor={(item) => item.id}
                style={[
                    styles.messageList,
                    animatedChatBgStyles,
                    { borderColor: colors.inputBorder },
                ]}
                contentContainerStyle={{ paddingVertical: 10 }}
            />
            <MessageInput
                onSendMessage={handleSendMessage}
                isSending={isGenerating}
            />
        </View>
    );
};

export default ChatView;
