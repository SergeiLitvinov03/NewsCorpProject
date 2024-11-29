import {dbConnection} from "./connection.js";


export class CustomerExceptionHandler extends Error {
    constructor(message) {
        super(message);
        this.name = 'CustomerExceptionHandler';
    }
}

export class Customer {

    // Constructor
    constructor(customer_id = null, custName, custAddr, custPhone, area_id, email, last_payment_date, status) {
        try {
            this.customer_id = customer_id;
            this.name = this.validateName(custName);
            this.address = this.validateAddress(custAddr);
            this.phoneNumber = this.validatePhoneNumber(custPhone);
            this.area_id = this.validateAreaId(area_id);
            this.email = this.validateEmail(email);
            this.last_payment_date = this.validateLastPaymentDate(last_payment_date);
            this.status = this.validateStatus(status);

            return new Promise((resolve, reject) => {
                try {
                    if (!customer_id) {
                        let connection = dbConnection();
                        const query = 'SELECT MAX(customer_id) AS current_id FROM customers';
                        connection.query(query, (err, results) => {
                            if (err) {
                                reject(err);
                            } else {
                                const id = results[0].current_id || 0;
                                this.customer_id = id + 1;
                                resolve(this);
                            }
                            connection.end();
                        });
                    } else {
                        resolve(this);
                    }
                } catch (error) {
                    reject(error);
                }});
        } catch (error) {
            throw new CustomerExceptionHandler(error.message);
        }



    }


    // Validation Methods
    validateName(custName) {
        if (!custName || custName.trim().length === 0 ) {
            throw new CustomerExceptionHandler('Customer Name NOT specified');
        } else if (custName.length < 2) {
            throw new CustomerExceptionHandler('Customer Name does not meet minimum length requirements');
        } else if (custName.length > 50) {
            throw new CustomerExceptionHandler('Customer Name exceeds maximum length requirements');
        }
        return custName
    }

    validateAddress(custAddr) {
        if (!custAddr || custAddr.trim().length === 0) {
            throw new CustomerExceptionHandler('Customer Address NOT specified');
        } else if (custAddr.length < 5) {
            throw new CustomerExceptionHandler('Customer Address does not meet minimum length requirements');
        } else if (custAddr.length > 60) {
            throw new CustomerExceptionHandler('Customer Address exceeds maximum length requirements');
        }
        return custAddr

    }

    validatePhoneNumber(custPhone) {
        if (!custPhone || custPhone.trim().length === 0 ) {
            throw new CustomerExceptionHandler('Customer Phone');
        } else if (custPhone.length < 7) {
            throw new CustomerExceptionHandler('Customer Phone Number does not meet minimum length requirements');
        } else if (custPhone.length > 15) {
            throw new CustomerExceptionHandler('Customer Phone Number exceeds maximum length requirements');
        }
        return custPhone
    }
    validateAreaId(area_id) {
        if (area_id <= 0 || isNaN(area_id)) {
            throw new CustomerExceptionHandler('Invalid Area ID');
        }
        return area_id;
    }


    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email !== null && !emailRegex.test(email)) {
            throw new CustomerExceptionHandler('Invalid Email Address');
        }
        return email;
    }

    validateLastPaymentDate(last_payment_date) {
        if (last_payment_date !== null && isNaN(Date.parse(last_payment_date))) {
            throw new CustomerExceptionHandler('Invalid Last Payment Date');
        }
        return last_payment_date;
    }

    validateStatus(status) {
        const validStatuses = ['active', 'inactive', 'suspended'];
        if (status !== null && !validStatuses.includes(status)) {
            throw new CustomerExceptionHandler('Invalid Status');
        }
        return status;
    }
}

