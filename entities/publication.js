import {dbConnection} from "./connection.js";

export class Publication {
    constructor(name, type, price, publication_id = null) {
        this.name = this.validateName(name);
        this.type = this.validateType(type);
        this.price = this.validatePrice(price);

        return new Promise((resolve, reject) => {
            if (publication_id) {
                this.publication_id = publication_id;
                resolve(this);
            } else {
                let connection = dbConnection();
                const query = 'SELECT MAX(newspaper_id) AS current_id FROM publications';
                connection.query(query, (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        const id = results[0].current_id || 0;
                        this.publication_id = id + 1;
                        resolve(this);
                    }
                    connection.end();
                });
            }
        });
    }

    validateName(name) {
        if (typeof name !== "string") {
            console.log(typeof name);
            throw new Error("Name should be a string!");
        }
        if (name.length === 0) {
            throw new Error("Name should not be 0 characters!");
        }
        if (name.length < 2) {
            throw new Error("Name should be more than 2 characters!");
        }
        if (name.length > 50) {
            throw new Error("Your name is hardly 50 characters, be for real");
        }
        return name;
    }

    validateType(type) {
        if (typeof type !== "string") {
            console.log(typeof type);
            throw new Error("Type should be a string!");
        }
        if (type !== "daily" && type !== 'weekly' && type !== 'monthly') {
            throw new Error("Type should be daily, weekly, or monthly!");
        }
        return type;
    }

    validatePrice(price) {
        if (isNaN(price)) {
            throw new Error("Price should be a number!");
        }
        if (price < 0) {
            throw new Error("Price should not be less than zero!");
        }
        if (price > 1000) {
            throw new Error("Price should not be more than a thousand!");
        }
        return price;
    }
}
