import mysql from 'mysql2/promise';
import { Customer } from "./customer.js";
import { Area } from "./area.js";
import { DeliveryDocket } from "./deliveryDocket.js";
import { Invoice } from "./invoiceManagement.js";
import { Order } from "./order.js";
import { Publication } from "./publication.js";
import { WarningLetter } from "./warningLetter.js";
import {currentDate} from "./currentDate.js";

export class MySQLAccess {
  constructor() {
    this.config = {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'newsagent',
      decimalNumbers: true
    };
    this.connection = null;
  }

  async connectToDatabase() {
    try {
      this.connection = await mysql.createConnection(this.config);
      await this.connection.query('SET FOREIGN_KEY_CHECKS = 0');
      console.log('Database connected successfully.');
    } catch (err) {
      console.error('Failed to connect to the database:', err);
      throw err;
    }
  }

  // Close the connection
  async closeConnection() {
    if (this.connection) {
      await this.connection.end();
      console.log('Database connection closed.');
    }
  }
// db.js
  async generateCustomerInvoices(customer_id, start_date, end_date) {
    try {
      // Step 1: Fetch all delivered orders for the customer within the date range
      const fetchOrdersQuery = `
        SELECT o.order_id, o.delivery_date, o.status, p.name AS publication_name, p.price
        FROM orders o
               INNER JOIN publications p ON o.newspaper_id = p.newspaper_id
        WHERE o.customer_id = ?
          AND o.delivery_date BETWEEN ? AND ?
          AND o.status = 'delivered'
      `;
      const [orders] = await this.connection.query(fetchOrdersQuery, [customer_id, start_date, end_date]);

      if (orders.length === 0) {
        console.log(`No delivered orders found for Customer ID ${customer_id} in the specified date range.`);
        return;
      }

      // Step 2: Calculate total amount and prepare invoice details
      let totalAmount = 0;
      const invoiceDetails = orders.map(order => {
        totalAmount += order.price;
        return {
          order_id: order.order_id,
          delivery_date: order.delivery_date,
          status: order.status,
          publication_name: order.publication_name,
          price: order.price,
        };
      });

      // Step 3: Insert the invoice into the `invoices` table
      const insertInvoiceQuery = `
        INSERT INTO invoices (customer_id, invoice_date, due_date, total_amount, payment_status, details)
        VALUES (?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), ?, 'unpaid', ?)
      `;
      const invoiceData = [customer_id, totalAmount, JSON.stringify(invoiceDetails)];
      const [result] = await this.connection.query(insertInvoiceQuery, invoiceData);

      console.log(`Invoice generated successfully for Customer ID ${customer_id}.`);
      console.log(`Invoice ID: ${result.insertId}`);
      console.log(`Total Amount: $${totalAmount.toFixed(2)}`);
      console.log('Invoice Details:', invoiceDetails);
    } catch (err) {
      console.error('Error generating customer invoices:', err.message);
      throw err;
    }
  }


  async markOrderAsDelivered(docket_id, order_id, status) {
    try {
      // Step 1: Update the `orders` table
      const orderQuery = `
            UPDATE orders
            SET status = ?
            WHERE order_id = ?
        `;
      const orderParams = [status, order_id];
      const [orderResult] = await this.connection.query(orderQuery, orderParams);

      if (orderResult.affectedRows === 0) {
        throw new Error(`Order ID ${order_id} not found in the orders table.`);
      }

      // Step 2: Fetch the existing `orders` JSON from the `dockets` table
      const fetchDocketQuery = `
            SELECT orders
            FROM dockets
            WHERE docket_id = ?
        `;
      const [docketResult] = await this.connection.query(fetchDocketQuery, [docket_id]);

      if (docketResult.length === 0) {
        throw new Error(`Docket ID ${docket_id} not found.`);
      }

      let orders = [];
      try {
        orders = JSON.parse(docketResult[0].orders || '[]'); // Parse the JSON column
      } catch (err) {
        throw new Error('Failed to parse `orders` column as JSON.');
      }

      if (!Array.isArray(orders) || orders.length === 0) {
        throw new Error('No valid orders found in the docket.');
      }

      // Step 3: Update the status of the matching order in the JSON object
      const updatedOrders = orders.map(order => {
        if (order.order_id === order_id) {
          return { ...order, status }; // Update the status
        }
        return order;
      });

      // Step 4: Replace the `orders` JSON column in the `dockets` table
      const updateDocketQuery = `
            UPDATE dockets
            SET orders = ?
            WHERE docket_id = ?
        `;
      const updateDocketParams = [JSON.stringify(updatedOrders), docket_id];
      await this.connection.query(updateDocketQuery, updateDocketParams);

      console.log(`Order ${order_id} in docket ${docket_id} updated successfully with status: ${status}`);
    } catch (err) {
      console.error('Error updating order status in delivery docket:', err.message);
      throw err;
    }
  }

  async getNewspaperPrice(newspaper_id) {
    const query = `SELECT price FROM newspapers WHERE newspaper_id = ?`;
    const [result] = await this.connection.query(query, [newspaper_id]);
    if (result.length === 0) {
      throw new Error(`Newspaper ID ${newspaper_id} not found.`);
    }
    return result[0].price;
  }







  async createRecord(table, columns, values) {
    if (!Array.isArray(columns) || !Array.isArray(values)) {
      throw new Error('Columns and values must be arrays');
    }

    if (columns.length !== values.length) {
      throw new Error('Columns and values length mismatch');
    }

    // Replace undefined with null
    const sanitizedValues = values.map(value => (value === undefined ? null : value));

    const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${sanitizedValues.map(() => '?').join(', ')})`;
    try {
      const [result] = await this.connection.execute(query, sanitizedValues);
      console.log(`${table} created:`, result);
      return result;
    } catch (err) {
      console.error(`Error creating record in ${table}:`, err.message);
      throw err;
    }
  }


  async readRecordById(table, idField, idValue) {
    if (!table || !idField || idValue === undefined) {
      throw new Error('Invalid arguments for reading record');
    }

    const query = `SELECT * FROM ${table} WHERE ${idField} = ?`;
    try {
      const [rows] = await this.connection.execute(query, [idValue]);
      if (rows.length === 0) {
        throw new Error(`${table} with id ${idValue} not found`);
      }
      return rows[0];
    } catch (err) {
      console.error(`Error reading record from ${table}:`, err.message);
      throw err;
    }
  }


async readAllRecords(table) {
  if (!table) {
    throw new Error('Table name is required');
  }

  const query = `SELECT * FROM ${table}`;
  try {
    const [rows] = await this.connection.execute(query);
    return rows;
  } catch (err) {
    console.error(`Error reading all records from ${table}:`, err.message);
    throw err;
  }
}

async updateRecord(table, fields, values, idField, idValue) {
  if (!Array.isArray(fields) || !Array.isArray(values)) {
    throw new Error('Fields and values must be arrays');
  }

  if (fields.length !== values.length) {
    throw new Error('Fields and values length mismatch');
  }

  if (!table || !idField || idValue === undefined) {
    throw new Error('Invalid arguments for updating record');
  }

  const setClause = fields.map(field => `${field} = ?`).join(', ');
  const query = `UPDATE ${table} SET ${setClause} WHERE ${idField} = ?`;
  const params = [...values, idValue];

  try {
    const [result] = await this.connection.execute(query, params);
    console.log(`${table} updated:`, result);
    return result;
  } catch (err) {
    console.error(`Error updating record in ${table}:`, err.message);
    throw err;
  }
}

  async deleteRecord(table, idField, idValue) {
    if (!table || !idField || idValue === undefined) {
      throw new Error('Invalid arguments for deleting record');
    }

    const query = `DELETE FROM ${table} WHERE ${idField} = ?`;
    try {
      const [result] = await this.connection.execute(query, [idValue]);
      console.log(`Record deleted from ${table}:`, result);
      return result;
    } catch (err) {
      console.error(`Error deleting record from ${table}:`, err.message);
      throw err;
    }
  }


// CRUD for Customer
async createCustomer(customer) {
  const values = [
    customer.customer_id || null,
    customer.name,
    customer.address || null,
    customer.phoneNumber || null,
    customer.area_id || null,
    customer.email || null,
    customer.last_payment_date || null,
    customer.status || null,
  ];
  return this.createRecord('customers', ['customer_id', 'name', 'address', 'phone', 'area_id', 'email', 'last_payment_date', 'status'], values);
}

async readCustomerById(customer_id) {
  return this.readRecordById('customers', 'customer_id', customer_id);
}

async readAllCustomers() {
  return this.readAllRecords('customers');
}

async updateCustomer(customer) {
  return this.updateRecord('customers', ['name', 'address', 'phone', 'area_id', 'email', 'last_payment_date', 'status'], [
    customer.name,
    customer.address,
    customer.phoneNumber,
    customer.area_id || null,
    customer.email || null,
    customer.last_payment_date || null,
    customer.status || null,
  ], 'customer_id', customer.customer_id);
}

async deleteCustomer(customer_id) {
  let tables = ['customers', 'customer_subscriptions', 'invoices', 'orders', 'warning_letters'];
  for (const table of tables) {
    await this.deleteRecord(table, 'customer_id', customer_id);
  }
}

// CRUD for Publication
async createPublication(publication) {
  return this.createRecord('publications', ['newspaper_id', 'name', 'type', 'price'], [
    publication.publication_id,
    publication.name,
    publication.type,
    publication.price,
  ]);
}

async readPublicationById(publication_id) {
  return this.readRecordById('publications', 'newspaper_id', publication_id);
}

async readAllPublications() {
  return this.readAllRecords('publications');
}

async updatePublication(publication) {
  return this.updateRecord(
      'publications',
      ['name', 'type', 'price'],
      [
        publication.name,
        publication.type,
        publication.price
      ],
      'newspaper_id',
      publication.publication_id
  );
}

async deletePublication(publication_id) {
  return this.deleteRecord('publications', 'newspaper_id', publication_id);
}

// CRUD for Area
async createArea(area) {
  return this.createRecord('areas', ['area_id', 'name'], [
    area.area_id,
    area.name
  ]);
}

async readAreaById(area_id) {
  return this.readRecordById('areas', 'area_id', area_id);
}

async readAllAreas() {
  return this.readAllRecords('areas');
}

async updateArea(area) {
  return this.updateRecord('areas', ['name'], [
    area.name
  ], 'area_id', area.area_id);
}

async deleteArea(area_id) {

  let tables = ['customers', 'orders', 'dockets'];
  for (const table of tables) {
    await this.deleteRecord(table, 'area_id', area_id);
  }
  return this.deleteRecord('areas', 'area_id', area_id);
}

// CRUD for Docket
async createDocket(docket) {
  return this.createRecord('dockets',
      ['docket_id', 'area_id', 'delivery_person', 'orders', 'date'],
      [
        docket.docket_id,
        docket.area_id,
        docket.delivery_person,
        docket.orders,
        currentDate()
      ]
  );
}

async readDocketById(docket_id) {
  const docket = await this.readRecordById('dockets', 'docket_id', docket_id);
  if (docket.orders && typeof docket.orders === 'string') {
    docket.orders = JSON.parse(docket.orders);
  }
  return docket;
}

async readOrdersByIds(orderIds) {
  const placeholders = orderIds.map(() => '?').join(', ');
  const query = `SELECT * FROM orders WHERE order_id IN (${placeholders})`;
  try {
    const [rows] = await this.connection.execute(query, orderIds);
    return rows.map(order => {
      // Parse any JSON or nested structures if necessary
      if (order.details && typeof order.details === 'string') {
        order.details = JSON.parse(order.details);
      }
      return order;
    });
  } catch (err) {
    console.error('Error fetching orders by IDs:', err.message);
    throw err;
  }
}


async readAllDockets() {
  const dockets = await this.readAllRecords('dockets');
  return dockets.map(docket => {
    if (docket.orders && typeof docket.orders === 'string') {
      docket.orders = JSON.parse(docket.orders);
    }
    return docket;
  });
}

async updateDocket(docket) {
  return this.updateRecord('dockets',
      ['area_id', 'delivery_person', 'orders'],
      [
        docket.area_id,
        docket.delivery_person,
        JSON.stringify(docket.orders)
      ],
      'docket_id',
      docket.docket_id
  );
}

async deleteDocket(docket_id) {
  return this.deleteRecord('dockets', 'docket_id', docket_id);
}

// CRUD for Invoice
  async createInvoice(invoice) {
    const { invoice_id, customer_id, invoice_date, due_date, total_amount, payment_status, details } = invoice;

    if (total_amount <= 0) {
      throw new Error('Total amount must be a positive number');
    }

    const sanitizedDetails = JSON.stringify(details || {});

    return this.createRecord(
        'invoices',
        ['invoice_id', 'customer_id', 'invoice_date', 'due_date', 'total_amount', 'payment_status', 'details'],
        [invoice_id, customer_id, invoice_date, due_date, total_amount, payment_status, sanitizedDetails]
    );
  }


async readInvoiceById(invoice_id) {
  return this.readRecordById('invoices', 'invoice_id', invoice_id);
}

async readAllInvoices() {
  return this.readAllRecords('invoices');
}

async updateInvoice(invoice) {
  return this.updateRecord(
      'invoices',
      ['customer_id', 'invoice_date', 'due_date', 'total_amount', 'payment_status', 'details'],
      [
        invoice.customer_id,
        invoice.invoice_date,
        invoice.due_date,
        invoice.total_amount,
        invoice.payment_status,
        JSON.stringify(invoice.details)
      ],
      'invoice_id',
      invoice.invoice_id
  );
}

async deleteInvoice(invoice_id) {
  return this.deleteRecord('invoices', 'invoice_id', invoice_id);
}

// CRUD for Order
async createOrder(order) {
  return this.createRecord('orders', ['order_id','customer_id', 'area_id','newspaper_id', 'delivery_date', 'status'], [
    order.order_id,
    order.customer_id,
    order.area_id,
    order.newspaper_id,
    order.delivery_date,
    order.status

  ]);
}

async readOrderById(order_id) {
  return this.readRecordById('orders', 'order_id', order_id);
}

async readAllOrders() {
  return this.readAllRecords('orders');
}

async updateOrder(order) {
  return this.updateRecord('orders', ['order_id','customer_id', 'area_id','newspaper_id', 'delivery_date', 'status'], [
    order.order_id,
    order.customer_id,
    order.area_id,
    order.newspaper_id,
    order.delivery_date,
    order.status
  ], 'order_id', order.order_id);
}

async deleteOrder(order_id) {
  return this.deleteRecord('orders', 'order_id', order_id);
}

// CRUD for WarningLetter
async createWarningLetter(warningLetter) {
  return this.createRecord('warning_letters', ['letter_id', 'customer_id', 'warning_date', 'status', 'message'], [
    warningLetter.letter_id,
    warningLetter.customer_id,
    warningLetter.warning_date,
    warningLetter.status,
    warningLetter.message
  ]);
}

async readWarningLetterById(warning_letter_id) {
  return this.readRecordById('warning_letters', 'letter_id', warning_letter_id);
}

async readAllWarningLetters() {
  return this.readAllRecords('warning_letters');
}

async updateWarningLetter(warningLetter) {
  return this.updateRecord('warning_letters',
      ['customer_id', 'warning_date', 'status', 'message'],
      [
        warningLetter.customer_id,
        warningLetter.warning_date,
        warningLetter.status,
        warningLetter.message
      ],
      'letter_id',
      warningLetter.letter_id
  );
}

async deleteWarningLetter(warning_letter_id) {
  return this.deleteRecord('warning_letters', 'letter_id', warning_letter_id);
}
}
