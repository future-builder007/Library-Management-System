const Constants = require('../utils/Constants');
const Messages = require('../utils/Messages');

class UserService {
  constructor(userManager, authManager) {
    this.userManager = userManager;
    this.authManager = authManager;
  }

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

  /**
   * 查看用户个人信息
   * @param {string} targetUserName - 目标用户名（可选，不传则查看自己）
   * @returns {string|Object} 用户信息
   */
  viewUserProfile(targetUserName = null) {
    const currentUser = this.authManager.getCurrentUser();
    const actualTarget = targetUserName || (currentUser ? currentUser.name : null);
    
    const authResult = this.authManager.checkResourcePermission(
      Constants.RESOURCES.USER,
      Constants.USER_ACTIONS.VIEW_PROFILE,
      { targetUserId: actualTarget }
    );
    
    if (!authResult.success) {
      return authResult.message;
    }

    const user = this.userManager.getUser(actualTarget);
    if (!user) {
      return Messages.USER_NOT_EXISTS(actualTarget);
    }

    const borrowedBooks = this.userManager.getUserBorrowedBooks(actualTarget);
    const stats = this.userManager.getUserBorrowingStats(actualTarget);

    return {
      name: actualTarget,
      role: user.role,
      borrowedBooks: borrowedBooks,
      stats: stats
    };
  }

  /**
   * 管理员查看所有用户
   * @returns {string|Array} 用户列表
   */
  listAllUsers() {
    const authResult = this.authManager.checkResourcePermission(
      Constants.RESOURCES.USER,
      Constants.USER_ACTIONS.MANAGE
    );
    
    if (!authResult.success) {
      return authResult.message;
    }

    return this.userManager.getAllUsers();
  }

  /**
   * 获取当前用户信息
   * @returns {Object|null} 当前用户信息
   */
  getCurrentUser() {
    return this.authManager.getCurrentUser();
  }
}

module.exports = UserService;