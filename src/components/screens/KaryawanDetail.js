import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Button, Alert } from "react-native";
import axios from "axios";

const KaryawanDetail = ({ route, navigation }) => {
  const { id } = route.params;
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(
        `http://192.168.10.8:5000/employees/${id}`
      );
      setEmployee(response.data);
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://192.168.10.8:5000/employees/${id}`);
      Alert.alert("Sukses", "Karyawan berhasil dihapus");
      navigation.navigate("Beranda", { newEmployeeAdded: true });
    } catch (error) {
      Alert.alert("Error", "Gagal menghapus karyawan");
    }
  };

  const handleEdit = () => {
    navigation.navigate("TambahKaryawan", { employee });
  };

  if (!employee) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      {employee.foto && (
        <Image source={{ uri: employee.foto }} style={styles.image} />
      )}
      <Text style={styles.name}>{employee.nama}</Text>
      <Text>Jabatan: {employee.jabatan}</Text>
      <Text>Kontak: {employee.kontak}</Text>
      <Text>Alamat: {employee.alamat}</Text>
      <Text>Tanggal Bergabung: {employee.tanggal_bergabung}</Text>
      <Text>Status: {employee.status}</Text>
      <Button title="Edit" onPress={handleEdit} />
      <Button title="Delete" onPress={handleDelete} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  image: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
  name: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
});

export default KaryawanDetail;
