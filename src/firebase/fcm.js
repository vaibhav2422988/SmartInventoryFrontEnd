import { getMessaging, getToken } from "firebase/messaging";
import firebaseApp from "./firebaseConfig";

const messaging = getMessaging(firebaseApp);

const YOUR_PUBLIC_VAPID_KEY = "BL4ujY3bSdsWPUPBrfPQekXWGA_7ia5Xgt0Nh_vcwo6SnA4MSNF_jXpd14LplPvhVL5AdcfXz8U43Q9r3kJMDjU"

export const requestFCMToken = async () => {
  try {
    console.log("Requesting notification permission...");
    const permission = await Notification.requestPermission();
    console.log("Notification permission status:", permission);
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: YOUR_PUBLIC_VAPID_KEY
      });
      console.log("FCM Token:", token);
      alert("FCM Token: " + token);
      return token;
    } else {
      console.warn("Notification permission denied");
      alert("Notification permission denied. Please enable notifications in your browser settings.");
      return null;
    }
  } catch (error) {
    console.error("Error getting FCM token", error);
    return null;
  }
};

