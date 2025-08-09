import React, { useContext } from 'react';
import { ActivityIndicator, View, Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import CreateEditEventScreen from '../screens/CreateEditEventScreen';
import DashboardScreen from '../screens/DashboardScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';

import styles from '../styles/AppStyles';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function LogoutScreen() {
  const { logout } = useContext(AuthContext);

  // Confirm logout immediately on mount
  React.useEffect(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => logout() },
      ],
      { cancelable: false }
    );
  }, [logout]);

  // Empty screen or loading spinner while alert is shown
  return <View style={styles.centered} />;
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = 'home';
          else if (route.name === 'Favorites') iconName = 'heart';
          else if (route.name === 'Logout') iconName = 'log-out';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: styles.tabBarActiveTintColor,
        tabBarInactiveTintColor: styles.tabBarInactiveTintColor,
        tabBarStyle: styles.tabBarStyle,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen
        name="Logout"
        component={LogoutScreen}
        options={{ tabBarLabel: 'Logout' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen
            name="HomeTabs"
            component={AppTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateEvent"
            component={CreateEditEventScreen}
            options={{ title: 'Create Event', headerStyle: styles.header, headerTitleStyle: styles.headerTitle }}
          />
          <Stack.Screen
            name="EditEvent"
            component={CreateEditEventScreen}
            options={{ title: 'Edit Event', headerStyle: styles.header, headerTitleStyle: styles.headerTitle }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}