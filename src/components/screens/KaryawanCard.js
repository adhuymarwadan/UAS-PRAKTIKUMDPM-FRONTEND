import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Dimensions,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import formatDate from "./formatDate";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const KaryawanCard = ({ employee, onUpdate }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));

  const isNew =
    new Date(employee.tanggal_bergabung) >
    new Date(new Date().setDate(new Date().getDate() - 30));
  new Date(employee.tanggal_bergabung).getFullYear() >= 2025;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => setModalVisible(true));
  };

  const handleDelete = () => {
    Alert.alert(
      "Konfirmasi Penghapusan",
      `Apakah Anda yakin ingin menghapus data ${employee.nama}?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(
                `http://192.168.10.8:5000/employees/${employee._id}`
              );
              Alert.alert("Berhasil", "Data karyawan berhasil dihapus");
              setModalVisible(false);
              if (onUpdate) onUpdate();
            } catch (error) {
              Alert.alert("Error", "Gagal menghapus data karyawan");
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    setModalVisible(false);
    navigation.navigate("TambahKaryawan", {
      employee,
      isEdit: true,
    });
  };

  return (
    <>
      <Animated.View
        style={[styles.cardWrapper, { transform: [{ scale: scaleValue }] }]}
      >
        <TouchableOpacity
          style={[styles.card, isNew && styles.newCard]}
          onPress={handlePress}
          activeOpacity={0.9}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>{employee.nama}</Text>
                {isNew && (
                  <View style={styles.newBadge}>
                    <Icon
                      name="star"
                      size={12}
                      color="#fff"
                      style={styles.newBadgeIcon}
                    />
                    <Text style={styles.newBadgeText}>Baru</Text>
                  </View>
                )}
              </View>
              <View style={styles.jobContainer}>
                <Icon name="briefcase-outline" size={16} color="#1B5E20" />
                <Text style={styles.cardSubtitle}>{employee.jabatan}</Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.cardInfo}>
                <Icon name="calendar-outline" size={14} color="#666" />
                <Text style={styles.cardDate}>
                  {formatDate(employee.tanggal_bergabung)}
                </Text>
              </View>
              <View style={styles.statusContainer}>
                <Icon
                  name={
                    employee.status === "Aktif"
                      ? "checkmark-circle"
                      : "close-circle"
                  }
                  size={16}
                  color={employee.status === "Aktif" ? "#1B5E20" : "#D32F2F"}
                />
                <Text
                  style={[
                    styles.cardStatus,
                    employee.status === "Aktif"
                      ? styles.statusActive
                      : styles.statusInactive,
                  ]}
                >
                  {employee.status}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleContainer}>
                  <Text style={styles.modalTitle}>{employee.nama}</Text>
                  <View style={styles.modalSubtitleContainer}>
                    <Icon name="briefcase-outline" size={16} color="#1B5E20" />
                    <Text style={styles.modalSubtitle}>{employee.jabatan}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Icon name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Icon name="call-outline" size={20} color="#1B5E20" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Kontak</Text>
                    <Text style={styles.infoText}>{employee.kontak}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Icon name="location-outline" size={20} color="#1B5E20" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Alamat</Text>
                    <Text style={styles.infoText}>{employee.alamat}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Icon name="calendar-outline" size={20} color="#1B5E20" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Tanggal Bergabung</Text>
                    <Text style={styles.infoText}>
                      {formatDate(employee.tanggal_bergabung)}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Icon
                      name={
                        employee.status === "Aktif"
                          ? "checkmark-circle-outline"
                          : "close-circle-outline"
                      }
                      size={20}
                      color={
                        employee.status === "Aktif" ? "#1B5E20" : "#D32F2F"
                      }
                    />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Status</Text>
                    <Text
                      style={[
                        styles.infoText,
                        {
                          color:
                            employee.status === "Aktif" ? "#1B5E20" : "#D32F2F",
                        },
                      ]}
                    >
                      {employee.status}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={handleEdit}
                >
                  <Icon name="create-outline" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Edit Data</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={handleDelete}
                >
                  <Icon name="trash-outline" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Hapus</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 12,
    marginHorizontal: 2,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  newCard: {
    borderColor: "#1B5E20",
    borderWidth: 2,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B5E20",
    flex: 1,
  },
  jobContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  newBadge: {
    backgroundColor: "#1B5E20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  newBadgeIcon: {
    marginRight: 4,
  },
  newBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardDate: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cardStatus: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  statusActive: {
    color: "#1B5E20",
  },
  statusInactive: {
    color: "#D32F2F",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1B5E20",
    marginBottom: 4,
  },
  modalSubtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#E8F5E9",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 12,
    flex: 1,
  },
  editButton: {
    backgroundColor: "#1B5E20",
  },
  deleteButton: {
    backgroundColor: "#D32F2F",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default KaryawanCard;
