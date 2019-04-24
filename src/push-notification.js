import * as firebase from 'firebase/app';
import 'firebase/messaging';

export const initializeFirebase = () => {
  var config = {
    messagingSenderId: "811672300760"
  };
  firebase.initializeApp(config);

  // use other service worker
  // navigator.serviceWorker
  //   .register('/my-sw.js')
  //   .then((registration) => {
  //     firebase.messaging().useServiceWorker(registration);
  //   });
}

export const askForPermissioToReceiveNotifications = async () => {
  try {
    const messaging = firebase.messaging();
    await messaging.requestPermission();
    const token = await messaging.getToken();
    console.log('user token: ', token);
    messaging.onTokenRefresh(async () => {
      const refreshToken = await messaging.getToken();
      console.log('Token torefreshken: ', refreshToken);
    })
    messaging.onMessage((payload) => {
      console.log('Message received.', payload)
    })
    return token;
  } catch (error) {
    console.error(error);
  }
}
