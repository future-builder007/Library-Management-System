const LibrarySystem = require('../src/index');

describe('Integration Tests', () => {
  let library;

  beforeEach(() => {
    library = new LibrarySystem();
  });

  describe('Basic Library Workflow', () => {
    test('should complete a typical library workflow', () => {
      // 1. Register users
      expect(library.register('admin', 'Alice', 'admin123')).toBe('Admin Alice successfully registered.');
      expect(library.register('user', 'Bob', 'user456')).toBe('User Bob successfully registered.');

      // 2. Admin adds a book
      library.login('Alice', 'admin123');
      expect(library.addBook('Clean Code', 'Robert C. Martin', 3)).toBe('Book "Clean Code" by Robert C. Martin added successfully, inventory: 3.');

      // 3. User searches and borrows book
      library.login('Bob', 'user456');
      expect(library.searchBook('Clean Code', 'Robert C. Martin')).toBe('Clean Code - Robert C. Martin - Inventory: 3');
      expect(library.borrowBook('Clean Code', 'Robert C. Martin')).toBe('Book "Clean Code" successfully borrowed.');

      // 4. Verify inventory decreased
      expect(library.searchBook('Clean Code', 'Robert C. Martin')).toBe('Clean Code - Robert C. Martin - Inventory: 2');

      // 5. User returns book
      expect(library.returnBook('Clean Code', 'Robert C. Martin')).toBe('Book "Clean Code" successfully returned.');

      // 6. Verify inventory restored
      expect(library.searchBook('Clean Code', 'Robert C. Martin')).toBe('Clean Code - Robert C. Martin - Inventory: 3');
    });

    test('should handle basic permission restrictions', () => {
      library.register('admin', 'Admin', 'pass1');
      library.register('user', 'User', 'pass2');

      // Admin can manage books but not borrow
      library.login('Admin', 'pass1');
      library.addBook('Test Book', 'Test Author', 1);
      expect(library.borrowBook('Test Book', 'Test Author')).toBe('Permission denied. Only users can perform this action.');

      // User can borrow books but not manage
      library.login('User', 'pass2');
      expect(library.addBook('Another Book', 'Another Author', 1)).toBe('Permission denied. Admin role required.');
      expect(library.borrowBook('Test Book', 'Test Author')).toBe('Book "Test Book" successfully borrowed.');
    });
  });

  describe('Error Handling', () => {
    test('should handle common error scenarios', () => {
      library.register('user', 'TestUser', 'password');
      library.login('TestUser', 'password');

      // Try to borrow non-existent book
      expect(library.borrowBook('Non Existent', 'Unknown')).toBe('Book "Non Existent" by Unknown not found.');

      // Try to return book that wasn't borrowed
      expect(library.returnBook('Non Existent', 'Unknown')).toBe('You have not borrowed "Non Existent" by Unknown.');

      // Operations without login
      library.logout();
      expect(library.addBook('Book', 'Author', 1)).toBe('Please login first.');
      expect(library.borrowBook('Book', 'Author')).toBe('Please login first.');
    });
  });
});