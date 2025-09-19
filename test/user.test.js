const LibrarySystem = require('../src/index');

describe('Authentication Flow', () => {
  let library;

  beforeEach(() => {
    library = new LibrarySystem();
    library.register('admin', 'Alice', 'password1');
    library.register('user', 'Bob', 'password2');
  });

  describe('Login Process', () => {
    test('should login admin successfully with correct credentials', () => {
      const result = library.login('Alice', 'password1');
      expect(result).toBe('Admin Alice successfully logged in.');
    });

    test('should login user successfully with correct credentials', () => {
      const result = library.login('Bob', 'password2');
      expect(result).toBe('User Bob successfully logged in.');
    });

    test('should not login with incorrect password', () => {
      const result = library.login('Alice', 'wrongpassword');
      expect(result).toBe('Incorrect password.');
    });

    test('should not login non-existent user', () => {
      const result = library.login('NonExistent', 'password');
      expect(result).toBe('User NonExistent does not exist.');
    });

    test('should handle user switching during session', () => {
      library.login('Alice', 'password1');
      const result = library.login('Bob', 'password2');
      expect(result).toBe('User Bob successfully logged in.');
    });
  });

  describe('Logout Process', () => {
    test('should logout successfully when user is logged in', () => {
      library.login('Alice', 'password1');
      const result = library.logout();
      expect(result).toBe('Successfully logged out.');
    });

    test('should not logout when no user is logged in', () => {
      const result = library.logout();
      expect(result).toBe('No user is currently logged in.');
    });

    test('should not logout twice in a row', () => {
      library.login('Alice', 'password1');
      library.logout();
      const result = library.logout();
      expect(result).toBe('No user is currently logged in.');
    });
  });

  describe('Authentication State', () => {
    test('should require authentication for protected operations', () => {
      expect(library.addBook('Test', 'Author', 1)).toBe('Please login first.');
      expect(library.listBooks()).toBe('Please login first.');
      expect(library.searchBook('Test', 'Author')).toBe('Please login first.');
      expect(library.borrowBook('Test', 'Author')).toBe('Please login first.');
      expect(library.returnBook('Test', 'Author')).toBe('Please login first.');
      expect(library.deleteBook('Test', 'Author')).toBe('Please login first.');
    });

    test('should maintain authentication state throughout session', () => {
      library.login('Alice', 'password1');
      
      expect(library.addBook('Test', 'Author', 1)).toBe('Book "Test" by Author added successfully, inventory: 1.');
      expect(library.listBooks()).toBe('Book List:\nTest - Author - Inventory: 1');
      expect(library.searchBook('Test', 'Author')).toBe('Test - Author - Inventory: 1');
    });

    test('should clear authentication state after logout', () => {
      library.login('Alice', 'password1');
      library.logout();
      
      expect(library.addBook('Test', 'Author', 1)).toBe('Please login first.');
    });
  });

  describe('Session Security', () => {
    test('should prevent unauthorized access after failed login', () => {
      library.login('Alice', 'wrongpassword');
      expect(library.addBook('Test', 'Author', 1)).toBe('Please login first.');
    });

    test('should handle concurrent login attempts', () => {
      library.login('Alice', 'password1');
      library.login('Bob', 'password2');
      

      expect(library.addBook('Test', 'Author', 1)).toBe('Permission denied. Admin role required.');
      expect(library.borrowBook('Test', 'Author')).toBe('Book "Test" by Author not found.');
    });
  });
});