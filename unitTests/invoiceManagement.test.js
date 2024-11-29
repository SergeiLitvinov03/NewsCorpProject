import { Invoice } from '../entities/invoiceManagement.js';
import { dbConnection } from '../entities/connection.js';

jest.mock('../entities/connection.js', () => ({
    dbConnection: jest.fn().mockReturnValue({
        query: jest.fn(),
        end: jest.fn(),
    }),
}));

describe('Invoice Class Tests', () => {

    // Test #1 - Invalid Date Format
    // Test #: 1
    // Test Objective: Should throw error for invalid date format.
    // Inputs: expect(() => new Invoice(null, 1, 'invalid-date', '2024-12-01', 100, 'unpaid', [])).
    // Expected Output: expect(() => new Invoice(null, 1, 'invalid-date', '2024-12-01', 100, 'unpaid', [])); .toThrowError('Invalid date format');.
    test('should throw error for invalid date format', () => {
        expect(() => new Invoice(null, 1, 'invalid-date', '2024-12-01', 100, 'unpaid', []))
            .toThrowError('Invalid date format');
    });

    // Test #2 - Valid Date Format
    // Test #: 2
    // Test Objective: Should create invoice for valid date.
    // Inputs: const invoice = await new Invoice(1, 1, '2024-11-01', '2024-12-01', 100, 'unpaid', []);.
    // Expected Output: expect(invoice.invoice_date).toBe('2024-11-01');; expect(invoice.due_date).toBe('2024-12-01');.
    test('should create Invoice for valid date', async () => {
        const invoice = await new Invoice(1, 1, '2024-11-01', '2024-12-01', 100, 'unpaid', []);
        expect(invoice.invoice_date).toBe('2024-11-01');
        expect(invoice.due_date).toBe('2024-12-01');
    });

    // Test #3 - Invalid Payment Status
    // Test #: 3
    // Test Objective: Should throw error for invalid payment status.
    // Inputs: expect(() => new Invoice(null, 1, '2024-11-01', '2024-12-01', 100, 'invalid-status', [])).
    // Expected Output: expect(() => new Invoice(null, 1, '2024-11-01', '2024-12-01', 100, 'invalid-status', [])); .toThrowError('Invalid payment status. Must be "paid", "unpaid", or "late".');.
    test('should throw error for invalid payment status', () => {
        expect(() => new Invoice(null, 1, '2024-11-01', '2024-12-01', 100, 'invalid-status', []))
            .toThrowError('Invalid payment status. Must be "paid", "unpaid", or "late".');
    });

    // Test #4 - Valid Payment Status
    // Test #: 4
    // Test Objective: Should create invoice for valid payment status.
    // Inputs: const invoice = await new Invoice(1, 1, '2024-11-01', '2024-12-01', 100, 'paid', []);.
    // Expected Output: expect(invoice.payment_status).toBe('paid');.
    test('should create Invoice for valid payment status', async () => {
        const invoice = await new Invoice(1, 1, '2024-11-01', '2024-12-01', 100, 'paid', []);
        expect(invoice.payment_status).toBe('paid');
    });

    // Test #5 - Invalid Total Amount (Negative)
    // Test #: 5
    // Test Objective: Should throw error for invalid total amount .
    // Inputs: expect(() => new Invoice(null, 1, '2024-11-01', '2024-12-01', -100, 'unpaid', [])).
    // Expected Output: expect(() => new Invoice(null, 1, '2024-11-01', '2024-12-01', -100, 'unpaid', [])); .toThrowError('Total amount must be a positive number');.
    test('should throw error for invalid total amount (negative)', () => {
        expect(() => new Invoice(null, 1, '2024-11-01', '2024-12-01', -100, 'unpaid', []))
            .toThrowError('Total amount must be a positive number');
    });

    // Test #6 - Invalid Total Amount (Non-number)
    // Test #: 6
    // Test Objective: Should throw error for invalid total amount .
    // Inputs: expect(() => new Invoice(null, 1, '2024-11-01', '2024-12-01', 'abc', 'unpaid', [])).
    // Expected Output: expect(() => new Invoice(null, 1, '2024-11-01', '2024-12-01', 'abc', 'unpaid', [])); .toThrowError('Total amount must be a positive number');.
    test('should throw error for invalid total amount (non-number)', () => {
        expect(() => new Invoice(null, 1, '2024-11-01', '2024-12-01', 'abc', 'unpaid', []))
            .toThrowError('Total amount must be a positive number');
    });

    // Test #7 - Valid Total Amount
    // Test #: 7
    // Test Objective: Should create invoice for valid total amount.
    // Inputs: const invoice = await new Invoice(1, 1, '2024-11-01', '2024-12-01', 150, 'unpaid', []);.
    // Expected Output: expect(invoice.total_amount).toBe(150);.
    test('should create Invoice for valid total amount', async () => {
        const invoice = await new Invoice(1, 1, '2024-11-01', '2024-12-01', 150, 'unpaid', []);
        expect(invoice.total_amount).toBe(150);
    });

    // Test #8 - Invalid Customer ID
    // Test #: 8
    // Test Objective: Should throw error for invalid customer_id.
    // Inputs: await expect(async () => {; await new Invoice(1, -1, '2024-11-01', '2024-12-01', 100, 'unpaid', []);.
    // Expected Output: await expect(async () => {; }).rejects.toThrowError('Invalid customer ID. It must be a positive number.');.
    test('should throw error for invalid customer_id', async () => {
        await expect(async () => {
            await new Invoice(1, -1, '2024-11-01', '2024-12-01', 100, 'unpaid', []);
        }).rejects.toThrowError('Invalid customer ID. It must be a positive number.');
    });

    // Test #9 - Valid Customer ID
    // Test #: 9
    // Test Objective: Should create invoice for valid customer_id.
    // Inputs: const invoice = await new Invoice(1, 1, '2024-11-01', '2024-12-01', 100, 'unpaid', []);.
    // Expected Output: expect(invoice.customer_id).toBe(1);.
    test('should create Invoice for valid customer_id', async () => {
        const invoice = await new Invoice(1, 1, '2024-11-01', '2024-12-01', 100, 'unpaid', []);
        expect(invoice.customer_id).toBe(1);
    });

    // Test #10 - Invalid Details (Not an Array)
    // Test #: 10
    // Test Objective: Should throw error for non-array details.
    // Inputs: expect(() => new Invoice(null, 1, '2024-11-01', '2024-12-01', 100, 'unpaid', 'invalid-details')).
    // Expected Output: expect(() => new Invoice(null, 1, '2024-11-01', '2024-12-01', 100, 'unpaid', 'invalid-details')); .toThrowError('Details must be an array');.
    test('should throw error for non-array details', () => {
        expect(() => new Invoice(null, 1, '2024-11-01', '2024-12-01', 100, 'unpaid', 'invalid-details'))
            .toThrowError('Details must be an array');
    });

    // Test #11 - Invalid Details (Empty or Invalid Objects)
    // Test #: 11
    // Test Objective: Should throw error for invalid details objects.
    // Inputs: expect(() => new Invoice(null, 1, '2024-11-01', '2024-12-01', 100, 'unpaid', [{}, 'invalid-object'])).
    // Expected Output: expect(() => new Invoice(null, 1, '2024-11-01', '2024-12-01', 100, 'unpaid', [{}, 'invalid-object'])); .toThrowError('Each item in details must be a non-empty object');.
    test('should throw error for invalid details objects', () => {
        expect(() => new Invoice(null, 1, '2024-11-01', '2024-12-01', 100, 'unpaid', [{}, 'invalid-object']))
            .toThrowError('Each item in details must be a non-empty object');
    });

    // Test #12 - Valid Details
    // Test #: 12
    // Test Objective: Should create invoice for valid details.
    // Inputs: const invoice = await new Invoice(1, 1, '2024-11-01', '2024-12-01', 100, 'unpaid', validDetails);.
    // Expected Output: expect(invoice.details).toEqual(validDetails);.
    test('should create Invoice for valid details', async () => {
        const validDetails = [{description: 'Item 1', amount: 50}, {description: 'Item 2', amount: 50}];
        const invoice = await new Invoice(1, 1, '2024-11-01', '2024-12-01', 100, 'unpaid', validDetails);
        expect(invoice.details).toEqual(validDetails);
    });

    // Test #13 - Auto-generate invoice_id if not provided
    // Test #: 13
    // Test Objective: Should generate invoice_id if not provided.
    // Inputs: const invoice = await new Invoice(null, 1, '2024-11-01', '2024-12-01', 100, 'unpaid', []);.
    // Expected Output: expect(invoice.invoice_id).toBe(6);  // Auto-generated invoice_id (max_id + 1).
    test('should generate invoice_id if not provided', async () => {
        const mockQuery = jest.fn((query, callback) => {
            callback(null, [{ current_id: '5' }]);
        });
        dbConnection.mockReturnValue({ query: mockQuery, end: jest.fn() });

        const invoice = await new Invoice(null, 1, '2024-11-01', '2024-12-01', 100, 'unpaid', []);
        expect(invoice.invoice_id).toBe(6);  // Auto-generated invoice_id (max_id + 1)
    });

    // Test #14 - Set invoice_id if provided
    // Test #: 14
    // Test Objective: Should set invoice_id if provided.
    // Inputs: const invoice = await new Invoice(123, 1, '2024-11-01', '2024-12-01', 100, 'unpaid', []);.
    // Expected Output: expect(invoice.invoice_id).toBe(123);.
    test('should set invoice_id if provided', async () => {
        const invoice = await new Invoice(123, 1, '2024-11-01', '2024-12-01', 100, 'unpaid', []);
        expect(invoice.invoice_id).toBe(123);
    });
});
