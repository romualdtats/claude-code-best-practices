'use client';

import Link from 'next/link';
import { ChangelogEntry, CourseEntry } from '@/lib/changelog';

interface ChangelogProps {
  entries: ChangelogEntry[];
  title?: string;
  showCategory?: boolean;
}

export function Changelog({ entries, title = "Recent Updates", showCategory = true }: ChangelogProps) {
  if (entries.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'advanced': 'Advanced',
      'best-practices': 'Best Practices',
      'tools': 'Tools',
      'community-tips': 'Community Tips',
      'cursor': 'Cursor',
      'sub-agents': 'Sub-Agents',
      'general': 'General'
    };
    return labels[category] || category;
  };

  const getLanguageLabel = (lang: string) => {
    return lang === 'zh' ? '中文' : 'English';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-fd-foreground">{title}</h2>
      <div className="space-y-3">
        {entries.map((entry, index) => (
          <div key={index} className="group">
            <Link 
              href={entry.url}
              className="block p-4 rounded-lg border border-fd-border hover:border-fd-foreground/20 hover:bg-fd-muted/20 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-fd-foreground group-hover:text-fd-foreground/80 transition-colors line-clamp-2">
                    {entry.title}
                  </h3>
                  {entry.description && (
                    <p className="mt-2 text-sm text-fd-muted-foreground line-clamp-2">
                      {entry.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-3 text-xs text-fd-muted-foreground">
                    <span>{formatDate(entry.date)}</span>
                    {showCategory && (
                      <span className="px-2 py-1 bg-fd-muted rounded-full text-xs">
                        {getCategoryLabel(entry.category)}
                      </span>
                    )}
                    <span className="px-2 py-1 bg-fd-primary/10 text-fd-primary rounded-full text-xs">
                      {getLanguageLabel(entry.language)}
                    </span>
                  </div>
                </div>
                <div className="ml-4 text-fd-muted-foreground group-hover:text-fd-foreground/60 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChangelogGrid({ entries, title = "Latest Articles" }: { entries: ChangelogEntry[], title?: string }) {
  if (entries.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'advanced': 'Advanced',
      'best-practices': 'Best Practices',
      'tools': 'Tools',
      'community-tips': 'Community Tips',
      'cursor': 'Cursor',
      'sub-agents': 'Sub-Agents',
      'general': 'General'
    };
    return labels[category] || category;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-fd-foreground">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map((entry, index) => (
          <Link 
            key={index}
            href={entry.url}
            className="group block p-4 rounded-lg border border-fd-border hover:border-fd-foreground/20 hover:bg-fd-muted/20 transition-all duration-200 h-full"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 bg-fd-primary/10 text-fd-primary rounded-full text-xs font-medium">
                  {getCategoryLabel(entry.category)}
                </span>
                <span className="text-xs text-fd-muted-foreground">
                  {formatDate(entry.date)}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-fd-foreground group-hover:text-fd-foreground/80 transition-colors line-clamp-2">
                {entry.title}
              </h3>
              {entry.description && (
                <p className="text-sm text-fd-muted-foreground line-clamp-3">
                  {entry.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function CoursesGrid({ entries, title = "Claude Code Courses" }: { entries: CourseEntry[], title?: string }) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-fd-foreground">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map((course, index) => (
          <Link 
            key={index}
            href={course.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-4 rounded-lg border border-fd-border hover:border-fd-foreground/20 hover:bg-fd-muted/20 transition-all duration-200 h-full"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 bg-fd-primary/10 text-fd-primary rounded-full text-xs font-medium">
                  {course.provider}
                </span>
                {course.duration && (
                  <span className="text-xs text-fd-muted-foreground">
                    {course.duration}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-fd-foreground group-hover:text-fd-foreground/80 transition-colors line-clamp-2">
                {course.title}
              </h3>
              {course.description && (
                <p className="text-sm text-fd-muted-foreground line-clamp-3">
                  {course.description}
                </p>
              )}
              {course.instructor && (
                <div className="pt-2 text-xs text-fd-muted-foreground">
                  Instructor: {course.instructor}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 