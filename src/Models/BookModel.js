const Messages = require('../utils/Messages');
const Validators = require('../utils/Validators');

class BookModel {
  constructor() {
    this.books = new Map(); // {key: {name, author, inventory, borrowedBy}}
  }

  /**
   * 生成图书的唯一标识
   * @param {string} bookName - 书名
   * @param {string} author - 作者
   * @returns {string} 图书唯一标识
   */
  getBookKey(bookName, author) {
    return `${bookName}-${author}`;
  }

  /**
   * 添加图书或更新库存
   * @param {string} bookName - 书名
   * @param {string} author - 作者
   * @param {number} amount - 数量
   * @returns {string} 操作结果消息
   */
  addBook(bookName, author, amount) {
    const validationError = Validators.validateAddBook(bookName, author, amount);
    if (validationError) return validationError;

    const key = this.getBookKey(bookName, author);
    
    if (this.books.has(key)) {
      const book = this.books.get(key);
      book.inventory += amount;
      return Messages.BOOK_UPDATE_SUCCESS(bookName, book.inventory);
    } else {
      this.books.set(key, {
        name: bookName,
        author: author,
        inventory: amount,
        borrowedBy: []
      });
      return Messages.BOOK_ADD_SUCCESS(bookName, author, amount);
    }
  }

  /**
   * 删除图书
   * @param {string} bookName - 书名
   * @param {string} author - 作者
   * @returns {string} 删除结果消息
   */
  deleteBook(bookName, author) {
    const validationError = Validators.validateBookOperation(bookName, author);
    if (validationError) return validationError;

    const key = this.getBookKey(bookName, author);
    
    if (!this.books.has(key)) {
      return Messages.BOOK_NOT_FOUND(bookName, author);
    }

    const book = this.books.get(key);
    if (book.borrowedBy.length > 0) {
      return Messages.BOOK_DELETE_BORROWED(bookName);
    }

    this.books.delete(key);
    return Messages.BOOK_DELETE_SUCCESS(bookName, author);
  }

  /**
   * 列出所有图书
   * @returns {string} 图书列表
   */
  listBooks() {
    if (this.books.size === 0) {
      return Messages.NO_BOOKS;
    }

    let result = Messages.BOOK_LIST_HEADER;
    for (const book of this.books.values()) {
      result += `\n${book.name} - ${book.author} - Inventory: ${book.inventory}`;
    }
    return result;
  }

  /**
   * 搜索图书
   * @param {string} bookName - 书名
   * @param {string} author - 作者
   * @returns {string} 搜索结果
   */
  searchBook(bookName, author) {
    const validationError = Validators.validateBookOperation(bookName, author);
    if (validationError) return validationError;

    const key = this.getBookKey(bookName, author);
    
    if (!this.books.has(key)) {
      return Messages.BOOK_NOT_FOUND(bookName, author);
    }

    const book = this.books.get(key);
    return `${book.name} - ${book.author} - Inventory: ${book.inventory}`;
  }

  /**
   * 借阅图书
   * @param {string} bookName - 书名
   * @param {string} author - 作者
   * @param {string} userName - 借阅用户名
   * @returns {Object} 借阅结果 {success: boolean, message: string}
   */
  borrowBook(bookName, author, userName) {
    const key = this.getBookKey(bookName, author);
    
    if (!this.books.has(key)) {
      return {
        success: false,
        message: Messages.BOOK_NOT_FOUND(bookName, author)
      };
    }

    const book = this.books.get(key);
    if (book.inventory <= 0) {
      return {
        success: false,
        message: Messages.BOOK_NOT_AVAILABLE(bookName)
      };
    }

    // 执行借阅
    book.inventory--;
    book.borrowedBy.push(userName);

    return {
      success: true,
      message: Messages.BOOK_BORROW_SUCCESS(bookName),
      bookKey: key
    };
  }

  /**
   * 归还图书
   * @param {string} bookName - 书名
   * @param {string} author - 作者
   * @param {string} userName - 归还用户名
   * @returns {Object} 归还结果 {success: boolean, message: string}
   */
  returnBook(bookName, author, userName) {
    const key = this.getBookKey(bookName, author);
    
    if (!this.books.has(key)) {
      return {
        success: false,
        message: Messages.BOOK_NOT_FOUND(bookName, author)
      };
    }

    const book = this.books.get(key);
    
    // 检查用户是否借阅了这本书
    const borrowerIndex = book.borrowedBy.indexOf(userName);
    if (borrowerIndex === -1) {
      return {
        success: false,
        message: Messages.BOOK_NOT_BORROWED(bookName, author)
      };
    }

    // 执行归还
    book.inventory++;
    book.borrowedBy.splice(borrowerIndex, 1);

    return {
      success: true,
      message: Messages.BOOK_RETURN_SUCCESS(bookName),
      bookKey: key
    };
  }

  /**
   * 检查图书是否存在
   * @param {string} bookName - 书名
   * @param {string} author - 作者
   * @returns {boolean} 图书是否存在
   */
  bookExists(bookName, author) {
    const key = this.getBookKey(bookName, author);
    return this.books.has(key);
  }

  /**
   * 获取图书信息
   * @param {string} bookName - 书名
   * @param {string} author - 作者
   * @returns {Object|null} 图书信息或null
   */
  getBook(bookName, author) {
    const key = this.getBookKey(bookName, author);
    return this.books.get(key) || null;
  }

  /**
   * 检查图书是否可借阅
   * @param {string} bookName - 书名
   * @param {string} author - 作者
   * @returns {boolean} 是否可借阅
   */
  isBookAvailable(bookName, author) {
    const book = this.getBook(bookName, author);
    return book && book.inventory > 0;
  }

  /**
   * 获取图书总数
   * @returns {number} 图书总数
   */
  getTotalBooks() {
    return this.books.size;
  }
}

module.exports = BookModel;