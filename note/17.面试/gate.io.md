# 问题总结
---
#  工程化是什么,项目中做了哪些工程化的功能
工程化是指将软件开发过程中的各种实践、工具和流程系统化、自动化的过程，目标是提高开发效率、代码质量和项目的可维护性。

## 工程化的核心概念

工程化本质上是用工程的方法和思维来解决软件开发中的问题，包括标准化开发流程、自动化重复性工作、建立质量保障体系等。

## 项目中常见的工程化功能

### 代码规范和质量控制
- **代码格式化工具**：如 Prettier、ESLint、TSLint
- **代码检查**：静态代码分析，检测潜在问题
- **提交规范**：使用 commitlint 规范 Git 提交信息
- **代码审查流程**：Pull Request 机制

### 构建和打包
- **模块化构建**：Webpack、Vite、Rollup 等构建工具
- **代码压缩优化**：JavaScript/CSS 压缩、图片优化
- **环境配置管理**：开发、测试、生产环境的差异化配置
- **Tree Shaking**：移除未使用的代码

### 自动化流程
- **持续集成/持续部署 (CI/CD)**：GitHub Actions、Jenkins、GitLab CI
- **自动化测试**：单元测试、集成测试、端到端测试
- **自动化部署**：一键部署到各个环境
- **依赖管理**：npm、yarn、pnpm 的版本锁定

### 开发环境优化
- **热重载**：开发时实时预览修改效果
- **Mock 数据**：模拟后端接口进行前端开发
- **调试工具**：Source Map、浏览器开发者工具集成
- **开发服务器**：本地开发环境搭建

### 监控和日志
- **错误监控**：Sentry、Bugsnag 等错误收集
- **性能监控**：页面加载速度、用户行为分析
- **日志管理**：结构化日志记录和分析

### 文档和协作
- **API 文档自动生成**：Swagger、JSDoc
- **组件库文档**：Storybook、Styleguidist
- **项目文档**：README、贡献指南、部署文档

这些工程化实践帮助团队建立高效、可靠的开发流程，减少人为错误，提高代码质量，使项目更容易维护和扩展。不同项目会根据具体需求选择合适的工程化工具和实践。

# 性能优化

## 性能优化总结

### 前端性能优化策略

**资源优化**：代码压缩（JavaScript/CSS/HTML）、图片压缩和格式优化（WebP、AVIF）、使用 CDN 加速静态资源分发、启用 Gzip/Brotli 压缩。

**加载优化**：懒加载（图片、组件）、代码分割和按需加载、预加载关键资源、减少 HTTP 请求数量、优化关键渲染路径。

**缓存策略**：合理配置强缓存和协商缓存、使用 Service Worker 离线缓存、localStorage/sessionStorage 数据缓存。

**渲染优化**：虚拟滚动处理大列表、防抖节流优化频繁操作、避免强制同步布局、减少重排重绘。

**JavaScript 优化**：避免内存泄漏、优化算法复杂度、使用 Web Workers 处理计算密集任务、Tree Shaking 移除无用代码。

## 项目中的性能优化实践

作为 AI，我没有实际的项目经验，但我可以分享一些常见的优化实践：

**构建优化**：配置 Webpack/Vite 的代码分割，将第三方库单独打包；使用动态导入实现路由懒加载；启用 Tree Shaking 和压缩插件。

**React 优化**：使用 React.memo、useMemo、useCallback 避免不必要的重渲染；实现组件懒加载；优化 Context 使用避免过度渲染。

**网络优化**：实现接口请求缓存和去重；使用分页、无限滚动减少单次数据量；配置合理的缓存策略。

**用户体验优化**：添加骨架屏和加载状态；实现图片懒加载和占位符；优化首屏加载时间。

具体的优化效果需要通过 Lighthouse、Performance 工具进行测量和验证，确保优化措施真正提升了用户体验。

# 输出结果预测
``` js
console.log('start');

async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}

async function async2() {
    console.log('async2');
}

async1();

setTimeout(() => {
    console.log('timeout 1');
    Promise.resolve().then(() => console.log('promise in timeout1'));
}, 0);

setTimeout(() => {
    console.log('timeout 2');
}, 0);

new Promise(() => {console.log('promise resolve or reject')})

Promise.resolve().then(() => {
    console.log('promise 1');
    setTimeout(() => {
        console.log('timeout in promise');
    }, 0);
});

Promise.resolve().then(() => {
    console.log('promise 2');
});

console.log('end');
```
让我分析这段JavaScript代码的执行顺序和输出。让我重新分析这段代码，通过理解JavaScript的事件循环机制来确定输出顺序：这段代码的输出顺序是：

```shell
start
async1 start
async2
promise resolve or reject
end
async1 end
promise 1
promise 2
timeout 1
promise in timeout1
timeout 2
timeout in promise
```

**执行顺序解析：**

1. **同步代码阶段：**
   - `console.log('start')` - 直接执行
   - `async1()` 调用，执行到 `await` 前的部分
   - `console.log('async1 start')` - 直接执行
   - `async2()` 同步执行，输出 `async2`
   - `await` 暂停，`async1` 剩余部分进入微任务队列
   - 两个 `setTimeout` 进入宏任务队列
   - `new Promise` 构造函数同步执行，输出 `promise resolve or reject`
   - 两个 `Promise.resolve().then()` 进入微任务队列
   - `console.log('end')` - 直接执行
2. **微任务队列执行：**
   - `async1` 中 `await` 后的代码：输出 `async1 end`
   - 第一个 Promise.then：输出 `promise 1`，并添加新的 setTimeout 到宏任务队列
   - 第二个 Promise.then：输出 `promise 2`
3. **宏任务队列执行：**
   - 第一个 setTimeout：输出 `timeout 1`，然后其内部的 Promise 进入微任务队列
   - 微任务：输出 `promise in timeout1`
   - 第二个 setTimeout：输出 `timeout 2`
   - Promise 中创建的 setTimeout：输出 `timeout in promise`

这个例子很好地展示了JavaScript事件循环中同步代码、微任务（Promise、async/await）和宏任务（setTimeout）的执行优先级。



# react fiber

React Fiber 是 React 16 引入的新协调引擎，用于解决大型应用中的性能问题和用户体验问题。

## 核心概念

Fiber 是一种数据结构，代表工作单元，包含组件信息、状态、副作用等。每个 React 元素都对应一个 Fiber 节点，形成 Fiber 树结构。

## 主要特性

**时间切片（Time Slicing）**：将渲染工作分割成小块，在浏览器空闲时执行，避免长时间阻塞主线程，保证动画和用户交互的流畅性。

**可中断渲染**：渲染过程可以被高优先级任务打断，React 会暂停当前工作，处理紧急任务后再恢复，实现更好的响应性。

**优先级调度**：不同类型的更新有不同优先级，用户交互（点击、输入）优先级最高，数据获取等优先级较低，确保关键操作及时响应。

## 工作原理

Fiber 采用双缓冲技术，维护 current 树（当前显示）和 workInProgress 树（正在构建）。渲染分为 render 阶段（可中断，构建新树）和 commit 阶段（不可中断，应用更改到 DOM）。

## 解决的问题

- **卡顿问题**：避免长时间同步渲染阻塞浏览器
- **响应性**：高优先级任务能及时执行
- **用户体验**：动画更流畅，交互更及时
- **大型应用性能**：更好地处理复杂组件树的更新

Fiber 让 React 从同步、递归的渲染模式转变为异步、可中断的渲染模式，是 React 性能优化的重要里程碑。

# 强缓存和协商缓存

强缓存和协商缓存是浏览器缓存机制的两种策略，用于优化网页加载性能。

## 强缓存

**工作原理**：浏览器直接从本地缓存读取资源，不向服务器发送请求。

**控制字段**：
- `Cache-Control`：现代标准，如 `max-age=3600`（缓存1小时）、`no-cache`（不使用强缓存）
- `Expires`：较旧标准，指定过期时间，如 `Expires: Wed, 21 Oct 2024 07:28:00 GMT`

**优点**：速度最快，完全不消耗网络资源
**缺点**：无法及时获取资源更新

## 协商缓存

**工作原理**：浏览器向服务器发送请求验证缓存是否有效，服务器返回 304（未修改）或 200（已修改）。

**控制字段**：
- `Last-Modified` / `If-Modified-Since`：基于文件修改时间
- `ETag` / `If-None-Match`：基于文件内容哈希，更精确

**优点**：既能利用缓存又能保证内容新鲜度
**缺点**：需要发送请求验证，有一定网络开销

## 执行优先级

1. 先检查强缓存，未过期直接使用
2. 强缓存过期，使用协商缓存验证
3. 协商缓存验证通过返回 304，否则返回新资源

## 实际应用

**强缓存**：适用于不常变化的静态资源（CSS、JS、图片），通常配合文件名哈希使用
**协商缓存**：适用于可能更新的资源（HTML、API 数据），在保证时效性的同时利用缓存优势

合理配置两种缓存策略可以显著提升网站性能和用户体验。

# IOC与SOLID

## IOC（控制反转 Inversion of Control）

**核心概念**：将对象的创建和依赖关系的管理从对象内部转移到外部容器，实现"不要找我，我来找你"的设计模式。

**实现方式**：
- **依赖注入（DI）**：通过构造函数、setter 方法或接口注入依赖
- **服务定位器**：通过注册中心获取所需依赖
- **事件驱动**：通过事件机制解耦组件间关系

**优势**：降低耦合度、提高可测试性、增强代码复用性、便于维护和扩展

## SOLID 原则

**单一职责原则（SRP）**：一个类只应该有一个引起变化的原因，每个类只负责一个功能领域。

**开闭原则（OCP）**：软件实体应该对扩展开放，对修改关闭，通过抽象和多态实现功能扩展。

**里氏替换原则（LSP）**：子类对象应该能够替换父类对象而不影响程序正确性，确保继承关系的合理性。

**接口隔离原则（ISP）**：客户端不应该依赖它不需要的接口，将大接口拆分为多个小而专一的接口。

**依赖倒置原则（DIP）**：高层模块不应该依赖低层模块，两者都应该依赖抽象；抽象不应该依赖细节，细节应该依赖抽象。

## 关系与应用

IOC 是实现 SOLID 原则的重要手段，特别是依赖倒置原则。通过 IOC 容器管理依赖关系，可以更好地遵循这些设计原则，构建松耦合、高内聚、易维护的软件系统。在现代框架如 Spring、Angular 中都广泛应用这些概念。

# nextjs框架A页面切到B页面会卡，为什么

Next.js App Router 页面切换卡顿主要是因为服务端组件需要等待渲染、代码分割导致的 JavaScript bundle 下载以及页面数据预取造成的延迟。解决方案包括：添加 loading.tsx 提供加载状态、使用 Link 组件的 prefetch 预加载页面资源、通过 Suspense 实现流式渲染避免阻塞、将非关键部分改为客户端组件、使用 dynamic 懒加载重型组件，以及在导航时使用 startTransition 优化用户体验。
