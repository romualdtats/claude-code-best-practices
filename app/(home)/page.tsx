import Link from 'next/link';
import { getClaudeCodeCourses } from '@/lib/changelog';
import { getHomePageRecentPosts } from '@/lib/recent-posts';
import { Changelog, CoursesGrid } from '@/components/changelog';

export default function HomePage() {
  // 获取最近更新的文章
  const recentUpdates = getHomePageRecentPosts(5);
  const courses = getClaudeCodeCourses();

  return (
    <main className="flex flex-1 flex-col justify-center text-center px-4">
      <h1 className="mb-12 text-4xl font-bold tracking-tight">
        Killer, Claude Code
      </h1>
      
      <div className="space-y-6 max-w-2xl mx-auto">
        <blockquote className="relative border-l-4 border-fd-foreground pl-6 py-4 bg-fd-muted/20 rounded-r-lg">
          <p className="text-xl leading-relaxed text-fd-foreground italic">
            "我学了一辈子的技能，被屠杀了，claude code 已经是远超人类 99% 程序员的编程能力了"
          </p>
          <footer className="mt-4 text-sm text-fd-muted-foreground">
            — Kai (@real_kai42)
          </footer>
        </blockquote>
        

      </div>
      
      {/* Cookbook Hero Section */}
      <div className="mt-12 max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl border border-fd-border bg-gradient-to-br from-fd-primary/5 to-fd-primary/10 p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fd-primary/5 to-transparent opacity-50"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-fd-primary/20 text-fd-primary border border-fd-primary/30">
                🚀 Just Shipped
              </span>
            </div>
            <h2 className="text-2xl font-bold text-fd-foreground mb-3">
              Claude Code Cookbook
            </h2>
            <p className="text-lg text-fd-muted-foreground mb-6 max-w-2xl mx-auto">
              A config collection that supercharges Claude Desktop for developers with 40+ custom commands, expert roles, and auto hooks.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-fd-muted text-fd-muted-foreground">
                ✨ 40+ Commands
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-fd-muted text-fd-muted-foreground">
                🎯 Expert Roles
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-fd-muted text-fd-muted-foreground">
                🔧 Auto Hooks
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-fd-muted text-fd-muted-foreground">
                🌍 Multi-Lang
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="https://github.com/foreveryh/claude-code-cookbook"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-fd-primary text-fd-primary-foreground font-medium hover:bg-fd-primary/90 transition-colors"
              >
                View on GitHub
              </Link>
              <code className="inline-flex items-center justify-center px-4 py-3 rounded-lg bg-fd-muted text-fd-foreground font-mono text-sm border border-fd-border">
                git clone https://github.com/foreveryh/claude-code-cookbook.git
              </code>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12">
        <Link
          href="/docs"
          className="text-lg font-medium text-fd-foreground border-b-2 border-fd-foreground hover:border-fd-muted-foreground transition-colors"
        >
          Learn the Killer Techniques →
        </Link>
      </div>

      {/* Changelog Section */}
      <div className="mt-16 max-w-4xl mx-auto w-full">
        <div className="space-y-12">
          {/* Claude Code Courses */}
          <CoursesGrid 
            entries={courses} 
            title="Claude Code Courses" 
          />
          
          {/* Recent Updates */}
          <div className="space-y-6">
            <Changelog 
              entries={recentUpdates} 
              title="Recent Updates" 
            />
            <div className="text-center">
              <Link
                href="/docs"
                className="inline-flex items-center text-fd-foreground hover:text-fd-primary transition-colors font-medium"
              >
                View all →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
