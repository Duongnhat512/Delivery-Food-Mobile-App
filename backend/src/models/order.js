class Order {
    constructor(customer_id, status, total, total_delivery_fee, created_at, updated_at) {
        this.customer_id = customer_id;
        this.status = status;
        this.total = total;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.total_delivery_fee = total_delivery_fee;
    }

    toFirestore() {
        return {
            customer_id: this.customer_id,
            status: this.status,
            total: this.total,
            created_at: this.created_at,
            updated_at: this.updated_at,
            total_delivery_fee: this.total_delivery_fee,
        }
    }

    static fromFirestore(snapshot) {
        const data = snapshot.data();
        return new Order(data.customer_id, data.status, data.total, data.created_at, data.updated_at, data.total_delivery_fee);
    }
}

module.exports = Order;