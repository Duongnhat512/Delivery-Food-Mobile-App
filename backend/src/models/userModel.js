const admin = require('firebase-admin');
const db = admin.firestore();

const getUserById = async () => {
    const userRef = db.collection('users').doc(userId)
    const doc = await userRef.get();

    if(!doc.exists){
        throw new Error('User not found');
    }
    return doc.data();
}

module.exports = {
    getUserById,
}