import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import axios from "axios";
import KaryawanCard from "../screens/KaryawanCard";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width } = Dimensions.get("window");

const Beranda = ({ navigation, route }) => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [newEmployees, setNewEmployees] = useState(0);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  useEffect(() => {
    fetchEmployees();
    fetchUsername();
  }, []);

  useEffect(() => {
    if (route.params?.newEmployeeAdded) {
      fetchEmployees();
      navigation.setParams({ newEmployeeAdded: false });
    }
  }, [route.params?.newEmployeeAdded]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://192.168.10.8:5000/employees");
      const employeeData = response.data;
      setEmployees(employeeData);
      setTotalEmployees(employeeData.length);

      const newCount = employeeData.filter((employee) => {
        const joinDate = new Date(employee.tanggal_bergabung);
        const joinYear = joinDate.getFullYear();
        return joinYear >= 2025;
      }).length;
      setNewEmployees(newCount);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching employees:", error);
      Alert.alert("Error", "Gagal memuat data karyawan. Coba lagi nanti.");
    }
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.nama?.toLowerCase().includes(search.toLowerCase())
  );
  const fetchUsername = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const { username } = JSON.parse(userData);
        setUsername(username);
      }
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };
  const renderEmployeeCard = ({ item }) => {
    return <KaryawanCard employee={item} onUpdate={fetchEmployees} />;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1B5E20" />
        <Text style={styles.loadingText}>Memuat data karyawan...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1B5E20" barStyle="light-content" />

      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Halo, {username}!</Text>
          <Text style={styles.subtitleText}>Selamat datang kembali</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate("Profil")}
        >
          <Icon name="person-circle-outline" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <TouchableOpacity style={styles.statsCard}>
          <View
            style={[styles.statsIconContainer, { backgroundColor: "#E8F5E9" }]}
          >
            <Icon name="people" size={28} color="#1B5E20" />
          </View>
          <View style={styles.statsTextContainer}>
            <Text style={styles.statsNumber}>{totalEmployees}</Text>
            <Text style={styles.statsLabel}>Total Karyawan</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statsCard}>
          <View
            style={[styles.statsIconContainer, { backgroundColor: "#E8F5E9" }]}
          >
            <Icon name="star" size={28} color="#1B5E20" />
          </View>
          <View style={styles.statsTextContainer}>
            <Text style={styles.statsNumber}>{newEmployees}</Text>
            <Text style={styles.statsLabel}>Karyawan Baru</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon
          name="search-outline"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchBar}
          placeholder="Cari karyawan..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#666"
        />
      </View>

      {/* Employee List */}
      {filteredEmployees.length > 0 ? (
        <FlatList
          data={filteredEmployees}
          keyExtractor={(item) => item._id}
          renderItem={renderEmployeeCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Icon name="alert-circle-outline" size={48} color="#1B5E20" />
          <Text style={styles.noDataText}>
            Tidak ada karyawan yang ditemukan
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    padding: 20,
    backgroundColor: "#1B5E20",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: "#E8F5E9",
    opacity: 0.9,
  },
  profileButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    marginTop: 8,
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
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333333",
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  noDataText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
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

export default Beranda;
