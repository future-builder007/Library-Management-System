class LibrarySystem {
    constructor() {
      this.users = new Map(); // 存储用户信息 {name: {role, password, borrowedBooks}}
      this.books = new Map(); // 存储图书信息 {key: {name, author, inventory, borrowedBy}}
      this.currentUser = null; // 当前登录用户
    }
  
    // 生成图书的唯一标识
    getBookKey(bookName, author) {
      return `${bookName}-${author}`;
    }
  
    // 用户注册
    register(role, name, password) {
      if (role !== 'admin' && role !== 'user') {
        return 'Invalid role. Role must be "admin" or "user".';
      }
  
      if (this.users.has(name)) {
        return `${role === 'admin' ? 'Admin' : 'User'} ${name} already exists.`;
      }
  
      this.users.set(name, {
        role: role,
        password: password,
        borrowedBooks: []
      });
  
      return `${role === 'admin' ? 'Admin' : 'User'} ${name} successfully registered.`;
    }
  
    // 用户登录
    login(name, password) {
      if (!this.users.has(name)) {
        return `User ${name} does not exist.`;
      }
  
      const user = this.users.get(name);
      if (user.password !== password) {
        return 'Incorrect password.';
      }
  
      this.currentUser = { name, ...user };
      return `${user.role === 'admin' ? 'Admin' : 'User'} ${name} successfully logged in.`;
    }
  
    // 用户登出
    logout() {
      if (!this.currentUser) {
        return 'No user is currently logged in.';
      }
  
      this.currentUser = null;
      return 'Successfully logged out.';
    }
  
    // 检查用户是否已登录
    checkLogin() {
      if (!this.currentUser) {
        return 'Please login first.';
      }
      return null;
    }
  
    // 检查管理员权限
    checkAdminPermission() {
      const loginCheck = this.checkLogin();
      if (loginCheck) return loginCheck;
  
      if (this.currentUser.role !== 'admin') {
        return 'Permission denied. Admin role required.';
      }
      return null;
    }
  
    // 列出所有图书
    listBooks() {
      const loginCheck = this.checkLogin();
      if (loginCheck) return loginCheck;
  
      if (this.books.size === 0) {
        return 'No books in the library.';
      }
  
      let result = 'Book List:';
      for (const book of this.books.values()) {
        result += `\n${book.name} - ${book.author} - Inventory: ${book.inventory}`;
      }
      return result;
    }
  
    // 搜索图书
    searchBook(bookName, author) {
      const loginCheck = this.checkLogin();
      if (loginCheck) return loginCheck;
  
      const key = this.getBookKey(bookName, author);
      if (!this.books.has(key)) {
        return `Book "${bookName}" by ${author} not found.`;
      }
  
      const book = this.books.get(key);
      return `${book.name} - ${book.author} - Inventory: ${book.inventory}`;
    }
  
    // 添加图书（仅管理员）
    addBook(bookName, author, amount) {
      const adminCheck = this.checkAdminPermission();
      if (adminCheck) return adminCheck;
  
      if (amount <= 0) {
        return 'Amount must be positive.';
      }
  
      const key = this.getBookKey(bookName, author);
      
      if (this.books.has(key)) {
        const book = this.books.get(key);
        book.inventory += amount;
        return `Book "${bookName}" inventory successfully updated, new inventory: ${book.inventory}.`;
      } else {
        this.books.set(key, {
          name: bookName,
          author: author,
          inventory: amount,
          borrowedBy: []
        });
        return `Book "${bookName}" by ${author} added successfully, inventory: ${amount}.`;
      }
    }
  
    // 删除图书（仅管理员）
    deleteBook(bookName, author) {
      const adminCheck = this.checkAdminPermission();
      if (adminCheck) return adminCheck;
  
      const key = this.getBookKey(bookName, author);
      if (!this.books.has(key)) {
        return `Book "${bookName}" by ${author} not found.`;
      }
  
      const book = this.books.get(key);
      if (book.borrowedBy.length > 0) {
        return `Cannot delete book "${bookName}" because it is currently borrowed.`;
      }
  
      this.books.delete(key);
      return `Book "${bookName}" by ${author} successfully deleted.`;
    }
  
    // 借阅图书（仅用户）
    borrowBook(bookName, author) {
      const loginCheck = this.checkLogin();
      if (loginCheck) return loginCheck;
  
      if (this.currentUser.role !== 'user') {
        return 'Permission denied. Only users can borrow books.';
      }
  
      const key = this.getBookKey(bookName, author);
      if (!this.books.has(key)) {
        return `Book "${bookName}" by ${author} not found.`;
      }
  
      const book = this.books.get(key);
      if (book.inventory <= 0) {
        return `Book "${bookName}" is not available for borrowing.`;
      }
  
      // 检查用户是否已经借阅了这本书
      const user = this.users.get(this.currentUser.name);
      if (user.borrowedBooks.includes(key)) {
        return `You have already borrowed "${bookName}" by ${author}.`;
      }
  
      // 执行借阅
      book.inventory--;
      book.borrowedBy.push(this.currentUser.name);
      user.borrowedBooks.push(key);
  
      return `Book "${bookName}" successfully borrowed.`;
    }
  
    // 归还图书（仅用户）
    returnBook(bookName, author) {
      const loginCheck = this.checkLogin();
      if (loginCheck) return loginCheck;
  
      if (this.currentUser.role !== 'user') {
        return 'Permission denied. Only users can return books.';
      }
  
      const key = this.getBookKey(bookName, author);
      if (!this.books.has(key)) {
        return `Book "${bookName}" by ${author} not found.`;
      }
  
      const user = this.users.get(this.currentUser.name);
      if (!user.borrowedBooks.includes(key)) {
        return `You have not borrowed "${bookName}" by ${author}.`;
      }
  
      // 执行归还
      const book = this.books.get(key);
      book.inventory++;
      
      // 从借阅者列表中移除
      const borrowerIndex = book.borrowedBy.indexOf(this.currentUser.name);
      if (borrowerIndex > -1) {
        book.borrowedBy.splice(borrowerIndex, 1);
      }
      
      // 从用户借阅列表中移除
      const bookIndex = user.borrowedBooks.indexOf(key);
      if (bookIndex > -1) {
        user.borrowedBooks.splice(bookIndex, 1);
      }
  
      return `Book "${bookName}" successfully returned.`;
    }
  }
  
  module.exports = LibrarySystem;