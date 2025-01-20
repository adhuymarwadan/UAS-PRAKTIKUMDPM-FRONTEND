import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get("window");

export default function ProfileScreen({ onLogout }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const tokenData = await AsyncStorage.getItem("token");
      if (!tokenData) throw new Error("No token found");

      const { token } = JSON.parse(tokenData);
      const response = await fetch("http://192.168.10.8:5000/api/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const { data } = await response.json();
      setUserData(data);
      if (data.profileImage) {
        setProfileImage(data.profileImage);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Sorry, we need camera roll permissions to make this work!"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setProfileImage(imageUri);

        // Upload to server
        const tokenData = await AsyncStorage.getItem("token");
        if (!tokenData) throw new Error("No token found");

        const { token } = JSON.parse(tokenData);
        const response = await fetch(
          "http://192.168.10.8:5000/api/profile/picture",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ imageUri }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update profile picture");
        }

        const { data } = await response.json();
        setUserData(data);
        Alert.alert("Success", "Profile picture updated successfully");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update profile picture");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1B5E20" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const renderInfoCard = (icon, label, value) => (
    <TouchableOpacity style={styles.infoCard}>
      <View style={styles.infoIconContainer}>
        <Icon name={icon} size={24} color="#1B5E20" />
      </View>
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
      <Icon name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#1B5E20" barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.headerBackground} />
        <View style={styles.profileContent}>
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={pickImage}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Icon name="person" size={50} color="#E8F5E9" />
              </View>
            )}
            <View style={styles.editIconContainer}>
              <Icon name="camera" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.username}>{userData?.username}</Text>
          <View style={styles.roleBadge}>
            <Icon name="shield-checkmark" size={16} color="#fff" />
            <Text style={styles.roleText}>Admin</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statsCard}>
          <View
            style={[styles.statsIconContainer, { backgroundColor: "#E8F5E9" }]}
          >
            <Icon name="time" size={24} color="#1B5E20" />
          </View>
          <View style={styles.statsTextContainer}>
            <Text style={styles.statsNumber}>12</Text>
            <Text style={styles.statsLabel}>Months Active</Text>
          </View>
        </View>

        <View style={styles.statsCard}>
          <View
            style={[styles.statsIconContainer, { backgroundColor: "#E8F5E9" }]}
          >
            <Icon name="star" size={24} color="#1B5E20" />
          </View>
          <View style={styles.statsTextContainer}>
            <Text style={styles.statsNumber}>4.8</Text>
            <Text style={styles.statsLabel}>Rating</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        {renderInfoCard("person-circle", "Username", userData?.username)}
        {renderInfoCard("mail", "Email", userData?.email)}
        {renderInfoCard(
          "calendar",
          "Joined Date",
          userData?.createdAt
            ? new Date(userData.createdAt).toLocaleDateString()
            : ""
        )}
        {renderInfoCard("shield", "Role", "Administrator")}

        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Icon name="log-out" size={24} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 280,
    position: "relative",
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    backgroundColor: "#1B5E20",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileContent: {
    alignItems: "center",
    paddingTop: 40,
  },
  profileImageContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 8,
    elevation: 8,
    borderWidth: 4,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 70,
  },
  profileImagePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 70,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#1B5E20",
    padding: 8,
    borderRadius: 20,
    elevation: 4,
    borderWidth: 2,
    borderColor: "#fff",
  },
  username: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 3,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(232, 245, 233, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  roleText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 6,
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    marginTop: -25,
  },
  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    width: width * 0.44,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statsIconContainer: {
    padding: 10,
    borderRadius: 12,
    marginRight: 12,
  },
  statsTextContainer: {
    flex: 1,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1B5E20",
  },
  statsLabel: {
    fontSize: 13,
    color: "#666666",
    marginTop: 40,
  },
  infoContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoIconContainer: {
    backgroundColor: "#E8F5E9",
    padding: 10,
    borderRadius: 12,
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "#D32F2F",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 12,
    color: "#1B5E20",
    fontSize: 16,
  },
});
