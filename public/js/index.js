// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getDatabase, onValue, ref, set, push } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { getStorage, getDownloadURL, ref as refStorage, uploadBytes } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js"
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-messaging.js"

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
const messaging = getMessaging(app)
const db = getDatabase()
const storage = getStorage()
// const songsRef = ref(db, 'songs/')
// onValue(songsRef, (snapshot) => {
//     const data = snapshot.val()
//     console.log(data)
// })

if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('Service Worker registered:', registration)
            Notification.requestPermission().then((permission) => {
                if (permission == "granted"){
                    console.log("Notification permission granted")
                    getToken(messaging, {vapidKey: "BNUMGY8F649872dpuSp9FsKLY1AJD-54HbDxaeT_MSs5xmoO_V34ubSlBq4eosugHbMAMSi5Doj208RGBuCEqyo"}).then((token) => {
                        console.log('FCM registration token:', token)
                    })
                } else {
                    console.log("Notification permission failed")
                }
            })
        })
        .catch(err => console.log('Service worker not registered:', err));
}

// messaging.onMessage((payload) => {
//     console.log("Message received:", payload)
//     const { title, ...options } = payload.notification
// })

// messaging.setBackgroundMessageHandler(payload => {
//     const notification = JSON.parse(payload.data.notification);
//     const notificationTitle = notification.title;
//     const notificationOptions = {
//         body: notification.body
//     };
//     return self.registration.showNotification(
//         notificationTitle,
//         notificationOptions
//     );
// });
  

const songList = document.getElementById("all-songs")
function renderSong(id, data) {
    console.log(id, data)
    const html = `
        <div class="card-panel song row" data-id="${id}">
            <div class="song-title">${data.title} by ${data.artist}</div>
            <audio controls>
                <source src=${data.url} type="audio/mpeg">
            </audio>
        </div>
    `;
    songList.innerHTML += html;
};

async function getSongs() {
    const db = getDatabase();
    const songsRef = ref(db, 'songs/');
    let songs = []
    await onValue(songsRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();
            renderSong(childKey, childData)
            songs.push([childKey, childData])
        });
    });
    // console.log(songs)
    return songs
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

    getToken(messaging, {vapidKey: "BNUMGY8F649872dpuSp9FsKLY1AJD-54HbDxaeT_MSs5xmoO_V34ubSlBq4eosugHbMAMSi5Doj208RGBuCEqyo"})
        .then((currentToken) => {
            if (currentToken) {
                messaging.send({
                    token: currentToken,
                    notification: {
                        title: "Alerta de temón!! :o",
                        body: `Ven a escuchar ${title} de ${artist}!`,
                    }
                }).then(() => {
                    console.log("Push notification sent successfully")
                }).catch((error) => {
                    console.log('Error sending push notification:', error)
                })
            } else {
                console.log('No registration token available')
            }
        })

    // const notificationPromise = Notification.requestPermission((permission) => {
    //     if (permission == "granted") {
    //         getToken(messaging, {vapidKey: "BNUMGY8F649872dpuSp9FsKLY1AJD-54HbDxaeT_MSs5xmoO_V34ubSlBq4eosugHbMAMSi5Doj208RGBuCEqyo"})
    //     }
    // }).then((token) => {
    //     const payload = {
    //         notification: {
    //             title: "Alerta de temón!! :o",
    //             body: `Ven a escuchar ${title} de ${artist}!`,
    //         }
    //     }
    //     return messaging.send()
    // })

    songList.innerHTML = ""
    await getSongs()
}

// const button = document.getElementById("get-songs")
// button.addEventListener("click", event => {
//     console.log("Obteniendo canciones...")
//     getSongs()
// })

const form = document.querySelector('form');
form.addEventListener('submit', evt => {
    evt.preventDefault();
    console.log("Subiendo canción...")
    addSong(form.title.value, form.artist.value, form.audioFile.files[0])
});

window.addEventListener('load', async () => {
    songList.innerHTML = ""
    await getSongs()
})

