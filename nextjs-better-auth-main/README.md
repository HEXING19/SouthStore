# South Store 🛍️

> 现代化的南非电子商务平台，基于 Next.js 16 和 Better Auth 构建

[![Deployed on Vercel](https://img.shields.io/badge/Vercel-部署-black?style=for-the-badge&logo=vercel)](https://south-store.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)

**South Store** 是一个功能完整的电子商务解决方案，专为南非市场设计。它集成了现代化的认证系统、产品管理、购物车功能，并提供直观的管理后台。

## ✨ 功能特性

### 🛒 用户功能
- **产品浏览** - 优雅的产品展示网格
- **智能搜索** - 实时搜索产品名称和描述
- **分类过滤** - 按类别浏览（Clothing, Hardware, Home, Electronics）
- **购物车管理** - 添加、移除和更新商品数量
- **用户认证** - 支持邮箱密码和 Google OAuth 登录
- **响应式设计** - 完美适配移动端和桌面端

### 🔧 管理功能
- **产品 CRUD** - 完整的创建、读取、更新、删除产品功能
- **库存管理** - 实时查看和管理库存数量
- **产品编辑** - 直观的产品编辑界面
- **数据持久化** - 所有数据存储在 Supabase PostgreSQL

### ⚡ 技术特性
- **类型安全** - 完整的 TypeScript 支持 + Zod 验证
- **服务端渲染** - Next.js App Router 提供出色的 SEO
- **性能优化** - Turbopack 实现快速构建和热更新
- **数据库 ORM** - Drizzle ORM 提供类型安全的数据库操作
- **现代 UI** - Tailwind CSS 4 + Radix UI 组件

## 🛠️ 技术栈

### 前端
- **框架**: [Next.js 16.1.6](https://nextjs.org/) (App Router + Turbopack)
- **UI 库**: [React 19.2.0](https://react.dev/)
- **语言**: [TypeScript 5](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS 4.1.16](https://tailwindcss.com/)
- **组件库**: [Radix UI](https://www.radix-ui.com/)
- **图标**: [Lucide React](https://lucide.dev/)
- **表单**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **通知**: [Sonner](https://sonner.emilkowal.ski/)

### 后端
- **API**: Next.js API Routes
- **数据库**: [PostgreSQL](https://www.postgresql.org/) (托管在 Supabase)
- **ORM**: [Drizzle ORM 0.44.7](https://orm.drizzle.team/)
- **认证**: [Better Auth 1.3.32](https://www.better-auth.com/)
- **验证**: [Zod 4.1.12](https://zod.dev/)

### 开发工具
- **代码检查**: [ESLint](https://eslint.org/)
- **格式化**: [Prettier](https://prettier.io/)
- **包管理**: [pnpm](https://pnpm.io/)

## 📁 项目结构

```
nextjs-better-auth-main/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API 路由
│   │   │   ├── auth/          # Better Auth 端点
│   │   │   ├── products/      # 产品公开 API
│   │   │   │   ├── route.ts   # GET /api/products
│   │   │   │   └── [id]/      # GET /api/products/[id]
│   │   │   └── admin/         # 管理员 API
│   │   │       └── products/  # POST/PUT/DELETE
│   │   ├── (routes)/          # 页面路由组
│   │   │   ├── shop/          # 商店页面
│   │   │   └── (auth)/        # 认证页面
│   │   │       ├── signin/    # 登录
│   │   │       └── signup/    # 注册
│   │   ├── admin/            # 管理后台
│   │   │   └── products/     # /admin/products
│   │   └── page.tsx          # 首页
│   ├── components/            # React 组件
│   │   ├── ui/               # 基础 UI 组件
│   │   └── store/            # 商店组件
│   │       ├── Header.tsx
│   │       ├── ProductCard.tsx
│   │       ├── ProductGrid.tsx
│   │       ├── CartDrawer.tsx
│   │       └── ...
│   ├── contexts/             # React Context
│   │   ├── CartContext.tsx   # 购物车状态
│   │   └── ViewContext.tsx   # 视图状态
│   ├── lib/                  # 工具库
│   │   ├── auth/            # Better Auth 配置
│   │   ├── hooks/           # 自定义 Hooks
│   │   ├── api/             # API 工具函数
│   │   └── utils.ts         # 通用工具
│   ├── db/                   # 数据库相关
│   │   ├── schema/          # Drizzle Schema
│   │   │   ├── auth.ts      # 用户、会话表
│   │   │   └── products.ts  # 产品表
│   │   └── index.ts         # 数据库连接
│   └── types/                # TypeScript 类型
├── drizzle/                  # 数据库迁移文件
├── public/                   # 静态资源
└── package.json             # 项目依赖
```

## 🚀 快速开始

### 前置要求

- Node.js 18 或更高版本
- pnpm（推荐）或 npm
- [Supabase](https://supabase.com/) 账户（免费）

### 安装步骤

**1. 克隆项目**

```bash
git clone https://github.com/HEXING19/SouthStore.git
cd SouthStore/nextjs-better-auth-main
```

**2. 安装依赖**

```bash
pnpm install
# 或
npm install
```

**3. 配置环境变量**

创建 `.env` 文件：

```env
# 数据库配置
DATABASE_URL="postgresql://user:password@host:port/database"
DIRECT_URL="postgresql://user:password@host:port/database"

# Better Auth 配置
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Google OAuth（可选）
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**4. 设置数据库**

```bash
# 生成迁移文件
pnpm run db:generate

# 执行数据库迁移
pnpm run db:migrate
```

**5. 创建产品表（如果迁移未包含）**

在 Supabase SQL Editor 中执行：

```sql
CREATE TABLE "products" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "category" text NOT NULL,
  "price" numeric(10, 2) NOT NULL,
  "description" text NOT NULL,
  "image" text NOT NULL,
  "rating" numeric(3, 2) DEFAULT '0' NOT NULL,
  "stock" text DEFAULT '0',
  "createdAt" timestamp DEFAULT now(),
  "updatedAt" timestamp DEFAULT now()
);

CREATE INDEX "products_category_idx" ON "products" USING btree ("category");
CREATE INDEX "products_name_idx" ON "products" USING btree ("name");
```

**6. 启动开发服务器**

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📚 API 文档

### 认证 API

| 端点 | 方法 | 描述 | 认证 |
|------|------|------|------|
| `/api/auth/sign-up` | POST | 用户注册 | ❌ |
| `/api/auth/sign-in` | POST | 用户登录 | ❌ |
| `/api/auth/sign-out` | POST | 用户登出 | ✅ |
| `/api/auth/session` | GET | 获取会话信息 | ✅ |

### 产品公开 API

#### 获取产品列表
```
GET /api/products
```

**查询参数**：
- `category` (可选): 产品类别 - `Clothing`, `Hardware`, `Home`, `Electronics`, `All`
- `search` (可选): 搜索关键词
- `limit` (可选): 每页数量（默认 50，最大 100）
- `offset` (可选): 偏移量（默认 0）
- `sort` (可选): 排序字段 - `name`, `price`, `rating`（默认 name）
- `order` (可选): 排序方向 - `asc`, `desc`（默认 asc）

**示例**：
```bash
# 获取所有产品
curl http://localhost:3000/api/products

# 按类别筛选
curl http://localhost:3000/api/products?category=Clothing

# 搜索产品
curl http://localhost:3000/api/products?search=drill

# 排序和分页
curl "http://localhost:3000/api/products?sort=price&order=desc&limit=10&offset=20"
```

#### 获取单个产品
```
GET /api/products/[id]
```

**示例**：
```bash
curl http://localhost:3000/api/products/prod_123
```

### 管理员 API（需要认证和 admin 角色）

| 端点 | 方法 | 描述 | 权限 |
|------|------|------|------|
| `/api/admin/products` | GET | 获取所有产品 | Admin |
| `/api/admin/products` | POST | 创建产品 | Admin |
| `/api/admin/products` | PUT | 更新产品 | Admin |
| `/api/admin/products` | DELETE | 删除产品 | Admin |

**创建产品示例**：
```bash
curl -X POST http://localhost:3000/api/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Classic Denim Jacket",
    "category": "Clothing",
    "price": 899.99,
    "description": "Durable and stylish denim jacket",
    "image": "/products/product-1.jpg",
    "rating": 4.5,
    "stock": 50
  }'
```

## 💾 数据库 Schema

### Products 表

```sql
CREATE TABLE "products" (
  "id" text PRIMARY KEY,           -- 产品 ID
  "name" text NOT NULL,             -- 产品名称
  "category" text NOT NULL,         -- 类别：Clothing/Hardware/Home/Electronics
  "price" numeric(10, 2) NOT NULL,  -- 价格（南非兰特）
  "description" text NOT NULL,      -- 产品描述
  "image" text NOT NULL,            -- 图片 URL
  "rating" numeric(3, 2) DEFAULT '0', -- 评分（0-5）
  "stock" text DEFAULT '0',         -- 库存数量
  "createdAt" timestamp DEFAULT now(),  -- 创建时间
  "updatedAt" timestamp DEFAULT now()   -- 更新时间
);

-- 索引
CREATE INDEX "products_category_idx" ON "products" ("category");
CREATE INDEX "products_name_idx" ON "products" ("name");
```

### 认证表（Better Auth 自动创建）

- `user` - 用户表
- `account` - 关联账户表
- `session` - 会话表
- `verification` - 验证表

## ⚙️ 环境变量

| 变量名 | 说明 | 必需 | 默认值 |
|--------|------|------|--------|
| `DATABASE_URL` | Supabase 连接池 URL | ✅ | - |
| `DIRECT_URL` | 数据库直接连接 URL | ✅ | - |
| `BETTER_AUTH_SECRET` | 认证密钥 | ✅ | - |
| `BETTER_AUTH_BASE_URL` | 应用 URL | ✅ | `http://localhost:3000` |
| `NEXT_PUBLIC_BASE_URL` | 公开 URL | ✅ | `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | Google OAuth ID | ❌ | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 密钥 | ❌ | - |

## 📜 可用脚本

```bash
# 开发
pnpm dev              # 启动开发服务器（Turbopack）
pnpm build            # 构建生产版本
pnpm start            # 启动生产服务器
pnpm lint             # 代码检查

# 数据库
pnpm run db:generate  # 生成迁移文件
pnpm run db:migrate   # 执行数据库迁移
pnpm run db:studio    # 打开 Drizzle Studio（数据库管理界面）
```

## 🌐 部署

### Vercel 部署

**1. 推送代码到 GitHub**

```bash
git push origin main
```

**2. 在 Vercel 中导入项目**

- 访问 [Vercel Dashboard](https://vercel.com/dashboard)
- 点击 "New Project"
- 导入 `HEXING19/SouthStore`

**3. 配置环境变量**

在 Vercel 项目设置中添加：
- `DATABASE_URL`
- `DIRECT_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_BASE_URL`（设置为你的域名）
- `NEXT_PUBLIC_BASE_URL`（设置为你的域名）
- `GOOGLE_CLIENT_ID` 和 `GOOGLE_CLIENT_SECRET`（可选）

**4. 部署**

Vercel 会自动部署。访问提供的 URL 查看应用。

## 🤝 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 开发指南

### 代码风格

- 使用 TypeScript 编写所有代码
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码

### 提交规范

- feat: 新功能
- fix: 修复 bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建/工具链相关

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [Next.js](https://nextjs.org/)
- [Better Auth](https://www.better-auth.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)

---

**Made with ❤️ for South Africa E-commerce**

在线演示：[https://south-store.vercel.app](https://south-store.vercel.app)
