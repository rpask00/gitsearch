import {initializeApp} from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDJs2OptCujgK5iv5zDp0qrUp9t5aL-6A8",
    authDomain: "gitsearch-af954.firebaseapp.com",
    projectId: "gitsearch-af954",
    storageBucket: "gitsearch-af954.appspot.com",
    messagingSenderId: "629146107950",
    appId: "1:629146107950:web:0177941c2406640b5a9fbf",
    measurementId: "G-1TLLWZTZHF"
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();

export { auth, provider };
