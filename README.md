# Cloudflare 身份认证系统

基于 Cloudflare Workers、D1 SQL 和 KV 的安全身份认证系统，包含注册码管理功能。

## 功能特性

### 用户端
- ✅ 用户注册（需要有效注册码）
- ✅ 用户登录
- ✅ JWT token 认证
- ✅ 会话管理（使用 KV）
- ✅ 实时注册码验证
- ✅ 精美的 Material Design 界面

### 管理端
- ✅ 生成注册码
- ✅ 设置注册码最大使用次数
- ✅ 设置注册码过期时间
- ✅ 查看注册码使用情况
- ✅ 统计信息展示

### 安全特性
- 🔒 bcrypt 密码加密（10 轮盐值）
- 🔒 JWT token 认证（7天过期）
- 🔒 KV 会话存储（7天过期）
- 🔒 输入验证和清理
- 🔒 SQL 注入防护（使用参数化查询）
- 🔒 XSS 防护（输入清理）
- 🔒 管理员密钥保护

## 项目结构

```
cf/
├── src/
│   ├── index.js              # 主入口文件
│   ├── assets.js             # 静态资源
│   ├── handlers/
│   │   ├── auth.js           # 认证处理器
│   │   └── codes.js          # 注册码处理器
│   └── utils/
│       ├── auth.js           # 认证工具函数
│       └── validators.js     # 验证工具函数
├── public/
│   ├── index.html            # 用户登录/注册页面
│   ├── admin.html            # 管理员面板
│   └── js/
│       ├── app.js            # 用户端 JavaScript
│       └── admin.js          # 管理端 JavaScript
├── migrations/
│   ├── 0001_initial.sql      # 数据库初始化
│   └── 0002_create_admin.sql # 创建默认管理员
├── scripts/
│   └── bundle-assets.js      # 静态资源打包脚本
├── package.json
├── wrangler.toml
└── .gitignore
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 创建 D1 数据库

```bash
npx wrangler d1 create auth-db
```

将返回的 `database_id` 更新到 `wrangler.toml` 文件中。

### 3. 创建 KV 命名空间

```bash
npx wrangler kv:namespace create "SESSIONS"
```

将返回的 `id` 更新到 `wrangler.toml` 文件中。

### 4. 运行数据库迁移

本地开发：
```bash
npx wrangler d1 migrations apply auth-db --local
```

生产环境：
```bash
npx wrangler d1 migrations apply auth-db
```

### 5. 配置环境变量

在 `wrangler.toml` 中配置：
- `JWT_SECRET`: JWT 密钥（生产环境请使用强密码）
- `ADMIN_KEY`: 管理员密钥（用于生成注册码）

### 6. 本地开发

```bash
npm run dev
```

访问：
- 用户端: http://localhost:8787/
- 管理端: http://localhost:8787/admin

### 7. 部署到 Cloudflare

```bash
npm run deploy
```

## API 端点

### 认证 API

#### POST /api/register
注册新用户

**请求体：**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "registrationCode": "WELCOME2024"
}
```

#### POST /api/login
用户登录

**请求体：**
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**响应：**
```json
{
  "success": true,
  "token": "jwt-token",
  "sessionId": "session-id",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

#### GET /api/verify
验证用户令牌

**请求头：**
```
Authorization: Bearer {token}
X-Session-ID: {session-id}
```

#### POST /api/logout
用户登出

**请求头：**
```
Authorization: Bearer {token}
X-Session-ID: {session-id}
```

### 注册码 API

#### POST /api/codes/generate
生成新注册码（需要管理员密钥）

**请求头：**
```
X-Admin-Key: {admin-key}
```

**请求体：**
```json
{
  "maxUses": 10,
  "expiresAt": "2024-12-31T23:59:59"
}
```

#### GET /api/codes/list
获取注册码列表（需要管理员密钥）

**请求头：**
```
X-Admin-Key: {admin-key}
```

#### POST /api/codes/validate
验证注册码

**请求体：**
```json
{
  "code": "WELCOME2024"
}
```

## 默认测试数据

数据库迁移后会创建以下测试数据：

### 默认管理员
- 用户名: admin
- 邮箱: admin@example.com
- 密码: admin123

### 测试注册码
- WELCOME2024 (最多使用 100 次)
- BETA2024 (最多使用 50 次)
- VIP2024 (最多使用 10 次)

## 安全建议

1. **生产环境配置**
   - 修改 `JWT_SECRET` 为强随机字符串
   - 修改 `ADMIN_KEY` 为强随机字符串
   - 修改默认管理员密码

2. **密码策略**
   - 要求用户使用强密码
   - 实现密码重置功能
   - 考虑添加两因素认证

3. **速率限制**
   - 实现登录尝试限制
   - 实现注册码验证限制
   - 防止暴力破解

4. **监控和日志**
   - 记录登录失败尝试
   - 监控异常活动
   - 实现告警机制

## 技术栈

- **后端**: Cloudflare Workers
- **数据库**: Cloudflare D1 (SQLite)
- **存储**: Cloudflare KV
- **认证**: JWT + bcrypt
- **前端**: HTML + CSS + JavaScript
- **UI 框架**: Bootstrap 5
- **图标**: Bootstrap Icons

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！