import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    interpolateColor,
} from "react-native-reanimated";
import { useTheme } from "../context/ThemeContext";

interface CustomSwitchProps {
    value: boolean;
    onValueChange: (newValue: boolean) => void;
}

const trackWidth = 42;
const trackHeight = 24;
const thumbSize = 20;
const padding = (trackHeight - thumbSize) / 2;

const CustomSwitch: React.FC<CustomSwitchProps> = ({
    value,
    onValueChange,
}) => {
    const { colors } = useTheme();
    const progress = useSharedValue(value ? 1 : 0);

    useEffect(() => {
        progress.value = withTiming(value ? 1 : 0, { duration: 250 });
    }, [value, progress]);

    const animatedTrackStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            progress.value,
            [0, 1],
            [colors.switchOffTrack, colors.accent]
        );
        return { backgroundColor };
    });

    const animatedThumbStyle = useAnimatedStyle(() => {
        const translateX =
            progress.value * (trackWidth - thumbSize - padding * 2);
        return {
            transform: [{ translateX }],
        };
    });

    return (
        <Pressable onPress={() => onValueChange(!value)}>
            <Animated.View style={[styles.track, animatedTrackStyle]}>
                <Animated.View style={[styles.thumb, animatedThumbStyle]} />
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    track: {
        width: trackWidth,
        height: trackHeight,
        borderRadius: trackHeight / 2,
        justifyContent: "center",
        paddingHorizontal: padding,
    },
    thumb: {
        width: thumbSize,
        height: thumbSize,
        borderRadius: thumbSize / 2,
        backgroundColor: "#FFFFFF",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
});

export default CustomSwitch;
