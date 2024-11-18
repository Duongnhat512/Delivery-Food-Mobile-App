class OrderDetail {
    constructor(item_id, quantity, delivery_fee, status, total, estimated_delivery_time) {
        this.item_id = item_id;
        this.quantity = quantity;
        this.delivery_fee = delivery_fee;
        this.status = status;
        this.total = total;
        this.estimated_delivery_time = estimated_delivery_time;
    }

    toFirestore() {
        return {
            item_id: this.item_id,
            quantity: this.quantity,
            delivery_fee: this.delivery_fee,
            status: this.status,
            total: this.total_price,
            estimated_delivery_time: this.estimated_delivery_time
        }
    }

    static fromFirestore(snapshot) {
        const data = snapshot.data();
        return new OrderDetail(data.quantity, data.delivery_fee, data.status, data.estimated_delivery_time);
    }
        
}

module.exports = OrderDetail;