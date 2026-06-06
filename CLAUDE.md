# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 命令

```bash
pnpm dev          # 启动开发服务器，带 Mock API（Vite，从 .env 读取 VITE_PORT）
pnpm build        # 类型检查后生产构建（禁用 Mock）
pnpm lint         # ESLint 检查
pnpm preview      # 预览生产构建
```


## 主要技术栈及版本

```
react19
zustand 5
react-router 7
antd 6
ahooks 3
axios 1
vite 7
tailwindcss 3
```

## 项目结构与文件组织

```shell
src/
├── assets/              # 静态资源（图片、图标、字体）
├── apis/                # 公共通用组件
│   └── index.ts         # 存放请求函数
│   └── types.d.ts       # 存放请求函数的参数类型、响应结果类型
├── components/          # 公共通用组件
│   └── ProForm
│       ├── components/  # 模块所需子组件
│       ├── hooks/       # 模块内自定义 Hooks
│       ├── types.d.ts   # 模块类型定义
│       └── utils.ts     # 模块用到的工具函数、常量等等存放在这里
│       └── index.tsx    # 模块主文件
	└── ....           
├── pages/               # 存放路由组件
│   └── Order/      
│       ├── components/  # 路由组件内私有组件
│       ├── hooks/       # 路由组件内自定义 Hooks
│       ├── types.d.ts   # 路由组件类型定义
│       └── index.tsx    # 路由组件导出入口
│   └── ...
├── hooks/            # 全局公共 Hooks
├── libs/             # 工具函数
├── constants/        # 常量
├──	└── index.ts      # 主文件，统一导出出口
├──	└── user.enum.ts  # enum值文件存放在此目录中
├── └── ....
├── routes/           # 路由配置
├── styles/           # 样式文件存放目录
├── stores/           # 全局状态管理
├── App.tsx
└── main.tsx
```

###  组件 / 文件规范

-  目录名使用大驼峰命名： `src/components/ProForm`
-  主文件 `index.tsx` 使用命名导出，此外还需要统一导出模块内其他文件，简化导入路径

```tsx
// src/components/ProForm/index.tsx

export const ProForm=({ options, onSubmit }: ProFormProps)=>{

}

export * from './types.d.ts'
```

- `types.d.ts` 存放模块内所有组件、函数需要的类型，包括 `props` 的类型

```ts
interface ProFormProps {
  user: {
	  id:string;
	  name:string;
  };
  onSubmit: (params: Record<string,any>) => void;
}
```

- `utils.ts` 存放模块内所有组件用到的工具函数、常量等等
- 导入规范：

```ts
// 1. 第三方依赖
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';

// 2. 绝对路径导入（配置别名后）
import { ProForm, ProFormProps} from '@/components/ProForm';
import { http } from '@/hooks';

// 3. 相对路径（同级/下级）
import { ProFormItem } from './components/ProFormItem.tsx';
```

- 代码都必须加上注释进行说明，其中 `组件，公共函数` 使用 `@description` 注释，普通函数使用箭头函数形式定义并使用 `//` 注释

```tsx
/**
* @description xxx
*/
export const ProForm=({ options, onSubmit }: ProFormProps)=>{
	
   // 点击按钮进行提交
   const handleSubmit=()=>{
   
   }
   
   ...
}

/**
* @description xxx
*/
export const format=(originStr:string)=>{
	.....
}

```

-  全局常量定义在 `src/constants/index.ts` 中的 `CFG` 对象里，并使用 `下划线/大写` 进行命名；`enum`  文件定义在同级目录中并使用 `下划线/大写`

```ts
// src/constants/index.ts
export const CFG = {
  TOKEN_KEY: "ADMIN_TOKEN",
  HOME_PATH: "/home",
  LOGIN_PATH: "/login",
  .....
};

export * from "./http.enum.ts";

```


```ts
// src/constants/user.enum.ts

export enum HTTP_STATUS {
  ....
}
```

## 优化手段
1. 避免不必要的重渲染
	- 使用 `React.memo `缓存纯组件及容易导致渲染瓶颈的复杂组件
	- 使用 `useMemo` 缓存计算值
	- 使用 `useCallback` 缓存函数引用
2. 列表渲染优化
	- 必须添加唯一稳定 `key`，不使用索引
	- 长列表使用虚拟滚动（`react-virtualized`）
3. 代码分割
	- 使用 `React.lazy + Suspense `路由懒加载
	- 禁止滥用优化：仅在性能瓶颈时使用 `memo/useMemo`

```tsx
// 缓存组件
const UserList = React.memo(function UserList({ list }) {
  return (
    <div>
      {list.map(item => (
        <UserItem key={item.id} data={item} />
      ))}
    </div>
  );
});

// 缓存计算值
const memoizedValue = useMemo(() => {
  return expensiveCalculation(list);
}, [list]);

// 缓存函数
const handleClick = useCallback((id) => {
  setActiveId(id);
}, []);
```

## Hooks 使用规范
1. 基础规则
	- 只在 `组件顶层 / 自定义 Hook` 中使用 `Hooks`
	- 只在 `React` 函数组件中使用 `Hooks`
	- 依赖数组必须完整，禁止手动省略依赖
2. 自定义 `Hooks` 规范
	- 命名必须以 `use` 开头
	- 一个 `Hook` 只处理一个独立逻辑
	- 暴露清晰的返回值，优先使用对象解构

## 其他说明

### 路径别名

`@/` 映射到 `src/`，在 `vite.config.ts` 和 `tsconfig.app.json` 中配置。

### 样式体系

四层样式，在 `main.tsx` 中加载：
- `common.scss` — 全局 SCSS 样式
- `tailwind.css` — Tailwind CSS v3（`@tailwind base/components/utilities`）
- `reset.css` — CSS 重置
- `theme.scss` — Ant Design 组件覆盖（按钮图标对齐、开关内部布局）
- `animate.css` — CSS 动画库（`animate__animated` 类）

### 样式风格
- 每个组件的样式都要使用tailwind v3 进行样式编写，使用 `className` 添加样式。
- 复杂的样式比如渐变、阴影或者需要动态样式可以使用 `style`


### 应用入口（`App.tsx`）

包装整个应用：
1. **Ant Design `ConfigProvider`** — locale 设为 `zh_CN`，根据 `isDark` 切换 `darkAlgorithm`/`defaultAlgorithm` 主题算法，覆盖主题 token（`colorPrimary`、`colorTextBase`、`colorBgContainer`、`colorBgLayout`）
2. **`QueryClientProvider`**（TanStack React Query v5）— 默认 `staleTime` 5 分钟
3. **Ant Design `App` 组件** — 挂载全局 `message`/`notification`/`modal` API

`main.tsx` 在渲染前调用一次 `initResize()`，该方法设置一个防抖的窗口 resize 监听器，更新 `useGlobalStore` 中的 `isMobile` 并调整根字体大小以实现响应式缩放。

### Mock API（仅开发环境）

`vite-plugin-mock` 在 `vite.config.ts` 中配置，`mockPath: "src/mock"`，仅在 `command === "serve"` 时启用。Mock 数据位于 `src/mock/index.ts`。添加新 API 端点时，需在 mock 中添加对应条目以保持应用在无后端时可运行。

### 路由

基于 Hash 路由（`createHashRouter`），位于 `src/routers/index.tsx`。路由是**动态的**——在运行时根据 API 菜单响应（`Api.getPermissions()`）生成，返回 `IApi.MenuItem` 对象树。每个菜单项携带 `componentPath` 字符串，通过 `import.meta.glob("@/pages/**/*.tsx")` 懒加载，匹配模式 `/src/pages/${componentPath}/index.tsx`。页面必须遵循 `src/pages/` 下的 `index.tsx` 约定。

`AuthGuard` 包裹布局——挂载时检查存储的 token，调用 `Api.getPermissions()` 获取用户信息和菜单，执行 `filterAndSortMenus()`（过滤 `type === 1`，按 `sort` 排序），并填充 auth store。无 token 时重定向到 `/login`。`RedirectIfAuthenticated` 包裹登录页，将已认证用户重定向走。

`AppRouter` 组件调用 `generateRoutes(apiMenus)` 从原始菜单数据构建路由对象。路由包裹在 `<Suspense>` 中，使用 Ant Design `<Spin>` 作为 fallback。

### API 层

`src/apis/index.ts` — 纯对象 `Api`，所有请求函数都写在该对象内，均使用 `src/libs/request.ts` 中的单例 `http`。请求函数的类型全部都定义在 `src/apis/type.d.ts` 的 `namespace IApi` 下。

### HTTP 层

`src/libs/request.ts` — `RequestHttp` 类，封装 Axios。拦截器注入 `Authorization: Bearer <token>` 。遇到 401 时清除 token 并重定向到登录页。导出为单例 `http`。

全局 Ant Design 消息 API 由 `src/hooks/useMessage.tsx` 中的 `MessageHolder` 挂载到 `window.$message`、`window.$notification`、`window.$modal`。

### 状态管理（Zustand）

四个 store，位于 `src/stores/`：

- **auth**（`useAuthStore`）— `isOnline`、`userInfo`、`menus`（UI 用转换后的菜单数据，树形结构）、`apiMenus`（路由生成用原始 API 响应）。不持久化。使用 `devtools` 中间件（名称：`"auth"`）。
- **theme**（`useThemeStore`）— `isDark`、`colorPrimary`、`colorVariants`（通过 `generateColorVariants()` 计算的颜色衍生值）。持久化到 localStorage（`theme-storage`）。`syncThemeToDOM()` 在 `document.documentElement` 和 `document.body` 上设置 `dark` 类。主题数据提供给 `App.tsx` 中的 Ant Design `ConfigProvider`。
- **global**（`useGlobalStore`）— `isMobile` 标志，由 `src/libs/index.ts:initResize()` 中的 resize 监听器设置。

### 事件总线

`src/libs/mitt.ts` — 类型安全的事件发射器（`mitt` 库），用于跨组件通信。目前仅有事件：`openThemeDrawer`。

### 存储工具

`src/libs/storage.ts` — 支持 TTL 过期的 `localStorage/sessionStorage` 封装。导出两种存储的 `getItem`/`setItem`/`removeItem`，以及 `getToken`/`setToken`/`removeToken` 。键在 `src/constants/index.ts` 中定义（`CFG.TOKEN_KEY` 等）。

### 图标集

`src/libs/iconMap.tsx` 中包含了系统可使用的图标集，页面中的所有图标都从这里获取。

### 登录流程

`src/pages/Login/Login.tsx` — 登录表单（loginName + loginPwd）。密码在发送前通过 `crypto-js` 进行 MD5 哈希。支持"记住我"（localStorage 30 天 TTL）。租户 ID 存储在 sessionStorage 中。

### 布局

`BaseLayout` 位于 `src/layout/index.tsx` — 响应式：桌面端显示可折叠的 `<Side>` 侧边栏（228px），移动端使用 Ant Design `<Drawer>`。顶部导航包含 `<CollapseButton>` 和 `<Setting>`（打开带 `ThemePanel` 的 Drawer）。页面过渡使用 CSS 淡入/淡出，通过 `page-enter`/`page-exit` 类实现。

### 关键组件

- **ProForm**（`src/components/ProForm/`）— 基于配置数组（`FormFieldItem[]`）的表单构建器。支持 Input、InputPassword、Select、DatePicker 等。通过 `ref` 暴露 `validateFields()`/`setFieldsValue()`。
- **ProTable**（`src/components/ProTable/`）— 支持拖拽排序的表格，基于 `@dnd-kit`。
- **ProModal**（`src/components/ProModal/`）— 基于 ProForm 配置的模态表单。
- **ProUpload**（`src/components/ProUpload/`）— 文件上传组件。
- **Drag**（`src/components/Drag/`）— 通用拖拽包裹组件，基于 `@dnd-kit`。
- **Banner**（`src/components/Banner/`）— 推广横幅，10 种颜色预设（`blue`、`pink`、`green`、`purple`、`orange`、`teal`、`red`、`cyan`、`indigo`、`lime`）。每种预设都有 `light` 和 `dark` 变体，根据 `isDark` 自动选择。支持标题、描述、按钮和插图。弧形装饰带 CSS 动画。
- **Chart**（`src/components/Chart/`）— ECharts 封装。`useChartColors()` hook 从 theme store 的 `colorVariants` 计算图表颜色集，自动适配深色/浅色模式。
- **Card**（`src/components/Card/`）— 卡片变体：`StatCard`、`MediaCard`、`ListCard`、`NormalCard`、`ProgressCard`。`StatCard` 包含迷你图表（折线/柱状/进度）。
- **Calendar**（`src/components/Calendar/`）— 日历组件，带提醒功能，由 `useCalendarStore` 支持。
- **ThemeToggle**（`src/components/ThemeToggle/`）— 深色/浅色切换按钮，使用 View Transitions API（`document.startViewTransition`），从点击位置执行圆形 clip-path 扩散动画。不支持的浏览器回退为即时切换。
- **ThemePanel**（`src/components/ThemePanel/`）— 设置面板，包含深色模式开关和主题色选择器（预设颜色 + 自定义）。
- **AnimateTransition**（`src/components/AnimateTransition/`）— 基于 `animate.css` 的入场/退场动画包裹组件，支持挂载/卸载控制。

### 关键 Hooks

- **`useChartColors`** — 从 theme `colorVariants` 和 `isDark` 派生的缓存图表颜色集。为深色模式适配强调色（绿、橙、红、金）。
- **`useEcharts`** — ECharts 实例生命周期管理（初始化、resize、销毁）。
- **`useCountUp`** — 数字动画计数器。
- **`useQueryPro`** — API 调用的 React Query 封装。
- **`useFullLoading`** — 全屏加载遮罩控制。
- **`useMessage`** — 将 Ant Design 的 message/notification/modal API 挂载到 `window`。


### 暗黑主题
- 创建的所有组件的样式必须有暗黑风格样式
- 主题配置模块可参考`src/stores/theme.ts`

### 弹窗组件
- 弹窗组件不要使用Antd的 `Modal`组件，而是使用自定义的`ProModal`组件