import { useContext, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/AppStyles';

export default function SignUpScreen({ navigation }) {
  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');

  const validate = () => {
    if (!email || !password || !displayName) {
      Alert.alert('Validation', 'Please fill all fields.');
      return false;
    }
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      Alert.alert('Validation', 'Please enter a valid email.');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Validation', 'Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    try {
      await register(email, password, displayName);
    } catch (e) {
      Alert.alert('Sign up error', e.message);
    }
  };

  return (
    <View style={styles.authContainer}>
      <Text style={styles.authTitle}>Create account</Text>

      <TextInput
        placeholder="Full name"
        value={displayName}
        onChangeText={setDisplayName}
        style={styles.authInput}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.authInput}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.authInput}
      />

      <Button title="Sign Up" onPress={handleRegister} />

      <View style={{ flexDirection: 'row', marginTop: 16 }}>
        <Text>Have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={{ color: 'blue' }}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}