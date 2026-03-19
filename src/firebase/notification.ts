import { getMessaging, getToken } from "firebase/messaging";
import app from './firebase';

const messaging = getMessaging(app);

export const requestPermissionAndGetToken = async () => {
  try {
    console.log("Requesting notification permission...");
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("Notification permission granted.");
      
 
      let registration = undefined;
      try {
        if ('serviceWorker' in navigator) {
          registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          console.log("Service Worker registered:", registration.scope);
        }
      } catch (swError) {
        console.log("Service Worker registration error:", swError);
        
      }
      
      
      const tokenOptions = {
        vapidKey: "BJJcs66jNOW9G8Jaw4MdjuZXYlMWb0FmwXVjtB5_B2eVqkQEcDCDpw4qlO5UeY6TXbXPsv_UeL8WrfwzIHBjrCE"
      };
      
      
      if (registration) {
        tokenOptions.serviceWorkerRegistration = registration;
      }
      
      const token = await getToken(messaging, tokenOptions);

      console.log("FCM Token:", token);
      

      localStorage.setItem('fcmToken', token);
      
      return token;
    } else {
      console.log("Permission denied");
    }
  } catch (error) {
    console.log("Error getting token:", error);
  }
};