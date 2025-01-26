import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, TextInput, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function sendPushNotification(expoPushToken: string, title: string, body: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: title,
    body: body,
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [500, 500, 100, 500],
      lightColor: '#FF1493',
      sound: '',
      enableLights: true,
      enableVibrate: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      alert('Project ID not found');
      return;
    }
    const pushToken = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;
    return pushToken;
  } else {
    alert('Must use a physical device for push notifications');
  }
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  const [titleInput, setTitleInput] = useState<string>('');
  const [bodyInput, setBodyInput] = useState<string>('');

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch(error => console.error(error));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Push Notification</Text>

      <View style={styles.notificationCard}>
        <Text style={styles.notificationTitle}>
          Title: {notification?.request.content.title || 'N/A'}
        </Text>
        <Text style={styles.notificationBody}>
          Body: {notification?.request.content.body || 'N/A'}
        </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter title here"
        placeholderTextColor="#999"
        value={titleInput}
        onChangeText={setTitleInput}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter body text"
        placeholderTextColor="#999"
        value={bodyInput}
        onChangeText={setBodyInput}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (expoPushToken && titleInput && bodyInput) {
            sendPushNotification(expoPushToken, titleInput, bodyInput);
          } else {
            alert('Please fill out all fields');
          }
        }}
      >
        <Text style={styles.buttonText}>Send Notification</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F7FF', // Light blue background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003366', // Deep blue for the header
    marginBottom: 20,
    textTransform: 'uppercase',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  notificationCard: {
    width: '90%',
    padding: 20,
    backgroundColor: '#FFFFFF', // White card
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366', // Deep blue for the title
    marginBottom: 10,
  },
  notificationBody: {
    fontSize: 16,
    color: '#666666', // Subtle gray for the body
  },
  input: {
    width: '90%',
    height: 50,
    backgroundColor: '#F8FAFB', // Light blue input field
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#B0C4DE', // Steel blue border
    marginBottom: 15,
    paddingLeft: 15,
    color: '#003366', // Deep blue text color
  },
  button: {
    backgroundColor: '#003366', // Deep blue button
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: '#FFFFFF', // White text for the button
    fontSize: 16,
    fontWeight: 'bold',
  },
});

