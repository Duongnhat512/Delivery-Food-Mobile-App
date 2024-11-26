const firebaseConfig = require('../config/firebaseConfig');
const db = firebaseConfig.db;
const admin = firebaseConfig.admin;

const getOrderDetailsTheoCustomerVaStatus = async (req, res) => {
    try {
        const customer_id = req.user.uid;
        const status = req.query.status;
        const limit = parseInt(req.query.limit) || 10;
        const startAfter = req.query.startAfter || '';

        let query = db.collection('orders')
            .where('customer_id', '==', customer_id)
            .orderBy('created_at', 'desc')
            .limit(limit);
        
        if (startAfter) {
            const startAfterDoc = await db.collection('orders').doc(startAfter).get();
            query = query.startAfter(startAfterDoc);
        }

        const snapshot = await query.get();
        const orderDetails = [];
        snapshot.forEach(doc => {
            const order = doc.data();
            const filteredOrderDetails = order.order_details.filter(detail => detail.status === status);
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

const updateStatusOrderDetail = async (req, res) => {
    try{
        const order_id = req.params.order_id;
        const item_id = req.params.item_id;
        const status = req.body.status;
        const orderRef = db.collection('orders').doc(order_id);
        const order = await orderRef.get();
        if (!order.exists) {
            res.status(404).send('Order not found');
            return;
        }
        const orderData = order.data();
        const orderDetails = orderData.order_details;
        const itemIndex = orderDetails.findIndex(item => item.id === item_id);
        if (itemIndex === -1) {
            res.status(404).send('Item not found');
            return;
        }
        orderDetails[itemIndex].status = status;
        await orderRef.update({
            order_details: orderDetails
        });
        res.status(200).send('Updated');
    }catch(error){
        res.status(500).send(error.message);
    }
}

module.exports = {
    updateStatusOrderDetail,
    getOrderDetailsTheoCustomerVaStatus
}
