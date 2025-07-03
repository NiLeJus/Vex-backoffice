window.deleteAdminById = async function (adminId) {
    try {
        await firebase.firestore().collection("admins").doc(adminId).delete();
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};