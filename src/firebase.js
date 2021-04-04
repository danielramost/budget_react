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
export const expensesCollection = "expenses";

export function signInWithGoogle() {
  const provider = new auth.GoogleAuthProvider();
  return auth().signInWithPopup(provider);
}

export function logout() {
  return auth().signOut();
}

function formatDataForDatabase(data) {
  return {
    'timestamp': firebase.firestore.FieldValue.serverTimestamp(),
    ...data,
    'value': parseInt(data.value),
    'date': data.date,
  };
}

export async function createExpense(data) {
  const docRef = db.collection(expensesCollection);
  docRef.add(formatDataForDatabase(data));
}

export async function updateExpense(id, data) {
  const docRef = db.collection(expensesCollection).doc(id);
  docRef.set(formatDataForDatabase(data));
}

export async function deleteExpense(id) {
  const docRef = db.collection(expensesCollection).doc(id);
  docRef.delete();
}

export async function deleteAllExpenses() {
  const expensesSnapshot = await db.collection(expensesCollection).get();
  const deletions = [];
  expensesSnapshot.forEach((expense) => {
    const docRef = db.collection(expensesCollection).doc(expense.id);
    deletions.push(docRef.delete());
  });

  return Promise.all(deletions);
}