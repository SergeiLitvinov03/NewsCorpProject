
import { dbConnection } from "./connection.js";

export class Invoice {
    constructor(invoice_id = null, customer_id, invoice_date, due_date, total_amount, payment_status, details) {
        this.customer_id = this.validateCustomerId(customer_id);
        this.invoice_date = this.validateDate(invoice_date);
        this.due_date = this.validateDate(due_date);
        this.total_amount = this.validateTotalAmount(total_amount);
        this.payment_status = this.validatePaymentStatus(payment_status);
        this.details = this.validateDetails(details);

        return new Promise(async (resolve, reject) => {
            try {
                if (!invoice_id) {
                    let connection = dbConnection();
                    const query = 'SELECT MAX(invoice_id) AS current_id FROM invoices';
                    connection.query(query, (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            const id = results[0].current_id || 0;
                            this.invoice_id = id + 1;
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

    validateDate(date) {
        const parsedDate = new Date(date).getTime();
        if (isNaN(parsedDate)) {
            throw new Error('Invalid date format');
        }
        return date;
    }

    validatePaymentStatus(payment_status) {
        const validStatuses = ['paid', 'unpaid', 'late'];
        if (!validStatuses.includes(payment_status)) {
            throw new Error('Invalid payment status. Must be "paid", "unpaid", or "late".');
        }
        return payment_status;
    }

    validateTotalAmount(total_amount) {
        if (typeof total_amount !== 'number' || total_amount <= 0) {
            throw new Error('Total amount must be a positive number');
        }
        return total_amount;
    }

    validateCustomerId(customer_id) {
        if (typeof customer_id !== 'number' || customer_id <= 0) {
            throw new Error('Invalid customer ID. It must be a positive number.');
        }
        return customer_id;
    }

    validateDetails(details) {
        if (!Array.isArray(details)) {
            throw new Error('Details must be an array');
        }
        if (details.length > 0 && !details.every(item => item && typeof item === 'object' && Object.keys(item).length > 0)) {
            throw new Error('Each item in details must be a non-empty object');
        }
        return details;
    }
}

