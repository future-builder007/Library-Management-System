const LibrarySystem = require('../src/index');

describe('Authentication', () => {
  let library;

  beforeEach(() => {
    library = new LibrarySystem();
  });

  describe('User Registration', () => {
    test('should register admin successfully', () => {
      const result = library.register('admin', 'Alice', 'password1');
      expect(result).toBe('Admin Alice successfully registered.');
    });

    test('should register user successfully', () => {
      const result = library.register('user', 'Bob', 'password2');
      expect(result).toBe('User Bob successfully registered.');
    });

    test('should not register user with invalid role', () => {
      const result = library.register('invalid', 'Charlie', 'password3');
      expect(result).toBe('Invalid role. Role must be "admin" or "user".');
    });

    test('should not register duplicate user', () => {
      library.register('user', 'Bob', 'password1');
      const result = library.register('user', 'Bob', 'password2');
      expect(result).toBe('User Bob already exists.');
    });
  });

  describe('User Login/Logout', () => {
    beforeEach(() => {
      library.register('admin', 'Alice', 'password1');
      library.register('user', 'Bob', 'password2');
    });

    test('should login successfully with correct credentials', () => {
      const result = library.login('Alice', 'password1');
      expect(result).toBe('Admin Alice successfully logged in.');
    });

    test('should not login with incorrect password', () => {
      const result = library.login('Alice', 'wrongpassword');
      expect(result).toBe('Incorrect password.');
    });

    test('should not login non-existent user', () => {
      const result = library.login('NonExistent', 'password');
      expect(result).toBe('User NonExistent does not exist.');
    });

    test('should logout successfully', () => {
      library.login('Alice', 'password1');
      const result = library.logout();
      expect(result).toBe('Successfully logged out.');
    });

    test('should not logout when no user is logged in', () => {
      const result = library.logout();
      expect(result).toBe('No user is currently logged in.');
    });
  });
});