// src/managers/UserManager.js

const Constants = require('../utils/Constants');
const Messages = require('../utils/Messages');
const Validators = require('../utils/Validators');

class UserManager {
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
   * @returns {string} 登出结果消息
   */
  logout() {
    if (!this.currentUser) {
      return Messages.NO_USER_LOGGED_IN;
    }

    this.currentUser = null;
    return Messages.LOGOUT_SUCCESS;
  }

  /**
   * 检查用户是否已登录
   * @returns {string|null} 错误消息或null
   */
  checkLogin() {
    if (!this.currentUser) {
      return Messages.NOT_LOGGED_IN;
    }
    return null;
  }

  /**
   * 检查管理员权限
   * @returns {string|null} 错误消息或null
   */
  checkAdminPermission() {
    const loginCheck = this.checkLogin();
    if (loginCheck) return loginCheck;

    if (this.currentUser.role !== Constants.ROLES.ADMIN) {
      return Messages.ADMIN_PERMISSION_REQUIRED;
    }
    return null;
  }

  /**
   * 检查普通用户权限
   * @returns {string|null} 错误消息或null
   */
  checkUserPermission() {
    const loginCheck = this.checkLogin();
    if (loginCheck) return loginCheck;

    if (this.currentUser.role !== Constants.ROLES.USER) {
      return Messages.USER_PERMISSION_REQUIRED;
    }
    return null;
  }

  /**
   * 获取当前用户
   * @returns {Object|null} 当前用户对象或null
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * 获取用户数据
   * @param {string} name - 用户名
   * @returns {Object|null} 用户数据或null
   */
  getUser(name) {
    return this.users.get(name) || null;
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
}

module.exports = UserManager;