import { useContext, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/AppStyles';

export default function SignInScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validate = () => {
    if (!email || !password) {
      Alert.alert('Validation', 'Email and password are required.');
      return false;
    }
    // simple email regex
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      Alert.alert('Validation', 'Please enter a valid email.');
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    if (!validate()) return;
    try {
      await login(email, password);
      // onAuthStateChanged will navigate automatically
    } catch (e) {
      Alert.alert('Sign in failed', e.message);
    }
  };

  return (
    <View style={styles.authContainer}>
      <Text style={styles.authTitle}>Event Organizer</Text>

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

      <Button title="Sign In" onPress={handleSignIn} />

      <View style={{ flexDirection: 'row', marginTop: 16 }}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={{ color: 'blue' }}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}