import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomecareAuthScreen = ({ navigation }) => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [fieldOfWork, setFieldOfWork] = useState('');
  const [open, setOpen] = useState(false);
const [value, setValue] = useState(null);
const [items, setItems] = useState([
  { label: 'Ambulance', value: 'Ambulance' },
  { label: 'Autos', value: 'Autos' },
  { label: 'Diagonistic', value: 'Diagonistic' },
  { label: 'Electricians', value: 'Electricians' },
  { label: 'Painters', value: 'Painters' },
  { label: 'Photographers', value: 'Photographers' },
  { label: 'Plumbers', value: 'Plumbers' },
  { label: 'Saloon', value: 'Saloon' },
]);

  const isValidPhone = phone => /^\d{10}$/.test(phone);
  const isValidAadhar = aadhar => /^\d{12}$/.test(aadhar);
  const isValidBankAccount = acc => /^\d{9,18}$/.test(acc);

  const handleAuth = async () => {
    if (
      !email ||
      !password ||
      (mode === 'signup' &&
        (!confirmPassword ||
          !name ||
          !phone ||
          !aadhar ||
          !bankAccount ||
          !fieldOfWork))
    ) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (
      mode === 'signup' &&
      (!isValidPhone(phone) || !isValidAadhar(aadhar) || !isValidBankAccount(bankAccount))
    ) {
      Alert.alert(
        'Invalid Input',
        'Ensure Phone is 10 digits, Aadhar is 12 digits, and Bank Account is 9–18 digits.'
      );
      return;
    }

    if (mode === 'login') {
      const userData = await AsyncStorage.getItem(`user:${email}`);
      if (userData) {
        const parsed = JSON.parse(userData);
        if (parsed.password === password) {
          Alert.alert('Login Successful', `Welcome back, ${parsed.name}`);
          navigation.replace('HomeScreen');
        } else {
          Alert.alert('Error', 'Invalid password.');
        }
      } else {
        Alert.alert('Error', 'User not found.');
      }
    } else {
      const userObj = {
        name,
        email,
        password,
        phone,
        aadhar: maskValue(aadhar),
        bankAccount: maskValue(bankAccount),
        fieldOfWork,
      };
      await AsyncStorage.setItem(`user:${email}`, JSON.stringify(userObj));
      Alert.alert('Account Created', `Welcome, ${name}`);
      toggleMode();
    }
  };

  const maskValue = value => value.replace(/\d(?=\d{4})/g, '*');

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setPhone('');
    setAadhar('');
    setBankAccount('');
    setFieldOfWork('');
  };

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.backButtonContainer}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Ionicons name="arrow-back" size={28} color="#333" />
  </TouchableOpacity>
</View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.inner}
      >
<ScrollView contentContainerStyle={{ ...styles.scrollContainer, paddingBottom: 300 }}>
          <Text style={styles.title}>
            {mode === 'login' ? 'Employee Login' : 'Employee Registration'}
          </Text>

          {mode === 'signup' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          {mode === 'signup' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Aadhar Number"
                keyboardType="numeric"
                value={aadhar}
                onChangeText={setAadhar}
              />
            </>
          )}

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {mode === 'signup' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="Bank Account Number"
                keyboardType="numeric"
                value={bankAccount}
                onChangeText={setBankAccount}
              />
<View style={{ zIndex: 1000, marginBottom: open ? 250 : 16, position: 'relative' }}>
 <DropDownPicker
  open={open}
  value={value}
  items={items}
  setOpen={setOpen}
  setValue={(callback) => {
    const selected = callback(value);
    setValue(selected);
    setFieldOfWork(selected);
  }}
  setItems={setItems}
  placeholder="Select Field of Work"
  listMode="SCROLLVIEW" 
  style={{
    marginBottom: open ? 200 : 16,
    borderColor: '#bdc3c7',
  }}
  dropDownContainerStyle={{
    maxHeight: 200, // ✅ Controls dropdown height
    borderColor: '#bdc3c7',
  }}
/>
</View>

            </>
          )}

          <TouchableOpacity style={styles.button} onPress={handleAuth}>
            <Text style={styles.buttonText}>
              {mode === 'login' ? 'Login' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleMode}>
            <Text style={styles.toggleText}>
              {mode === 'login'
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HomecareAuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f6f3',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
    color: '#34495e',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  button: {
    backgroundColor: '#1abc9c',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#2980b9',
    fontSize: 14,
  },
  backButtonContainer: {
  marginTop: 30, 
  paddingLeft: 10,
},

  scrollContainer: {
  flexGrow: 1,
  justifyContent: 'center',
  paddingHorizontal: 24,
  paddingVertical: 20,
  zIndex: 1,
},
});
