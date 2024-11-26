const firebaseConfig = require('../config/firebaseConfig');
const { get } = require('../routes/menuItemsRoutes');
const db = firebaseConfig.db;
const admin = firebaseConfig.admin;
const Order = require('../models/order');
const OrderDetail = require('../models/orderDetail');

const addOrder = async (req, res) => {
    try {
        const { customer_id, status, total, total_delivery_fee, created_at, updated_at, order_details } = req.body;

        const orderRef = db.collection('orders').doc();
        const orderId = orderRef.id;

        const order = new Order(customer_id, status, total, created_at, updated_at, total_delivery_fee, order_details)

        await orderRef.set(order.toFirestore());

        res.status(201).json({ id: orderId });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getOrder = async (req, res) => {
    try {
        const orderRef = db.collection('orders');
        const snapshot = await orderRef.get();
        const orders = [];
        snapshot.forEach(doc => {
            orders.push({ id: doc.id, data: doc.data() });
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const updateStatusOrderDetail = async (req, res) => {
    try {
        const order_id = req.params.order_id;
        const item_id = parseInt(req.params.item_id);
        
        const status = req.body.status;
        const reason = req.body.reason;
        const orderRef = db.collection('orders').doc(order_id);
        const order = await orderRef.get();

        if (!order.exists) {
            res.status(404).send('Order not found');
            return;
        }

        const orderData = order.data();
        const orderDetails = orderData.order_details;
        const itemIndex = orderDetails.findIndex(item => item.item_id === item_id);

        if (itemIndex === -1) {
            res.status(404).send('Item not found');
            return;
        }

        orderDetails[itemIndex].status = status;
        orderDetails[itemIndex].reason = reason;

        await orderRef.update({ order_details: orderDetails });

        res.status(200).send('Order updated');
    } catch (error) {
        res.status(500).send(error.message);
    }
}


module.exports = {
    addOrder, getOrder, updateStatusOrderDetail
};