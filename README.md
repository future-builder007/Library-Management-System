# Library Management System

一个简单的命令行图书管理系统，支持用户管理、图书管理和借阅功能。

## 功能特性

- 👤 用户注册和登录（管理员/普通用户）
- 📚 图书添加、删除、搜索
- 📋 图书列表查看
- 📖 图书借阅和归还
- 🔐 基于角色的权限管理

## 安装运行

```bash
# 安装依赖
npm install

# 启动系统
npm start

# 或者直接运行
node bin/my_lms.js

# 或者
npm link
my_lms
```

## 快速开始

1. **注册用户**
   ```
   register admin Alice password123  # 注册管理员
   register user Bob password456     # 注册普通用户
   ```

2. **登录系统**
   ```
   login Alice password123
   ```

3. **添加图书**（管理员）
   ```
   add-book "Clean Code" "Robert C. Martin" 5
   ```

4. **借阅图书**（普通用户）
   ```
   login Bob password456
   borrow-book "Clean Code" "Robert C. Martin"
   ```

## 开发测试

```bash
# 运行测试
npm test

# 测试覆盖率
npm run test:coverage

# 查看覆盖率报告
npm run test:coverage:open
```

## 项目结构

```
├── src/              # 源代码
├── test/             # 测试文件
├── bin/              # 可执行文件
└── package.json      # 项目配置
```

## 许可证

MIT License
