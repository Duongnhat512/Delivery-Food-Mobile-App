const firebaseConfig = require('../config/firebaseConfig');
const { get } = require('../routes/menuItemsRoutes');
const db = firebaseConfig.db;
const admin = firebaseConfig.admin;
const Order = require('../models/order');
const OrderDetail = require('../models/orderDetail');

const addOrder = async (req, res) => {
    try {
        const { customer_id, status, total, total_delivery_fee, created_at, updated_at, orderDetails } = req.body;

        const orderRef = db.collection('orders').doc();
        const orderId = orderRef.id;

        const order = new Order(customer_id, status, total, created_at, updated_at, total_delivery_fee);

        await orderRef.set(order.toFirestore());

        for (const detail of orderDetails) {
            const orderDetail = new OrderDetail(
                detail.item_id,
                orderId,
                detail.quantity,
                detail.delivery_fee,
                detail.status,
                detail.estimated_delivery_time
            );
            await db.collection('order_details').add(orderDetail.toFirestore());
        }

        res.status(201).json({ id: orderId });
    } catch (error) {
        res.status(500).send(error.message);
    }
}


module.exports = { 
    addOrder
};