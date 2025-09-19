const Constants = require('../utils/Constants');
const Messages = require('../utils/Messages');

/**
 * 鉴权管理器
 * 负责处理用户认证和权限验证
 */
class AuthModel {
  constructor(userManager) {
    this.userManager = userManager;
  }

  /**
   * 检查用户是否已登录
   * @returns {Object} 鉴权结果 {success: boolean, message?: string, user?: Object}
   */
  checkLogin() {
    const currentUser = this.userManager.getCurrentUser();
    
    if (!currentUser) {
      return {
        success: false,
        message: Messages.NOT_LOGGED_IN
      };
    }

    return {
      success: true,
      user: currentUser
    };
  }

  /**
   * 检查管理员权限
   * @returns {Object} 鉴权结果 {success: boolean, message?: string, user?: Object}
   */
  checkAdminPermission() {
    const loginResult = this.checkLogin();
    if (!loginResult.success) {
      return loginResult;
    }

    if (loginResult.user.role !== Constants.ROLES.ADMIN) {
      return {
        success: false,
        message: Messages.ADMIN_PERMISSION_REQUIRED
      };
    }

    return {
      success: true,
      user: loginResult.user
    };
  }

  /**
   * 检查普通用户权限
   * @returns {Object} 鉴权结果 {success: boolean, message?: string, user?: Object}
   */
  checkUserPermission() {
    const loginResult = this.checkLogin();
    if (!loginResult.success) {
      return loginResult;
    }

    if (loginResult.user.role !== Constants.ROLES.USER) {
      return {
        success: false,
        message: Messages.USER_PERMISSION_REQUIRED
      };
    }

    return {
      success: true,
      user: loginResult.user
    };
  }

  /**
   * 检查用户是否有权限操作特定资源
   * @param {string} resource - 资源类型
   * @param {string} action - 操作类型
   * @param {Object} context - 上下文信息
   * @returns {Object} 鉴权结果
   */
  checkResourcePermission(resource, action, context = {}) {
    const loginResult = this.checkLogin();
    if (!loginResult.success) {
      return loginResult;
    }

    const user = loginResult.user;

    // 根据资源和操作类型进行权限检查
    switch (resource) {
      case Constants.RESOURCES.BOOK:
        return this._checkBookPermission(user, action, context);
      case Constants.RESOURCES.USER:
        return this._checkUserResourcePermission(user, action, context);
      default:
        return {
          success: false,
          message: 'Unknown resource type'
        };
    }
  }

  /**
   * 检查图书相关权限
   * @private
   */
  _checkBookPermission(user, action, context) {
    switch (action) {
      case Constants.BOOK_ACTIONS.LIST:
      case Constants.BOOK_ACTIONS.SEARCH:
        // 任何登录用户都可以查看图书
        return { success: true, user };

      case Constants.BOOK_ACTIONS.ADD:
      case Constants.BOOK_ACTIONS.DELETE:
        // 只有管理员可以添加/删除图书
        if (user.role !== Constants.ROLES.ADMIN) {
          return {
            success: false,
            message: Messages.ADMIN_PERMISSION_REQUIRED
          };
        }
        return { success: true, user };

      case Constants.BOOK_ACTIONS.BORROW:
      case Constants.BOOK_ACTIONS.RETURN:
        // 只有普通用户可以借阅/归还图书
        if (user.role !== Constants.ROLES.USER) {
          return {
            success: false,
            message: Messages.USER_PERMISSION_REQUIRED
          };
        }
        return { success: true, user };

      default:
        return {
          success: false,
          message: 'Unknown book action'
        };
    }
  }

  /**
   * 检查用户资源相关权限
   * @private
   */
  _checkUserResourcePermission(user, action, context) {
    switch (action) {
      case Constants.USER_ACTIONS.VIEW_PROFILE:
        // 用户只能查看自己的信息，管理员可以查看所有用户信息
        if (user.role === Constants.ROLES.ADMIN) {
          return { success: true, user };
        }
        if (context.targetUserId && context.targetUserId !== user.name) {
          return {
            success: false,
            message: 'Permission denied. Can only view your own profile.'
          };
        }
        return { success: true, user };

      case Constants.USER_ACTIONS.MANAGE:
        // 只有管理员可以管理用户
        if (user.role !== Constants.ROLES.ADMIN) {
          return {
            success: false,
            message: Messages.ADMIN_PERMISSION_REQUIRED
          };
        }
        return { success: true, user };

      default:
        return {
          success: false,
          message: 'Unknown user action'
        };
    }
  }

  /**
   * 获取当前用户信息
   * @returns {Object|null} 当前用户信息
   */
  getCurrentUser() {
    return this.userManager.getCurrentUser();
  }

  /**
   * 检查当前用户是否为管理员
   * @returns {boolean}
   */
  isCurrentUserAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === Constants.ROLES.ADMIN;
  }

  /**
   * 检查当前用户是否为普通用户
   * @returns {boolean}
   */
  isCurrentUserRegular() {
    const user = this.getCurrentUser();
    return user && user.role === Constants.ROLES.USER;
  }
}

module.exports = AuthModel;