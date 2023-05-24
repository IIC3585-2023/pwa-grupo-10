// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getDatabase, onValue, ref, set, push } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { getStorage, getDownloadURL, ref as refStorage, uploadBytes } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js"

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
const db = getDatabase()
const storage = getStorage()
// const songsRef = ref(db, 'songs/')
// onValue(songsRef, (snapshot) => {
//     const data = snapshot.val()
//     console.log(data)
// })

function getSongs() {
    const db = getDatabase();
    const songsRef = ref(db, 'songs/');
    console.log(songsRef);
    onValue(songsRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();
            console.log(childKey, childData);
        });
    });
}

function getSong(songId) {
    const db = getDatabase();
    const songsRef = ref(db, 'songs/' + songId);
    onValue(songsRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data);
    });
}

async function addSong(title, artist, audioFile) {
    const storage = getStorage()
    let songsStorageRef = refStorage(storage, `songs/${audioFile.name}`)
    await uploadBytes(songsStorageRef, audioFile).then((snapshot) => {
        console.log('Uploaded audio file')
    })

    songsStorageRef = refStorage(storage, `songs/${audioFile.name}`)
    const audioUrl = await getDownloadURL(songsStorageRef)
    console.log("url",audioUrl)
    
    const db = getDatabase();
    const songsListRef = ref(db, 'songs/');
    const newSongRef = push(songsListRef);

    set(newSongRef, {
        title: title,
        artist: artist,
        url: audioUrl,
    });
}

const button = document.getElementById("get-songs")
button.addEventListener("click", event => {
    console.log("Obteniendo canciones...")
    getSongs()
})

const form = document.querySelector('form');
form.addEventListener('submit', evt => {
    evt.preventDefault();
    console.log(form.title.value, form.artist.value, form.audioFile.files[0])
    console.log("Subiendo canción...")
    addSong(form.title.value, form.artist.value, form.audioFile.files[0])
//   const recipe = {
//     name: form.title.value,
//     ingredients: form.ingredients.value
//   };

//   db.collection('recipes').add(recipe)
//     .catch(err => console.log(err));

//   form.title.value = '';
//   form.ingredients.value = '';
});