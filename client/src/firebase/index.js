/**
 * Firebase Login
 * Vuely comes with built in firebase login feature
 * You Need To Add Your Firsebase App Account Details Here
 */
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

// Initialize Firebase

const config = {
  apiKey: "AIzaSyC6juMZJXj7FW3tgjlylXb1BhvRrXaIAvY",
  authDomain: "dialer-3d298.firebaseapp.com",
  databaseURL: "https://dialer-3d298.firebaseio.com",
  projectId: "dialer-3d298",
  storageBucket: "dialer-3d298.appspot.com",
  messagingSenderId: "529470970606",
  appId: "1:529470970606:web:a0669ba92a681dbc92b1ff",
  measurementId: "G-043E4F2CX1"
};

firebase.initializeApp(config);

const auth = firebase.auth();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
const githubAuthProvider = new firebase.auth.GithubAuthProvider();
const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();
const database = firebase.database();
const dialerQueueRef = database.ref('dialerQueue');

export {
    auth,
    googleAuthProvider,
    githubAuthProvider,
    facebookAuthProvider,
    twitterAuthProvider,
    database,
    dialerQueueRef
};
