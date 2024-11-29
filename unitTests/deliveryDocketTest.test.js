import { DeliveryDocket } from '../entities/DeliveryDocket.js';
import { dbConnection } from '../entities/connection.js';

jest.mock('../entities/connection.js');

describe('DeliveryDocket Class Tests', () => {
  beforeEach(() => {
    // Clear mocks before each test
    dbConnection.mockClear();
  });

    // Test #: 1
    // Test Objective: Should create a valid delivery docket with valid data.
    // Inputs: const newDocket = await new DeliveryDocket(null, 1, 'John Doe', orders, '2024-11-08');.
    // Expected Output: expect(newDocket.area_id).toBe(1);; expect(newDocket.delivery_person).toBe('John Doe');; expect(newDocket.orders).toBe(orders);; expect(newDocket.date).toBe('2024-11-08');; expect(newDocket.docket_id).toBe(6);  // Since MAX(docket_id) = 5, it should increment by 1 to 6.
  test('should create a valid delivery docket with valid data', async () => {
    // Mock the database response for the 'SELECT MAX(docket_id)' query
    dbConnection.mockReturnValue({
      query: jest.fn((query, callback) => {
        if (query.includes('MAX(docket_id)')) {
          callback(null, [{ current_id: 5 }]);  // Mocking the DB returning docket_id = 5
        }
      }),
      end: jest.fn(),
    });

    const orders = [
      { area_id: 1, order_id: 101 },
      { area_id: 1, order_id: 102 }
    ];

    const newDocket = await new DeliveryDocket(null, 1, 'John Doe', orders, '2024-11-08');

    expect(newDocket.area_id).toBe(1);
    expect(newDocket.delivery_person).toBe('John Doe');
    expect(newDocket.orders).toBe(orders);
    expect(newDocket.date).toBe('2024-11-08');
    expect(newDocket.docket_id).toBe(6);  // Since MAX(docket_id) = 5, it should increment by 1 to 6
  });

    // Test #: 2
    // Test Objective: Should throw error if the date is invalid.
    // Inputs: await new DeliveryDocket(null, 1, 'John Doe', [], 'invalid-date');; await new DeliveryDocket(null, 1, 'John Doe', [], '');.
    // Expected Output: expect(error.message).toBe('Invalid date');; expect(error.message).toBe('Invalid date');.
  test('should throw error if the date is invalid', async () => {
    try {
      await new DeliveryDocket(null, 1, 'John Doe', [], 'invalid-date');
    } catch (error) {
      expect(error.message).toBe('Invalid date');
    }

    try {
      await new DeliveryDocket(null, 1, 'John Doe', [], '');
    } catch (error) {
      expect(error.message).toBe('Invalid date');
    }
  });

    // Test #: 3
    // Test Objective: Should throw error if the area_id is invalid.
    // Inputs: await new DeliveryDocket(null, -1, 'John Doe', [], '2024-11-08');; await new DeliveryDocket(null, 'invalid', 'John Doe', [], '2024-11-08');.
    // Expected Output: expect(error.message).toBe('Invalid area_id. It must be a positive integer.');; expect(error.message).toBe('Invalid area_id. It must be a positive integer.');.
  test('should throw error if the area_id is invalid', async () => {
    try {
      await new DeliveryDocket(null, -1, 'John Doe', [], '2024-11-08');
    } catch (error) {
      expect(error.message).toBe('Invalid area_id. It must be a positive integer.');
    }

    try {
      await new DeliveryDocket(null, 'invalid', 'John Doe', [], '2024-11-08');
    } catch (error) {
      expect(error.message).toBe('Invalid area_id. It must be a positive integer.');
    }
  });

    // Test #: 4
    // Test Objective: Should throw error if the delivery_person is invalid.
    // Inputs: await new DeliveryDocket(null, 1, '', [], '2024-11-08');; await new DeliveryDocket(null, 1, 123, [], '2024-11-08');.
    // Expected Output: expect(error.message).toBe('Invalid delivery_person. It must be a non-empty string.');; expect(error.message).toBe('Invalid delivery_person. It must be a non-empty string.');.
  test('should throw error if the delivery_person is invalid', async () => {
    try {
      await new DeliveryDocket(null, 1, '', [], '2024-11-08');
    } catch (error) {
      expect(error.message).toBe('Invalid delivery_person. It must be a non-empty string.');
    }

    try {
      await new DeliveryDocket(null, 1, 123, [], '2024-11-08');
    } catch (error) {
      expect(error.message).toBe('Invalid delivery_person. It must be a non-empty string.');
    }
  });

    // Test #: 5
    // Test Objective: Should throw error if orders is not an array.
    // Inputs: await new DeliveryDocket(null, 1, 'John Doe', 'not-an-array', '2024-11-08');.
    // Expected Output: expect(error.message).toBe('Orders must be an array');.
  test('should throw error if orders is not an array', async () => {
    try {
      await new DeliveryDocket(null, 1, 'John Doe', 'not-an-array', '2024-11-08');
    } catch (error) {
      expect(error.message).toBe('Orders must be an array');
    }
  });

    // Test #: 6
    // Test Objective: Should throw error if an order does not have valid area_id and order_id.
    // Inputs: await new DeliveryDocket(null, 1, 'John Doe', invalidOrders, '2024-11-08');.
    // Expected Output: expect(error.message).toBe('Each order must have a valid area_id and order_id');.
  test('should throw error if an order does not have valid area_id and order_id', async () => {
    const invalidOrders = [
      { area_id: 1 },
      { order_id: 102 },
    ];

    try {
      await new DeliveryDocket(null, 1, 'John Doe', invalidOrders, '2024-11-08');
    } catch (error) {
      expect(error.message).toBe('Each order must have a valid area_id and order_id');
    }
  });

    // Test #: 7
    // Test Objective: Should return true if all orders match the area_id.
    // Inputs: const docket = await new DeliveryDocket(null, 1, 'John Doe', validOrders, '2024-11-08');.
    // Expected Output: expect(result).toBe(true);.
  test('should return true if all orders match the area_id', async () => {
    const validOrders = [
      { area_id: 1, order_id: 101 },
      { area_id: 1, order_id: 102 }
    ];

    const docket = await new DeliveryDocket(null, 1, 'John Doe', validOrders, '2024-11-08');

    const result = docket.validateOrdersForArea();
    expect(result).toBe(true);
  });

    // Test #: 8
    // Test Objective: Should return false if any order does not match the area_id.
    // Inputs: const docket = await new DeliveryDocket(null, 1, 'John Doe', invalidOrders, '2024-11-08');.
    // Expected Output: expect(result).toBe(false);.
  test('should return false if any order does not match the area_id', async () => {
    const invalidOrders = [
      { area_id: 1, order_id: 101 },
      { area_id: 2, order_id: 102 }
    ];

    const docket = await new DeliveryDocket(null, 1, 'John Doe', invalidOrders, '2024-11-08');

    const result = docket.validateOrdersForArea();
    expect(result).toBe(false);
  });
});
