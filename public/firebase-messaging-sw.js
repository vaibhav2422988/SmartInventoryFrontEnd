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

  const notificationTitle = payload.data.title;
  // const notificationOptions = {
  //   body: payload.data.body || 'Default Body',
  //   // data: payload.data, // optional: pass data to notification click event
  // };

  // self.registration.showNotification(notificationTitle);
});


