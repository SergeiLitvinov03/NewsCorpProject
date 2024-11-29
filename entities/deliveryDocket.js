import { dbConnection } from "./connection.js";

export class DeliveryDocket {
    constructor(docket_id = null, area_id, delivery_person, orders) {
        this.docket_id = docket_id;
        this.area_id = this.validateAreaId(area_id);
        this.delivery_person = this.validateDeliveryPerson(delivery_person);
        this.orders = orders;

        return new Promise(async (resolve, reject) => {
            try {
                if (!docket_id) {
                    let connection = dbConnection();
                    const query = 'SELECT MAX(docket_id) AS current_id FROM dockets';
                    connection.query(query, (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            const id = results[0].current_id || 0;
                            this.docket_id = id + 1;
                            resolve(this);
                        }
                        connection.end();
                    });
                } else {
                    resolve(this);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    validateAreaId(area_id) {
        const parsedId = parseInt(area_id);
        if (isNaN(parsedId) || parsedId <= 0) {
            throw new Error('Invalid area_id. It must be a positive integer.');
        }
        return parsedId;
    }

    validateDeliveryPerson(delivery_person) {
        if (typeof delivery_person !== 'string' || delivery_person.trim() === '') {
            throw new Error('Invalid delivery_person. It must be a non-empty string.');
        }
        return delivery_person.trim();
    }

    // validateOrders(orders) {
    //     if (!Array.isArray(orders)) {
    //         throw new Error('Orders must be an array');
    //     }
    //
    //     return orders.map(order => {
    //         if (!order.status || !order.customer_id || !order.newspaper_id) {
    //             throw new Error('Each order must have status, customer_id, and newspaper_id');
    //         }
    //
    //         return {
    //             status: order.status,
    //             customer_id: parseInt(order.customer_id),
    //             newspaper_id: parseInt(order.newspaper_id)
    //         };
    //     });
    // }
}
