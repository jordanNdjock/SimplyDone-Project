// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

// Utilise la même config que ton appli
const firebaseConfig = {
  apiKey: "AIzaSyBhoVEQrrOX4zix14BHcDbhe_fYLmfGKJ0",
  authDomain: "simplydoneproject-787e4.firebaseapp.com",
  projectId: "simplydoneproject-787e4",
  storageBucket: "simplydoneproject-787e4.firebasestorage.app",
  messagingSenderId: "881063271032",
  appId: "1:881063271032:web:ae0810c1b1288e9209eb8d",
  measurementId: "G-R8QPMD5Z5Q"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Message reçu en arrière-plan :", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/src/app/favicon.ico", // ou une icône personnalisée
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
