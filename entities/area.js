import { dbConnection } from "./connection.js";

export class Area {
    constructor(area_id = null, name) {
        this.name = this.validateName(name);
        this.area_id = area_id || null;
    }

    static async create(area_id = null, name) {
        const area = new Area(area_id, name);

        return new Promise(async (resolve, reject) => {
            try {
                if (!area_id) {
                    let connection = dbConnection();
                    const query = 'SELECT MAX(area_id) AS current_id FROM areas';
                    connection.query(query, (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            const id = results[0].current_id || 0;
                            this.area_id = id + 1;
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

    validateName(name) {
        if (!name || typeof name !== 'string' || name.length < 2 || name.length > 50) {
            throw new Error('Invalid area name. It must be between 2 and 50 characters.');
        }
        return name;
    }

}
