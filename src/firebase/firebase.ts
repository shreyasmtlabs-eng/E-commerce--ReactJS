import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDabOx4aG3S-2TFaMokIZaeTO0Qlj4QOSk",
  authDomain: "ecommerce-c9d81.firebaseapp.com",
  projectId: "ecommerce-c9d81",
  storageBucket: "ecommerce-c9d81.firebasestorage.app",
  messagingSenderId: "882809795305",
  appId: "1:882809795305:web:c47fff1e6fd1f56c117678",
  measurementId: "G-TRHBZQGJYV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
export { analytics };
export default app;
