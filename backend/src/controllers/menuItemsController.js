const firebaseConfig = require('../config/firebaseConfig');
const db = firebaseConfig.db;
const admin = firebaseConfig.admin;

// Get all menu items
const getMenuItems = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const startAfter = req.query.startAfter || '';

    console.log(limit, startAfter);

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

// Get all menu items in category 'Ăn vặt'
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

// Get all menu items in category 'Món chính'
const getAnChinh = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const startAfter = req.query.startAfter || '';

    try {
        let query = db.collection('menu_items').where('category', '==', 'Món chính').orderBy('name').limit(limit);

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

//  Get all menu items in category 'Đồ uống'
const getDoUong = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const startAfter = req.query.startAfter || '';

    try {
        let query = db.collection('menu_items').where('category', '==', 'Đồ uống').orderBy('name').limit(limit);

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

const getTrangMieng = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const startAfter = req.query.startAfter || '';

    try {
        let query = db.collection('menu_items').where('category', '==', 'Tráng miệng').orderBy('name').limit(limit);

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

const getAnChay = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const startAfter = req.query.startAfter || '';

    try {
        let query = db.collection('menu_items').where('category', '==', 'Đồ chay').orderBy('name').limit(limit);

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

// Search menu items by name
const searchMenuItems = async (req, res) => {
    const search = req.query.search || '';
    const startAfter = req.query.startAfter || '';
    const limit = parseInt(req.query.limit) || 10;

    try {
        let query = db.collection('menu_items').orderBy('name');

        if (startAfter) {
            const startAfterDoc = await db.collection('menu_items').doc(startAfter).get();
            query = query.startAfter(startAfterDoc);
        }

        const restaurantsSnapshot = await query.get();
        const searchLower = search.toLowerCase();
        const restaurants = restaurantsSnapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .filter(doc => doc.name.toLowerCase().includes(searchLower));

        res.status(200).json(restaurants);

    } catch (error) {
        res.status(500).send(error.message);
    }
}

// Get menu item by id
const getMenuItemById = async(req, res) => {
    const id = req.query.id;

    try {
        const doc = await db.collection('menu_items').doc(id).get();
        if (!doc.exists) {
            res.status(404).send('Menu item not found');
        } else {
            res.status(200).json(doc.data());
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    getMenuItems, getAnVat, getAnChinh, getDoUong, searchMenuItems, getMenuItemById, getTrangMieng,getAnChay
};