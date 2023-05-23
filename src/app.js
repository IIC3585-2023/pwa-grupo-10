// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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

const apiKey = "nWprVPSy88c4Z5TpiDWrwSF7vmVlS3ry"

async function fetchTrending() {
    const res = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=25`);
    const json = await res.json();

    console.log(json.data)
    const container = document.getElementsByClassName("container")
    console.log("aaaaaaaaaaaa", container)
    let output = ""
    json.data.forEach(({id}) => {
        output += `<img id=${id} alt=${id} src=https://i.giphy.com/media/${id}/giphy.webp /><br />`
    })
    container[0].innerHTML = output
}

window.addEventListener('load', async e => {
    await fetchTrending();

    if ('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.register('serviceWorker.js');
            console.log('SW registered');

        } catch (error) {
            console.log('SW failed');

        }
    }
});
