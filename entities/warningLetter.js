import { dbConnection } from "./connection.js";

export class WarningLetter {
    constructor(customer_id, warning_date, status, message, letter_id = null) {
        this.customer_id = this.validateCustomerId(customer_id);
        this.warning_date = this.validateDate(warning_date);
        this.status = this.validateStatus(status);
        this.message = this.validateMessage(message);

        return new Promise((resolve, reject) => {
            if (letter_id) {
                this.letter_id = letter_id;
                resolve(this);
            } else {
                let connection = dbConnection();
                const query = 'SELECT MAX(letter_id) AS current_id FROM warning_letters';
                connection.query(query, (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        const id = results[0].current_id || 0;
                        this.letter_id = id + 1;
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

    validateDate(date) {
        const parsedDate = new Date(date);
        if (parsedDate.toString() === "Invalid Date") {
            throw new Error('Invalid warning date');
        }

        return date;
    }


    validateStatus(status) {
        const validStatuses = ['warning', 'suspension'];
        if (!validStatuses.includes(status)) {
            throw new Error('Invalid warning letter status. Valid statuses are "warning" or "suspension".');
        }
        return status;
    }

    validateMessage(message) {
        if (typeof message !== 'string' || message.trim() === '') {
            throw new Error('Message must be a non-empty string.');
        }
        return message;
    }
}
