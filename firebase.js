// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3GO8PK1LHuoRpdgKBjxPX3wS4j8DVbwQ",
  authDomain: "spotify-grupo10.firebaseapp.com",
  databaseURL: "https://spotify-grupo10-default-rtdb.firebaseio.com",
  projectId: "spotify-grupo10",
  storageBucket: "spotify-grupo10.appspot.com",
  messagingSenderId: "819150563194",
  appId: "1:819150563194:web:cf0dab5a18e3246e8c98c3",
  measurementId: "G-MP20JX80ZX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);