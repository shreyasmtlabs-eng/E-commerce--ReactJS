importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDabOx4aG3S-2TFaMokIZaeTO0Qlj4QOSk",
  authDomain: "ecommerce-c9d81.firebaseapp.com",
  projectId: "ecommerce-c9d81",
  storageBucket: "ecommerce-c9d81.firebasestorage.app",
  messagingSenderId: "882809795305",
  appId: "1:882809795305:web:c47fff1e6fd1f56c117678"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);
  
  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: '/icon.png',
    badge: '/icon.png',
    vibrate: [200, 100, 200]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});