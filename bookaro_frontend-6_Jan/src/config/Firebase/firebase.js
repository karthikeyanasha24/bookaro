import { initializeApp } from 'firebase/app';
import 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCxP-1mxTQ00C4-BOqTx_oZ2sp6mV1ATY0",
  authDomain: "bookaroo-20f40.firebaseapp.com",
  projectId: "bookaroo-20f40",
  storageBucket: "bookaroo-20f40.firebasestorage.app",
  messagingSenderId: "264617751697",
  appId: "1:264617751697:web:290fd8fc06cca361dc3b30",
  measurementId: "G-HZWPPX3SDR"
};

export const firebaseApp = initializeApp(firebaseConfig);