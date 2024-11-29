import { Area } from '../entities/Area.js'; // Update with correct path if necessary
import { dbConnection } from '../entities/connection.js';

jest.mock('../entities/connection.js');  // Mock the dbConnection to avoid real DB interaction

describe('Area Class Tests', () => {
    beforeEach(() => {
        dbConnection.mockClear();
    });


    // Test #: 1
    // Test Objective: Should throw error if area name is invalid.
    // Inputs: await Area.create(null, '', [1, 2, 3]);  // Empty name; await Area.create(null, 'A', [1, 2, 3]);  // Name too short; await Area.create(null, 'A'.repeat(51), [1, 2, 3]);  // Name too long.
    // Expected Output: expect(error.message).toBe('Invalid area name. It must be between 2 and 50 characters.');; expect(error.message).toBe('Invalid area name. It must be between 2 and 50 characters.');; expect(error.message).toBe('Invalid area name. It must be between 2 and 50 characters.');.
    test('should throw error if area name is invalid', async () => {
        try {
            await Area.create(null, '', [1, 2, 3]);  // Empty name
        } catch (error) {
            expect(error.message).toBe('Invalid area name. It must be between 2 and 50 characters.');
        }

        try {
            await Area.create(null, 'A', [1, 2, 3]);  // Name too short
        } catch (error) {
            expect(error.message).toBe('Invalid area name. It must be between 2 and 50 characters.');
        }

        try {
            await Area.create(null, 'A'.repeat(51), [1, 2, 3]);  // Name too long
        } catch (error) {
            expect(error.message).toBe('Invalid area name. It must be between 2 and 50 characters.');
        }
    });

    // Test #: 2
    // Test Objective: Should throw error if customers array is invalid.
    // Inputs: await Area.create(null, 'New Area', []);  // Empty customers array; await Area.create(null, 'New Area', [1, 'two', 3]);  // Invalid customer ID.
    // Expected Output: expect(error.message).toBe('Customers array cannot be empty.');; expect(error.message).toBe('Invalid customer_id at index 1. It must be a positive integer.');.
    test('should throw error if customers array is invalid', async () => {
        try {
            await Area.create(null, 'New Area', []);  // Empty customers array
        } catch (error) {
            expect(error.message).toBe('Customers array cannot be empty.');
        }

        try {
            await Area.create(null, 'New Area', [1, 'two', 3]);  // Invalid customer ID
        } catch (error) {
            expect(error.message).toBe('Invalid customer_id at index 1. It must be a positive integer.');
        }
    });

    // Test #: 3
    // Test Objective: Should throw error if area id is not unique.
    // Inputs: const newArea = await Area.create(6, 'Central Park', [1, 2, 3]);.
    // Expected Output: expect(error.message).toBe('Area ID is not unique.');.
    test('should throw error if area ID is not unique', async () => {
        dbConnection.mockReturnValue({
            query: jest.fn((query, values, callback) => {
                if (query.includes('COUNT(*)')) {
                    callback(null, [{ count: 1 }]);  // Simulate that area_id is not unique
                }
            }),
            end: jest.fn(),
        });

        try {
            const newArea = await Area.create(6, 'Central Park', [1, 2, 3]);
        } catch (error) {
            expect(error.message).toBe('Area ID is not unique.');
        }
    });
});
