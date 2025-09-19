/**
 * 系统消息管理
 */
class Messages {
    // ============ 认证相关 ============
    static INVALID_ROLE = 'Invalid role. Role must be "admin" or "user".';
    static USER_EXISTS = (role, name) => `${role === 'admin' ? 'Admin' : 'User'} ${name} already exists.`;
    static USER_NOT_EXISTS = (name) => `User ${name} does not exist.`;
    static WRONG_PASSWORD = 'Incorrect password.';
    static NOT_LOGGED_IN = 'Please login first.';
    static NO_USER_LOGGED_IN = 'No user is currently logged in.';
    
    // ============ 权限相关 ============
    static ADMIN_PERMISSION_REQUIRED = 'Permission denied. Admin role required.';
    static USER_PERMISSION_REQUIRED = 'Permission denied. Only users can perform this action.';
    
    // ============ 操作成功消息 ============
    static REGISTER_SUCCESS = (role, name) => `${role === 'admin' ? 'Admin' : 'User'} ${name} successfully registered.`;
    static LOGIN_SUCCESS = (role, name) => `${role === 'admin' ? 'Admin' : 'User'} ${name} successfully logged in.`;
    static LOGOUT_SUCCESS = 'Successfully logged out.';
    
    // ============ 图书相关 ============
    static NO_BOOKS = 'No books in the library.';
    static BOOK_NOT_FOUND = (bookName, author) => `Book "${bookName}" by ${author} not found.`;
    static BOOK_ADD_SUCCESS = (bookName, author, amount) => `Book "${bookName}" by ${author} added successfully, inventory: ${amount}.`;
    static BOOK_UPDATE_SUCCESS = (bookName, inventory) => `Book "${bookName}" inventory successfully updated, new inventory: ${inventory}.`;
    static BOOK_DELETE_SUCCESS = (bookName, author) => `Book "${bookName}" by ${author} successfully deleted.`;
    static BOOK_DELETE_BORROWED = (bookName) => `Cannot delete book "${bookName}" because it is currently borrowed.`;
    static BOOK_NOT_AVAILABLE = (bookName) => `Book "${bookName}" is not available for borrowing.`;
    static BOOK_ALREADY_BORROWED = (bookName, author) => `You have already borrowed "${bookName}" by ${author}.`;
    static BOOK_BORROW_SUCCESS = (bookName) => `Book "${bookName}" successfully borrowed.`;
    static BOOK_RETURN_SUCCESS = (bookName) => `Book "${bookName}" successfully returned.`;
    static BOOK_NOT_BORROWED = (bookName, author) => `You have not borrowed "${bookName}" by ${author}.`;
    
    // ============ 验证相关 ============
    static INVALID_PARAMETERS = 'Invalid parameters provided.';
    static AMOUNT_MUST_POSITIVE = 'Amount must be positive.';
    
    // ============ CLI相关 ============
    static WELCOME = 'Welcome to Library Management System, please input your command (input exit to exit):';
    static GOODBYE = 'See you next time!';
    static BOOK_LIST_HEADER = 'Book List:';
  }
  
  module.exports = Messages;