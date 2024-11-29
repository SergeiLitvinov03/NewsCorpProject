import { dbConnection } from "./connection.js";

export class Order {
    constructor(order_id = null, customer_id, area_id, newspaper_id, delivery_date, status) {
        this.customer_id = this.validateCustomerId(customer_id);
        this.area_id = this.validateAreaId(area_id);
        this.newspaper_id = this.validateNewspaperId(newspaper_id);
        this.delivery_date = this.validateDeliveryDate(delivery_date);
        this.status = this.validateStatus(status);

        return new Promise((resolve, reject) => {
            if (order_id) {
                this.order_id = order_id;
                resolve(this);
            } else {
                let connection = dbConnection();
                const query = 'SELECT MAX(order_id) AS current_id FROM orders';
                connection.query(query, (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        const id = results[0].current_id || 0;
                        this.order_id = id + 1;
                        resolve(this);
                    }
                    connection.end();
                });
            }
        });
    }

    validateCustomerId(customer_id) {
        if (typeof customer_id !== 'number' || customer_id <= 0) {
            throw new Error('Invalid customer_id. It must be a positive integer.');
        }
        return customer_id;
    }

    validateAreaId(area_id) {
        if (typeof area_id !== 'number' || area_id <= 0) {
            throw new Error('Invalid area_id. It must be a positive integer.');
        }
        return area_id;
    }

    validateNewspaperId(newspaper_id) {
        if (typeof newspaper_id !== 'number' || newspaper_id <= 0) {
            throw new Error('Invalid newspaper_id. It must be a positive integer.');
        }
        return newspaper_id;
    }

    validateDeliveryDate(delivery_date) {
        const date = new Date(delivery_date);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid delivery date');
        }
        return delivery_date;
    }

    validateStatus(status) {
        const validStatuses = ['pending', 'delivered', 'missed', 'canceled'];
        if (!validStatuses.includes(status)) {
            throw new Error('Invalid order status. Valid statuses are: "pending", "delivered", "missed", "canceled".');
        }
        return status;

    }
}
