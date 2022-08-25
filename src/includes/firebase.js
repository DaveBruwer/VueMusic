import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCrLnKEsEu4o5SoOkdnxmU2bPx4bTYOdQY',
  authDomain: 'music-38185.firebaseapp.com',
  projectId: 'music-38185',
  storageBucket: 'music-38185.appspot.com',
  messagingSenderId: '593141972725',
  appId: '1:593141972725:web:fb8d55570cd2539933cfbc',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const usersCollection = db.collection('users');
const songsCollection = db.collection('songs');
const commentsCollection = db.collection('comments');

export {
  auth,
  db,
  usersCollection,
  songsCollection,
  storage,
  commentsCollection,
};
