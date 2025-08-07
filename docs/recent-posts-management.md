# 最近文章管理系统

## 概述

最近文章管理系统使用结构化的数组来管理首页的 "Recent Posts" 部分，比动态扫描文件系统更加可控和高效。

## 文件结构

- `lib/recent-posts.ts` - 最近文章的结构化数组和管理函数
- `scripts/manage-recent-posts.js` - 管理脚本
- `app/(home)/page.tsx` - 首页组件，使用新的最近文章系统

## 使用方法

### 1. 查看当前最近文章列表

```bash
npm run recent-posts list
```

### 2. 添加新文章到最近文章列表

```bash
npm run recent-posts add <article-path> <language>
```

示例：
```bash
npm run recent-posts add content/docs/en/best-practices/my-new-article.mdx en
npm run recent-posts add content/docs/zh/best-practices/my-new-article.mdx zh
```

### 3. 从最近文章列表中移除文章

```bash
npm run recent-posts remove <slug>
```

示例：
```bash
npm run recent-posts remove en/best-practices/old-article
```

## 文章数据结构

每篇文章包含以下字段：

```typescript
interface ChangelogEntry {
  title: string;           // 文章标题
  description: string;     // 文章描述
  date: string;           // 发布日期
  category: string;       // 文章分类
  language: 'zh' | 'en';  // 语言
  slug: string;           // 文章标识符
  url: string;            // 文章链接
}
```

## 管理函数

### `getHomePageRecentPosts(limit: number = 5)`
获取首页最近文章，按日期排序

### `addRecentPost(post: ChangelogEntry)`
添加新文章到最近文章列表

### `removeRecentPost(slug: string)`
从最近文章列表中移除文章

### `getRecentPostsByLanguage(language: 'zh' | 'en', limit: number = 5)`
获取特定语言的文章

### `getRecentPostsByCategory(category: string, limit: number = 5)`
获取特定分类的文章

## 工作流程

### 发布新文章时

1. 创建文章文件到 `content/docs/<lang>/<category>/`
2. 运行 `npm run update-indexes` 更新目录索引
3. 运行 `npm run recent-posts add <article-path> <language>` 添加到首页最近文章
4. 验证文章正确显示在首页

### 移除旧文章时

1. 删除文章文件
2. 运行 `npm run update-indexes` 更新目录索引
3. 运行 `npm run recent-posts remove <slug>` 从最近文章列表中移除
4. 验证文章不再显示在首页

## 优势

1. **可控性** - 精确控制哪些文章显示在首页
2. **性能** - 不需要动态扫描文件系统
3. **灵活性** - 可以手动调整文章顺序和显示
4. **维护性** - 结构化的数组便于管理和调试
5. **自动化** - 提供脚本工具简化管理操作

## 注意事项

- 文章按日期自动排序，最新的显示在前面
- 系统会自动检测重复的文章，避免重复添加
- 支持中英文双语文章管理
- 文章 slug 必须唯一，用于标识文章
