const LibrarySystem = require('../src/index');

describe('Book Management', () => {
  let library;

  beforeEach(() => {
    library = new LibrarySystem();
    library.register('admin', 'Alice', 'password1');
    library.register('user', 'Bob', 'password2');
  });

  describe('Adding Books', () => {
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

  describe('Deleting Books', () => {
    beforeEach(() => {
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

    test('user should not be able to delete books', () => {
      library.login('Bob', 'password2');
      const result = library.deleteBook('Clean Code', 'Robert C. Martin');
      expect(result).toBe('Permission denied. Admin role required.');
    });

    test('should require login to delete books', () => {
      const result = library.deleteBook('Clean Code', 'Robert C. Martin');
      expect(result).toBe('Please login first.');
    });
  });
});