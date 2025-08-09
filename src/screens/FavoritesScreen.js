import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/AppStyles';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const favRef = collection(db, 'users', user.uid, 'favorites');
    const unsubscribe = onSnapshot(favRef, snapshot => {
      const favList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFavorites(favList);
      setLoading(false);
    }, error => {
      console.error('Error fetching favorites:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user.uid]);

  const confirmRemoveFavorite = (eventId) => {
    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this event from favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'users', user.uid, 'favorites', eventId));
              Alert.alert('Removed', 'Event removed from favorites.');
            } catch (error) {
              console.error('Remove favorite error:', error);
              Alert.alert('Error', 'Could not remove favorite.');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.getParent()?.navigate('EditEvent', { eventId: item.id })}
        style={{ flex: 1 }}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Ionicons name="chevron-forward" size={20} color={styles.colors.icon} />
        </View>
        <Text style={styles.cardSubtitle}>
          {item.date
            ? new Date(item.date.seconds ? item.date.seconds * 1000 : item.date).toLocaleString()
            : ''}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => confirmRemoveFavorite(item.id)}
        style={{ position: 'absolute', right: 16, top: 16 }}
      >
        <Ionicons name="trash-outline" size={24} color={styles.colors.danger} />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={styles.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No favorites yet</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}