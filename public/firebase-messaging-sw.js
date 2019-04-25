importScripts('./firebase/firebase-app.js');
importScripts('./firebase/firebase-messaging.js');

firebase.initializeApp({
  messagingSenderId: "811672300760" // 同上的拿取步驟
});

const messaging = firebase.messaging();
