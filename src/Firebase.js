// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyCW9zMDN8mS3JBzsd_J6K_E9Kau49XGL9o",
  authDomain: "mexicantraindominoes-a867f.firebaseapp.com",
  projectId: "mexicantraindominoes-a867f",
  storageBucket: "mexicantraindominoes-a867f.appspot.com",
  messagingSenderId: "685746480475",
  appId: "1:685746480475:web:03c34842ab41246fb1e67e",
  measurementId: "G-HFZNXDRYFK"
};

// Initialize Firebase
export function Initialize(){
    // eslint-disable-next-line no-unused-vars
    const app = initializeApp(firebaseConfig);
}