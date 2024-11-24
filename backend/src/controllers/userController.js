const userModel = require('../models/user');
const admin = require('../config/firebaseConfig').admin;
const db = require('../config/firebaseConfig').db;

const signUp = async(req, res) => {
    try {
        const { email, password, name, phoneNumber, birthDate, photoURL, time_created } = req.body;
        const user = await admin.auth().createUser({
            email,
            password,
        });

        const newUser = new userModel(user.uid, name, email, phoneNumber, birthDate, photoURL, time_created);

        await db.collection('users').doc(user.uid).set(newUser.toObject());

        res.status(201).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getUser = async(req, res) => {
    try {
        const uid = req.user.uid;
        const user = await db.collection('users').doc(uid).get();
        if (!user.exists) {
            res.status(404).send('User not found');
        } else {
            res.status(200).json(user.data());
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const updateAddress = async(req, res) => {
    try {
        const uid = req.user.uid;
        const { newAddress } = req.body;

        const userDoc = await db.collection('users').doc(uid).get();
        const currentAddresses = userDoc.data().addresses || [];

        const updatedAddresses = [...currentAddresses, ...newAddress];

        await db.collection('users').doc(uid).update({ addresses: updatedAddresses });

        res.status(200).send('Addresses updated');
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

const updateUser = async(req, res) => {
    try {
        const uid = req.user.uid;
        const { name, phoneNumber, birthDate, photoURL } = req.body;

        const userDoc = await db.collection('users').doc(uid).get();
        const user = userDoc.data();

        const updatedUser = {
            name: name || user.name,
            phoneNumber: phoneNumber || user.phoneNumber,
            birthDate: birthDate || user.birthDate,
            photoURL: photoURL || user.photoURL
        }

        await db.collection('users').doc(uid).update(updatedUser);

        res.status(200).send('User updated');
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const deleteUser = async(req, res) => {
    try {
        const uid = req.user.uid;
        await db.collection('users').doc(uid).delete();
        await admin.auth().deleteUser(uid);
        res.status(200).send('User deleted');
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    signUp, getUser, updateAddress, updateUser, deleteUser
}