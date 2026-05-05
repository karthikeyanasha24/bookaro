/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCxP-1mxTQ00C4-BOqTx_oZ2sp6mV1ATY0",
  authDomain: "bookaroo-20f40.firebaseapp.com",
  projectId: "bookaroo-20f40",
  storageBucket: "bookaroo-20f40.firebasestorage.app",
  messagingSenderId: "264617751697",
  appId: "1:264617751697:web:290fd8fc06cca361dc3b30",
  measurementId: "G-HZWPPX3SDR"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();