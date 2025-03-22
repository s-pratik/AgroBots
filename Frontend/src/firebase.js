import { initializeApp, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCxv3SQYSeOKpWr4zptTWpaI89a4QRdq_s",
  authDomain: "soilmoisture-3abe7.firebaseapp.com",
  databaseURL: "https://soilmoisture-3abe7-default-rtdb.firebaseio.com",
  projectId: "soilmoisture-3abe7",
  storageBucket: "soilmoisture-3abe7.firebasestorage.app",
  messagingSenderId: "413335580678",
  appId: "1:413335580678:web:41e4b495717d2ea8d31387",
  measurementId: "G-W47J2XV3WR",
};

// Initialize Firebase only if it hasn't been initialized already
let app;
try {
  app = getApp(); // Get the default app if it already exists
} catch (error) {
  app = initializeApp(firebaseConfig); // Initialize the app if it doesn't exist
}

const db = getDatabase(app);

console.log("Firebase initialized");

export { db };