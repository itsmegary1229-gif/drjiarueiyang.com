/* ============================================
   Firebase 設定檔
   檔案位置：assets/js/firebase-config.js
   ============================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB9H8rJcK-OlUXopY75L9QAa5MeQ23e8mU",
  authDomain: "dr-yang-website.firebaseapp.com",
  projectId: "dr-yang-website",
  storageBucket: "dr-yang-website.firebasestorage.app",
  messagingSenderId: "893181464873",
  appId: "1:893181464873:web:26648455b6809722316738"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
