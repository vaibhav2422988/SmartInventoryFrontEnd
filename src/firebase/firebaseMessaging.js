import { getMessaging, getToken, onMessage } from "firebase/messaging";

import app from "./firebaseConfig";

const messaging = getMessaging(app);

const YOUR_VAPID_KEY = "BL4ujY3bSdsWPUPBrfPQekXWGA_7ia5Xgt0Nh_vcwo6SnA4MSNF_jXpd14LplPvhVL5AdcfXz8U43Q9r3kJMDjU"
export const requestFCMToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const currentToken = await getToken(messaging, { vapidKey: YOUR_VAPID_KEY });
      console.log('FCM Token:', currentToken);
      return currentToken;
    } else {
      console.warn('Permission not granted for notifications');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error);
    return null;
  }
};

// Optional: For receiving messages while app is in foreground
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      resolve(payload);
    });
  });

// Optional: Listen for token refresh
onTokenRefresh(messaging, async () => {
  const newToken = await getToken(messaging, { vapidKey: YOUR_VAPID_KEY });
  console.log('Token refreshed:', newToken);
  // Update token in backend if needed
});
