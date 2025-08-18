// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// ADIÇÃO: imports para garantir singleton e evitar erro "No Firebase App '[DEFAULT]'"
import { getApps, getApp } from "firebase/app";
import { getAuth, } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5IILYwY8wf75pPI6Wl-1g5SJT0sw86JQ",
  authDomain: "daelink-producao.firebaseapp.com",
  projectId: "daelink-producao",
  storageBucket: "daelink-producao.appspot.com",
  messagingSenderId: "1037795223095",
  appId: "1:1037795223095:web:2b0e82b636a3a7044e01b2"
};

// Initialize Firebase (comentado original e substituído por versão segura com singleton)
// const app = initializeApp(firebaseConfig); // ORIGINAL (mantido para referência)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app)


auth.useDeviceLanguage();

export { auth, db, storage };