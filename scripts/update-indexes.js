#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// 配置
const DOCS_DIR = path.join(process.cwd(), 'content/docs');
const LANGUAGES = ['en', 'zh'];

// 目录配置
const DIRECTORY_CONFIG = {
  'best-practices': {
    en: { title: 'Best Practices', description: 'Learn best practices for using ClaudeCode effectively' },
    zh: { title: '最佳实践', description: '学习有效使用 ClaudeCode 的最佳实践' }
  },
  'community-tips': {
    en: { title: 'Community Tips', description: 'Discover tips and tricks shared by the ClaudeCode community' },
    zh: { title: '社区技巧', description: '发现 ClaudeCode 社区分享的技巧和窍门' }
  },
  'cursor': {
    en: { title: 'Cursor', description: 'Learn about Cursor IDE and its integration with ClaudeCode' },
    zh: { title: 'Cursor', description: '了解 Cursor IDE 及其与 ClaudeCode 的集成' }
  },
  'tools': {
    en: { title: 'Tools', description: 'Explore tools and utilities for ClaudeCode' },
    zh: { title: '工具', description: '探索 ClaudeCode 的工具和实用程序' }
  },
  'advanced': {
    en: { title: 'Advanced', description: 'Advanced techniques and concepts for ClaudeCode' },
    zh: { title: '高级', description: 'ClaudeCode 的高级技术和概念' }
  },
  'sub-agents': {
    en: { title: 'Sub Agents', description: 'Learn about sub-agents and specialized assistants' },
    zh: { title: '子代理', description: '了解子代理和专门的助手' }
  }
};

// 获取目录下的所有文章
function getArticlesInDirectory(dirPath, lang) {
  const articles = [];
  
  if (!fs.existsSync(dirPath)) {
    return articles;
  }
  
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const item of items) {
    if (item.isFile() && item.name.endsWith('.mdx') && item.name !== 'index.mdx') {
      const filePath = path.join(dirPath, item.name);
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(content);
        
        if (data.title) {
          articles.push({
            title: data.title,
            description: data.description || '',
            slug: item.name.replace('.mdx', ''),
            date: data.date || '',
            category: data.category || 'general'
          });
        }
      } catch (error) {
        console.warn(`Failed to parse MDX file: ${filePath}`, error);
      }
    }
  }
  
  // 按日期排序，最新的在前
  articles.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  return articles;
}

// 生成索引页面内容
function generateIndexContent(category, lang, articles) {
  const config = DIRECTORY_CONFIG[category]?.[lang] || {
    title: category.charAt(0).toUpperCase() + category.slice(1),
    description: `Articles in ${category}`
  };
  
  const cards = articles.map(article => {
    return `  <Card 
    title="${article.title.replace(/"/g, '\\"')}" 
    description="${article.description.replace(/"/g, '\\"')}"
    href="/docs/${lang}/${category}/${article.slug}" 
  />`;
  }).join('\n');
  
  if (lang === 'en') {
    return `---
title: ${config.title}
description: ${config.description}
lang: ${lang}
---

# ${config.title}

Welcome to the ${config.title} section! Here you'll find valuable resources and guides about ${config.title}.

## What You'll Find Here

This section contains:

- **Practical Guides**: Detailed usage guides for ${config.title}
- **Best Practices**: Proven best practices and techniques
- **Case Studies**: Real-world application examples
- **Advanced Tips**: Advanced techniques to improve efficiency

## Featured Articles

<Cards>
${cards}
</Cards>

## Getting Started

Whether you're a beginner or an experienced user, these articles will help you better understand and use ${config.title}.

## Contributing

Have great content to share? We welcome community contributions! Please follow our contribution guidelines to help make this resource even better.

---

*Explore these articles to enhance your ${config.title} experience!*`;
  } else {
    return `---
title: ${config.title}
description: ${config.description}
lang: ${lang}
---

# ${config.title}

欢迎来到 ${config.title} 专区！在这里您将找到关于 ${config.title} 的宝贵资源和指南。

## 您可以在这里找到

本专区包含：

- **实用指南**：${config.title} 的详细使用指南
- **最佳实践**：经过验证的最佳实践和技巧
- **案例研究**：真实世界的应用案例
- **高级技巧**：提升效率的高级技巧

## 精选文章

<Cards>
${cards}
</Cards>

## 开始使用

无论您是初学者还是经验丰富的用户，这些文章都将帮助您更好地理解和使用 ${config.title}。

## 贡献

有好的内容要分享吗？我们欢迎社区贡献！请遵循我们的贡献指南，帮助让这个资源变得更好。

---

*探索这些文章，提升您的 ${config.title} 使用体验！*`;
  }
}

// 更新目录索引页面
function updateDirectoryIndex(category, lang) {
  const dirPath = path.join(DOCS_DIR, lang, category);
  const articles = getArticlesInDirectory(dirPath, lang);
  
  if (articles.length === 0) {
    console.log(`No articles found in ${category}/${lang}`);
    return;
  }
  
  const indexContent = generateIndexContent(category, lang, articles);
  const indexPath = path.join(dirPath, 'index.mdx');
  
  try {
    fs.writeFileSync(indexPath, indexContent, 'utf-8');
    console.log(`✅ Updated index for ${category}/${lang} with ${articles.length} articles`);
  } catch (error) {
    console.error(`❌ Failed to update index for ${category}/${lang}:`, error);
  }
}

// 获取所有最近文章
function getAllRecentArticles(limit = 10) {
  const allArticles = [];
  
  for (const lang of LANGUAGES) {
    for (const category of Object.keys(DIRECTORY_CONFIG)) {
      const dirPath = path.join(DOCS_DIR, lang, category);
      const articles = getArticlesInDirectory(dirPath, lang);
      
      articles.forEach(article => {
        allArticles.push({
          ...article,
          language: lang,
          category,
          url: `/docs/${lang}/${category}/${article.slug}`
        });
      });
    }
  }
  
  // 按日期排序，最新的在前
  allArticles.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  return allArticles.slice(0, limit);
}

// 更新首页最近文章
function updateHomePageRecentArticles() {
  const recentArticles = getAllRecentArticles(5);
  
  // 这里可以更新首页的最近文章部分
  // 由于首页是动态生成的，我们只需要确保 changelog.ts 中的逻辑正确
  console.log(`📝 Found ${recentArticles.length} recent articles for homepage`);
  
  recentArticles.forEach((article, index) => {
    console.log(`  ${index + 1}. ${article.title} (${article.language}/${article.category})`);
  });
}

// 主函数
function main() {
  console.log('🔄 Starting index update process...');
  
  // 更新所有目录的索引页面
  for (const category of Object.keys(DIRECTORY_CONFIG)) {
    for (const lang of LANGUAGES) {
      updateDirectoryIndex(category, lang);
    }
  }
  
  // 更新首页最近文章
  updateHomePageRecentArticles();
  
  console.log('✅ Index update process completed!');
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  updateDirectoryIndex,
  updateHomePageRecentArticles,
  getAllRecentArticles
};
