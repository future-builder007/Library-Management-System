// src/LibrarySystem.js

const UserManager = require('./managers/UserManager');
const BookManager = require('./managers/BookManager');
const Constants = require('./utils/Constants');
const Messages = require('./utils/Messages');

class LibrarySystem {
  constructor() {
    this.userManager = new UserManager();
    this.bookManager = new BookManager();
  }

  // ==================== 用户管理相关方法 ====================

  /**
   * 用户注册
   * @param {string} role - 用户角色
   * @param {string} name - 用户名
   * @param {string} password - 密码
   * @returns {string} 注册结果消息
   */
  register(role, name, password) {
    return this.userManager.register(role, name, password);
  }

  /**
   * 用户登录
   * @param {string} name - 用户名
   * @param {string} password - 密码
   * @returns {string} 登录结果消息
   */
  login(name, password) {
    return this.userManager.login(name, password);
  }

  /**
   * 用户登出
   * @returns {string} 登出结果消息
   */
  logout() {
    return this.userManager.logout();
  }

  // ==================== 图书查询相关方法 ====================

  /**
   * 列出所有图书
   * @returns {string} 图书列表
   */
  listBooks() {
    const loginCheck = this.userManager.checkLogin();
    if (loginCheck) return loginCheck;

    return this.bookManager.listBooks();
  }

  /**
   * 搜索图书
   * @param {string} bookName - 书名
   * @param {string} author - 作者
   * @returns {string} 搜索结果
   */
  searchBook(bookName, author) {
    const loginCheck = this.userManager.checkLogin();
    if (loginCheck) return loginCheck;

    return this.bookManager.searchBook(bookName, author);
  }

  // ==================== 管理员专用方法 ====================

  /**
   * 添加图书（仅管理员）
   * @param {string} bookName - 书名
   * @param {string} author - 作者
   * @param {number} amount - 数量
   * @returns {string} 添加结果消息
   */
  addBook(bookName, author, amount) {
    const adminCheck = this.userManager.checkAdminPermission();
    if (adminCheck) return adminCheck;

    return this.bookManager.addBook(bookName, author, amount);
  }

  /**
   * 删除图书（仅管理员）
   * @param {string} bookName - 书名
   * @param {string} author - 作者
   * @returns {string} 删除结果消息
   */
  deleteBook(bookName, author) {
    const adminCheck = this.userManager.checkAdminPermission();
    if (adminCheck) return adminCheck;

    return this.bookManager.deleteBook(bookName, author);
  }

  // ==================== 用户专用方法 ====================

  /**
   * 借阅图书（仅用户）
   * @param {string} bookName - 书名
   * @param {string} author - 作者
   * @returns {string} 借阅结果消息
   */
  borrowBook(bookName, author) {
    const userCheck = this.userManager.checkUserPermission();
    if (userCheck) return userCheck;

    const currentUser = this.userManager.getCurrentUser();
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
    const userCheck = this.userManager.checkUserPermission();
    if (userCheck) return userCheck;

    const currentUser = this.userManager.getCurrentUser();
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

  // ==================== 工具方法 ====================

  /**
   * 获取当前用户信息
   * @returns {Object|null} 当前用户信息
   */
  getCurrentUser() {
    return this.userManager.getCurrentUser();
  }

  /**
   * 获取系统统计信息
   * @returns {Object} 系统统计信息
   */
  getSystemStats() {
    const loginCheck = this.userManager.checkLogin();
    if (loginCheck) return { error: loginCheck };

    return {
      totalBooks: this.bookManager.getTotalBooks(),
      totalUsers: this.userManager.users.size,
      currentUser: this.userManager.getCurrentUser()?.name || 'None'
    };
  }
}

module.exports = LibrarySystem;