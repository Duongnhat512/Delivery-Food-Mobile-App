const express = require('express');
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const serviceAccount = require('./serviceAccountKey.json');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
});

const db = admin.firestore();

app.use(express.json());


const authenticate = async (req, res, next) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).send('Unauthorized');
    }
};

app.use(authenticate);

app.get('/menu_items', async (req, res) => {
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
});

app.post('/menu_items', authenticate, async (req, res) => {
    try {
        const menuItem = req.body;
        await db.collection('menu_items').add(menuItem);
        res.status(201).send('Menu item added');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/restaurants', authenticate, async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const startAfter = req.query.startAfter || '';

    try {
        let query = db.collection('restaurants').orderBy('name').limit(limit);

        if (startAfter) {
            const startAfterDoc = await db.collection('restaurants').doc(startAfter).get();
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
});

app.post('/restaurants', authenticate, async (req, res) => {
    try {
        const restaurant = req.body;
        await db.collection('restaurants').add(restaurant);
        res.status(201).send('Restaurant added');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server running at ${port}/`);
});