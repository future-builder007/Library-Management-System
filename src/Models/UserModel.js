const Constants = require('../utils/Constants');
const Messages = require('../utils/Messages');
const Validators = require('../utils/Validators');

class UserModel {
  constructor() {
    this.users = new Map(); // {name: {role, password, borrowedBooks}}
    this.currentUser = null;
  }

  /**
   * 用户注册
   * @param {string} role - 用户角色 ('admin' 或 'user')
   * @param {string} name - 用户名
   * @param {string} password - 密码
   * @returns {string} 注册结果消息
   */
  register(role, name, password) {
    const validationError = Validators.validateRegistration(role, name, password);
    if (validationError) return validationError;

    if (this.users.has(name)) {
      return Messages.USER_EXISTS(role, name);
    }

    this.users.set(name, {
      role,
      password,
      borrowedBooks: []
    });

    return Messages.REGISTER_SUCCESS(role, name);
  }

  /**
   * 用户登录
   * @param {string} name - 用户名
   * @param {string} password - 密码
   * @returns {string} 登录结果消息
   */
  login(name, password) {
    const validationError = Validators.validateLogin(name, password);
    if (validationError) return validationError;

    if (!this.users.has(name)) {
      return Messages.USER_NOT_EXISTS(name);
    }

    const user = this.users.get(name);
    if (user.password !== password) {
      return Messages.WRONG_PASSWORD;
    }

    this.currentUser = { name, ...user };
    return Messages.LOGIN_SUCCESS(user.role, name);
  }

  /**
   * 用户登出
   * @returns {string}
   */
  logout() {
    if (!this.currentUser) {
      return Messages.NO_USER_LOGGED_IN;
    }

    this.currentUser = null;
    return Messages.LOGOUT_SUCCESS;
  }

  /**
   * 获取当前用户
   * @returns {Object|null}
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * 获取用户数据
   * @param {string} name
   * @returns {Object|null} 
   */
  getUser(name) {
    return this.users.get(name) || null;
  }

  /**
   * 检查用户是否存在
   * @param {string} name
   * @returns {boolean}
   */
  userExists(name) {
    return this.users.has(name);
  }

  /**
   * 获取所有用户（管理员功能）
   * @returns {Array} 用户列表
   */
  getAllUsers() {
    const userList = [];
    for (const [name, userData] of this.users) {
      userList.push({
        name,
        role: userData.role,
        borrowedBooksCount: userData.borrowedBooks.length
      });
    }
    return userList;
  }

  /**
   * 更新用户借阅列表
   * @param {string} userName - 用户名
   * @param {string} bookKey - 图书唯一标识
   * @param {string} action - 操作类型 ('add' 或 'remove')
   */
  updateUserBorrowedBooks(userName, bookKey, action) {
    const user = this.users.get(userName);
    if (!user) return;

    if (action === Constants.ACTIONS.ADD) {
      if (!user.borrowedBooks.includes(bookKey)) {
        user.borrowedBooks.push(bookKey);
      }
    } else if (action === Constants.ACTIONS.REMOVE) {
      const index = user.borrowedBooks.indexOf(bookKey);
      if (index > -1) {
        user.borrowedBooks.splice(index, 1);
      }
    }
  }

  /**
   * 检查用户是否已借阅某本书
   * @param {string} userName - 用户名
   * @param {string} bookKey - 图书唯一标识
   * @returns {boolean} 是否已借阅
   */
  hasUserBorrowedBook(userName, bookKey) {
    const user = this.users.get(userName);
    return user ? user.borrowedBooks.includes(bookKey) : false;
  }

  /**
   * 获取用户借阅的图书列表
   * @param {string} userName - 用户名
   * @returns {Array} 借阅的图书键值列表
   */
  getUserBorrowedBooks(userName) {
    const user = this.users.get(userName);
    return user ? [...user.borrowedBooks] : [];
  }

  /**
   * 获取用户借阅统计
   * @param {string} userName - 用户名
   * @returns {Object} 借阅统计信息
   */
  getUserBorrowingStats(userName) {
    const user = this.users.get(userName);
    if (!user) {
      return {
        totalBorrowed: 0,
        currentlyBorrowed: 0
      };
    }

    return {
      totalBorrowed: user.borrowedBooks.length, // 这里可以扩展为历史借阅记录
      currentlyBorrowed: user.borrowedBooks.length
    };
  }

  /**
   * 获取用户总数
   * @returns {number} 用户总数
   */
  getTotalUsers() {
    return this.users.size;
  }

  /**
   * 获取角色统计
   * @returns {Object} 角色统计信息
   */
  getRoleStats() {
    let adminCount = 0;
    let userCount = 0;

    for (const userData of this.users.values()) {
      if (userData.role === Constants.ROLES.ADMIN) {
        adminCount++;
      } else if (userData.role === Constants.ROLES.USER) {
        userCount++;
      }
    }

    return {
      admin: adminCount,
      user: userCount,
      total: this.users.size
    };
  }
}

module.exports = UserModel;