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
const addPayment = async (req, res) => {
    try {
        const uid = req.user?.uid;
        if (!uid) {
            return res.status(400).send("User ID is required");
        }

        const { payment } = req.body;
        if (!payment) {
            return res.status(400).send("Payment is required");
        }

        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            return res.status(404).send("User not found");
        }

        const currentPayments = userDoc.data().payments || [];
        const updatedPayments = [...currentPayments, payment];

        await db.collection('users').doc(uid).update({ payments: updatedPayments });

        res.status(200).send('Payment added');
    } catch (error) {
        console.error("Error adding payment:", error);
        res.status(500).send(error.message);
    }
};
const deleteAddress = async (req, res) => {
    try {
        const uid = req.user.uid; // Lấy UID của user từ middleware xác thực
        const { id } = req.params; // Lấy addressId từ tham số URL

        const userDoc = await db.collection('users').doc(uid).get();
        const currentAddresses = userDoc.data().addresses || [];

        // Lọc bỏ địa chỉ có addressId tương ứng
        const updatedAddresses = currentAddresses.filter(item => item.address !== id);

        // Cập nhật tài liệu người dùng với danh sách địa chỉ đã lọc
        await db.collection('users').doc(uid).update({ addresses: updatedAddresses });

        res.status(200).send('Address deleted successfully');
    } catch (error) {
        res.status(500).send(`Error deleting address: ${error.message}`);
    }
};

const addCart = async (req, res) => {
    try {
        const uid = req.user?.uid;
        if (!uid) {
            return res.status(400).send("User ID is required");
        }

        const { item_id, quantity } = req.body;
        if (!item_id || !quantity) {
            return res.status(400).send("Item data is required");
        }

        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            return res.status(404).send("User not found");
        }

        const currentCart = userDoc.data().cart || [];
        const existingItemIndex = currentCart.findIndex(cartItem => cartItem.item_id === item_id);

        if (existingItemIndex !== -1) {
            // Nếu sản phẩm đã có trong giỏ hàng, cộng thêm số lượng
            currentCart[existingItemIndex].quantity += quantity;
        } else {
            // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
            currentCart.push({ item_id, quantity });
        }

        await db.collection('users').doc(uid).update({ cart: currentCart });

        res.status(200).send('Item added to cart');
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).send(error.message);
    }

   


  
};

const clearCart = async (req, res) => {
    try {
        const uid = req.user?.uid;
        if (!uid) {
            return res.status(400).send("User ID is required");
        }

        await db.collection('users').doc(uid).update({ cart: [] });

        res.status(200).send('Cart cleared');
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).send(error.message);
    }
};

const deleteCartItem = async (req, res) => {
    try {
        const uid = req.user?.uid;
        const item_id = req.params.item_id;

        if (!uid) {
            return res.status(400).send("User ID is required");
        }

        if (!item_id) {
            return res.status(400).send("Item ID is required");
        }

        const userDoc = await db.collection('users').doc(uid).get();
        const userData = userDoc.data();

        if (!userData || !userData.cart) {
            return res.status(404).send("Cart not found");
        }

        const updatedCart = userData.cart.filter(item => item.item_id !== parseInt(item_id));

        await db.collection('users').doc(uid).update({ cart: updatedCart });

        res.status(200).send('Item removed from cart');
    } catch (error) {
        console.error("Error deleting cart item:", error);
        res.status(500).send(error.message);
    }
};




module.exports = {
    signUp, getUser, updateAddress, updateUser, addPayment, deleteAddress, addCart, clearCart, deleteCartItem
}