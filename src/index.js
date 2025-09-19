const UserModel = require('./Models/UserModel');
const BookModel = require('./Models/BookModel');
const AuthModel = require('./Models/AuthModel');

const BookService = require('./services/BookService');
const UserService = require('./services/UserService');
const SystemService = require('./services/SystemService');

/**
 * 图书馆系统门面类
 * 提供统一的接口访问各个服务
 */
class LibraryFacade {
  constructor() {
    // 初始化管理器
    this.UserModel = new UserModel();
    this.BookModel = new BookModel();
    this.AuthModel = new AuthModel(this.UserModel);
    
    // 初始化服务层
    this.bookService = new BookService(this.BookModel, this.AuthModel, this.UserModel);
    this.userService = new UserService(this.UserModel, this.AuthModel);
    this.systemService = new SystemService(this.UserModel, this.BookModel, this.AuthModel);
  }

  // ==================== 用户相关接口 ====================
  
  /**
   * 用户注册
   */
  register(role, name, password) {
    return this.userService.register(role, name, password);
  }

  /**
   * 用户登录
   */
  login(name, password) {
    return this.userService.login(name, password);
  }

  /**
   * 用户登出
   */
  logout() {
    return this.userService.logout();
  }

  /**
   * 查看用户个人信息
   */
  viewUserProfile(targetUserName = null) {
    return this.userService.viewUserProfile(targetUserName);
  }

  /**
   * 管理员查看所有用户
   */
  listAllUsers() {
    return this.userService.listAllUsers();
  }

  /**
   * 获取当前用户信息
   */
  getCurrentUser() {
    return this.userService.getCurrentUser();
  }

  // ==================== 图书相关接口 ====================
  
  /**
   * 列出所有图书
   */
  listBooks() {
    return this.bookService.listBooks();
  }

  /**
   * 搜索图书
   */
  searchBook(bookName, author) {
    return this.bookService.searchBook(bookName, author);
  }

  /**
   * 添加图书（仅管理员）
   */
  addBook(bookName, author, amount) {
    return this.bookService.addBook(bookName, author, amount);
  }

  /**
   * 删除图书（仅管理员）
   */
  deleteBook(bookName, author) {
    return this.bookService.deleteBook(bookName, author);
  }

  /**
   * 借阅图书（仅用户）
   */
  borrowBook(bookName, author) {
    return this.bookService.borrowBook(bookName, author);
  }

  /**
   * 归还图书（仅用户）
   */
  returnBook(bookName, author) {
    return this.bookService.returnBook(bookName, author);
  }

  // ==================== 系统相关接口 ====================
  
  /**
   * 获取系统统计信息
   */
  getSystemStats() {
    return this.systemService.getSystemStats();
  }

  /**
   * 系统健康检查
   */
  healthCheck() {
    return this.systemService.healthCheck();
  }

  /**
   * 获取系统配置信息
   */
  getSystemConfig() {
    return this.systemService.getSystemConfig();
  }

  // ==================== 便捷方法 ====================
  
  /**
   * 获取特定服务实例（用于扩展功能）
   */
  getService(serviceName) {
    const services = {
      'book': this.bookService,
      'user': this.userService,
      'system': this.systemService
    };
    
    return services[serviceName] || null;
  }

  /**
   * 获取特定管理器实例（用于高级操作）
   */
  getManager(managerName) {
    const managers = {
      'user': this.UserModel,
      'book': this.BookModel,
      'auth': this.AuthModel
    };
    
    return managers[managerName] || null;
  }
}

module.exports = LibraryFacade;