import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBUuDUFPB9W6DBGX80bTYntIACegAdb5Uo",
  authDomain: "uttility.firebaseapp.com",
  projectId: "uttility",
  storageBucket: "uttility.appspot.com",
  messagingSenderId: "566211943215",
  appId: "1:566211943215:web:4f8b4c68796dda1f875fda",
  measurementId: "G-5Z4F38JWGV",
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
