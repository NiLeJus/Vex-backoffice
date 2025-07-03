
//----------------------- Sign Up

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.8.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);

window.firebaseSignUp = async (email, password) => {
    const auth = getAuth(app);
    const adminsRef = collection(db, "admins");

    if (isUserAdmin(email)) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Verification Mail
            //await userCredential.user.sendEmailVerification();

            return "Inscription réussie ! Vérifiez vos e-mails pour valider votre compte.";
        } catch (error) {
      
            throw new Error(error.message);
        }
    } else {
        throw new Error("Not admin")
    }

   
};

//----------------------- Sign Up



