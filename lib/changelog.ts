import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface ChangelogEntry {
  title: string;
  description: string;
  date: string;
  category: string;
  language: 'zh' | 'en';
  slug: string;
  url: string;
}

export interface CourseEntry {
  title: string;
  description: string;
  url: string;
  provider: string;
  duration?: string;
  instructor?: string;
}

export function getRecentUpdates(limit: number = 5): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [];
  
  // 扫描所有文档目录
  const docsDir = path.join(process.cwd(), 'content/docs');
  
  function scanDirectory(dir: string, lang: 'zh' | 'en') {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        // 递归扫描子目录
        scanDirectory(fullPath, lang);
      } else if (item.isFile() && item.name.endsWith('.mdx')) {
        try {
          // 读取MDX文件
          const content = fs.readFileSync(fullPath, 'utf-8');
          const { data } = matter(content);
          
          // 检查是否有必要的元数据
          if (data.date && data.title) {
            const relativePath = path.relative(path.join(process.cwd(), 'content/docs'), fullPath);
            const slug = relativePath.replace(/\.mdx$/, '');
            
            entries.push({
              title: data.title,
              description: data.description || '',
              date: data.date,
              category: data.category || 'general',
              language: lang,
              slug,
              url: `/docs/${slug}`
            });
          }
        } catch (error) {
          console.warn(`Failed to parse MDX file: ${fullPath}`, error);
          // 跳过有问题的文件，继续处理其他文件
          continue;
        }
      }
    }
  }
  
  try {
    // 只扫描中文文档，避免中英文重复
    scanDirectory(path.join(docsDir, 'zh'), 'zh');
    
    // 按日期排序，最新的在前
    entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return entries.slice(0, limit);
  } catch (error) {
    console.warn('Error scanning documents:', error);
    return [];
  }
}

export function getChangelogByCategory(category: string, limit: number = 3): ChangelogEntry[] {
  const allEntries = getRecentUpdates(20); // 获取更多条目以便筛选
  return allEntries
    .filter(entry => entry.category === category)
    .slice(0, limit);
}

export function getLatestAdvancedArticles(limit: number = 3): ChangelogEntry[] {
  return getChangelogByCategory('advanced', limit);
}

export function getClaudeCodeCourses(): CourseEntry[] {
  return [
    {
      title: "Claude Code: A Highly Agentic Coding Assistant",
      description: "Learn best practices for agentic coding with Claude Code. Explore codebases, develop features, test, refactor, and debug with AI assistance. Master MCP servers, GitHub integration, and advanced workflows.",
      url: "https://www.deeplearning.ai/short-courses/claude-code-a-highly-agentic-coding-assistant/",
      provider: "DeepLearning.AI",
      duration: "1 Hour 50 Minutes",
      instructor: "Elie Schoppik"
    },
    {
      title: "Claude Code in Action",
      description: "Comprehensive training on using Claude Code for software development. Learn coding assistant architecture, tool use systems, context management, and advanced integration strategies.",
      url: "https://anthropic.skilljar.com/claude-code-in-action",
      provider: "Anthropic Academy",
      duration: "Self-paced",
      instructor: "Anthropic Team"
    },
    {
      title: "Build with Claude",
      description: "Start developing Claude-powered applications with comprehensive API guides and best practices. Learn about Claude 4, APIs & SDKs, Computer Use, and advanced development techniques.",
      url: "https://www.anthropic.com/learn/build-with-claude",
      provider: "Anthropic",
      duration: "Self-paced",
      instructor: "Anthropic Team"
    }
  ];
} 