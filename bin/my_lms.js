#!/usr/bin/env node

const readline = require('readline');
const { program } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const LibrarySystem = require('../src/index');

// 常量定义
const CONSTANTS = {
  COMMANDS: {
    EXIT: 'exit',
    HELP: 'help'
  },
  MESSAGES: {
    WELCOME: 'Welcome to Library Management System!',
    PROMPT: 'Please input your command (input "exit" to exit):',
    HELP_TIP: 'Type "help" for available commands.\n',
    GOODBYE: 'See you next time! 👋',
    INVALID_COMMAND: '❌ Invalid command. Type "help" for available commands.',
    AVAILABLE_COMMANDS: '\n📋 Available Commands:',
    SEPARATOR: '─'.repeat(50)
  },
  ICONS: {
    SUCCESS: '✅',
    ERROR: '❌',
    LOGOUT: '👋',
    BOOKS: '📚',
    SEARCH: '🔍',
    BORROW: '📖',
    RETURN: '📚',
    ADD: '➕',
    DELETE: '🗑️'
  }
};

/**
 * CLI应用程序类
 */
class LibraryCLI {
  constructor() {
    this.library = new LibrarySystem();
    this.rl = this.createReadlineInterface();
    this.setupProgram();
  }

  /**
   * 创建readline接口
   */
  createReadlineInterface() {
    return readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * 设置commander程序
   */
  setupProgram() {
    program
      .description('Library Management System')
      .option('-h, --help', 'display help for command');
  }

  /**
   * 显示欢迎信息
   */
  displayWelcome() {
    console.log(chalk.cyan(figlet.textSync('Library Management', {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    })));

    console.log(chalk.green.bold(CONSTANTS.MESSAGES.WELCOME));
    console.log(chalk.yellow(CONSTANTS.MESSAGES.PROMPT));
    console.log(chalk.gray(CONSTANTS.MESSAGES.HELP_TIP));
  }

  /**
   * 判断操作是否成功
   */
  isSuccess(result) {
    return result.includes('success') || result.includes('成功');
  }

  /**
   * 显示结果信息
   */
  displayResult(result, icon = '', successColor = chalk.green, errorColor = chalk.red) {
    const prefix = icon ? `${icon} ` : '';
    if (this.isSuccess(result)) {
      console.log(successColor(prefix + result));
    } else {
      console.log(errorColor(prefix + result));
    }
  }

  /**
   * 创建命令处理器
   */
  createCommandHandlers() {
    const handlers = {
      register: (role, name, password) => {
        const result = this.library.register(role, name, password);
        console.log(chalk.cyan(result));
      },

      login: (name, password) => {
        const result = this.library.login(name, password);
        this.displayResult(result, CONSTANTS.ICONS.SUCCESS);
      },

      logout: () => {
        const result = this.library.logout();
        console.log(chalk.yellow(`${CONSTANTS.ICONS.LOGOUT} ${result}`));
      },

      list: () => {
        const result = this.library.listBooks();
        console.log(chalk.blue(`${CONSTANTS.ICONS.BOOKS} ${result}`));
      },

      search: (bookName, author) => {
        const result = this.library.searchBook(bookName, author);
        console.log(chalk.magenta(`${CONSTANTS.ICONS.SEARCH} ${result}`));
      },

      borrow: (bookName, author) => {
        const result = this.library.borrowBook(bookName, author);
        this.displayResult(result, CONSTANTS.ICONS.BORROW);
      },

      return: (bookName, author) => {
        const result = this.library.returnBook(bookName, author);
        this.displayResult(result, CONSTANTS.ICONS.RETURN);
      },

      add: (bookName, author, amount) => {
        const result = this.library.addBook(bookName, author, parseInt(amount));
        this.displayResult(result, CONSTANTS.ICONS.ADD);
      },

      delete: (bookName, author) => {
        const result = this.library.deleteBook(bookName, author);
        this.displayResult(result, CONSTANTS.ICONS.DELETE);
      },

      help: () => {
        console.log(chalk.cyan.bold(CONSTANTS.MESSAGES.AVAILABLE_COMMANDS));
        console.log(chalk.gray(CONSTANTS.MESSAGES.SEPARATOR));
        
        const commands = [
          { cmd: 'register <role> <name> <password>', desc: 'Register a new user with role (admin/user), name and password', color: chalk.blue },
          { cmd: 'login <name> <password>', desc: 'login with name and password', color: chalk.green },
          { cmd: 'logout', desc: 'logout', color: chalk.yellow },
          { cmd: 'list', desc: 'list all books', color: chalk.magenta },
          { cmd: 'search <bookName> <author>', desc: 'Search book by book name and author', color: chalk.cyan },
          { cmd: 'borrow <bookName> <author>', desc: 'Borrow book by book name and author', color: chalk.blue },
          { cmd: 'return <bookName> <author>', desc: 'Return book by book name and author', color: chalk.green },
          { cmd: 'add <bookName> <author> <amount>', desc: 'Add book inventory by book name and author', color: chalk.magenta },
          { cmd: 'delete <bookName> <author>', desc: 'Delete book by name and author', color: chalk.red },
          { cmd: 'help', desc: 'display help for command', color: chalk.gray }
        ];
        
        commands.forEach(({ cmd, desc, color }) => {
          console.log(`  ${color.bold(cmd.padEnd(30))} ${chalk.white(desc)}`);
        });
        
        console.log(chalk.gray(CONSTANTS.MESSAGES.SEPARATOR));
      }
    };

    return handlers;
  }

  /**
   * 注册所有命令
   */
  registerCommands() {
    const handlers = this.createCommandHandlers();

    // 清空现有命令
    program.commands = [];

    // 注册命令
    program
      .command('register <role> <name> <password>')
      .description('Register a new user with role (admin/user), name and password')
      .action(handlers.register);

    program
      .command('login <name> <password>')
      .description('login with name and password')
      .action(handlers.login);

    program
      .command('logout')
      .description('logout')
      .action(handlers.logout);

    program
      .command('list')
      .description('list all books')
      .action(handlers.list);

    program
      .command('search <bookName> <author>')
      .description('Search book by book name and author')
      .action(handlers.search);

    program
      .command('borrow <bookName> <author>')
      .description('Borrow book by book name and author')
      .action(handlers.borrow);

    program
      .command('return <bookName> <author>')
      .description('Return book by book name and author')
      .action(handlers.return);

    program
      .command('add <bookName> <author> <amount>')
      .description('Add book inventory by book name and author')
      .action(handlers.add);

    program
      .command('delete <bookName> <author>')
      .description('Delete book by name and author')
      .action(handlers.delete);

    program
      .command('help')
      .description('display help for command')
      .action(handlers.help);
  }

  /**
   * 解析输入字符串为参数数组
   */
  parseInput(input) {
    const args = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';

    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      
      if ((char === '"' || char === "'") && !inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar && inQuotes) {
        inQuotes = false;
        quoteChar = '';
      } else if (char === ' ' && !inQuotes) {
        if (current) {
          args.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }
    
    if (current) {
      args.push(current);
    }
    
    return args;
  }

  /**
   * 处理用户输入
   */
  handleUserInput(input) {
    const trimmedInput = input.trim();

    // 处理退出命令
    if (trimmedInput === CONSTANTS.COMMANDS.EXIT) {
      console.log(chalk.magenta.bold(CONSTANTS.MESSAGES.GOODBYE));
      this.rl.close();
      return false;
    }

    // 处理空输入
    if (trimmedInput === '') {
      return true;
    }

    // 解析并执行命令
    try {
      const args = this.parseInput(trimmedInput);
      process.argv = ['node', 'my_lms', ...args];
      
      // 重新注册命令
      this.registerCommands();
      
      program.parse(process.argv);
    } catch (error) {
      console.log(chalk.red.bold(CONSTANTS.MESSAGES.INVALID_COMMAND));
    }

    return true;
  }

  promptUser() {
    this.rl.question(chalk.cyan.bold('$ '), (input) => {
      const shouldContinue = this.handleUserInput(input);
      
      if (shouldContinue) {
        this.promptUser();
      }
    });
  }

  start() {
    this.displayWelcome();
    this.promptUser();
  }
}

const app = new LibraryCLI();
app.start();