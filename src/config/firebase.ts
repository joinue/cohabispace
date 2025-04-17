import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyClayOD0yilBZZYpRQtjnap-wQxMBr41HM",
    authDomain: "cohabitask.firebaseapp.com",
    projectId: "cohabitask",
    storageBucket: "cohabitask.firebasestorage.app",
    messagingSenderId: "1009943410874",
    appId: "1:1009943410874:web:13ddb9ebf956b560d46a83"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app; 