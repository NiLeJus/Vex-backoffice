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
