import inquirer from 'inquirer';
import { MySQLAccess } from './entities/db.js';
import { Customer } from './entities/customer.js';
import { Area } from './entities/area.js';
import { Order } from './entities/order.js';
import {DeliveryDocket} from './entities/deliveryDocket.js';
import { Invoice } from './entities/invoiceManagement.js';
import { Publication } from './entities/publication.js';
import {currentDate}   from "./entities/currentDate.js";
import { WarningLetter } from './entities/warningLetter.js';

let db;

async function initDB() {
    try {
        db = await new MySQLAccess();
        await db.connectToDatabase();
    } catch (err) {
        console.error('Database initialization failed:', err.message);
        process.exit(1);
    }
}

async function closeDB() {
    try {
        await db.closeConnection();
    } catch (err) {
        console.error('Error closing database connection:', err.message);
    }
}

// Main menu
async function mainMenu() {
    const choices = [
        { name: 'Customers', value: 'customers' },
        { name: 'Areas', value: 'areas' },
        { name: 'Orders', value: 'orders' },
        { name: 'Delivery Dockets', value: 'dockets' },
        { name: 'Invoices', value: 'invoices' },
        { name: 'Publications', value: 'publications' },
        { name: 'Warning Letters', value: 'letters' },
        { name: 'Exit', value: 'exit' }
    ];

    const answer = await inquirer.prompt({
        type: 'list',
        name: 'selection',
        message: 'Select an entity:',
        choices
    });

    switch (answer.selection) {
        case 'customers':
            await customerMenu();
            break;
        case 'areas':
            await areaMenu();
            break;
        case 'orders':
            await orderMenu();
            break;
        case 'dockets':
            await docketMenu();
            break;
        case 'invoices':
            await invoiceMenu();
            break;
        case 'letters':
            await warningLetterMenu();
            break;
        case 'publications':
            await publicationMenu();
            break;
        case 'exit':
            await closeDB();
            console.log('Goodbye!');
            process.exit();
    }
    await mainMenu();
}


async function crudMenu(entityName, createMethod, readMethod, updateMethod, deleteMethod) {
    const crudChoices = [
        { name: `Create ${entityName}`, value: 'create' },
        { name: `Read ${entityName}`, value: 'read' },
        { name: `Update ${entityName}`, value: 'update' },
        { name: `Delete ${entityName}`, value: 'delete' },
        { name: 'Back to Main Menu', value: 'back' }
    ];

    const answer = await inquirer.prompt({
        type: 'list',
        name: 'operation',
        message: `What would you like to do with ${entityName}?`,
        choices: crudChoices
    });

    try {
        switch (answer.operation) {
            case 'create':
                await createMethod();
                break;
            case 'read':
                await readMethod();
                break;
            case 'update':
                await updateMethod();
                break;
            case 'delete':
                await deleteMethod();
                break;
            case 'back':
                return; // Return to main menu
        }
    } catch (err) {
        console.error(`Error performing ${answer.operation} on ${entityName}:`, err.message);
    }

    await crudMenu(entityName, createMethod, readMethod, updateMethod, deleteMethod); // Stay in the CRUD menu after action
}


async function customerMenu() {
    await crudMenu(
        'Customer',
        createCustomer,
        readCustomer,
        updateCustomer,
        deleteCustomer
    );
}

async function createCustomer() {
    try {
        const answers = await inquirer.prompt([
            { name: 'name', message: 'Enter customer name:' },
            { name: 'address', message: 'Enter customer address:' },
            { name: 'phone', message: 'Enter customer phone number:' },
            { name: 'area_id', message: 'Enter area ID:' },
            { name: 'email', message: 'Enter customer email:' },
            { name: 'last_payment_date', message: 'Enter last payment date (YYYY-MM-DD):' },
            { name: 'status', message: 'Enter customer status (active/inactive):' }
        ]);

        const customer = await new Customer(null, answers.name, answers.address, answers.phone, answers.area_id, answers.email, answers.last_payment_date, answers.status);
        const result = await db.createCustomer(customer);
        console.log('Customer created with ID:', result.insertId);
    } catch (err) {
        console.error('Error creating customer:', err.message);
    }
}

async function readCustomer() {
    try {
        const { id } = await inquirer.prompt({ name: 'id', message: 'Enter customer ID:' });
        const customer = await db.readCustomerById(id);
        console.log('Customer details:', customer);
    } catch (err) {
        console.error('Error reading customer:', err.message);
    }
}

async function updateCustomer() {
    try {
        const answers = await inquirer.prompt([
            { name: 'id', message: 'Enter customer ID:' },
            { name: 'name', message: 'Enter await new customer name:' },
            { name: 'address', message: 'Enter await new customer address:' },
            { name: 'phone', message: 'Enter await new customer phone number:' },
            { name: 'area_id', message: 'Enter await new area ID:' },
            { name: 'email', message: 'Enter await new customer email:' },
            { name: 'last_payment_date', message: 'Enter await new last payment date (YYYY-MM-DD):' },
            { name: 'status', message: 'Enter await new customer status (active/inactive):' }
        ]);

        const customer = await new Customer(null, answers.name, answers.address, answers.phone, answers.area_id, answers.email, answers.last_payment_date, answers.status);
        await db.updateCustomer({ ...customer, customer_id: answers.id });
        console.log('Customer updated.');
    } catch (err) {
        console.error('Error updating customer:', err.message);
    }
}

async function deleteCustomer() {
    try {
        const { id } = await inquirer.prompt({ name: 'id', message: 'Enter customer ID to delete:' });
        await db.deleteCustomer(id);
        console.log('Customer deleted.');
    } catch (err) {
        console.error('Error deleting customer:', err.message);
    }
}


async function areaMenu() {
    await crudMenu('Area', createArea, readArea, updateArea, deleteArea);
}

async function createArea() {
    try {
        const answers = await inquirer.prompt([
            { name: 'name', message: 'Enter area name:' }
        ]);

        const area = await Area.create(null, answers.name, []);
        const result = await db.createArea(area);
        console.log('Area created with ID:', area.area_id);
    } catch (err) {
        console.error('Error creating area:', err.message);
    }
}

async function readArea() {
    try {
        const { id } = await inquirer.prompt({ name: 'id', message: 'Enter area ID:' });
        const area = await db.readAreaById(id);
        console.log('Area details:', area);
    } catch (err) {
        console.error('Error reading area:', err.message);
    }
}

async function updateArea() {
    try {
        const { id } = await inquirer.prompt([
            { name: 'id', message: 'Enter area ID:' }
        ]);

        const existingArea = await db.readAreaById(id);

        const answers = await inquirer.prompt([
            {
                name: 'name',
                message: 'Enter new area name:',
                default: existingArea.name
            }
        ]);

        const area = await Area.create(id, answers.name);
        await db.updateArea(area);
        console.log('Area updated.');
    } catch (err) {
        console.error('Error updating area:', err.message);
    }
}

async function deleteArea() {
    try {
        const { id } = await inquirer.prompt({ name: 'id', message: 'Enter area ID to delete:' });
        await db.deleteArea(id);
        console.log('Area deleted.');
    } catch (err) {
        console.error('Error deleting area:', err.message);
    }
}


async function orderMenu() {
    await crudMenu('Order', createOrder, readOrder, updateOrder, deleteOrder);
}

async function createOrder() {
    try {
        const answers = await inquirer.prompt([
            { name: 'customer_id', message: 'Enter customer ID:' },
            { name: 'area_id', message: 'Enter area ID:' },
            { name: 'newspaper_id', message: 'Enter newspaper ID:' },
            { name: 'delivery_date', message: 'Enter delivery date (YYYY-MM-DD):' },
            {
                type: 'list',
                name: 'status',
                message: 'Select status:',
                choices: ['pending', 'delivered', 'missed', 'canceled']
            }
        ]);

        const order = await new Order(
            null,
            parseInt(answers.customer_id),
            parseInt(answers.area_id),
            parseInt(answers.newspaper_id),
            answers.delivery_date,
            answers.status
        );
        const result = await db.createOrder(order);
        console.log('Order created with ID:', result.insertId);
    } catch (err) {
        console.error('Error creating order:', err.message);
    }
}

async function readOrder() {
    try {
        const { id } = await inquirer.prompt({ name: 'id', message: 'Enter order ID:' });
        const order = await db.readOrderById(id);
        console.log('Order details:', order);
    } catch (err) {
        console.error('Error reading order:', err.message);
    }
}

async function updateOrder() {
    try {
        const answers = await inquirer.prompt([
            { name: 'id', message: 'Enter order ID:' },
            { name: 'customer_id', message: 'Enter await new customer ID:' },
            { name: 'product', message: 'Enter await new product name:' },
            { name: 'quantity', message: 'Enter await new quantity:' },
            { name: 'price', message: 'Enter await new price:' }
        ]);

        const order = await new Order(null, answers.customer_id, answers.product, answers.quantity, answers.price);
        await db.updateOrder({ ...order, order_id: answers.id });
        console.log('Order updated.');
    } catch (err) {
        console.error('Error updating order:', err.message);
    }
}

async function deleteOrder() {
    try {
        const { id } = await inquirer.prompt({ name: 'id', message: 'Enter order ID to delete:' });
        await db.deleteOrder(id);
        console.log('Order deleted.');
    } catch (err) {
        console.error('Error deleting order:', err.message);
    }
}


async function docketMenu() {
    const crudChoices = [
        { name: 'Create Delivery Docket', value: 'create' },
        { name: 'Read Delivery Docket', value: 'read' },
        { name: 'Update Delivery Docket', value: 'update' },
        { name: 'Delete Delivery Docket', value: 'delete' },
        { name: 'Mark Delivery Status', value: 'mark_status' }, // New option
        { name: 'Back to Main Menu', value: 'back' }
    ];

    const answer = await inquirer.prompt({
        type: 'list',
        name: 'operation',
        message: 'What would you like to do with Delivery Dockets?',
        choices: crudChoices
    });

    try {
        switch (answer.operation) {
            case 'create':
                await createDocket();
                break;
            case 'read':
                await readDocket();
                break;
            case 'update':
                await updateDocket();
                break;
            case 'delete':
                await deleteDocket();
                break;
            case 'mark_status':
                await markDeliveryStatus();
                break;
            case 'back':
                return; // Return to main menu
        }
    } catch (err) {
        console.error(`Error performing ${answer.operation} on Delivery Docket:`, err.message);
    }

    await docketMenu(); // Stay in the menu after action
}

async function markDeliveryStatus() {
    try {
        const { docket_id } = await inquirer.prompt({ name: 'docket_id', message: 'Enter Delivery Docket ID:' });
        const docket = await db.readDocketById(docket_id);

        if (!docket || docket.orders.length === 0) {
            console.error('No orders found in this docket.');
            return;
        }

        console.log('Orders in this docket:');
        docket.orders.forEach(order => {
            console.log(`Order ID: ${order.order_id}, Status: ${order.status}`);
        });

        const { order_id, status } = await inquirer.prompt([
            { name: 'order_id', message: 'Enter Order ID to update:' },
            {
                type: 'list',
                name: 'status',
                message: 'Select new status:',
                choices: ['delivered', 'missed', 'pending']
            }
        ]);

        // Call the function directly from db.js
        await db.markOrderAsDelivered(docket_id, parseInt(order_id), status);
        console.log(`Order ${order_id} in docket ${docket_id} successfully updated to status: ${status}`);
    } catch (err) {
        console.error('Error updating delivery status:', err.message);
    }
}


async function createDocket() {
    try {
        const answers = await inquirer.prompt([
            {
                name: 'area_id',
                message: 'Enter area ID:',
                validate: input => !isNaN(input) && parseInt(input) > 0 ? true : 'Please enter a valid positive number'
            },
            {
                name: 'delivery_person',
                message: 'Enter delivery person:',
                validate: input => input.trim() !== '' ? true : 'Delivery person cannot be empty'
            },
            {
                name: 'order_ids',
                message: 'Enter order IDs (comma-separated, e.g., "1, 2, 3"):',
                validate: input => {
                    const ids = input.split(',').map(id => id.trim());
                    if (ids.some(id => isNaN(id) || id <= 0)) {
                        return 'Please enter valid positive numbers separated by commas.';
                    }
                    return true;
                }
            }

        ]);

        const area_id = parseInt(answers.area_id);
        const delivery_person = answers.delivery_person.trim();
        let orders = []

        console.log(answers.order_ids)
        let orderIds = answers.order_ids; // This might be a string or an array
        try {
            // If orderIds is a string, split it into an array
            if (typeof orderIds === 'string') {
                orderIds = orderIds.split(',').map(id => id.trim()); // Convert string to array of strings
            }

            // Check if it's an array and parse each item to an integer
            if (Array.isArray(orderIds)) {
                const parsedOrderIds = orderIds.map(id => parseInt(id, 10));

                // Validate that all parsed IDs are valid integers
                if (parsedOrderIds.some(id => isNaN(id))) {
                    throw new Error('One or more order IDs are not valid integers.');
                }


                // Fetch the orders from the database
                orders = await db.readOrdersByIds(parsedOrderIds);
                console.log('Fetched Orders:', orders);
            } else {
                throw new Error('orderIds must be an array or a comma-separated string.');
            }
        } catch (err) {
            console.error('Error fetching orders:', err.message);
        }


        const docket = await new DeliveryDocket(
            null,
            area_id,
            delivery_person,
            JSON.stringify(orders)

        );

        const result = await db.createDocket(docket);
        console.log('Delivery Docket created with ID:', result.insertId);
    } catch (err) {
        console.error('Error creating delivery docket:', err.message);
    }
}

async function readDocket() {
    try {
        const { id } = await inquirer.prompt({ name: 'id', message: 'Enter delivery docket ID:' });
        const docket = await db.readDocketById(id);
        console.log('Delivery Docket details:', docket);
    } catch (err) {
        console.error('Error reading delivery docket:', err.message);
    }
}

async function updateDocket() {
    try {
        const { id } = await inquirer.prompt([
            {
                name: 'id',
                message: 'Enter delivery docket ID:',
                validate: input => !isNaN(input) && parseInt(input) > 0 ? true : 'Please enter a valid positive number'
            }
        ]);

        const existingDocket = await db.readDocketById(id);
        console.log('\nCurrent Docket Information:');
        console.log('ID:', existingDocket.docket_id);
        console.log('Area ID:', existingDocket.area_id);
        console.log('Delivery Person:', existingDocket.delivery_person);
        console.log('Orders:');

        const existingOrders = Array.isArray(existingDocket.orders)
            ? existingDocket.orders
            : existingDocket.orders
                ? [existingDocket.orders]
                : [];

        existingOrders.forEach((order, index) => {
            console.log(`  Order ${index + 1}:`);
            console.log(`    Status: ${order.status}`);
            console.log(`    Customer ID: ${order.customer_id}`);
            console.log(`    Newspaper ID: ${order.newspaper_id}`);
        });

        const basicInfo = await inquirer.prompt([
            {
                name: 'area_id',
                message: 'Enter new area ID:',
                default: existingDocket.area_id,
                validate: input => !isNaN(input) && parseInt(input) > 0 ? true : 'Please enter a valid positive number'
            },
            {
                name: 'delivery_person',
                message: 'Enter new delivery person:',
                default: existingDocket.delivery_person,
                validate: input => input.trim() !== '' ? true : 'Delivery person cannot be empty'
            }
        ]);

        const updatedOrders = await Promise.all(
            existingOrders.map(async (order, index) => {
                console.log(`\nOrder ${index + 1}:`);
                const orderInfo = await inquirer.prompt([
                    {
                        name: 'status',
                        type: 'list',
                        message: `Enter status for order ${index + 1}:`,
                        choices: ['delivered', 'missed', 'pending'],
                        default: order.status
                    }
                ]);

                return {
                    ...order,
                    status: orderInfo.status
                };
            })
        );

        const docket = await new DeliveryDocket(
            id,
            parseInt(basicInfo.area_id),
            basicInfo.delivery_person.trim(),
            updatedOrders
        );

        await db.updateDocket(docket);
        console.log('Delivery Docket updated successfully.');
    } catch (err) {
        console.error('Error updating delivery docket:', err.message);
    }
}

async function deleteDocket() {
    try {
        const { id } = await inquirer.prompt({ name: 'id', message: 'Enter delivery docket ID to delete:' });
        await db.deleteDocket(id);
        console.log('Delivery Docket deleted.');
    } catch (err) {
        console.error('Error deleting delivery docket:', err.message);
    }
}

// ----- Invoice Menu and CRUD Methods -----
async function invoiceMenu() {
    const choices = [
        { name: 'Generate Invoices for Customer', value: 'generate_customer_invoices' }, // New option
        { name: 'Read Invoice', value: 'read' },
        { name: 'Update Invoice', value: 'update' },
        { name: 'Delete Invoice', value: 'delete' },
        { name: 'Back to Main Menu', value: 'back' },
    ];

    const answer = await inquirer.prompt({
        type: 'list',
        name: 'operation',
        message: 'What would you like to do with Invoices?',
        choices,
    });

    try {
        switch (answer.operation) {
            case 'generate_customer_invoices':
                await generateCustomerInvoicesMenu(); // Call the new function
                break;
            case 'read':
                await readInvoice();
                break;
            case 'update':
                await updateInvoice();
                break;
            case 'delete':
                await deleteInvoice();
                break;
            case 'back':
                return; // Return to main menu
        }
    } catch (err) {
        console.error(`Error performing ${answer.operation} on Invoices:`, err.message);
    }

    await invoiceMenu(); // Stay in the invoice menu after action
}



async function generateCustomerInvoicesMenu() {
    try {
        // Prompt for customer_id, start_date, and end_date
        const answers = await inquirer.prompt([
            { name: 'customer_id', message: 'Enter Customer ID:' },
            { name: 'start_date', message: 'Enter Start Date (YYYY-MM-DD):' },
            { name: 'end_date', message: 'Enter End Date (YYYY-MM-DD):' },
        ]);

        // Call the function to generate invoices
        await db.generateCustomerInvoices(
            parseInt(answers.customer_id),
            answers.start_date,
            answers.end_date
        );

        console.log('Invoices generated successfully.');
    } catch (err) {
        console.error('Error generating invoices for customer:', err.message);
    }
}


async function readInvoice() {
    try {
        const { id } = await inquirer.prompt({ name: 'id', message: 'Enter invoice ID:' });
        const invoice = await db.readInvoiceById(id);
        console.log('Invoice details:', invoice);
    } catch (err) {
        console.error('Error reading invoice:', err.message);
    }
}

async function updateInvoice() {
    try {
        const { id } = await inquirer.prompt([
            { name: 'id', message: 'Enter invoice ID:' }
        ]);

        const currentInvoice = await db.readInvoiceById(id);

        const basicInfo = await inquirer.prompt([
            {
                name: 'customer_id',
                message: 'Enter customer ID (number):',
                default: currentInvoice.customer_id.toString()
            },
            {
                name: 'invoice_date',
                message: 'Enter invoice date (YYYY-MM-DD):',
                default: currentInvoice.invoice_date
            },
            {
                name: 'due_date',
                message: 'Enter due date (YYYY-MM-DD):',
                default: currentInvoice.due_date
            },
            {
                name: 'payment_status',
                message: 'Enter payment status (paid/unpaid/late):',
                default: currentInvoice.payment_status
            }
        ]);

        const currentDetails = JSON.parse(currentInvoice.details);
        const details = [];
        let total_amount = 0;

        console.log('Current items:');
        currentDetails.forEach((item, index) => {
            console.log(`${index + 1}. ${item.item} - Quantity: ${item.quantity}, Price: ${item.price}`);
        });

        const { update_details } = await inquirer.prompt({
            type: 'confirm',
            name: 'update_details',
            message: 'Would you like to update the invoice details?',
            default: false
        });

        if (update_details) {
            let addMore = true;
            while (addMore) {
                const item = await inquirer.prompt([
                    { name: 'item', message: 'Enter item description:' },
                    { name: 'quantity', message: 'Enter quantity:', type: 'number' },
                    { name: 'price', message: 'Enter price per unit:', type: 'number' }
                ]);

                const itemTotal = item.quantity * item.price;
                total_amount += itemTotal;

                details.push({
                    item: item.item,
                    quantity: item.quantity,
                    price: item.price,
                    total: itemTotal
                });

                const { continue_adding } = await inquirer.prompt({
                    type: 'confirm',
                    name: 'continue_adding',
                    message: 'Add another item?',
                    default: false
                });

                addMore = continue_adding;
            }
        } else {
            details.push(...currentDetails);
            total_amount = currentInvoice.total_amount;
        }

        const invoice = await new Invoice(
            parseInt(id),
            parseInt(basicInfo.customer_id),
            basicInfo.invoice_date,
            basicInfo.due_date,
            total_amount,
            basicInfo.payment_status,
            details
        );

        await db.updateInvoice(invoice);
        console.log('Invoice updated successfully.');
        console.log('Updated total amount:', total_amount);
        console.log('Updated items:', details);
    } catch (err) {
        console.error('Error updating invoice:', err.message);
    }
}

async function deleteInvoice() {
    try {
        const { id } = await inquirer.prompt({ name: 'id', message: 'Enter invoice ID to delete:' });
        await db.deleteInvoice(id);
        console.log('Invoice deleted.');
    } catch (err) {
        console.error('Error deleting invoice:', err.message);
    }
}


async function publicationMenu() {
    await crudMenu('Publication', createPublication, readPublication, updatePublication, deletePublication);
}

async function createPublication() {
    try {
        const answers = await inquirer.prompt([
            { name: 'name', message: 'Enter publication name:' },
            {
                type: 'list',
                name: 'type',
                message: 'Select publication type:',
                choices: ['daily', 'weekly', 'monthly']
            },
            {
                name: 'price',
                message: 'Enter publication price:',
                validate: input => !isNaN(input) && input >= 0 && input <= 1000 ? true : 'Please enter a valid price between 0 and 1000'
            }
        ]);

        const publication = await new Publication(
            answers.name,
            answers.type,
            parseFloat(answers.price)
        );
        const result = await db.createPublication(publication);
        console.log('Publication created with ID:', publication.publication_id);
    } catch (err) {
        console.error('Error creating publication:', err.message);
    }
}

async function readPublication() {
    try {
        const { id } = await inquirer.prompt({ name: 'id', message: 'Enter publication ID:' });
        const publication = await db.readPublicationById(id);
        console.log('Publication details:', publication);
    } catch (err) {
        console.error('Error reading publication:', err.message);
    }
}

async function updatePublication() {
    try {
        const { id } = await inquirer.prompt([
            { name: 'id', message: 'Enter publication ID:' }
        ]);

        const existingPublication = await db.readPublicationById(id);

        const answers = await inquirer.prompt([
            {
                name: 'name',
                message: 'Enter new publication name:',
                default: existingPublication.name
            },
            {
                type: 'list',
                name: 'type',
                message: 'Select new publication type:',
                choices: ['daily', 'weekly', 'monthly'],
                default: existingPublication.type
            },
            {
                name: 'price',
                message: 'Enter new publication price:',
                default: existingPublication.price,
                validate: input => !isNaN(input) && input >= 0 && input <= 1000 ? true : 'Please enter a valid price between 0 and 1000'
            }
        ]);

        const publication = await new Publication(
            answers.name,
            answers.type,
            parseFloat(answers.price),
            parseInt(id)
        );

        await db.updatePublication(publication);
        console.log('Publication updated successfully.');
    } catch (err) {
        console.error('Error updating publication:', err.message);
    }
}

async function deletePublication() {
    try {
        const { id } = await inquirer.prompt({ name: 'id', message: 'Enter publication ID to delete:' });
        await db.deletePublication(id);
        console.log('Publication deleted.');
    } catch (err) {
        console.error('Error deleting publication:', err.message);
    }
}

async function warningLetterMenu() {
    await crudMenu('Warning Letter', createWarningLetter, readWarningLetter, updateWarningLetter, deleteWarningLetter);
}

async function createWarningLetter() {
    try {
        const answers = await inquirer.prompt([
            { name: 'customer_id', message: 'Enter customer ID (number):' },
            { name: 'warning_date', message: 'Enter date of letter (YYYY-MM-DD):' },
            { name: 'status', message: 'Enter status (warning/suspension):' },
            { name: 'message', message: 'Enter warning message:' }
        ]);

        const customer_id = parseInt(answers.customer_id);
        const letter = await new WarningLetter(
            customer_id,
            answers.warning_date,
            answers.status,
            answers.message
        );
        const result = await db.createWarningLetter(letter);
        console.log('Warning Letter created with ID:', letter.letter_id);
    } catch (err) {
        console.error('Error creating warning letter:', err.message);
    }
}

async function readWarningLetter() {
    try {
        const { id } = await inquirer.prompt({ name: 'id', message: 'Enter warning letter ID:' });
        const letter = await db.readWarningLetterById(id);
        console.log('Warning Letter details:', letter);
    } catch (err) {
        console.error('Error reading warning letter:', err.message);
    }
}

async function updateWarningLetter() {
    try {
        const answers = await inquirer.prompt([
            { name: 'id', message: 'Enter warning letter ID:' },
            { name: 'customer_id', message: 'Enter new customer ID (number):' },
            { name: 'warning_date', message: 'Enter new date of letter (YYYY-MM-DD):' },
            { name: 'status', message: 'Enter new status (warning/suspension):' },
            { name: 'message', message: 'Enter new warning message:' }
        ]);

        const customer_id = parseInt(answers.customer_id);
        const letter = await new WarningLetter(
            customer_id,
            answers.warning_date,
            answers.status,
            answers.message,
            answers.id
        );
        await db.updateWarningLetter(letter);
        console.log('Warning Letter updated.');
    } catch (err) {
        console.error('Error updating warning letter:', err.message);
    }
}

async function deleteWarningLetter() {
    try {
        const { id } = await inquirer.prompt({ name: 'id', message: 'Enter warning letter ID to delete:' });
        await db.deleteWarningLetter(id);
        console.log('Warning Letter deleted.');
    } catch (err) {
        console.error('Error deleting warning letter:', err.message);
    }
}

(async function start() {
    await initDB();
    await mainMenu();
})();
