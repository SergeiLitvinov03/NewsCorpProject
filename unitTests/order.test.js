import { Order } from '../entities/order.js';  // Adjust path as necessary
import { dbConnection } from '../entities/connection.js';// Adjust path as necessary

// Mocking the database connection to prevent actual DB calls during testing
jest.mock('../entities/connection.js', () => ({
    dbConnection: jest.fn().mockReturnValue({
        query: jest.fn(),
        end: jest.fn(),
    }),
}));

describe('Order Class Tests', () => {

    // Test #1 - Invalid Customer ID
    // Test #: 1
    // Test Objective: Should throw error for invalid customer_id .
    // Inputs: expect(() => new Order(null, -1, 1, 1, '2024-12-01', 'pending')).
    // Expected Output: expect(() => new Order(null, -1, 1, 1, '2024-12-01', 'pending')); .toThrowError('Invalid customer_id. It must be a positive integer.');.
    test('should throw error for invalid customer_id (non-positive number)', () => {
        expect(() => new Order(null, -1, 1, 1, '2024-12-01', 'pending'))
            .toThrowError('Invalid customer_id. It must be a positive integer.');
    });

    // Test #2 - Valid Customer ID
    // Test #: 2
    // Test Objective: Should create order for valid customer_id.
    // Inputs: const order = await new Order(1, 1, 1, 1, '2024-12-01', 'pending');.
    // Expected Output: expect(order.customer_id).toBe(1);.
    test('should create Order for valid customer_id', async () => {
        const order = await new Order(1, 1, 1, 1, '2024-12-01', 'pending');
        expect(order.customer_id).toBe(1);
    });

    // Test #3 - Invalid Area ID
    // Test #: 3
    // Test Objective: Should throw error for invalid area_id .
    // Inputs: expect(() => new Order(null, 1, -1, 1, '2024-12-01', 'pending')).
    // Expected Output: expect(() => new Order(null, 1, -1, 1, '2024-12-01', 'pending')); .toThrowError('Invalid area_id. It must be a positive integer.');.
    test('should throw error for invalid area_id (non-positive number)', () => {
        expect(() => new Order(null, 1, -1, 1, '2024-12-01', 'pending'))
            .toThrowError('Invalid area_id. It must be a positive integer.');
    });

    // Test #4 - Valid Area ID
    // Test #: 4
    // Test Objective: Should create order for valid area_id.
    // Inputs: const order = await new Order(1, 1, 1, 1, '2024-12-01', 'pending');.
    // Expected Output: expect(order.area_id).toBe(1);.
    test('should create Order for valid area_id', async () => {
        const order = await new Order(1, 1, 1, 1, '2024-12-01', 'pending');
        expect(order.area_id).toBe(1);
    });

    // Test #5 - Invalid Newspaper ID
    // Test #: 5
    // Test Objective: Should throw error for invalid newspaper_id .
    // Inputs: expect(() => new Order(null, 1, 1, -1, '2024-12-01', 'pending')).
    // Expected Output: expect(() => new Order(null, 1, 1, -1, '2024-12-01', 'pending')); .toThrowError('Invalid newspaper_id. It must be a positive integer.');.
    test('should throw error for invalid newspaper_id (non-positive number)', () => {
        expect(() => new Order(null, 1, 1, -1, '2024-12-01', 'pending'))
            .toThrowError('Invalid newspaper_id. It must be a positive integer.');
    });

    // Test #6 - Valid Newspaper ID
    // Test #: 6
    // Test Objective: Should create order for valid newspaper_id.
    // Inputs: const order = await new Order(1, 1, 1, 1, '2024-12-01', 'pending');.
    // Expected Output: expect(order.newspaper_id).toBe(1);.
    test('should create Order for valid newspaper_id', async () => {
        const order = await new Order(1, 1, 1, 1, '2024-12-01', 'pending');
        expect(order.newspaper_id).toBe(1);
    });

    // Test #7 - Invalid Delivery Date
    // Test #: 7
    // Test Objective: Should throw error for invalid delivery_date .
    // Inputs: expect(() => new Order(null, 1, 1, 1, 'invalid-date', 'pending')).
    // Expected Output: expect(() => new Order(null, 1, 1, 1, 'invalid-date', 'pending')); .toThrowError('Invalid delivery date');.
    test('should throw error for invalid delivery_date (not a valid date)', () => {
        expect(() => new Order(null, 1, 1, 1, 'invalid-date', 'pending'))
            .toThrowError('Invalid delivery date');
    });

    // Test #8 - Valid Delivery Date
    // Test #: 8
    // Test Objective: Should create order for valid delivery_date.
    // Inputs: const order = await new Order(1, 1, 1, 1, '2024-12-01', 'pending');.
    // Expected Output: expect(order.delivery_date).toBe('2024-12-01');.
    test('should create Order for valid delivery_date', async () => {
        const order = await new Order(1, 1, 1, 1, '2024-12-01', 'pending');
        expect(order.delivery_date).toBe('2024-12-01');
    });

    // Test #9 - Invalid Status (Invalid status string)
    // Test #: 9
    // Test Objective: Should throw error for invalid status.
    // Inputs: expect(() => new Order(null, 1, 1, 1, '2024-12-01', 'invalid-status')).
    // Expected Output: expect(() => new Order(null, 1, 1, 1, '2024-12-01', 'invalid-status')); .toThrowError('Invalid order status. Valid statuses are: "pending", "delivered", "missed", "canceled".');.
    test('should throw error for invalid status', () => {
        expect(() => new Order(null, 1, 1, 1, '2024-12-01', 'invalid-status'))
            .toThrowError('Invalid order status. Valid statuses are: "pending", "delivered", "missed", "canceled".');
    });

    // Test #10 - Valid Status
    // Test #: 10
    // Test Objective: Should create order for valid status.
    // Inputs: const order = await new Order(1, 1, 1, 1, '2024-12-01', 'pending');.
    // Expected Output: expect(order.status).toBe('pending');.
    test('should create Order for valid status', async () => {
        const order = await new Order(1, 1, 1, 1, '2024-12-01', 'pending');
        expect(order.status).toBe('pending');
    });

    // Test #11 - Auto-generate order_id if not provided
    // Test #: 11
    // Test Objective: Should generate order_id if not provided.
    // Inputs: const order = await new Order(null, 1, 1, 1, '2024-12-01', 'pending');.
    // Expected Output: expect(order.order_id).toBe(6);  // Auto-generated order_id (max_id + 1).
    test('should generate order_id if not provided', async () => {
        const mockQuery = jest.fn((query, callback) => {
            callback(null, [{ current_id: '5' }]);
        });
        dbConnection.mockReturnValue({ query: mockQuery, end: jest.fn() });

        const order = await new Order(null, 1, 1, 1, '2024-12-01', 'pending');
        expect(order.order_id).toBe(6);  // Auto-generated order_id (max_id + 1)
    });

    // Test #12 - Set order_id if provided
    // Test #: 12
    // Test Objective: Should set order_id if provided.
    // Inputs: const order = await new Order(123, 1, 1, 1, '2024-12-01', 'pending');.
    // Expected Output: expect(order.order_id).toBe(123);.
    test('should set order_id if provided', async () => {
        const order = await new Order(123, 1, 1, 1, '2024-12-01', 'pending');
        expect(order.order_id).toBe(123);
    });
});
