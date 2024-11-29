import { WarningLetter } from '../entities/warningLetter.js';
import { dbConnection } from '../entities/connection.js';

jest.mock('../entities/connection.js', () => ({
  dbConnection: jest.fn().mockReturnValue({
    query: jest.fn((query, callback) => {
      if (query.includes('SELECT MAX(letter_id)')) {
        callback(null, [{ current_id: 1 }]);
      } else {
        callback(new Error('Query Error'), null);
      }
    }),
    end: jest.fn(),
  }),
}));

describe('WarningLetter Tests', () => {

  // Test Case 1: Constructor and ID generation
    // Test #: 1
    // Test Objective: Should create a new warning letter with a unique letter_id.
    // Inputs: const warningLetter = await new WarningLetter(123, '2024-11-07', 'warning', 'Late payment');.
    // Expected Output: expect(warningLetter.letter_id).toBe(2);.
  it('should create a new warning letter with a unique letter_id', async () => {
    const warningLetter = await new WarningLetter(123, '2024-11-07', 'warning', 'Late payment');
    expect(warningLetter.letter_id).toBe(2);
  });

    // Test #: 2
    // Test Objective: Should create a new warning letter with a provided letter_id.
    // Inputs: const warningLetter = await new WarningLetter(123, '2024-11-07', 'warning', 'Late payment', 456);.
    // Expected Output: expect(warningLetter.letter_id).toBe(456);.
  it('should create a new warning letter with a provided letter_id', async () => {
    const warningLetter = await new WarningLetter(123, '2024-11-07', 'warning', 'Late payment', 456);
    expect(warningLetter.letter_id).toBe(456);
  });

  // Test Case 2: validateDate
    // Test #: 3
    // Test Objective: Should throw an error if the date is invalid.
    // Inputs: await expect(() => new WarningLetter(123, 'invalid-date', 'warning', 'Late payment')).
    // Expected Output: await expect(() => new WarningLetter(123, 'invalid-date', 'warning', 'Late payment')); .toThrow('Invalid warning date');.
  it('should throw an error if the date is invalid', async () => {
    await expect(() => new WarningLetter(123, 'invalid-date', 'warning', 'Late payment'))
        .toThrow('Invalid warning date');
  });


    // Test #: 4
    // Test Objective: Should accept a valid date format.
    // Inputs: const warningLetter = await new WarningLetter(123, '2024-11-07', 'warning', 'Late payment');.
    // Expected Output: expect(warningLetter.warning_date).toBe('2024-11-07');.
  it('should accept a valid date format', async () => {
    const warningLetter = await new WarningLetter(123, '2024-11-07', 'warning', 'Late payment');
    expect(warningLetter.warning_date).toBe('2024-11-07');
  });

  // Test Case 3: validateStatus
    // Test #: 5
    // Test Objective: Should throw an error if the status is invalid.
    // Inputs: expect(() => new WarningLetter(123, '2024-11-07', 'alert', 'Late payment')).toThrow('Invalid warning letter status');.
    // Expected Output: expect(() => new WarningLetter(123, '2024-11-07', 'alert', 'Late payment')).toThrow('Invalid warning letter status');.
  it('should throw an error if the status is invalid', async () => {
    expect(() => new WarningLetter(123, '2024-11-07', 'alert', 'Late payment')).toThrow('Invalid warning letter status');
  });

    // Test #: 6
    // Test Objective: Should accept a valid status .
    // Inputs: const warningLetterWarning = await new WarningLetter(123, '2024-11-07', 'warning', 'Late payment');; const warningLetterSuspension = await new WarningLetter(123, '2024-11-07', 'suspension', 'Non-payment');.
    // Expected Output: expect(warningLetterWarning.status).toBe('warning');; expect(warningLetterSuspension.status).toBe('suspension');.
  it('should accept a valid status ("warning" or "suspension")', async () => {
    const warningLetterWarning = await new WarningLetter(123, '2024-11-07', 'warning', 'Late payment');
    expect(warningLetterWarning.status).toBe('warning');

    const warningLetterSuspension = await new WarningLetter(123, '2024-11-07', 'suspension', 'Non-payment');
    expect(warningLetterSuspension.status).toBe('suspension');
  });

  // Test Case 4: Database connection error
    // Test #: 7
    // Test Objective: Should throw an error if database query fails.
    // Inputs: query: jest.fn((query, callback) => callback(new Error('Query Error'), null)),; await new WarningLetter(123, '2024-11-07', 'warning', 'Late payment');.
    // Expected Output: expect(error.message).toBe('Query Error');.
  it('should throw an error if database query fails', async () => {
    dbConnection.mockReturnValueOnce({
      query: jest.fn((query, callback) => callback(new Error('Query Error'), null)),
      end: jest.fn(),
    });

    try {
      await new WarningLetter(123, '2024-11-07', 'warning', 'Late payment');
    } catch (error) {
      expect(error.message).toBe('Query Error');
    }
  });
});
