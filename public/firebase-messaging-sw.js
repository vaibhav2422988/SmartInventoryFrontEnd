// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBQ6PwIHUA04mxIC31KdxgPR3RV0jkJfjI",
  authDomain: "peaceful-region-415508.firebaseapp.com",
  projectId: "peaceful-region-415508",
  storageBucket: "peaceful-region-415508.appspot.com",
  messagingSenderId: "286372964642",
  appId: "1:286372964642:web:650b14c63f5d7e437a5d7b"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  // If notification is available, use it for displaying
  const notificationTitle = payload.notification.title || 'Default Title';
  const notificationBody = payload.notification.body || 'Default Body'; // Use notification.body

  // Log the payload for debugging
  console.log('Notification Payload:', payload.notification);

  const notificationOptions = {
    body: notificationBody,
    // You can pass other data as well if needed
    data: payload.data || {}, // Pass the data along for future reference on click
  };

  // Show the notification if there's a title and body
  if (notificationTitle && notificationBody !== 'undefined') {
    self.registration.showNotification(notificationTitle, notificationOptions);
  }
});


