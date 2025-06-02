import { getAuth, sendSignInLinkToEmail } from "firebase/auth";

const auth = getAuth();

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
