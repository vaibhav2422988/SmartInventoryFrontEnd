// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQ6PwIHUA04mxIC31KdxgPR3RV0jkJfjI",
  authDomain: "peaceful-region-415508.firebaseapp.com",
  projectId: "peaceful-region-415508",
  storageBucket: "peaceful-region-415508.appspot.com",
  messagingSenderId: "286372964642",
  appId: "1:286372964642:web:650b14c63f5d7e437a5d7b"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const messaging = getMessaging(firebaseApp);

export {messaging}

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BL4ujY3bSdsWPUPBrfPQekXWGA_7ia5Xgt0Nh_vcwo6SnA4MSNF_jXpd14LplPvhVL5AdcfXz8U43Q9r3kJMDjU",
      });
      console.log("FCM Token:", token);
      console.log("You got the permission ");
      return token;
    } else {
      console.warn("Notification permission not granted.");
      return null;
    }
  } catch (err) {
    console.error("An error occurred while retrieving token. ", err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });



export default firebaseApp;