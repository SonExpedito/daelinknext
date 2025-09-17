import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, } from "firebase/auth";
import { getStorage} from "firebase/storage";
import { getFirestore } from "firebase/firestore";
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

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app)


auth.useDeviceLanguage();

export { auth, db, storage };