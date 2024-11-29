import mysql from 'mysql2';

export function dbConnection() {
    return mysql.createConnection({
        host: 'localhost',      // Replace with your DB host
        user: 'root',           // Replace with your DB user
        password: '',   // Replace with your DB password
        database: 'newsagent'  // Replace with your DB name
    });
}
