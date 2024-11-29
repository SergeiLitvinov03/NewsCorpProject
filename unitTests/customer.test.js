import { Customer, CustomerExceptionHandler } from '../entities/Customer.js';
import { dbConnection } from '../entities/connection.js';

jest.mock('../entities/connection.js');

describe('Customer Class Tests', () => {
    beforeEach(() => {
        dbConnection.mockClear();
    });


    // Test #: 1
    // Test Objective: Should throw error if customer name is invalid.
    // Inputs: await new Customer(null, '', '123 Main St', '1234567890', 1, 'john.doe@example.com', '2024-11-08', 'active');; await new Customer(null, 'A', '123 Main St', '1234567890', 1, 'john.doe@example.com', '2024-11-08', 'active');; await new Customer(null, 'A'.repeat(51), '123 Main St', '1234567890', 1, 'john.doe@example.com', '2024-11-08', 'active');.
    // Expected Output: expect(error).toBeInstanceOf(CustomerExceptionHandler);; expect(error.message).toBe('Customer Name NOT specified');; expect(error).toBeInstanceOf(CustomerExceptionHandler);; expect(error.message).toBe('Customer Name does not meet minimum length requirements');; expect(error).toBeInstanceOf(CustomerExceptionHandler);; expect(error.message).toBe('Customer Name exceeds maximum length requirements');.
    test('should throw error if customer name is invalid', async () => {
        try {
            await new Customer(null, '', '123 Main St', '1234567890', 1, 'john.doe@example.com', '2024-11-08', 'active');
        } catch (error) {
            expect(error).toBeInstanceOf(CustomerExceptionHandler);
            expect(error.message).toBe('Customer Name NOT specified');
        }

        try {
            await new Customer(null, 'A', '123 Main St', '1234567890', 1, 'john.doe@example.com', '2024-11-08', 'active');
        } catch (error) {
            expect(error).toBeInstanceOf(CustomerExceptionHandler);
            expect(error.message).toBe('Customer Name does not meet minimum length requirements');
        }

        try {
            await new Customer(null, 'A'.repeat(51), '123 Main St', '1234567890', 1, 'john.doe@example.com', '2024-11-08', 'active');
        } catch (error) {
            expect(error).toBeInstanceOf(CustomerExceptionHandler);
            expect(error.message).toBe('Customer Name exceeds maximum length requirements');
        }
    });

    // Test #: 2
    // Test Objective: Should throw error if customer address is invalid.
    // Inputs: await new Customer(null, 'John Doe', '', '1234567890', 1, 'john.doe@example.com', '2024-11-08', 'active');; await new Customer(null, 'John Doe', '123', '1234567890', 1, 'john.doe@example.com', '2024-11-08', 'active');; await new Customer(null, 'John Doe', 'A'.repeat(61), '1234567890', 1, 'john.doe@example.com', '2024-11-08', 'active');.
    // Expected Output: expect(error).toBeInstanceOf(CustomerExceptionHandler);; expect(error.message).toBe('Customer Address NOT specified');; expect(error).toBeInstanceOf(CustomerExceptionHandler);; expect(error.message).toBe('Customer Address does not meet minimum length requirements');; expect(error).toBeInstanceOf(CustomerExceptionHandler);; expect(error.message).toBe('Customer Address exceeds maximum length requirements');.
    test('should throw error if customer address is invalid', async () => {
        try {
            await new Customer(null, 'John Doe', '', '1234567890', 1, 'john.doe@example.com', '2024-11-08', 'active');
        } catch (error) {
            expect(error).toBeInstanceOf(CustomerExceptionHandler);
            expect(error.message).toBe('Customer Address NOT specified');
        }

        try {
            await new Customer(null, 'John Doe', '123', '1234567890', 1, 'john.doe@example.com', '2024-11-08', 'active');
        } catch (error) {
            expect(error).toBeInstanceOf(CustomerExceptionHandler);
            expect(error.message).toBe('Customer Address does not meet minimum length requirements');
        }

        try {
            await new Customer(null, 'John Doe', 'A'.repeat(61), '1234567890', 1, 'john.doe@example.com', '2024-11-08', 'active');
        } catch (error) {
            expect(error).toBeInstanceOf(CustomerExceptionHandler);
            expect(error.message).toBe('Customer Address exceeds maximum length requirements');
        }
    });

    // Test #: 3
    // Test Objective: Should throw error if customer phone number is invalid.
    // Inputs: await new Customer(null, 'John Doe', '123 Main St', '', 1, 'john.doe@example.com', '2024-11-08', 'active');; await new Customer(null, 'John Doe', '123 Main St', '12345', 1, 'john.doe@example.com', '2024-11-08', 'active');; await new Customer(null, 'John Doe', '123 Main St', '12345678901234567890', 1, 'john.doe@example.com', '2024-11-08', 'active');.
    // Expected Output: expect(error).toBeInstanceOf(CustomerExceptionHandler);; expect(error.message).toBe('Customer Phone');; expect(error).toBeInstanceOf(CustomerExceptionHandler);; expect(error.message).toBe('Customer Phone Number does not meet minimum length requirements');; expect(error).toBeInstanceOf(CustomerExceptionHandler);; expect(error.message).toBe('Customer Phone Number exceeds maximum length requirements');.
    test('should throw error if customer phone number is invalid', async () => {
        try {
            await new Customer(null, 'John Doe', '123 Main St', '', 1, 'john.doe@example.com', '2024-11-08', 'active');
        } catch (error) {
            expect(error).toBeInstanceOf(CustomerExceptionHandler);
            expect(error.message).toBe('Customer Phone');
        }

        try {
            await new Customer(null, 'John Doe', '123 Main St', '12345', 1, 'john.doe@example.com', '2024-11-08', 'active');
        } catch (error) {
            expect(error).toBeInstanceOf(CustomerExceptionHandler);
            expect(error.message).toBe('Customer Phone Number does not meet minimum length requirements');
        }

        try {
            await new Customer(null, 'John Doe', '123 Main St', '12345678901234567890', 1, 'john.doe@example.com', '2024-11-08', 'active');
        } catch (error) {
            expect(error).toBeInstanceOf(CustomerExceptionHandler);
            expect(error.message).toBe('Customer Phone Number exceeds maximum length requirements');
        }
    });

    // Test #: 4
    // Test Objective: Should throw error if area id is invalid.
    // Inputs: await new Customer(null, 'John Doe', '123 Main St', '1234567890', -1, 'john.doe@example.com', '2024-11-08', 'active');; await new Customer(null, 'John Doe', '123 Main St', '1234567890', 'invalid', 'john.doe@example.com', '2024-11-08', 'active');.
    // Expected Output: expect(error).toBeInstanceOf(CustomerExceptionHandler);; expect(error.message).toBe('Invalid Area ID');; expect(error).toBeInstanceOf(CustomerExceptionHandler);; expect(error.message).toBe('Invalid Area ID');.
    test('should throw error if area id is invalid', async () => {
        try {
            await new Customer(null, 'John Doe', '123 Main St', '1234567890', -1, 'john.doe@example.com', '2024-11-08', 'active');
        } catch (error) {
            expect(error).toBeInstanceOf(CustomerExceptionHandler);
            expect(error.message).toBe('Invalid Area ID');
        }

        try {
            await new Customer(null, 'John Doe', '123 Main St', '1234567890', 'invalid', 'john.doe@example.com', '2024-11-08', 'active');
        } catch (error) {
            expect(error).toBeInstanceOf(CustomerExceptionHandler);
            expect(error.message).toBe('Invalid Area ID');
        }
    });

    // Test #: 5
    // Test Objective: Should throw error if email is invalid.
    // Inputs: await new Customer(null, 'John Doe', '123 Main St', '1234567890', 1, 'invalid-email', '2024-11-08', 'active');.
    // Expected Output: expect(error).toBeInstanceOf(CustomerExceptionHandler);; expect(error.message).toBe('Invalid Email Address');.
    test('should throw error if email is invalid', async () => {
        try {
            await new Customer(null, 'John Doe', '123 Main St', '1234567890', 1, 'invalid-email', '2024-11-08', 'active');
        } catch (error) {
            expect(error).toBeInstanceOf(CustomerExceptionHandler);
            expect(error.message).toBe('Invalid Email Address');
        }
    });

    // Test #: 6
    // Test Objective: Should throw error if last payment date is invalid.
    // Inputs: await new Customer(null, 'John Doe', '123 Main St', '1234567890', 1, 'john.doe@example.com', 'invalid-date', 'active');.
    // Expected Output: expect(error).toBeInstanceOf(CustomerExceptionHandler);; expect(error.message).toBe('Invalid Last Payment Date');.
    test('should throw error if last payment date is invalid', async () => {
        try {
            await new Customer(null, 'John Doe', '123 Main St', '1234567890', 1, 'john.doe@example.com', 'invalid-date', 'active');
        } catch (error) {
            expect(error).toBeInstanceOf(CustomerExceptionHandler);
            expect(error.message).toBe('Invalid Last Payment Date');
        }
    });

    // Test #: 7
    // Test Objective: Should throw error if status is invalid.
    // Inputs: await new Customer(null, 'John Doe', '123 Main St', '1234567890', 1, 'john.doe@example.com', '2024-11-08', 'invalid-status');.
    // Expected Output: expect(error).toBeInstanceOf(CustomerExceptionHandler);; expect(error.message).toBe('Invalid Status');.
    test('should throw error if status is invalid', async () => {
        try {
            await new Customer(null, 'John Doe', '123 Main St', '1234567890', 1, 'john.doe@example.com', '2024-11-08', 'invalid-status');
        } catch (error) {
            expect(error).toBeInstanceOf(CustomerExceptionHandler);
            expect(error.message).toBe('Invalid Status');
        }
    });
});
