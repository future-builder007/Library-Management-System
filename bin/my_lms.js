#!/usr/bin/env node

const readline = require('readline');
const { program } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const LibrarySystem = require('../src/index');

const library = new LibrarySystem();

// 配置commander程序
program
  .description('Library Management System')
  .option('-h, --help', 'display help for command');

program
  .command('register <role> <name> <password>')
  .description('Register a new user with role (admin/user), name and password')
  .action((role, name, password) => {
    const result = library.register(role, name, password);
    console.log(chalk.cyan(result));
  });

program
  .command('login <name> <password>')
  .description('login with name and password')
  .action((name, password) => {
    const result = library.login(name, password);
    if (result.includes('success') || result.includes('成功')) {
      console.log(chalk.green(result));
    } else {
      console.log(chalk.red(result));
    }
  });

program
  .command('logout')
  .description('logout')
  .action(() => {
    const result = library.logout();
    console.log(chalk.yellow(result));
  });

program
  .command('list')
  .description('list all books')
  .action(() => {
    const result = library.listBooks();
    console.log(chalk.blue(result));
  });

program
  .command('search <bookName> <author>')
  .description('Search book by book name and author')
  .action((bookName, author) => {
    const result = library.searchBook(bookName, author);
    console.log(chalk.magenta(result));
  });

program
  .command('borrow <bookName> <author>')
  .description('Borrow book by book name and author')
  .action((bookName, author) => {
    const result = library.borrowBook(bookName, author);
    if (result.includes('success') || result.includes('成功')) {
      console.log(chalk.green(result));
    } else {
      console.log(chalk.red(result));
    }
  });

program
  .command('return <bookName> <author>')
  .description('Return book by book name and author')
  .action((bookName, author) => {
    const result = library.returnBook(bookName, author);
    if (result.includes('success') || result.includes('成功')) {
      console.log(chalk.green(result));
    } else {
      console.log(chalk.red(result));
    }
  });

program
  .command('add <bookName> <author> <amount>')
  .description('Add book inventory by book name and author')
  .action((bookName, author, amount) => {
    const result = library.addBook(bookName, author, parseInt(amount));
    if (result.includes('success') || result.includes('成功')) {
      console.log(chalk.green(result));
    } else {
      console.log(chalk.red(result));
    }
  });

program
  .command('delete <bookName> <author>')
  .description('Delete book by name and author')
  .action((bookName, author) => {
    const result = library.deleteBook(bookName, author);
    if (result.includes('success') || result.includes('成功')) {
      console.log(chalk.green(result));
    } else {
      console.log(chalk.red(result));
    }
  });

// 创建readline接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 显示欢迎标题
console.log(chalk.cyan(figlet.textSync('Library Management', {
  font: 'Standard',
  horizontalLayout: 'default',
  verticalLayout: 'default'
})));

console.log(chalk.green.bold('Welcome to Library Management System!'));
console.log(chalk.yellow('Please input your command (input "exit" to exit):'));
console.log(chalk.gray('Type "help" for available commands.\n'));

// 主循环
function promptUser() {
  rl.question(chalk.cyan.bold('$ '), (input) => {
    if (input.trim() === 'exit') {
      console.log(chalk.magenta.bold('See you next time! 👋'));
      rl.close();
      return;
    }

    if (input.trim() === '') {
      promptUser();
      return;
    }

    // 解析输入并执行命令
    try {
      const args = parseInput(input);
      process.argv = ['node', 'my_lms', ...args];
      
      // 重置program的子命令
      program.commands = [];
      setupCommands();
      
      program.parse(process.argv);
    } catch (error) {
      console.log(chalk.red.bold('❌ Invalid command. Type "help" for available commands.'));
    }

    promptUser();
  });
}

// 设置所有命令
function setupCommands() {
  program
    .command('register <role> <name> <password>')
    .description('Register a new user with role (admin/user), name and password')
    .action((role, name, password) => {
      const result = library.register(role, name, password);
      console.log(chalk.cyan(result));
    });

  program
    .command('login <name> <password>')
    .description('login with name and password')
    .action((name, password) => {
      const result = library.login(name, password);
      if (result.includes('success') || result.includes('成功')) {
        console.log(chalk.green('✅ ' + result));
      } else {
        console.log(chalk.red('❌ ' + result));
      }
    });

  program
    .command('logout')
    .description('logout')
    .action(() => {
      const result = library.logout();
      console.log(chalk.yellow('👋 ' + result));
    });

  program
    .command('list')
    .description('list all books')
    .action(() => {
      const result = library.listBooks();
      console.log(chalk.blue('📚 ' + result));
    });

  program
    .command('search <bookName> <author>')
    .description('Search book by book name and author')
    .action((bookName, author) => {
      const result = library.searchBook(bookName, author);
      console.log(chalk.magenta('🔍 ' + result));
    });

  program
    .command('borrow <bookName> <author>')
    .description('Borrow book by book name and author')
    .action((bookName, author) => {
      const result = library.borrowBook(bookName, author);
      if (result.includes('success') || result.includes('成功')) {
        console.log(chalk.green('📖 ' + result));
      } else {
        console.log(chalk.red('❌ ' + result));
      }
    });

  program
    .command('return <bookName> <author>')
    .description('Return book by book name and author')
    .action((bookName, author) => {
      const result = library.returnBook(bookName, author);
      if (result.includes('success') || result.includes('成功')) {
        console.log(chalk.green('📚 ' + result));
      } else {
        console.log(chalk.red('❌ ' + result));
      }
    });

  program
    .command('add <bookName> <author> <amount>')
    .description('Add book inventory by book name and author')
    .action((bookName, author, amount) => {
      const result = library.addBook(bookName, author, parseInt(amount));
      if (result.includes('success') || result.includes('成功')) {
        console.log(chalk.green('➕ ' + result));
      } else {
        console.log(chalk.red('❌ ' + result));
      }
    });

  program
    .command('delete <bookName> <author>')
    .description('Delete book by name and author')
    .action((bookName, author) => {
      const result = library.deleteBook(bookName, author);
      if (result.includes('success') || result.includes('成功')) {
        console.log(chalk.green('🗑️ ' + result));
      } else {
        console.log(chalk.red('❌ ' + result));
      }
    });

  program
    .command('help')
    .description('display help for command')
    .action(() => {
      console.log(chalk.cyan.bold('\n📋 Available Commands:'));
      console.log(chalk.gray('─'.repeat(50)));
      program.help();
    });
}

// 解析输入字符串为参数数组
function parseInput(input) {
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

// 开始交互
promptUser();