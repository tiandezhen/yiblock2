# YiBlock2 - 积木式编程平台

一个基于最新 Blockly 的积木式模块化编程 Web 应用，支持生成 C、Python、JavaScript、C++ 和 Rust 代码。

## 功能特性

- 🧩 **可视化编程**: 使用拖拽式积木块进行编程，无需编写代码
- 🌐 **多语言支持**: 支持生成 5 种编程语言的代码：
  - JavaScript
  - Python
  - C
  - C++
  - Rust
- 🎨 **友好界面**: 现代化的用户界面，支持中文
- 📋 **一键复制**: 轻松复制生成的代码
- ⚡ **实时生成**: 编辑积木块时实时生成代码

## 快速开始

### 安装依赖

```bash
npm install
```

### 运行应用

```bash
npm start
```

然后在浏览器中访问 `http://localhost:8080`

## 使用方法

1. 从左侧工具栏拖拽积木块到工作区
2. 连接和配置积木块
3. 在右侧选择目标编程语言
4. 查看自动生成的代码
5. 点击"复制代码"按钮复制生成的代码

## 支持的积木块

- **逻辑块**: if-else 条件语句、比较运算、逻辑运算
- **循环块**: 重复执行、while 循环、for 循环
- **数学块**: 数字、算术运算、数学函数
- **文本块**: 字符串、打印输出
- **变量块**: 创建和使用变量
- **函数块**: 定义和调用函数

## 技术栈

- [Blockly](https://developers.google.com/blockly) - Google 开发的可视化编程库
- HTML5 + CSS3
- JavaScript (ES6+)

## 项目结构

```
yiblock2/
├── index.html          # 主 HTML 文件
├── js/
│   ├── app.js         # 应用主逻辑
│   └── generators.js  # 多语言代码生成器
├── package.json       # Node.js 依赖配置
├── .gitignore        # Git 忽略文件
└── README.md         # 项目文档
```

## 代码生成器说明

本项目实现了 5 个自定义代码生成器：

1. **C 生成器**: 生成标准 C 代码（C99）
2. **Python 生成器**: 生成 Python 3 代码
3. **JavaScript 生成器**: 使用 Blockly 内置的 JavaScript 生成器
4. **C++ 生成器**: 生成标准 C++ 代码（C++11）
5. **Rust 生成器**: 生成 Rust 代码

每个生成器都支持基本的编程结构，包括变量、控制流、循环和函数。

## 浏览器支持

- Chrome（推荐）
- Firefox
- Safari
- Edge

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 致谢

本项目使用了 [Google Blockly](https://developers.google.com/blockly)，感谢 Google 及 Blockly 团队的贡献。
