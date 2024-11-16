const firebaseConfig = require('../config/firebaseConfig');
const db = firebaseConfig.db;
const admin = firebaseConfig.admin;

const getMenuItems = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const startAfter = req.query.startAfter || '';

    try {
        let query = db.collection('menu_items').orderBy('name').limit(limit);

        if (startAfter) {
            const startAfterDoc = await db.collection('menu_items').doc(startAfter).get();
            query = query.startAfter(startAfterDoc);
        }

        const restaurantsSnapshot = await query.get();
        const restaurants = restaurantsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(restaurants);

    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getAnVat = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const startAfter = req.query.startAfter || '';

    try {
        let query = db.collection('menu_items').where('category', '==', 'Ăn vặt').orderBy('name').limit(limit);

        if (startAfter) {
            const startAfterDoc = await db.collection('menu_items').doc(startAfter).get();
            query = query.startAfter(startAfterDoc);
        }

        const restaurantsSnapshot = await query.get();
        const restaurants = restaurantsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(restaurants);

    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getAnChinh = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const startAfter = req.query.startAfter || '';

    try {
        let query = db.collection('menu_items').where('category', '==', 'Ăn chính').orderBy('name').limit(limit);

        if (startAfter) {
            const startAfterDoc = await db.collection('menu_items').doc(startAfter).get();
            query = query.startAfter(startAfterDoc);
        }

        const restaurantsSnapshot = await query.get();
        const restaurants = restaurantsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(restaurants);

    } catch (error) {
        res.status(500).send(error.message);
    }
}


module.exports = {
    getMenuItems, getAnVat, getAnChinh
};