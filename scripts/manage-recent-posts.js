#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// 最近文章文件路径
const RECENT_POSTS_FILE = path.join(process.cwd(), 'lib/recent-posts.ts');

// 从 MDX 文件提取文章信息
function extractArticleInfo(filePath, language) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(content);
    
    if (!data.title || !data.date) {
      return null;
    }
    
    const relativePath = path.relative(path.join(process.cwd(), 'content/docs'), filePath);
    const slug = relativePath.replace(/\.mdx$/, '');
    
    return {
      title: data.title,
      description: data.description || '',
      date: data.date,
      category: data.category || 'general',
      language: language,
      slug,
      url: `/docs/${slug}`
    };
  } catch (error) {
    console.error(`Failed to parse MDX file: ${filePath}`, error);
    return null;
  }
}

// 添加新文章到最近文章列表
function addArticleToRecentPosts(articlePath, language) {
  const articleInfo = extractArticleInfo(articlePath, language);
  
  if (!articleInfo) {
    console.error('Failed to extract article info');
    return;
  }
  
  // 读取当前的最近文章文件
  let content = fs.readFileSync(RECENT_POSTS_FILE, 'utf-8');
  
  // 找到 RECENT_POSTS 数组的开始位置
  const arrayStart = content.indexOf('export const RECENT_POSTS: ChangelogEntry[] = [');
  if (arrayStart === -1) {
    console.error('Could not find RECENT_POSTS array');
    return;
  }
  
  // 找到数组的结束位置
  const arrayEnd = content.indexOf('];', arrayStart);
  if (arrayEnd === -1) {
    console.error('Could not find end of RECENT_POSTS array');
    return;
  }
  
  // 构建新文章条目
  const newArticleEntry = `  {
    title: "${articleInfo.title.replace(/"/g, '\\"')}",
    description: "${articleInfo.description.replace(/"/g, '\\"')}",
    date: "${articleInfo.date}",
    category: "${articleInfo.category}",
    language: "${articleInfo.language}",
    slug: "${articleInfo.slug}",
    url: "${articleInfo.url}"
  }`;
  
  // 检查是否已存在相同 slug 的文章
  const existingSlugPattern = new RegExp(`slug: "${articleInfo.slug}"`, 'g');
  if (existingSlugPattern.test(content)) {
    console.log(`Article with slug "${articleInfo.slug}" already exists`);
    return;
  }
  
  // 在数组开头插入新文章
  const beforeArray = content.substring(0, arrayStart + 'export const RECENT_POSTS: ChangelogEntry[] = ['.length);
  const afterArray = content.substring(arrayEnd);
  
  const newContent = beforeArray + '\n' + newArticleEntry + ',' + afterArray;
  
  // 写回文件
  fs.writeFileSync(RECENT_POSTS_FILE, newContent, 'utf-8');
  
  console.log(`✅ Added article "${articleInfo.title}" to recent posts`);
}

// 列出当前的所有最近文章
function listRecentPosts() {
  const content = fs.readFileSync(RECENT_POSTS_FILE, 'utf-8');
  
  // 提取 RECENT_POSTS 数组
  const arrayMatch = content.match(/export const RECENT_POSTS: ChangelogEntry\[\] = \[([\s\S]*?)\];/);
  
  if (!arrayMatch) {
    console.error('Could not find RECENT_POSTS array');
    return;
  }
  
  const arrayContent = arrayMatch[1];
  
  // 解析数组中的文章
  const articleMatches = arrayContent.match(/\{\s*title:\s*"([^"]+)",\s*description:\s*"([^"]+)",\s*date:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*language:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*url:\s*"([^"]+)"\s*\}/g);
  
  if (!articleMatches) {
    console.log('No articles found in recent posts');
    return;
  }
  
  console.log('📝 Current Recent Posts:');
  console.log('='.repeat(80));
  
  articleMatches.forEach((match, index) => {
    const titleMatch = match.match(/title:\s*"([^"]+)"/);
    const dateMatch = match.match(/date:\s*"([^"]+)"/);
    const languageMatch = match.match(/language:\s*"([^"]+)"/);
    const slugMatch = match.match(/slug:\s*"([^"]+)"/);
    
    if (titleMatch && dateMatch && languageMatch && slugMatch) {
      console.log(`${index + 1}. ${titleMatch[1]}`);
      console.log(`   Date: ${dateMatch[1]}`);
      console.log(`   Language: ${languageMatch[1]}`);
      console.log(`   Slug: ${slugMatch[1]}`);
      console.log('');
    }
  });
}

// 从最近文章列表中移除文章
function removeArticleFromRecentPosts(slug) {
  const content = fs.readFileSync(RECENT_POSTS_FILE, 'utf-8');
  
  // 构建要移除的文章的正则表达式
  const articlePattern = new RegExp(`\\s*\\{\\s*title:\\s*"[^"]+",\\s*description:\\s*"[^"]+",\\s*date:\\s*"[^"]+",\\s*category:\\s*"[^"]+",\\s*language:\\s*"[^"]+",\\s*slug:\\s*"${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}",\\s*url:\\s*"[^"]+"\\s*\\},?\\s*`, 'g');
  
  const newContent = content.replace(articlePattern, '');
  
  if (newContent === content) {
    console.log(`❌ Article with slug "${slug}" not found`);
    return;
  }
  
  fs.writeFileSync(RECENT_POSTS_FILE, newContent, 'utf-8');
  console.log(`✅ Removed article with slug "${slug}" from recent posts`);
}

// 主函数
function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'add':
      const articlePath = process.argv[3];
      const language = process.argv[4] || 'en';
      
      if (!articlePath) {
        console.error('Usage: node scripts/manage-recent-posts.js add <article-path> [language]');
        process.exit(1);
      }
      
      const fullPath = path.join(process.cwd(), articlePath);
      if (!fs.existsSync(fullPath)) {
        console.error(`Article file not found: ${fullPath}`);
        process.exit(1);
      }
      
      addArticleToRecentPosts(fullPath, language);
      break;
      
    case 'list':
      listRecentPosts();
      break;
      
    case 'remove':
      const slug = process.argv[3];
      
      if (!slug) {
        console.error('Usage: node scripts/manage-recent-posts.js remove <slug>');
        process.exit(1);
      }
      
      removeArticleFromRecentPosts(slug);
      break;
      
    default:
      console.log('Usage:');
      console.log('  node scripts/manage-recent-posts.js add <article-path> [language]');
      console.log('  node scripts/manage-recent-posts.js list');
      console.log('  node scripts/manage-recent-posts.js remove <slug>');
      break;
  }
}

if (require.main === module) {
  main();
}
