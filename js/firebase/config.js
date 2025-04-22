
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

function initFirebase() {
  if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    return firebase.firestore();
  } else {
    console.error('Firebase SDK not loaded');
    return null;
  }
}

function saveFormData(formData) {
  const db = initFirebase();
  if (!db) return Promise.reject('Firebase not initialized');
  
  return db.collection('form_submissions').add({
    ...formData,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(docRef => {
    console.log('Document written with ID: ', docRef.id);
    return docRef.id;
  })
  .catch(error => {
    console.error('Error adding document: ', error);
    throw error;
  });
}
