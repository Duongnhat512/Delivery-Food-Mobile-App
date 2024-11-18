const firebaseConfig = require('../config/firebaseConfig');
const db = firebaseConfig.db;
const admin = firebaseConfig.admin;

const getOrderDetailsChuaGiaoTheoCustomer = async (req, res) => {
    try {
        const customer_id = req.user.uid;
        const orderDetailsRef = db.collection('orders');
        const snapshot = await orderDetailsRef
            .where('customer_id', '==', customer_id)
            .get();

        const orderDetails = [];
        snapshot.forEach(doc => {
            const order = doc.data();
            const filteredOrderDetails = order.order_details.filter(detail => detail.status === 'Chưa giao');
            if (filteredOrderDetails.length > 0) {
                orderDetails.push({
                    id: doc.id,
                    ...order,
                    order_details: filteredOrderDetails
                });
            }
        });

        res.status(200).json(orderDetails);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getOrderDetailsDaGiaoTheoCustomer = async (req, res) => {
    try {
        const customer_id = req.user.uid;
        const orderDetailsRef = db.collection('orders');
        const snapshot = await orderDetailsRef
            .where('customer_id', '==', customer_id)
            .get();

        const orderDetails = [];
        snapshot.forEach(doc => {
            const order = doc.data();
            const filteredOrderDetails = order.order_details.filter(detail => detail.status === 'Đã giao');
            if (filteredOrderDetails.length > 0) {
                orderDetails.push({
                    id: doc.id,
                    ...order,
                    order_details: filteredOrderDetails
                });
            }
        });

        res.status(200).json(orderDetails);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getOrderDetailsDangGiaoTheoCustomer = async (req, res) => {
    try {
        const customer_id = req.user.uid;
        const orderDetailsRef = db.collection('orders');
        const snapshot = await orderDetailsRef
            .where('customer_id', '==', customer_id)
            .get();

        const orderDetails = [];
        snapshot.forEach(doc => {
            const order = doc.data();
            const filteredOrderDetails = order.order_details.filter(detail => detail.status === 'Đang giao');
            if (filteredOrderDetails.length > 0) {
                orderDetails.push({
                    id: doc.id,
                    ...order,
                    order_details: filteredOrderDetails
                });
            }
        });

        res.status(200).json(orderDetails);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    getOrderDetailsChuaGiaoTheoCustomer, 
    getOrderDetailsDaGiaoTheoCustomer, 
    getOrderDetailsDangGiaoTheoCustomer
}
