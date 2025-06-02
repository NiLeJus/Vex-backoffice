import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.8.0/firebase-app.js'
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.8.0/firebase-firestore.js";



// Mets ici ta config Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCXUsrkU-r5dZC1NrrHAso7t2Qpui8eaNE",
    authDomain: "vex-app-66702.firebaseapp.com",
    projectId: "vex-app-66702",
    storageBucket: "vex-app-66702.appspot.com",
    messagingSenderId: "265736686012",
    appId: "1:265736686012:web:8c01094cdfee7a155a03b9",
    measurementId: "G-84MV4N7N3L"
};

// Initialisation (évite de ré-initialiser si déjà fait)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.firebaseLogin = async function (email, password) {
    try {
        console.log("Admin Login", email);
        const db = getFirestore();
        const adminsRef = collection(db, "admins");
        const q = query(adminsRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.warn("No admin found", email);
            return { success: false, error: "Cet email n'est pas autorisé à se connecter (pas admin)." };
        }

        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Auth succeed for ", user.uid);
        
        // Firestore Admin > document
        const adminData = querySnapshot.docs[0].data();
        console.log("Data from Firestore:", adminData);

        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userUid", user.uid);
        localStorage.setItem("isSuper", adminData.isSuper);

        return { success: true, data: adminData };

    } catch (error) {
        console.error("Erreur dans firebaseLogin:", error);
        return { success: false, error: error && error.message ? error.message : JSON.stringify(error) || "Erreur inconnue" };
    }
};


window.firebaseLogout = function () {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userUid");
    localStorage.removeItem("isSuper");

}

import { getAuth, sendSignInLinkToEmail } from "firebase/auth";

const auth = getAuth();
const email = "utilisateur@example.com"; // récupéré depuis un formulaire

const actionCodeSettings = {
    url: 'https://ton-app.com/finishSignUp', 
    handleCodeInApp: true
};

sendSignInLinkToEmail(auth, email, actionCodeSettings)
    .then(() => {
        window.localStorage.setItem('emailForSignIn', email);
    })
    .catch((error) => {
        console.error(error);
    });

import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

const auth = getAuth();

if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
        // Affiche le formulaire
        document.getElementById('email-signin-container').style.display = 'block';

        document.getElementById('email-signin-form').addEventListener('submit', function (e) {
            e.preventDefault();
            email = document.getElementById('email').value;

            signInWithEmailLink(auth, email, window.location.href)
                .then((result) => {
                    window.localStorage.removeItem('emailForSignIn');
                    // Redirige, affiche un message, etc.
                    alert("Connexion réussie !");
                    window.location.href = "/"; // par exemple
                })
                .catch((error) => {
                    document.getElementById('email-error').textContent = error.message;
                });
        });
    } 
    throw new Error("Lien de connexion invalide.");

}

import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "https://www.gstatic.com/firebasejs/11.8.0/firebase-auth.js";

window.signInWithEmailLinkBlazor = async function (email, url) {
    const auth = getAuth();



    if (isSignInWithEmailLink(auth, url)) {
        try {
            await signInWithEmailLink(auth, email, url);
            window.localStorage.removeItem('emailForSignIn');
            return true;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    throw new Error("Lien de connexion invalide.");
}
