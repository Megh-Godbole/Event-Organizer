import { collection, onSnapshot, query, orderBy, doc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../config/firebase';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/AppStyles';

export default function DashboardScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoritesIds, setFavoritesIds] = useState(new Set());

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('date', 'desc'));
    const unsubscribeEvents = onSnapshot(
      q,
      snapshot => {
        const eventsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(eventsList);
        setLoading(false);
      },
      error => {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    );

    const favRef = collection(db, 'users', user.uid, 'favorites');
    const unsubscribeFav = onSnapshot(favRef, snapshot => {
      const favIds = new Set(snapshot.docs.map(doc => doc.id));
      setFavoritesIds(favIds);
    });

    return () => {
      unsubscribeEvents();
      unsubscribeFav();
    };
  }, [user.uid]);

  const confirmDelete = (eventId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'events', eventId));
              Alert.alert('Deleted', 'Event removed successfully.');
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Could not delete event.');
            }
          }
        }
      ]
    );
  };

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

  const toggleFavorite = async (event) => {
    const favDocRef = doc(db, 'users', user.uid, 'favorites', event.id);
    try {
      if (favoritesIds.has(event.id)) {
        confirmRemoveFavorite(event.id);
      } else {
        await setDoc(favDocRef, {
          title: event.title,
          date: event.date,
          ownerId: event.ownerId || null,
          location: event.location || '',
        });
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
      Alert.alert('Error', 'Could not update favorites.');
    }
  };

  const renderItem = ({ item }) => {
    const isOwner = user.uid === item.ownerId;
    const isFavorite = favoritesIds.has(item.id);
    const eventDate = item.date && item.date.seconds ? new Date(item.date.seconds * 1000) : item.date instanceof Date ? item.date : null;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>

          <TouchableOpacity
            onPress={() => toggleFavorite(item)}
            style={styles.favoriteIconWrapper}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={28}
              color={isFavorite ? styles.colors.danger : styles.colors.icon}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.cardSubtitle}>
          {eventDate ? eventDate.toLocaleDateString() : 'No date'}
        </Text>

        {isOwner && (
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
            <TouchableOpacity
              onPress={() => navigation.getParent()?.navigate('EditEvent', { eventId: item.id })}
              style={{ marginRight: 16 }}
            >
              <Ionicons name="create-outline" size={24} color={styles.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmDelete(item.id)}>
              <Ionicons name="trash-outline" size={24} color={styles.colors.danger} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };


  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={styles.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          marginBottom: 20,
          padding: 20,
          backgroundColor: styles.colors.primary,
          borderRadius: 12,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 6,
          elevation: 5,
        }}
      >
        <Text style={{ color: styles.colors.onPrimary, fontSize: 20, fontWeight: '700' }}>
          {user.displayName || 'No Name'}
        </Text>
        <Text style={{ color: styles.colors.onPrimary, fontSize: 14, marginTop: 4 }}>
          {user.email}
        </Text>
      </View>

      <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.getParent()?.navigate('CreateEvent')}
      >
        <Ionicons name="add" size={28} color={styles.colors.background} />
      </TouchableOpacity>
    </View>
  );
}