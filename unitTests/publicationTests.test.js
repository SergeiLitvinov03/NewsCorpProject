import { Publication } from '../entities/publication.js';
import { dbConnection } from '../entities/connection.js';

jest.mock('../entities/connection.js', () => ({
  dbConnection: jest.fn().mockReturnValue({
    query: jest.fn((query, callback) => {
      if (query.includes('SELECT MAX(newspaper_id)')) {
        callback(null, [{ current_id: 1 }]);
      } else {
        callback(new Error('Query Error'), null);
      }
    }),
    end: jest.fn(),
  }),
}));

describe('Publication Tests', () => {

  // Test Case 1: Constructor and ID generation
    // Test #: 1
    // Test Objective: Should create a new publication with a unique publication_id.
    // Inputs: const publication = await new Publication('The Daily News', 'daily', 5.00);.
    // Expected Output: expect(publication.publication_id).toBe(2);.
  it('should create a new publication with a unique publication_id', async () => {
    const publication = await new Publication('The Daily News', 'daily', 5.00);
    expect(publication.publication_id).toBe(2);
  });

    // Test #: 2
    // Test Objective: Should create a new publication with a provided publication_id.
    // Inputs: const publication = await new Publication('The Weekly Journal', 'weekly', 10.00, 123);.
    // Expected Output: expect(publication.publication_id).toBe(123);.
  it('should create a new publication with a provided publication_id', async () => {
    const publication = await new Publication('The Weekly Journal', 'weekly', 10.00, 123);
    expect(publication.publication_id).toBe(123);
  });

  // Test Case 2: validateName
    // Test #: 3
    // Test Objective: Should throw an error if name is not a string.
    // Inputs: expect(() => new Publication(123, 'daily', 5.00)).toThrow('Name should be a string!');.
    // Expected Output: expect(() => new Publication(123, 'daily', 5.00)).toThrow('Name should be a string!');.
  it('should throw an error if name is not a string', () => {
    expect(() => new Publication(123, 'daily', 5.00)).toThrow('Name should be a string!');
  });

    // Test #: 4
    // Test Objective: Should throw an error if name is empty.
    // Inputs: expect(() => new Publication('', 'daily', 5.00)).toThrow('Name should not be 0 characters!');.
    // Expected Output: expect(() => new Publication('', 'daily', 5.00)).toThrow('Name should not be 0 characters!');.
  it('should throw an error if name is empty', () => {
    expect(() => new Publication('', 'daily', 5.00)).toThrow('Name should not be 0 characters!');
  });

    // Test #: 5
    // Test Objective: Should throw an error if name is less than 2 characters.
    // Inputs: expect(() => new Publication('A', 'daily', 5.00)).toThrow('Name should be more than 2 characters!');.
    // Expected Output: expect(() => new Publication('A', 'daily', 5.00)).toThrow('Name should be more than 2 characters!');.
  it('should throw an error if name is less than 2 characters', () => {
    expect(() => new Publication('A', 'daily', 5.00)).toThrow('Name should be more than 2 characters!');
  });

    // Test #: 6
    // Test Objective: Should throw an error if name is more than 50 characters.
    // Inputs: expect(() => new Publication('A'.repeat(51), 'daily', 5.00)).toThrow('Your name is hardly 50 characters, be for real');.
    // Expected Output: expect(() => new Publication('A'.repeat(51), 'daily', 5.00)).toThrow('Your name is hardly 50 characters, be for real');.
  it('should throw an error if name is more than 50 characters', () => {
    expect(() => new Publication('A'.repeat(51), 'daily', 5.00)).toThrow('Your name is hardly 50 characters, be for real');
  });

    // Test #: 7
    // Test Objective: Should accept a valid name.
    // Inputs: const publication = await new Publication('The Times', 'daily', 5.00);.
    // Expected Output: expect(publication.name).toBe('The Times');.
  it('should accept a valid name', async () => {
    const publication = await new Publication('The Times', 'daily', 5.00);
    expect(publication.name).toBe('The Times');
  });

  // Test Case 3: validateType
    // Test #: 8
    // Test Objective: Should throw an error if type is not a string.
    // Inputs: expect(() => new Publication('The Times', 123, 5.00)).toThrow('Type should be a string!');.
    // Expected Output: expect(() => new Publication('The Times', 123, 5.00)).toThrow('Type should be a string!');.
  it('should throw an error if type is not a string', () => {
    expect(() => new Publication('The Times', 123, 5.00)).toThrow('Type should be a string!');
  });

    // Test #: 9
    // Test Objective: Should throw an error if type is not "daily.
    // Inputs: expect(() => new Publication('The Times', 'yearly', 5.00)).toThrow('Type should be daily, weekly, or monthly!');.
    // Expected Output: expect(() => new Publication('The Times', 'yearly', 5.00)).toThrow('Type should be daily, weekly, or monthly!');.
  it('should throw an error if type is not "daily", "weekly", or "monthly"', () => {
    expect(() => new Publication('The Times', 'yearly', 5.00)).toThrow('Type should be daily, weekly, or monthly!');
  });

    // Test #: 10
    // Test Objective: Should accept a valid type.
    // Inputs: const publication = await new Publication('The Times', 'weekly', 5.00);.
    // Expected Output: expect(publication.type).toBe('weekly');.
  it('should accept a valid type', async () => {
    const publication = await new Publication('The Times', 'weekly', 5.00);
    expect(publication.type).toBe('weekly');
  });

  // Test Case 4: validatePrice
    // Test #: 11
    // Test Objective: Should throw an error if price is not a number.
    // Inputs: expect(() => new Publication('The Times', 'daily', 'five')).toThrow('Price should be a number!');.
    // Expected Output: expect(() => new Publication('The Times', 'daily', 'five')).toThrow('Price should be a number!');.
  it('should throw an error if price is not a number', () => {
    expect(() => new Publication('The Times', 'daily', 'five')).toThrow('Price should be a number!');
  });

    // Test #: 12
    // Test Objective: Should throw an error if price is less than 0.
    // Inputs: expect(() => new Publication('The Times', 'daily', -5.00)).toThrow('Price should not be less than zero!');.
    // Expected Output: expect(() => new Publication('The Times', 'daily', -5.00)).toThrow('Price should not be less than zero!');.
  it('should throw an error if price is less than 0', () => {
    expect(() => new Publication('The Times', 'daily', -5.00)).toThrow('Price should not be less than zero!');
  });

    // Test #: 13
    // Test Objective: Should throw an error if price is more than 1000.
    // Inputs: expect(() => new Publication('The Times', 'daily', 1500)).toThrow('Price should not be more than a thousand!');.
    // Expected Output: expect(() => new Publication('The Times', 'daily', 1500)).toThrow('Price should not be more than a thousand!');.
  it('should throw an error if price is more than 1000', () => {
    expect(() => new Publication('The Times', 'daily', 1500)).toThrow('Price should not be more than a thousand!');
  });

    // Test #: 14
    // Test Objective: Should accept a valid price.
    // Inputs: const publication = await new Publication('The Times', 'daily', 5.00);.
    // Expected Output: expect(publication.price).toBe(5.00);.
  it('should accept a valid price', async () => {
    const publication = await new Publication('The Times', 'daily', 5.00);
    expect(publication.price).toBe(5.00);
  });

  // Test Case 5: Database connection error
    // Test #: 15
    // Test Objective: Should throw an error if database query fails.
    // Inputs: query: jest.fn((query, callback) => callback(new Error('Query Error'), null)),; await new Publication('The Times', 'daily', 5.00);.
    // Expected Output: expect(error.message).toBe('Query Error');.
  it('should throw an error if database query fails', async () => {
    dbConnection.mockReturnValueOnce({
      query: jest.fn((query, callback) => callback(new Error('Query Error'), null)),
      end: jest.fn(),
    });

    try {
      await new Publication('The Times', 'daily', 5.00);
    } catch (error) {
      expect(error.message).toBe('Query Error');
    }
  });
});
