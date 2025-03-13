// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getMessaging, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhoVEQrrOX4zix14BHcDbhe_fYLmfGKJ0",
  authDomain: "simplydoneproject-787e4.firebaseapp.com",
  projectId: "simplydoneproject-787e4",
  storageBucket: "simplydoneproject-787e4.firebasestorage.app",
  messagingSenderId: "881063271032",
  appId: "1:881063271032:web:ae0810c1b1288e9209eb8d",
  measurementId: "G-R8QPMD5Z5Q"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const messaging = getMessaging(app);

onMessage(messaging, (payload) => {
    console.log("Message reçu au premier plan :", payload);
    // Ici, tu peux afficher une notification custom ou mettre à jour ton UI
  });
  

export {app, messaging}