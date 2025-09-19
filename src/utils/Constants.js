/**
 * 系统常量定义
 */
class Constants {
  // 用户角色
  static ROLES = {
    ADMIN: 'admin',
    USER: 'user'
  };

  // 验证规则
  static VALIDATION = {
    MIN_PASSWORD_LENGTH: 1,
    MIN_NAME_LENGTH: 1,
    MIN_BOOK_NAME_LENGTH: 1,
    MIN_AUTHOR_LENGTH: 1,
    MIN_AMOUNT: 1
  };

  // 操作类型
  static ACTIONS = {
    ADD: 'add',
    REMOVE: 'remove'
  };

  // 资源类型
  static RESOURCES = {
    BOOK: 'book',
    USER: 'user'
  };

  // 图书操作类型
  static BOOK_ACTIONS = {
    LIST: 'list',
    SEARCH: 'search',
    ADD: 'add',
    DELETE: 'delete',
    BORROW: 'borrow',
    RETURN: 'return'
  };

  // 用户操作类型
  static USER_ACTIONS = {
    VIEW_PROFILE: 'view_profile',
    MANAGE: 'manage'
  };
}

module.exports = Constants;