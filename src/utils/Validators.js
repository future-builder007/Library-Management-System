const Constants = require('./Constants');
const Messages = require('./Messages');

/**
 * 验证工具类
 */
class Validators {
  /**
   * 验证字符串参数
   * @param {string} value - 待验证的值
   * @param {number} minLength - 最小长度
   * @returns {boolean}
   */
  static isValidString(value, minLength = 1) {
    return typeof value === 'string' && value.trim().length >= minLength;
  }

  /**
   * 验证用户角色
   * @param {string} role - 角色
   * @returns {boolean}
   */
  static isValidRole(role) {
    return Object.values(Constants.ROLES).includes(role);
  }

  /**
   * 验证用户名
   * @param {string} name - 用户名
   * @returns {boolean}
   */
  static isValidName(name) {
    return this.isValidString(name, Constants.VALIDATION.MIN_NAME_LENGTH);
  }

  /**
   * 验证密码
   * @param {string} password - 密码
   * @returns {boolean}
   */
  static isValidPassword(password) {
    return this.isValidString(password, Constants.VALIDATION.MIN_PASSWORD_LENGTH);
  }

  /**
   * 验证图书名
   * @param {string} bookName - 图书名
   * @returns {boolean}
   */
  static isValidBookName(bookName) {
    return this.isValidString(bookName, Constants.VALIDATION.MIN_BOOK_NAME_LENGTH);
  }

  /**
   * 验证作者名
   * @param {string} author - 作者名
   * @returns {boolean}
   */
  static isValidAuthor(author) {
    return this.isValidString(author, Constants.VALIDATION.MIN_AUTHOR_LENGTH);
  }

  /**
   * 验证数量
   * @param {number} amount - 数量
   * @returns {boolean}
   */
  static isValidAmount(amount) {
    return typeof amount === 'number' && 
           Number.isInteger(amount) && 
           amount >= Constants.VALIDATION.MIN_AMOUNT;
  }

  /**
   * 验证注册参数
   * @param {string} role - 角色
   * @param {string} name - 用户名
   * @param {string} password - 密码
   * @returns {string|null} 错误信息或null
   */
  static validateRegistration(role, name, password) {
    if (!this.isValidRole(role)) {
      return Messages.INVALID_ROLE;
    }
    if (!this.isValidName(name) || !this.isValidPassword(password)) {
      return Messages.INVALID_PARAMETERS;
    }
    return null;
  }

  /**
   * 验证登录参数
   * @param {string} name - 用户名
   * @param {string} password - 密码
   * @returns {string|null} 错误信息或null
   */
  static validateLogin(name, password) {
    if (!this.isValidName(name) || !this.isValidPassword(password)) {
      return Messages.INVALID_PARAMETERS;
    }
    return null;
  }

  /**
   * 验证图书操作参数
   * @param {string} bookName - 图书名
   * @param {string} author - 作者名
   * @returns {string|null} 错误信息或null
   */
  static validateBookOperation(bookName, author) {
    if (!this.isValidBookName(bookName) || !this.isValidAuthor(author)) {
      return Messages.INVALID_PARAMETERS;
    }
    return null;
  }

  /**
   * 验证添加图书参数
   * @param {string} bookName - 图书名
   * @param {string} author - 作者名
   * @param {number} amount - 数量
   * @returns {string|null} 错误信息或null
   */
  static validateAddBook(bookName, author, amount) {
    const bookValidation = this.validateBookOperation(bookName, author);
    if (bookValidation) return bookValidation;
    
    if (!this.isValidAmount(amount)) {
      return Messages.AMOUNT_MUST_POSITIVE;
    }
    return null;
  }
}

module.exports = Validators;