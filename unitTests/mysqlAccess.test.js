// tests/MySQLAccess.test.js
import { MySQLAccess } from '../entities/db.js';
import { WarningLetter } from '../entities/warningLetter.js'; // Update with actual path
import { Customer } from '../entities/customer.js'; // Update with actual path
import { Publication } from '../entities/publication.js'; // Update with actual path
import { Area } from '../entities/area.js'; // Update with actual path
import { DeliveryDocket } from '../entities/deliveryDocket.js'; // Update with actual path
import { Invoice } from '../entities/invoiceManagement.js'; // Update with actual path
import { Order } from '../entities/order.js'; // Update with actual path
import mysql from 'mysql2/promise';
let db;

beforeAll(async () => {
    db = await new MySQLAccess();
    await db.connectToDatabase();
});

afterAll(async () => {
    await db.closeConnection();
});
describe('MySQLAccess - connectToDatabase', () => {
    let db;

    beforeAll(() => {
        db = new MySQLAccess();
    });

    afterAll(async () => {
        await db.closeConnection();
    });

    // Test #: 1
    // Test Objective: Should connect to the database successfully.
    // Inputs: await db.connectToDatabase();.
    // Expected Output: expect(db.connection).not.toBeNull();.
    it('should connect to the database successfully', async () => {
        await db.connectToDatabase();
        expect(db.connection).not.toBeNull();
    });

    // Test #: 2
    // Test Objective: Should handle connection errors.
    // Inputs: await expect(db.connectToDatabase()).rejects.toThrow();; db = new MySQLAccess();; await db.connectToDatabase();; await db.closeConnection();.
    // Expected Output: await expect(db.connectToDatabase()).rejects.toThrow();.
    it('should handle connection errors', async () => {
        db.config.password = 'wrong_password'; // Simulate incorrect credentials
        await expect(db.connectToDatabase()).rejects.toThrow();
    });
});
describe('MySQLAccess - createRecord', () => {
    let db;

    beforeAll(async () => {
        db = new MySQLAccess();
        await db.connectToDatabase();
    });

    afterAll(async () => {
        await db.closeConnection();
    });

    // Test #: 3
    // Test Objective: Should throw an error for invalid table name.
    // Inputs: await expect(.
    // Expected Output: await expect(; ).rejects.toThrow();.
    it('should throw an error for invalid table name', async () => {
        await expect(
            db.createRecord('invalid_table', ['name'], ['test'])
        ).rejects.toThrow();
    });

    // Test #: 4
    // Test Objective: Should throw an error for missing values.
    // Inputs: await expect(.
    // Expected Output: await expect(; ).rejects.toThrow();.
    it('should throw an error for missing values', async () => {
        await expect(
            db.createRecord('customers', ['name'], []) // No values provided
        ).rejects.toThrow();
    });
    // Test #: 5
    // Test Objective: Should throw an error for empty columns or values in createrecord.
    // Inputs: const db = new MySQLAccess();; await db.connectToDatabase();; await expect(db.createRecord('customers', [], ['John Doe'])).rejects.toThrow(; await db.closeConnection();; db = new MySQLAccess();; await db.connectToDatabase();; await db.closeConnection();.
    // Expected Output: await expect(db.createRecord('customers', [], ['John Doe'])).rejects.toThrow(.
    it('should throw an error for empty columns or values in createRecord', async () => {
        const db = new MySQLAccess();
        await db.connectToDatabase();
        await expect(db.createRecord('customers', [], ['John Doe'])).rejects.toThrow(
            'Columns and values length mismatch'
        );
        await db.closeConnection();
    });

});
describe('MySQLAccess - readRecordById', () => {
    let db;

    beforeAll(async () => {
        db = new MySQLAccess();
        await db.connectToDatabase();
    });


    afterAll(async () => {
        await db.closeConnection();
    });

    // Test #: 6
    // Test Objective: Should throw an error if record is not found.
    // Inputs: await expect(db.readRecordById('customers', 'customer_id', 9999)).rejects.toThrow(.
    // Expected Output: await expect(db.readRecordById('customers', 'customer_id', 9999)).rejects.toThrow(.
    it('should throw an error if record is not found', async () => {
        await expect(db.readRecordById('customers', 'customer_id', 9999)).rejects.toThrow(
            'customers with id 9999 not found'
        );
    });

    // Test #: 7
    // Test Objective: Should handle query errors gracefully.
    // Inputs: await expect(db.readRecordById('invalid_table', 'id', 1)).rejects.toThrow();.
    // Expected Output: await expect(db.readRecordById('invalid_table', 'id', 1)).rejects.toThrow();.
    it('should handle query errors gracefully', async () => {
        await expect(db.readRecordById('invalid_table', 'id', 1)).rejects.toThrow();
    });
    // Test #: 8
    // Test Objective: Should throw an error for invalid table name in readrecordbyid.
    // Inputs: const db = new MySQLAccess();; await db.connectToDatabase();; await expect(db.readRecordById('invalid_table', 'id', 1)).rejects.toThrow();; await db.closeConnection();; db = new MySQLAccess();; await db.connectToDatabase();; await db.closeConnection();.
    // Expected Output: await expect(db.readRecordById('invalid_table', 'id', 1)).rejects.toThrow();.
    it('should throw an error for invalid table name in readRecordById', async () => {
        const db = new MySQLAccess();
        await db.connectToDatabase();
        await expect(db.readRecordById('invalid_table', 'id', 1)).rejects.toThrow();
        await db.closeConnection();
    });

});
describe('MySQLAccess - deleteRecord', () => {
    let db;

    beforeAll(async () => {
        db = new MySQLAccess();
        await db.connectToDatabase();
    });

    afterAll(async () => {
        await db.closeConnection();
    });

    // Test #: 9
    // Test Objective: Should throw an error for invalid table name.
    // Inputs: await expect(db.deleteRecord('invalid_table', 'id', 1)).rejects.toThrow();.
    // Expected Output: await expect(db.deleteRecord('invalid_table', 'id', 1)).rejects.toThrow();.
    it('should throw an error for invalid table name', async () => {
        await expect(db.deleteRecord('invalid_table', 'id', 1)).rejects.toThrow();
    });


});


// Test for Customer CRUD operations
describe('Customer CRUD Operations', () => {
    // Test #: 10
    // Test Objective: Should create a await new customer.
    // Inputs: const customer = await new Customer(50,'John Doe', '123 Main St', '555-1234', 1, 'john@example.com', '2024-01-01', 'active');; const result = await db.createCustomer(customer);.
    // Expected Output: expect(result).toHaveProperty('insertId');.
    it('should create a await new customer', async () => {
        const customer = await new Customer(50,'John Doe', '123 Main St', '555-1234', 1, 'john@example.com', '2024-01-01', 'active');
        console.log(customer)
        const result = await db.createCustomer(customer);
        expect(result).toHaveProperty('insertId');
    });

    // Test #: 11
    // Test Objective: Should read a customer by id.
    // Inputs: const customer = await db.readCustomerById(50);.
    // Expected Output: expect(customer).toHaveProperty('name', 'John Doe');.
    it('should read a customer by ID', async () => {
        const customer = await db.readCustomerById(50);
        expect(customer).toHaveProperty('name', 'John Doe');
    });

    // Test #: 12
    // Test Objective: Should update a customer.
    // Inputs: const updatedCustomer = await new Customer(50,'John Doe', '456 Elm St', '555-1234', 1, 'john@example.com', '2024-01-01', 'active');; await db.updateCustomer({ ...updatedCustomer, customer_id: 50 });; const customer = await db.readCustomerById(50);.
    // Expected Output: expect(customer).toHaveProperty('address', '456 Elm St');.
    it('should update a customer', async () => {
        const updatedCustomer = await new Customer(50,'John Doe', '456 Elm St', '555-1234', 1, 'john@example.com', '2024-01-01', 'active');
        await db.updateCustomer({ ...updatedCustomer, customer_id: 50 });
        const customer = await db.readCustomerById(50);
        expect(customer).toHaveProperty('address', '456 Elm St');
    });

    // Test #: 13
    // Test Objective: Should delete a customer.
    // Inputs: const wasDeleted = await db.deleteCustomer(1);; await expect(db.readCustomerById(1)).rejects.toThrow('customers with id 1 not found');.
    // Expected Output: await expect(db.readCustomerById(1)).rejects.toThrow('customers with id 1 not found');.
    it('should delete a customer', async () => {
        const wasDeleted = await db.deleteCustomer(1);
        await expect(db.readCustomerById(1)).rejects.toThrow('customers with id 1 not found');
    });

});

// Test for Publication CRUD operations
describe('Publication CRUD Operations', () => {
    // Test #: 14
    // Test Objective: Should create a await new publication.
    // Inputs: const publication = await new Publication('Sample Publication', 'daily', 5.99, 1);; const result = await db.createPublication(publication);.
    // Expected Output: expect(result).toHaveProperty('insertId');.
    it('should create a await new publication', async () => {
        const publication = await new Publication('Sample Publication', 'daily', 5.99, 1);

        const result = await db.createPublication(publication);
        expect(result).toHaveProperty('insertId');
    });

    // Test #: 15
    // Test Objective: Should read a publication by id.
    // Inputs: const publication = await db.readPublicationById(1);.
    // Expected Output: expect(publication).toHaveProperty('name', 'Sample Publication');.
    it('should read a publication by ID', async () => {
        const publication = await db.readPublicationById(1);
        expect(publication).toHaveProperty('name', 'Sample Publication');
    });

    // Test #: 16
    // Test Objective: Should update a publication.
    // Inputs: const updatedPublication = await  new Publication('Updated Publication', 'daily', 6.99);; await db.updatePublication({ ...updatedPublication, publication_id: 1 });; const publication = await db.readPublicationById(1);.
    // Expected Output: expect(publication).toHaveProperty('price', 6.99);.
    it('should update a publication', async () => {
        const updatedPublication = await  new Publication('Updated Publication', 'daily', 6.99);
        await db.updatePublication({ ...updatedPublication, publication_id: 1 });
        const publication = await db.readPublicationById(1);
        console.log(publication)
        expect(publication).toHaveProperty('price', 6.99);
    });

    // Test #: 17
    // Test Objective: Should delete a publication.
    // Inputs: await db.deletePublication(1);; await expect(db.readPublicationById(1)).rejects.toThrow('publications with id 1 not found');.
    // Expected Output: await expect(db.readPublicationById(1)).rejects.toThrow('publications with id 1 not found');.
    it('should delete a publication', async () => {
        await db.deletePublication(1);
        await expect(db.readPublicationById(1)).rejects.toThrow('publications with id 1 not found');
    });
});

// Test for Area CRUD operations
describe('Area CRUD Operations', () => {
    // Test #: 18
    // Test Objective: Should create a await new area.
    // Inputs: const area = await new Area(1, 'Downtown', 'Business area');; const result = await db.createArea(area);.
    // Expected Output: expect(result).toHaveProperty('insertId');.
    it('should create a await new area', async () => {
        const area = await new Area(1, 'Downtown', 'Business area');
        console.log(area)
        const result = await db.createArea(area);
        expect(result).toHaveProperty('insertId');
    });

    // Test #: 19
    // Test Objective: Should read an area by id.
    // Inputs: const area = await db.readAreaById(1);.
    // Expected Output: expect(area).toHaveProperty('name', 'Downtown');.
    it('should read an area by ID', async () => {
        const area = await db.readAreaById(1);
        expect(area).toHaveProperty('name', 'Downtown');
    });

    // Test #: 20
    // Test Objective: Should update an area.
    // Inputs: const updatedArea = await new Area(1,'Uptown', 'Residential area');; await db.updateArea({ ...updatedArea, area_id: 1 });; const area = await db.readAreaById(1);.
    // Expected Output: expect(area).toHaveProperty('name', 'Uptown');.
    it('should update an area', async () => {
        const updatedArea = await new Area(1,'Uptown', 'Residential area');
        await db.updateArea({ ...updatedArea, area_id: 1 });
        const area = await db.readAreaById(1);
        expect(area).toHaveProperty('name', 'Uptown');
    });

    // Test #: 21
    // Test Objective: Should delete an area.
    // Inputs: await db.deleteArea(1);; await expect(db.readAreaById(1)).rejects.toThrow('areas with id 1 not found');.
    // Expected Output: await expect(db.readAreaById(1)).rejects.toThrow('areas with id 1 not found');.
    it('should delete an area', async () => {
        await db.deleteArea(1);
        await expect(db.readAreaById(1)).rejects.toThrow('areas with id 1 not found');
    });
});

// Test for Delivery Docket CRUD operations
describe('Delivery Docket CRUD Operations', () => {
    // Test #: 22
    // Test Objective: Should create a await new delivery docket.
    // Inputs: const docket = await new DeliveryDocket(1, 1, 'John Smith', 1, '2024-10-24');; const result = await db.createDocket(docket);.
    // Expected Output: expect(result).toHaveProperty('insertId');.
    it('should create a await new delivery docket', async () => {
        const docket = await new DeliveryDocket(1, 1, 'John Smith', 1, '2024-10-24');
        const result = await db.createDocket(docket);
        expect(result).toHaveProperty('insertId');
    });

    // Test #: 23
    // Test Objective: Should read a delivery docket by id.
    // Inputs: const docket = await db.readDocketById(1);.
    // Expected Output: expect(docket).toHaveProperty('delivery_person', 'John Smith');.
    it('should read a delivery docket by ID', async () => {
        const docket = await db.readDocketById(1);
        expect(docket).toHaveProperty('delivery_person', 'John Smith');
    });

    // Test #: 24
    // Test Objective: Should update a delivery docket.
    // Inputs: const updatedDocket = await new DeliveryDocket(1,1, 'Jane Doe', 1, '2024-10-24');; await db.updateDocket(updatedDocket);; const docket = await db.readDocketById(1);.
    // Expected Output: expect(docket).toHaveProperty('delivery_person', 'Jane Doe');.
    it('should update a delivery docket', async () => {
        const updatedDocket = await new DeliveryDocket(1,1, 'Jane Doe', 1, '2024-10-24');
        await db.updateDocket(updatedDocket);
        const docket = await db.readDocketById(1);
        expect(docket).toHaveProperty('delivery_person', 'Jane Doe');
    });

    // Test #: 25
    // Test Objective: Should delete a delivery docket.
    // Inputs: await db.deleteDocket(1);; await expect(db.readDocketById(1)).rejects.toThrow('dockets with id 1 not found');.
    // Expected Output: await expect(db.readDocketById(1)).rejects.toThrow('dockets with id 1 not found');.
    it('should delete a delivery docket', async () => {
        await db.deleteDocket(1);
        await expect(db.readDocketById(1)).rejects.toThrow('dockets with id 1 not found');
    });
});

// Test for Invoice CRUD operations
describe('Invoice CRUD Operations', () => {
    // Test #: 26
    // Test Objective: Should create a await new invoice.
    // Inputs: const invoice = await new Invoice(1, 1, '2024-10-24', '2012-12-12', 150.00,'unpaid', [{"item":"hi","quantity":1,"price":1,"total":1}] );; const result = await db.createInvoice(invoice);.
    // Expected Output: expect(result).toHaveProperty('insertId');.
    it('should create a await new invoice', async () => {
        const details = ["order:002", "order:003"];
        const invoice = await new Invoice(1, 1, '2024-10-24', '2012-12-12', 150.00,'unpaid', [{"item":"hi","quantity":1,"price":1,"total":1}] );
        const result = await db.createInvoice(invoice);
        expect(result).toHaveProperty('insertId');
    });

    // Test #: 27
    // Test Objective: Should read an invoice by id.
    // Inputs: const invoice = await db.readInvoiceById(18);.
    // Expected Output: expect(invoice).toHaveProperty('total_amount', 150.00);.
    it('should read an invoice by ID', async () => {
        const invoice = await db.readInvoiceById(18);
        expect(invoice).toHaveProperty('total_amount', 150.00);
    });

    // Test #: 28
    // Test Objective: Should update an invoice.
    // Inputs: const updatedInvoice = await new Invoice(17, 1, '2024-10-24', '2012-12-12', 149.00,'unpaid', [{"item":"hi","quantity":1,"price":1,"total":1}]);; await db.updateInvoice({ ...updatedInvoice, invoice_id: 17 });; const invoice = await db.readInvoiceById(17);.
    // Expected Output: expect(invoice).toHaveProperty('total_amount', 149.00);.
    it('should update an invoice', async () => {;
        const updatedInvoice = await new Invoice(17, 1, '2024-10-24', '2012-12-12', 149.00,'unpaid', [{"item":"hi","quantity":1,"price":1,"total":1}]);
        await db.updateInvoice({ ...updatedInvoice, invoice_id: 17 });
        const invoice = await db.readInvoiceById(17);
        expect(invoice).toHaveProperty('total_amount', 149.00);
    });

    // Test #: 29
    // Test Objective: Should delete an invoice.
    // Inputs: await db.deleteInvoice(1);; await expect(db.readInvoiceById(1)).rejects.toThrow('invoices with id 1 not found');.
    // Expected Output: await expect(db.readInvoiceById(1)).rejects.toThrow('invoices with id 1 not found');.
    it('should delete an invoice', async () => {
        await db.deleteInvoice(1);
        await expect(db.readInvoiceById(1)).rejects.toThrow('invoices with id 1 not found');
    });
});

// Test for Order CRUD operations
describe('Order CRUD Operations', () => {
    // Test #: 30
    // Test Objective: Should create a await new order.
    // Inputs: const order = await new Order(1, 1, 2, 1,'2024-10-24', 'pending');; const result = await db.createOrder(order);.
    // Expected Output: expect(result).toHaveProperty('insertId');.
    it('should create a await new order', async () => {
        const order = await new Order(1, 1, 2, 1,'2024-10-24', 'pending');
        const result = await db.createOrder(order);
        expect(result).toHaveProperty('insertId');
    });

    // Test #: 31
    // Test Objective: Should read an order by id.
    // Inputs: const order = await db.readOrderById(1);.
    // Expected Output: expect(order).toHaveProperty('order_id', 1);.
    it('should read an order by ID', async () => {
        const order = await db.readOrderById(1);
        expect(order).toHaveProperty('order_id', 1);
    });

    // Test #: 32
    // Test Objective: Should update an order.
    // Inputs: const updatedOrder = await new Order(1, 1, 2, 1,'2024-10-24', 'pending');; await db.updateOrder({ ...updatedOrder, order_id: 1 });; const order = await db.readOrderById(1);.
    // Expected Output: expect(order).toHaveProperty('order_id', 1);.
    it('should update an order', async () => {
        const updatedOrder = await new Order(1, 1, 2, 1,'2024-10-24', 'pending');
        await db.updateOrder({ ...updatedOrder, order_id: 1 });
        const order = await db.readOrderById(1);
        expect(order).toHaveProperty('order_id', 1);
    });

    // Test #: 33
    // Test Objective: Should delete an order.
    // Inputs: await db.deleteOrder(1);; await expect(db.readOrderById(1)).rejects.toThrow('orders with id 1 not found');.
    // Expected Output: await expect(db.readOrderById(1)).rejects.toThrow('orders with id 1 not found');.
    it('should delete an order', async () => {
        await db.deleteOrder(1);
        await expect(db.readOrderById(1)).rejects.toThrow('orders with id 1 not found');
    });
});

// Test for Warning Letter CRUD operations
describe('Warning Letter CRUD Operations', () => {
    // Test #: 34
    // Test Objective: Should create a await new warning letter.
    // Inputs: const warningLetter = await new WarningLetter(1, '2024-10-24', 'warning', 'This is a warning message.', 1);; const result = await db.createWarningLetter(warningLetter);.
    // Expected Output: expect(result).toHaveProperty('insertId');.
    it('should create a await new warning letter', async () => {
        const warningLetter = await new WarningLetter(1, '2024-10-24', 'warning', 'This is a warning message.', 1);
        const result = await db.createWarningLetter(warningLetter);
        expect(result).toHaveProperty('insertId');
    });

    // Test #: 35
    // Test Objective: Should read a warning letter by id.
    // Inputs: const warningLetter = await db.readWarningLetterById(1);.
    // Expected Output: expect(warningLetter).toHaveProperty('message', 'This is a warning message.');.
    it('should read a warning letter by ID', async () => {
        const warningLetter = await db.readWarningLetterById(1);
        expect(warningLetter).toHaveProperty('message', 'This is a warning message.');
    });

    // Test #: 36
    // Test Objective: Should update a warning letter.
    // Inputs: const updatedWarningLetter = await new WarningLetter(1, '2024-10-24', 'suspension', 'This is an updated warning message.', 1);; await db.updateWarningLetter({ ...updatedWarningLetter, letter_id: 1 });; const warningLetter = await db.readWarningLetterById(1);.
    // Expected Output: expect(warningLetter).toHaveProperty('status', 'suspension');.
    it('should update a warning letter', async () => {
        const updatedWarningLetter = await new WarningLetter(1, '2024-10-24', 'suspension', 'This is an updated warning message.', 1);
        await db.updateWarningLetter({ ...updatedWarningLetter, letter_id: 1 });
        const warningLetter = await db.readWarningLetterById(1);
        expect(warningLetter).toHaveProperty('status', 'suspension');
    });

    // Test #: 37
    // Test Objective: Should delete a warning letter.
    // Inputs: await db.deleteWarningLetter(1);; await expect(db.readWarningLetterById(1)).rejects.toThrow('warning_letters with id 1 not found');.
    // Expected Output: await expect(db.readWarningLetterById(1)).rejects.toThrow('warning_letters with id 1 not found');.
    it('should delete a warning letter', async () => {
        await db.deleteWarningLetter(1);
        await expect(db.readWarningLetterById(1)).rejects.toThrow('warning_letters with id 1 not found');
    });
});
