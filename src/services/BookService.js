const Constants = require('../utils/Constants');
const Messages = require('../utils/Messages');

class BookService {
  constructor(bookManager, authManager, userManager) {
    this.bookManager = bookManager;
    this.authManager = authManager;
    this.userManager = userManager;
  }

  /**
   * 列出所有图书
   * @returns {string} 图书列表
   */
  listBooks() {
    const authResult = this.authManager.checkResourcePermission(
      Constants.RESOURCES.BOOK, 
      Constants.BOOK_ACTIONS.LIST
    );
    
    if (!authResult.success) {
      return authResult.message;
    }

    return this.bookManager.listBooks();
  }

  /**
   * 搜索图书
   * @param {string} bookName - 书名
   * @param {string} author - 作者
   * @returns {string} 搜索结果
   */
  searchBook(bookName, author) {
    const authResult = this.authManager.checkResourcePermission(
      Constants.RESOURCES.BOOK, 
      Constants.BOOK_ACTIONS.SEARCH
    );
    
    if (!authResult.success) {
      return authResult.message;
    }

    return this.bookManager.searchBook(bookName, author);
  }

  /**
   * 添加图书（仅管理员）
   * @param {string} bookName - 书名
   * @param {string} author - 作者
   * @param {number} amount - 数量
   * @returns {string} 添加结果消息
   */
  addBook(bookName, author, amount) {
    const authResult = this.authManager.checkResourcePermission(
      Constants.RESOURCES.BOOK, 
      Constants.BOOK_ACTIONS.ADD
    );
    
    if (!authResult.success) {
      return authResult.message;
    }

    return this.bookManager.addBook(bookName, author, amount);
  }

  /**
   * 删除图书（仅管理员）
   * @param {string} bookName - 书名
   * @param {string} author - 作者
   * @returns {string} 删除结果消息
   */
  deleteBook(bookName, author) {
    const authResult = this.authManager.checkResourcePermission(
      Constants.RESOURCES.BOOK, 
      Constants.BOOK_ACTIONS.DELETE
    );
    
    if (!authResult.success) {
      return authResult.message;
    }

    return this.bookManager.deleteBook(bookName, author);
  }

  /**
   * 借阅图书（仅用户）
   * @param {string} bookName - 书名
   * @param {string} author - 作者
   * @returns {string} 借阅结果消息
   */
  borrowBook(bookName, author) {
    const authResult = this.authManager.checkResourcePermission(
      Constants.RESOURCES.BOOK, 
      Constants.BOOK_ACTIONS.BORROW
    );
    
    if (!authResult.success) {
      return authResult.message;
    }

    const currentUser = authResult.user;
    const bookKey = this.bookManager.getBookKey(bookName, author);

    // 检查用户是否已经借阅了这本书
    if (this.userManager.hasUserBorrowedBook(currentUser.name, bookKey)) {
      return Messages.BOOK_ALREADY_BORROWED(bookName, author);
    }

    // 尝试借阅图书
    const borrowResult = this.bookManager.borrowBook(bookName, author, currentUser.name);
    
    if (borrowResult.success) {
      // 更新用户借阅列表
      this.userManager.updateUserBorrowedBooks(currentUser.name, bookKey, Constants.ACTIONS.ADD);
    }

    return borrowResult.message;
  }

  /**
   * 归还图书（仅用户）
   * @param {string} bookName - 书名
   * @param {string} author - 作者
   * @returns {string} 归还结果消息
   */
  returnBook(bookName, author) {
    const authResult = this.authManager.checkResourcePermission(
      Constants.RESOURCES.BOOK, 
      Constants.BOOK_ACTIONS.RETURN
    );
    
    if (!authResult.success) {
      return authResult.message;
    }

    const currentUser = authResult.user;
    const bookKey = this.bookManager.getBookKey(bookName, author);

    // 检查用户是否借阅了这本书
    if (!this.userManager.hasUserBorrowedBook(currentUser.name, bookKey)) {
      return Messages.BOOK_NOT_BORROWED(bookName, author);
    }

    // 尝试归还图书
    const returnResult = this.bookManager.returnBook(bookName, author, currentUser.name);
    
    if (returnResult.success) {
      // 更新用户借阅列表
      this.userManager.updateUserBorrowedBooks(currentUser.name, bookKey, Constants.ACTIONS.REMOVE);
    }

    return returnResult.message;
  }
}

module.exports = BookService;