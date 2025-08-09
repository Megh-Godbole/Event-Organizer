import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Button, Platform, Text, TextInput, TouchableOpacity, View, ActivityIndicator, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/AppStyles';

export default function CreateEditEventScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);
  const eventId = route?.params?.eventId || null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: eventId ? 'Edit Event' : 'Create Event',
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 16 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={styles.colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, eventId]);

  useEffect(() => {
    if (eventId) {
      (async () => {
        setLoading(true);
        try {
          const docSnap = await getDoc(doc(db, 'events', eventId));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setTitle(data.title || '');
            setDescription(data.description || '');
            setLocation(data.location || '');
            if (data.date && data.date.seconds) {
              setDate(new Date(data.date.seconds * 1000));
            }
          } else {
            Alert.alert('Not found', 'Event not found.');
            navigation.goBack();
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to load event.');
          navigation.goBack();
        }
        setLoading(false);
      })();
    }
  }, [eventId, navigation]);

  const validate = () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Title is required');
      return false;
    }
    if (!location.trim()) {
      Alert.alert('Validation', 'Location is required');
      return false;
    }
    if (!date) {
      Alert.alert('Validation', 'Date is required');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      const eventData = {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        date,
      };

      if (eventId) {
        await updateDoc(doc(db, 'events', eventId), eventData);
        Alert.alert('Success', 'Event updated.');
      } else {
        await addDoc(collection(db, 'events'), {
          ...eventData,
          ownerId: user.uid,
          ownerEmail: user.email,
          createdAt: serverTimestamp(),
        });
        Alert.alert('Success', 'Event created.');
      }
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save event.');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={styles.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholder="Event title"
        editable={!saving}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 100 }]}
        multiline
        placeholder="Describe event"
        editable={!saving}
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        value={location}
        onChangeText={setLocation}
        style={styles.input}
        placeholder="Where?"
        editable={!saving}
      />

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateBtn}
        disabled={saving}
      >
        <Text>{date ? date.toLocaleDateString() : 'Pick date'}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          minimumDate={new Date()}
          onChange={(event, selectedDate) => {
            if (Platform.OS === 'android') {
              const eventType = event.type || (event.nativeEvent && event.nativeEvent.type);
              if (eventType === 'dismissed') {
                setShowDatePicker(false);
                return;
              }
              if (eventType === 'set') {
                setShowDatePicker(false);
                if (selectedDate) {
                  const dateOnly = new Date(selectedDate);
                  dateOnly.setHours(0, 0, 0, 0);
                  setDate(dateOnly);
                }
              }
            } else {
              setShowDatePicker(false);
              if (selectedDate) {
                const dateOnly = new Date(selectedDate);
                dateOnly.setHours(0, 0, 0, 0);
                setDate(dateOnly);
              }
            }
          }}
        />

      )}

      <View style={{ marginTop: 20 }}>
        <Button
          title={saving ? 'Saving...' : eventId ? 'Save changes' : 'Create event'}
          onPress={handleSave}
          disabled={saving}
          color={styles.colors.primary}
        />
      </View>
    </ScrollView>
  );
}