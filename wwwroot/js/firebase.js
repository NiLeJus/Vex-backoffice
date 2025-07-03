// firebase.js (module ES6 unique)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.8.0/firebase-app.js';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    isSignInWithEmailLink,
    signInWithEmailLink
} from "https://www.gstatic.com/firebasejs/11.8.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    query,
    where,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/11.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCXUsrkU-r5dZC1NrrHAso7t2Qpui8eaNE",
    authDomain: "vex-app-66702.firebaseapp.com",
    projectId: "vex-app-66702",
    storageBucket: "vex-app-66702.appspot.com",
    messagingSenderId: "265736686012",
    appId: "1:265736686012:web:8c01094cdfee7a155a03b9",
    measurementId: "G-84MV4N7N3L"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


const adminsCol = collection(db, "admins");
const postsCol = collection(db, "posts");

window.firestoreDoc = doc;
window.firestoreDeleteDoc = deleteDoc;

window.firebaseLogin = async function  (email, password)  {
    try {
        const q = query(adminsCol, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) throw new Error("Accès non autorisé");
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const adminData = querySnapshot.docs[0].data();
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("isSuper", adminData.isSuper);
        return { success: true, data: adminData };
    } catch (error) {
        console.error("Erreur firebaseLogin:", error);
        return { success: false, error: error.message };
    }

};

window.firebaseLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userUid");
    localStorage.removeItem("isSuper");
};

window.firebaseSignUp = async (email, password) => {
    try {
        const q = query(adminsCol, where("email", "==", email.trim().toLowerCase()));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) throw new Error("Not admin");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return "Inscription réussie ! Vérifiez vos e-mails pour valider votre compte.";
    } catch (error) {
        throw new Error(error.message);
    }
};

window.isEmailAdmin = async (email) => {
    const q = query(adminsCol, where("email", "==", email.trim().toLowerCase()));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
};

window.getAdmins = async () => {
    const q = query(adminsCol);
    const querySnapshot = await getDocs(q);

    let admins = [];
    querySnapshot.forEach((doc) => {
        admins.push({ id: doc.id, ...doc.data() });
    });

    return admins; 
};

window.getAdminByEmail = async function (email) {
    const querySnapshot = await adminsCol.where("email", "==", email.trim().toLowerCase()).limit(1).get();

    if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];


        return { id: doc.id, ...doc.data() };
    } else {
        return null; 
    }
};

window.registerNewAdmin = async function (email) {
    if (!email) {
        return { success: false, error: "Email manquant." };
    }

    const alreadyExists = await window.isEmailAdmin(email);
    if (!alreadyExists) {
        try {
            await addDoc(collection(db, "admins"), {
                email: email.trim().toLowerCase(),
                isCreated: false,
                isSuper: false
            });
            return { success: true };
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'admin:", error);
            return { success: false, error: error.message };
        }
    } else {
        return { success: false, error: "Cet email est déjà admin." };
    }
};

window.deleteAdminById = async function (adminId) {
    try {
        const adminDocRef = doc(db, "admins", adminId);
        await deleteDoc(adminDocRef);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

window.getPosts = async function () {
    const querySnapshot = await getDocs(postsCol);

    const posts = [];
    querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
    });

    return posts;
}

window.addPost = async function (post) {
    try {
        await addDoc(collection(db, "posts"), post);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}