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
react 19
zustand 5
react-router 7
antd 6
ahooks 3
axios 1
vite 7
tailwindcss 3
framer-motion 12
echarts 6
@tanstack/react-query 5
@tabler/icons-react 3
dayjs 1
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
├── routers/          # 路由配置（AuthGuard、动态路由生成）
├── styles/           # 样式文件存放目录
├── stores/           # 全局状态管理
├── types/            # 全局类型声明（global.d.ts、module.d.ts）
├── mock/             # Mock API（仅 dev 环境生效）
├── App.tsx
└── main.tsx
```

###  组件 / 文件规范（重点，必须准时）

- 公共组件目录名必须使用大驼峰命名： `src/components/ProForm`
- 公共组件中主文件 `index.tsx` 必须使用命名导出，此外还需要统一导出模块内其他文件，简化导入路径
- 公共组件中必须将模块内所有组件、函数需要的类型存放在 `types.d.ts` 中，`props` 的类型
- 公共组件中必须将所有组件用到的工具函数、常量 存放在 `utils.ts`
- 所有的代码都必须加上注释进行说明，其中 `组件，公共函数` 使用 `@description` 注释，普通函数使用箭头函数形式定义并使用 `//` 注释
- 全局常量定义在 `src/constants/index.ts` 中的 `CFG` 对象里，并使用 `下划线/大写` 进行命名；`enum`  文件定义在同级目录中并使用 `下划线/大写`


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



## 其他说明

### 路径别名

`@/` 映射到 `src/`，在 `vite.config.ts` 和 `tsconfig.app.json` 中配置。


### Mock API（仅开发环境）

`vite-plugin-mock` 在 `vite.config.ts` 中配置，`mockPath: "src/mock"`，仅在 `command === "serve"` 时启用。Mock 数据位于 `src/mock/index.ts`，包含 14 个端点：登录（admin/123456）、权限菜单、用户 CRUD（30 条模拟数据+分页）、角色 CRUD（4 条）、菜单 CRUD、首页仪表盘和首页分析。添加新 API 端点时，需在 mock 中添加对应条目以保持应用在无后端时可运行。


### API 层

`src/apis/index.ts` — 纯对象 `Api`，所有请求函数都写在该对象内，均使用 `src/libs/request.ts` 中的单例 `http`。请求函数的类型全部都定义在 `src/apis/type.d.ts` 的 `namespace IApi` 下。


### 状态管理（Zustand）

四个 store，位于 `src/stores/`，通过 `src/stores/index.ts` 统一导出：

- **auth**（`useAuthStore`）— `isOnline`、`userInfo`、`menus`（经 `filterAndSortMenus` 处理后的菜单树，同时用于 UI 渲染和路由生成）。不持久化。使用 `devtools` 中间件（名称：`"auth"`）。
- **theme**（`useThemeStore`）— `isDark`、`colorPrimary`、`colorVariants`（通过 `generateColorVariants()` 计算的颜色衍生值）。持久化到 localStorage（`theme-storage`），仅持久化 `isDark` 和 `colorPrimary`，`colorVariants` 在 rehydrate 时重新计算。`syncThemeToDOM()` 在 `document.documentElement` 和 `document.body` 上设置 `dark` 类。主题数据提供给 `App.tsx` 中的 Ant Design `ConfigProvider`。支持 6 种预设颜色（`PRESET_COLORS`：blue/orange/green/purple/cyan/magenta）。
- **global**（`useGlobalStore`）— `isMobile` 标志，由 `src/libs/index.ts:initResize()` 中的 resize 监听器设置。持久化到 localStorage（`global-storage`）。
- **calendar**（`useCalendarStore`）— `reminders`（`CalendarReminder[]`），提供 `addReminder`/`updateReminder`/`deleteReminder`/`completeReminder`/`getRemindersByDate`/`getSortedReminders` 方法。持久化到 localStorage（`calendar-storage`）。

### 工具函数集

- `src/libs/index.ts` — 导出通用工具函数：`cleanEmptyChildren`（递归删除空 children 数组）、`sortTree`（递归排序树形数据）、`flattenToTree`（扁平数组转树形结构）、`removeImgTag`（移除 HTML 中的 img 标签）、`initResize`（防抖 resize 监听，更新 `isMobile` 状态和根字体大小）。
- `src/libs/assetUrl.ts` — `getAssetUrl()` 处理后端静态资源路径拼接，支持 `VITE_STATIC_BASE_URL` 环境变量。

### 事件总线

`src/libs/mitt.ts` — 类型安全的事件发射器（`mitt` 库），用于跨组件通信。目前仅有事件：`openThemeDrawer`。

### 存储工具

`src/libs/storage.ts` — 支持 TTL 过期的 `localStorage/sessionStorage` 封装。导出两种存储的 `getItem`/`setItem`/`removeItem`，以及 `getToken`/`setToken`/`removeToken` 。键在 `src/constants/index.ts` 中定义（`CFG.TOKEN_KEY` 等）。

### 图标集

`src/libs/iconMap.tsx` 中包含了系统可使用的图标集，页面中的所有图标都从这里获取。

### 登录流程

`src/pages/Login/Login.tsx` — 登录表单（loginName + loginPwd）。密码在发送前通过 `crypto-js` 进行 MD5 哈希。支持"记住我"（localStorage 30 天 TTL）。租户 ID 存储在 sessionStorage 中。


### 关键组件

- **ProForm**（`src/components/ProForm/`）— 基于配置数组（`FormFieldItem[]`）的表单构建器。支持 Input、InputPassword、Select、DatePicker 等。通过 `ref` 暴露 `validateFields()`/`setFieldsValue()`。
- **ProTable**（`src/components/ProTable/`）— 支持拖拽排序的表格，基于 `@dnd-kit`。包含子组件：`Toolbar`（工具栏）、`SelectedInfo`（选中统计）、`DragSortRow`（可拖拽行）、`CopyableCell`（可复制单元格）。
- **ProModal**（`src/components/ProModal/`）— 基于 ProForm 配置的模态表单。
- **ProUpload**（`src/components/ProUpload/`）— 文件上传组件。
- **Drag**（`src/components/Drag/`）— 通用拖拽包裹组件，基于 `@dnd-kit`。
- **Banner**（`src/components/Banner/`）— 推广横幅，10 种颜色预设（`blue`、`pink`、`green`、`purple`、`orange`、`teal`、`red`、`cyan`、`indigo`、`lime`）。每种预设都有 `light` 和 `dark` 变体，根据 `isDark` 自动选择。支持标题、描述、按钮和插图。弧形装饰带 CSS 动画。
- **Chart**（`src/components/Chart/`）— ECharts 封装。`useChartColors()` hook 从 theme store 的 `colorVariants` 计算图表颜色集，自动适配深色/浅色模式。
- **Card**（`src/components/Card/`）— 卡片变体：`StatCard`、`MediaCard`、`ListCard`、`NormalCard`、`ProgressCard`。`StatCard` 包含迷你图表（折线/柱状/进度）。
- **Calendar**（`src/components/Calendar/`）— 日历组件，带提醒功能，由 `useCalendarStore` 支持。
- **ThemeToggle**（`src/components/ThemeToggle/`）— 深色/浅色切换按钮，使用 View Transitions API（`document.startViewTransition`），从点击位置执行圆形 clip-path 扩散动画。不支持的浏览器回退为即时切换。
- **ThemePanel**（`src/components/ThemePanel/`）— 设置面板，包含深色模式开关和主题色选择器（预设颜色 + 自定义）。
- **ModalSelector**（`src/components/ModalSelector/`）— 模态选择器，支持 ListSelector、TableSelector、TreeSelector 三种模式，包含 `SelectedPanel`、`SelectorFooter`、`SelectorTrigger` 子组件。
- **IconSelect**（`src/components/IconSelect/`）— 图标选择组件，从 `src/libs/iconMap.tsx` 注册的图标集中选取。

### 关键 Hooks

- **`useChartColors`** — 从 theme `colorVariants` 和 `isDark` 派生的缓存图表颜色集。为深色模式适配强调色（绿、橙、红、金）。
- **`useEcharts`** — ECharts 实例生命周期管理（初始化、resize、销毁）。
- **`useCountUp`** — 数字动画计数器。
- **`useQueryPro`** — API 调用的 React Query 封装。
- **`useFullLoading`** — 全屏加载遮罩控制。
- **`useMessage`** — 将 Ant Design 的 message/notification/modal API 挂载到 `window`。


### 暗黑主题/样式风格
- 创建的所有组件的样式必须有暗黑风格样式
- 主题配置模块可参考`src/stores/theme.ts`
- 每个组件的样式都要使用tailwind v3 进行样式编写，使用 `className` 添加样式。
- 复杂的样式比如渐变、阴影或者需要动态样式可以使用 `style`

### 全局类型声明

`src/types/global.d.ts` — 扩展 `Window` 接口，挂载 `$message`、`$notification`、`$modal`、`$showDialog`。
`src/types/module.d.ts` — 声明 `pdfjs-dist/build/pdf.worker.mjs` 模块类型。

### 弹窗组件
- 弹窗组件不要使用Antd的 `Modal`组件，而是使用自定义的`ProModal`组件

### 注意事项
- **Ant Design 6** — 这是 antd 的最新主版本，API 与 v5 存在差异。编写 antd 相关代码时，务必查询 antd 6 最新文档而非 v5。
- **路径别名** — `@/` 映射到 `src/`，仅在 `src/` 内生效。vite 配置文件使用相对路径。
- **Mock 数据同步** — 修改 API 接口时，必须同步更新 `src/mock/index.ts` 和 `src/apis/type.d.ts` 中的类型定义。想