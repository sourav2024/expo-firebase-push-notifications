# Expo Firebase Push Notifications

This repository showcases the integration of **push notifications** into a React Native app using **Expo** and **Firebase Cloud Messaging (FCM)**. This guide will walk you through the steps to set up and use push notifications effectively.

---

## Features
- **Real-Time Notifications**: Send and receive notifications instantly.
- **Firebase Integration**: Leverage Firebase Cloud Messaging for scalable and reliable notification delivery.
- **Cross-Platform Support**: Works seamlessly on both Android and iOS.
- **Expo EAS Integration**: Simplified builds and over-the-air (OTA) updates.

---

## Prerequisites

Before starting, ensure you have the following:
1. **Node.js** and **npm** installed on your machine.
2. **Expo CLI** installed globally. You can install it using:
   ```bash
   npm install -g expo-cli
   ```
3. A **Firebase project** with Firebase Cloud Messaging enabled.
4. Basic knowledge of React Native and Expo.

---

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/sourav2024/expo-firebase-push-notifications.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   expo start
   ```

---

## Setup Firebase Cloud Messaging (FCM)

1. Go to the [Firebase Console](https://console.firebase.google.com/), create a new project, or use an existing one.
2. Enable **Cloud Messaging** under the "Project Settings".
3. Download the `google-services.json` (for Android) and `GoogleService-Info.plist` (for iOS) files and place them in the appropriate directories:
   - `google-services.json`: Place this file in the root of your project.
   - `GoogleService-Info.plist`: Place this file in the `ios` directory.

---

## Setting Up Push Notifications in Expo

1. Install the required Expo packages:
   ```bash
   expo install expo-notifications
   ```

2. Configure push notifications in your app:
   - Create a file named `notifications.js` and add the following code:
     ```javascript
     import * as Notifications from 'expo-notifications';
     import * as Device from 'expo-device';

     export async function registerForPushNotificationsAsync() {
       let token;
       if (Device.isDevice) {
         const { status: existingStatus } = await Notifications.getPermissionsAsync();
         let finalStatus = existingStatus;
         if (existingStatus !== 'granted') {
           const { status } = await Notifications.requestPermissionsAsync();
           finalStatus = status;
         }
         if (finalStatus !== 'granted') {
           alert('Failed to get push token for push notifications!');
           return;
         }
         token = (await Notifications.getExpoPushTokenAsync()).data;
         console.log(token);
       } else {
         alert('Must use physical device for Push Notifications');
       }
       return token;
     }
     ```

3. Call the `registerForPushNotificationsAsync` function in your `App.js`:
   ```javascript
   import React, { useEffect } from 'react';
   import { registerForPushNotificationsAsync } from './notifications';

   export default function App() {
     useEffect(() => {
       registerForPushNotificationsAsync();
     }, []);

     return null;
   }
   ```

---

## Sending Notifications

1. Use the [Expo Push Notification Tool](https://expo.dev/notifications) to send test notifications.
2. Alternatively, send notifications via Firebase:
   - Go to the **Cloud Messaging** section in Firebase.
   - Compose a notification and send it to the Expo push token.

---

## References
- [Expo Push Notifications Documentation](https://docs.expo.dev/push-notifications/overview/)
- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)

---

## Screenshots
![Push Notifications Example](https://github.com/sourav2024/expo-firebase-push-notifications/blob/main/example.mp4)

---

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests for improvements.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Connect with Me
Feel free to reach out if you have any questions or suggestions!
- **LinkedIn**: [Sourav Kashyap](https://www.linkedin.com/in/sourav-kashyap-56b550269/)
- **GitHub**: [sourav2024](https://github.com/sourav2024)
