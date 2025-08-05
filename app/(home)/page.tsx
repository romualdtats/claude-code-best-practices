import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center text-center px-4">
      <h1 className="mb-8 text-4xl font-bold tracking-tight">
        Killer, Claude Code
      </h1>
      
      <div className="space-y-6 max-w-2xl mx-auto">
        <blockquote className="relative border-l-4 border-fd-foreground pl-6 py-4 bg-fd-muted/20 rounded-r-lg">
          <p className="text-xl leading-relaxed text-fd-foreground italic">
            "我学了一辈子的技能，被屠杀了，claude code 已经是远超人类 99% 程序员的编程能力了"
          </p>
          <footer className="mt-4 text-sm text-fd-muted-foreground">
            — <a 
              href="https://x.com/real_kai42" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-fd-foreground hover:underline font-medium"
            >
              Kai (@real_kai42)
            </a>
          </footer>
        </blockquote>
        
        <p className="text-xl leading-relaxed text-fd-muted-foreground">
          I've spent a lifetime learning skills that have been slaughtered. Claude Code has already surpassed the programming capabilities of 99% of human programmers.
        </p>
      </div>
      
      <div className="mt-12">
        <Link
          href="/docs"
          className="text-lg font-medium text-fd-foreground border-b-2 border-fd-foreground hover:border-fd-muted-foreground transition-colors"
        >
          Learn the Killer Techniques →
        </Link>
      </div>
    </main>
  );
}
