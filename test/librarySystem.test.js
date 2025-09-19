const LibrarySystem = require('../src/LibrarySystem');

describe('LibrarySystem', () => {
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

  describe('Book Management', () => {
    beforeEach(() => {
      library.register('admin', 'Alice', 'password1');
      library.register('user', 'Bob', 'password2');
    });

    test('admin should add book successfully', () => {
      library.login('Alice', 'password1');
      const result = library.addBook('Clean Code', 'Robert C. Martin', 5);
      expect(result).toBe('Book "Clean Code" by Robert C. Martin added successfully, inventory: 5.');
    });

    test('admin should update book inventory when adding existing book', () => {
      library.login('Alice', 'password1');
      library.addBook('Clean Code', 'Robert C. Martin', 5);
      const result = library.addBook('Clean Code', 'Robert C. Martin', 3);
      expect(result).toBe('Book "Clean Code" inventory successfully updated, new inventory: 8.');
    });

    test('user should not be able to add books', () => {
      library.login('Bob', 'password2');
      const result = library.addBook('Clean Code', 'Robert C. Martin', 5);
      expect(result).toBe('Permission denied. Admin role required.');
    });

    test('should require login to add books', () => {
      const result = library.addBook('Clean Code', 'Robert C. Martin', 5);
      expect(result).toBe('Please login first.');
    });
  });

  describe('Book Operations', () => {
    beforeEach(() => {
      library.register('admin', 'Alice', 'password1');
      library.register('user', 'Bob', 'password2');
      library.login('Alice', 'password1');
      library.addBook('Clean Code', 'Robert C. Martin', 5);
      library.logout();
    });

    test('should list books correctly', () => {
      library.login('Bob', 'password2');
      const result = library.listBooks();
      expect(result).toBe('Book List:\nClean Code - Robert C. Martin - Inventory: 5');
    });

    test('should search book successfully', () => {
      library.login('Bob', 'password2');
      const result = library.searchBook('Clean Code', 'Robert C. Martin');
      expect(result).toBe('Clean Code - Robert C. Martin - Inventory: 5');
    });

    test('should not find non-existent book', () => {
      library.login('Bob', 'password2');
      const result = library.searchBook('Non Existent', 'Unknown Author');
      expect(result).toBe('Book "Non Existent" by Unknown Author not found.');
    });
  });

  describe('Book Borrowing and Returning', () => {
    beforeEach(() => {
      library.register('admin', 'Alice', 'password1');
      library.register('user', 'Bob', 'password2');
      library.login('Alice', 'password1');
      library.addBook('Clean Code', 'Robert C. Martin', 5);
      library.logout();
    });

    test('user should borrow book successfully', () => {
      library.login('Bob', 'password2');
      const result = library.borrowBook('Clean Code', 'Robert C. Martin');
      expect(result).toBe('Book "Clean Code" successfully borrowed.');
    });

    test('user should return book successfully', () => {
      library.login('Bob', 'password2');
      library.borrowBook('Clean Code', 'Robert C. Martin');
      const result = library.returnBook('Clean Code', 'Robert C. Martin');
      expect(result).toBe('Book "Clean Code" successfully returned.');
    });

    test('admin should not be able to borrow books', () => {
      library.login('Alice', 'password1');
      const result = library.borrowBook('Clean Code', 'Robert C. Martin');
      expect(result).toBe('Permission denied. Only users can borrow books.');
    });

    test('should not borrow non-existent book', () => {
      library.login('Bob', 'password2');
      const result = library.borrowBook('Non Existent', 'Unknown Author');
      expect(result).toBe('Book "Non Existent" by Unknown Author not found.');
    });

    test('should not return book that was not borrowed', () => {
      library.login('Bob', 'password2');
      const result = library.returnBook('Clean Code', 'Robert C. Martin');
      expect(result).toBe('You have not borrowed "Clean Code" by Robert C. Martin.');
    });
  });

  describe('Book Deletion', () => {
    beforeEach(() => {
      library.register('admin', 'Alice', 'password1');
      library.register('user', 'Bob', 'password2');
      library.login('Alice', 'password1');
      library.addBook('Clean Code', 'Robert C. Martin', 5);
      library.logout();
    });

    test('admin should delete book successfully when not borrowed', () => {
      library.login('Alice', 'password1');
      const result = library.deleteBook('Clean Code', 'Robert C. Martin');
      expect(result).toBe('Book "Clean Code" by Robert C. Martin successfully deleted.');
    });

    test('admin should not delete borrowed book', () => {
      library.login('Bob', 'password2');
      library.borrowBook('Clean Code', 'Robert C. Martin');
      library.logout();
      
      library.login('Alice', 'password1');
      const result = library.deleteBook('Clean Code', 'Robert C. Martin');
      expect(result).toBe('Cannot delete book "Clean Code" because it is currently borrowed.');
    });

    test('should not delete non-existent book', () => {
      library.login('Alice', 'password1');
      const result = library.deleteBook('Non Existent', 'Unknown Author');
      expect(result).toBe('Book "Non Existent" by Unknown Author not found.');
    });
  });

  describe('Full Workflow', () => {
    test('should handle complete workflow as described in README', () => {
      // Register users
      expect(library.register('admin', 'Alice', 'password1')).toBe('Admin Alice successfully registered.');
      expect(library.register('user', 'Bob', 'password2')).toBe('User Bob successfully registered.');

      // Admin login and add book
      expect(library.login('Alice', 'password1')).toBe('Admin Alice successfully logged in.');
      expect(library.addBook('Clean Code', 'Robert C. Martin', 5)).toBe('Book "Clean Code" by Robert C. Martin added successfully, inventory: 5.');
      
      // List books
      expect(library.listBooks()).toBe('Book List:\nClean Code - Robert C. Martin - Inventory: 5');

      // User login and operations
      expect(library.login('Bob', 'password2')).toBe('User Bob successfully logged in.');
      expect(library.searchBook('Clean Code', 'Robert C. Martin')).toBe('Clean Code - Robert C. Martin - Inventory: 5');
      expect(library.borrowBook('Clean Code', 'Robert C. Martin')).toBe('Book "Clean Code" successfully borrowed.');

      // Admin tries to delete borrowed book
      expect(library.login('Alice', 'password1')).toBe('Admin Alice successfully logged in.');
      expect(library.deleteBook('Clean Code', 'Robert C. Martin')).toBe('Cannot delete book "Clean Code" because it is currently borrowed.');

      // User returns book
      expect(library.login('Bob', 'password2')).toBe('User Bob successfully logged in.');
      expect(library.returnBook('Clean Code', 'Robert C. Martin')).toBe('Book "Clean Code" successfully returned.');

      // Admin updates inventory
      expect(library.login('Alice', 'password1')).toBe('Admin Alice successfully logged in.');
      expect(library.addBook('Clean Code', 'Robert C. Martin', 3)).toBe('Book "Clean Code" inventory successfully updated, new inventory: 8.');
    });
  });
});