import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";


const config = require("./config/firebase.json");

try {
  firebase.initializeApp(config);
} catch (error) {
  console.log("app already initialized");
}

export const auth = firebase.auth;
export const db = firebase.firestore();
export const EXPENSES_COLLECTION = "expenses";
export const CATEGORIES_COLLECTION = "categories";
export const CATEGORY_GROUPS_COLLECTION = "category_groups";

export function signInWithGoogle() {
  const provider = new auth.GoogleAuthProvider();
  return auth().signInWithPopup(provider);
}

export function logOut() {
  return auth().signOut();
}

export async function createRecord(collection, data) {
  const docRef = db.collection(collection);
  docRef.add(addTimestampProp(data));
}

function addTimestampProp(data) {
  return {
    'timestamp': firebase.firestore.FieldValue.serverTimestamp(),
    ...data,
  };
}

export async function updateRecord(collection, id, data) {
  const docRef = db.collection(collection).doc(id);
  docRef.set(addTimestampProp(data));
}

export async function deleteRecord(collection, id) {
  const docRef = db.collection(collection).doc(id);
  docRef.delete();
}

export async function deleteAllExpenses() {
  const expensesSnapshot = await db.collection(EXPENSES_COLLECTION).get();
  const deletions = [];
  expensesSnapshot.forEach((expense) => {
    const docRef = db.collection(EXPENSES_COLLECTION).doc(expense.id);
    deletions.push(docRef.delete());
  });

  return Promise.all(deletions);
}