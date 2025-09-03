🤖 AI 聊天助手
一个基于 React + TypeScript 构建的现代化 AI 聊天界面，提供流畅的对话体验和美观的用户界面。
✨ 功能特性
🎨 界面设计

现代化设计: 渐变背景和玻璃态效果
深色/浅色主题: 一键切换，护眼体验
响应式布局: 完美适配桌面端和移动端
流畅动画: 微交互动画提升用户体验

💬 聊天功能

实时对话: 即时消息发送和接收
智能响应: 模拟 AI 助手回复
打字指示器: 动画显示 AI 正在输入
消息时间戳: 清晰显示对话时间

⚙️ 实用工具

设置面板: 自定义 AI 名称和消息限制
清空聊天: 一键清除所有对话记录
键盘快捷键: 支持 Enter 快速发送
自动滚动: 自动定位到最新消息

🚀 快速开始
环境要求

Node.js 16+
npm 或 yarn

安装和运行
bash# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 在浏览器中访问 http://localhost:5173
构建生产版本
bash# 构建项目
npm run build

# 预览构建结果
npm run preview
🛠️ 技术栈

前端框架: React 18 + TypeScript
构建工具: Vite
样式方案: Tailwind CSS
图标库: Lucide React
开发语言: TypeScript

📁 项目结构
src/
├── components/          # React 组件
│   └── AIChat.tsx      # 主聊天组件
├── App.tsx             # 根组件
├── main.tsx            # 入口文件
└── index.css           # 全局样式
🔧 自定义配置
主题配置
项目支持深色和浅色两种主题，可以通过界面右上角的主题切换按钮进行切换。
AI 响应自定义
在 AIChat.tsx 中的 generateAIResponse 函数，你可以：

修改预设回复内容
添加更智能的回复逻辑
集成真实的 AI API（如 OpenAI GPT）

样式自定义
使用 Tailwind CSS，可以轻松修改：

颜色方案
布局尺寸
动画效果
响应式断点

🚧 开发计划

 集成真实 AI API
 添加语音输入/输出
 支持文件上传
 多语言支持
 聊天记录导出
 用户认证系统

🤝 贡献指南
我们欢迎所有形式的贡献！

Fork 项目到你的 GitHub
创建 功能分支 (git checkout -b feature/AmazingFeature)
提交 你的更改 (git commit -m 'Add some AmazingFeature')
推送 到分支 (git push origin feature/AmazingFeature)
开启 Pull Request

📄 开源协议
本项目基于 MIT License 开源协议。
👨‍💻 作者信息
如有问题或建议，欢迎联系！

⭐ 如果这个项目对你有帮助，请给它一个 Star！