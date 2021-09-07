import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore"


// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKvBP0pCGylUVc_mn24iw67SrIdIZsnTI",
  authDomain: "pintter-96560.firebaseapp.com",
  projectId: "pintter-96560",
  storageBucket: "pintter-96560.appspot.com",
  messagingSenderId: "957056169694",
  appId: "1:957056169694:web:0ee7f4414179445e85f44f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

export default db;
