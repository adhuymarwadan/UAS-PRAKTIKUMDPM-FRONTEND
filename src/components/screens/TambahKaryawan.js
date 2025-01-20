import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";

const { width } = Dimensions.get("window");

const TambahKaryawan = ({ navigation, route }) => {
  const isEdit = route.params?.isEdit || false;
  const editData = route.params?.employee;
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const [form, setForm] = useState({
    nama: "",
    jabatan: "",
    kontak: "",
    alamat: "",
    tanggal_bergabung: "",
    status: "Aktif",
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    if (isEdit && editData) {
      setForm({
        nama: editData.nama,
        jabatan: editData.jabatan,
        kontak: editData.kontak,
        alamat: editData.alamat,
        tanggal_bergabung: editData.tanggal_bergabung.split("T")[0],
        status: editData.status,
      });
    }
  }, [isEdit, editData]);

  const handleChange = (name, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const fields = [
      { key: "nama", label: "Nama" },
      { key: "jabatan", label: "Jabatan" },
      { key: "kontak", label: "Kontak" },
      { key: "alamat", label: "Alamat" },
      { key: "tanggal_bergabung", label: "Tanggal bergabung" },
    ];

    for (const field of fields) {
      if (!form[field.key].trim()) {
        Alert.alert("Error", `${field.label} harus diisi!`);
        return false;
      }
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(form.tanggal_bergabung)) {
      Alert.alert(
        "Error",
        "Format tanggal tidak valid! Gunakan format YYYY-MM-DD"
      );
      return false;
    }
    const joinYear = new Date(form.tanggal_bergabung).getFullYear();
    if (joinYear < 2025) {
      Alert.alert(
        "Error",
        "Tahun bergabung harus 2025 atau setelahnya untuk karyawan baru"
      );
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setForm({
      nama: "",
      jabatan: "",
      kontak: "",
      alamat: "",
      tanggal_bergabung: "",
      status: "Aktif",
    });
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;

      const endpoint = isEdit
        ? `http://192.168.10.8:5000/employees/${editData._id}`
        : "http://192.168.10.8:5000/employees";

      const method = isEdit ? "put" : "post";
      const successMessage = isEdit
        ? "Data karyawan berhasil diperbarui"
        : "Karyawan berhasil ditambahkan";

      await axios[method](endpoint, {
        ...form,
        tanggal_bergabung: new Date(form.tanggal_bergabung).toISOString(),
      });

      Alert.alert("Sukses", successMessage);
      resetForm();
      navigation.navigate("Beranda", { newEmployeeAdded: true });
    } catch (error) {
      console.error("Error:", error.response?.data || error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Gagal memproses data karyawan. Silakan coba lagi nanti."
      );
    }
  };

  const renderInputField = (label, field, props = {}) => (
    <Animated.View
      style={[
        styles.formGroup,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.labelContainer}>
        <Icon
          name={getIconForField(field)}
          size={18}
          color="#1B5E20"
          style={styles.labelIcon}
        />
        <Text style={styles.label}>{label}</Text>
      </View>
      <TextInput
        style={[styles.input, field === "alamat" && styles.textArea]}
        value={form[field]}
        onChangeText={(value) => handleChange(field, value)}
        placeholderTextColor="#666"
        {...props}
      />
    </Animated.View>
  );

  const getIconForField = (field) => {
    const icons = {
      nama: "person-outline",
      jabatan: "briefcase-outline",
      kontak: "call-outline",
      alamat: "location-outline",
      tanggal_bergabung: "calendar-outline",
    };
    return icons[field] || "help-outline";
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Icon
            name={isEdit ? "create" : "add-circle"}
            size={40}
            color="#1B5E20"
          />
          <Text style={styles.header}>
            {isEdit ? "Edit Karyawan" : "Tambah Karyawan Baru"}
          </Text>
        </View>

        <View style={styles.formContainer}>
          {renderInputField("Nama Karyawan*", "nama", {
            placeholder: "Masukkan nama lengkap",
          })}

          {renderInputField("Jabatan*", "jabatan", {
            placeholder: "Masukkan jabatan",
          })}

          {renderInputField("Nomor Kontak*", "kontak", {
            placeholder: "Masukkan nomor telepon",
            keyboardType: "phone-pad",
          })}

          {renderInputField("Alamat Lengkap*", "alamat", {
            placeholder: "Masukkan alamat lengkap",
            multiline: true,
            numberOfLines: 3,
          })}

          {renderInputField("Tanggal Bergabung*", "tanggal_bergabung", {
            placeholder: "YYYY-MM-DD",
          })}

          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="close-circle-outline" size={20} color="#666" />
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Icon name="checkmark-circle-outline" size={20} color="#FFF" />
              <Text style={styles.submitButtonText}>
                {isEdit ? "Simpan Perubahan" : "Tambah Karyawan"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#E8F5E9",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1B5E20",
    marginTop: 12,
  },
  formContainer: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  labelIcon: {
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  submitButton: {
    backgroundColor: "#1B5E20",
    padding: 16,
    borderRadius: 12,
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default TambahKaryawan;
