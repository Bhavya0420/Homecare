import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import apiurl from './utils/config';
import BookingModal from './BookingModal';

const SaloonScreen = ({ navigation }) => {
  const [saloonEmployees, setSaloonEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSaloonEmployee, setSelectedSaloonEmployee] = useState(null);

  const fetchSaloonEmployees = async () => {
    try {
      const res = await axios.get(`${apiurl}/api/authRoutes/employeesByField`, {
        params: { fieldOfWork: 'Saloon' },
      });
      if (res.data.success) {
        setSaloonEmployees(res.data.employees);
      } else {
        setSaloonEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching saloon employees:', error);
      setSaloonEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaloonEmployees();
  }, []);

  const openBookingForm = (employee) => {
    setSelectedSaloonEmployee(employee);
    setModalVisible(true);
  };

  const closeBookingForm = () => {
    setSelectedSaloonEmployee(null);
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDetails}>Phone: {item.phone}</Text>
      <Text style={styles.itemDetails}>Email: {item.email}</Text>
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => openBookingForm(item)}
      >
        <Text style={styles.bookButtonText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saloon</Text>
      </View>
      <View style={styles.body}>
        {loading ? (
          <ActivityIndicator size="large" color="#1abc9c" />
        ) : saloonEmployees.length === 0 ? (
          <Text style={styles.bodyText}>No saloon employees found.</Text>
        ) : (
          <FlatList
            data={saloonEmployees}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
      <BookingModal
        visible={modalVisible}
        onClose={closeBookingForm}
        selectedEmployee={selectedSaloonEmployee}
        serviceName="Saloon"
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

export default SaloonScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#f7f7f7',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  body: { flex: 1, padding: 20 },
  bodyText: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 20 },
  itemContainer: {
    backgroundColor: '#e0f7f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1abc9c',
  },
  itemDetails: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  bookButton: {
    marginTop: 10,
    backgroundColor: '#1abc9c',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
