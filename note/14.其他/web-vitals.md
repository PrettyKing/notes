# Web-Vitals 核心实现步骤

本文档基于对 `web-vitals` 库源代码的分析，概述了其核心实现步骤。

## 1. 项目目标

`web-vitals` 库的主要目标是提供一种轻量级、模块化且准确的方法，用于在真实用户环境中测量所有的 Web Vitals 指标（LCP, CLS, INP, FCP, TTFB）。它的设计旨在与谷歌工具（如 Chrome 用户体验报告 - CrUX）测量这些指标的方式保持一致。

## 2. 主入口点

- **文件:** `src/index.ts`
- **目的:** 该文件是库标准构建版本的公共 API。
- **功能:** 它为每个 Web Vital 指标导出主函数（如 `onLCP`, `onCLS` 等）及其对应的评分阈值（如 `LCPThresholds`, `CLSThresholds` 等）。同时，它也从 `src/types.ts` 中重新导出了所有必要的 TypeScript 类型。

## 3. 指标专属逻辑 (以 LCP 为例)

每个指标都在其自己的文件中实现（例如 `src/onLCP.ts`）。每个指标的实现通常遵循以下步骤：

1.  **初始化**: 使用 `initMetric()` 辅助函数创建一个 `Metric` 对象。这是一个标准化的数据结构，用于保存指标的名称、当前值、唯一 ID、性能条目以及导航类型等其他元数据。

2.  **性能观察**: 使用浏览器的 `PerformanceObserver` API 来监听与指标相关的特定性能事件。这个过程被封装在一个自定义的 `observe()` 工具函数 (`src/lib/observe.ts`) 中，以增强健壮性并处理浏览器之间的不一致性。
    - 对于 LCP，它观察 `largest-contentful-paint` 类型的条目。
    - 对于 CLS，它观察 `layout-shift`。
    - 对于 INP，它观察 `event` 和 `first-input`。

3.  **条目处理**: 一个回调函数（在 `onLCP.ts` 中是 `handleEntries`）被注册到 `PerformanceObserver`。每当浏览器分派一个新的相关性能条目时，这个函数就会被执行。它处理该条目，计算指标值，并更新 `Metric` 对象。

4.  **报告逻辑**: 使用 `bindReporter()` 辅助函数 (`src/lib/bindReporter.ts`) 来创建一个 `report` 函数。这将指标计算与最终向用户报告的逻辑解耦。`report` 函数负责：
    - 计算当前指标值与上一个值之间的差量（delta）。
    - 通过将指标值与预定义阈值进行比较，来确定其评级（`good`, `needs-improvement`, `poor`）。
    - 使用完整的、更新后的 `Metric` 对象调用用户提供的回调函数。

5.  **生命周期管理**: 该库能正确处理浏览器复杂的页面生命周期，以确保指标的准确性。
    - 它监听用户交互（如 `keydown` 或 `click`），以确定指标值何时应被视为最终值。例如，LCP 的测量在第一次用户交互后就会停止。
    - 它使用 `getVisibilityWatcher()` 来了解页面在指标报告前是否已被隐藏。
    - 它处理特殊情况，例如页面从后退/前进缓存（bf-cache）中恢复（`onBFCacheRestore`）或被预渲染（`whenActivated`, `getActivationStart`）。

## 4. 核心抽象 (`src/lib/`)

`src/lib/` 目录包含一组提供核心、可复用逻辑的辅助函数：

-   **`observe.ts`:** 一个安全可靠的 `PerformanceObserver` API 封装器。
-   **`initMetric.ts`:** 一个用于创建一致性 `Metric` 对象的工厂函数。
-   **`bindReporter.ts`:** 一个高阶函数，用于管理报告状态并调用用户的回调。
-   **`bfcache.ts`, `getVisibilityWatcher.ts`, `whenActivated.ts`:** 用于管理和查询页面生命周期状态的工具。
-   **`generateUniqueID.ts`:** 为每个指标实例创建一个唯一 ID，这对于分析和区分不同页面加载（例如，从 bf-cache 恢复后）至关重要。

## 5. 构建变体 ("standard" vs. "attribution")

项目提供两种构建版本，这在 `package.json` 中定义并在 `README.md` 中有文档说明：

-   **标准构建 (Standard Build):** 默认的轻量级构建，提供指标值。
-   **归因构建 (Attribution Build):** 一个稍大的构建版本，它在 `Metric` 对象中包含额外的诊断信息（在一个 `attribution` 属性下）。这些数据可以帮助开发者调试*为什么*某个指标会是特定的值（例如，识别出哪个元素是 LCP 的目标元素）。这部分功能在 `src/attribution/` 目录中实现。