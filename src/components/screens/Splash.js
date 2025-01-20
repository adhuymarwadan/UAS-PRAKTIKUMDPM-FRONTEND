import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function Splash({ onFinish }) {
  // Animation values
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0);
  const titleAnim = new Animated.Value(-100);

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // Fade in the background
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Scale up the icon
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      // Slide in the title
      Animated.spring(titleAnim, {
        toValue: 0,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to main screen after 3.5 seconds
    const timer = setTimeout(onFinish, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Main content container */}
      <View style={styles.contentContainer}>
        {/* Animated icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <MaterialIcons name="people-alt" size={80} color="#1B5E20" />
        </Animated.View>

        {/* Animated title */}
        <Animated.View
          style={{
            transform: [{ translateX: titleAnim }],
          }}
        >
          <Text style={styles.title}>Employee Management</Text>
        </Animated.View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Manage Your Team Efficiently</Text>
      </View>

      {/* Version number */}
      <Text style={styles.version}>v1.0.0</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 32,
    color: "#1B5E20",
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#388E3C",
    marginTop: 10,
    textAlign: "center",
  },
  version: {
    position: "absolute", 
    bottom: 20,
    fontSize: 12,
    color: "#666666",
  },
});
