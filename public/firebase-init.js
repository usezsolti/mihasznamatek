window.__FIREBASE_CONFIG__ = {
    apiKey: "AIzaSyD1gvtJjjod5J3oJUI-iBPnR6yzU-AldtI",
    authDomain: "mihasznamatek-c9701.firebaseapp.com",
    projectId: "mihasznamatek-c9701",
    storageBucket: "mihasznamatek-c9701.appspot.com",
    messagingSenderId: "385597107359",
    appId: "1:385597107359:web:905725ba30245ef75c06aa",
    measurementId: "G-PCZM48WSFH"
};

// Firebase inicializálás függvény
function initializeFirebase() {
    if (window.firebase && !window.firebase.apps.length) {
        try {
            window.firebase.initializeApp(window.__FIREBASE_CONFIG__);
            console.log('Firebase sikeresen inicializálva');
        } catch (error) {
            console.error('Firebase inicializálási hiba:', error);
        }
    }
}

// Várjuk meg, hogy a Firebase SDK-k betöltődjenek
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFirebase);
} else {
    // Ha már betöltődött, próbáljuk meg inicializálni
    initializeFirebase();
}

// Fallback: ha még mindig nincs Firebase, próbáljuk meg később
setTimeout(() => {
    if (!window.firebase || !window.firebase.apps.length) {
        initializeFirebase();
    }
}, 1000);






