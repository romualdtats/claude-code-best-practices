import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center text-center px-4">
      <h1 className="mb-8 text-4xl font-bold tracking-tight">
        Killer, Claude Code
      </h1>
      
      <div className="space-y-6 max-w-2xl mx-auto">
        <p className="text-xl leading-relaxed text-fd-foreground">
          我学了一辈子的技能，被屠杀了，claude code 已经是远超人类 99% 程序员的编程能力了
        </p>
        
        <p className="text-xl leading-relaxed text-fd-muted-foreground">
          I've spent a lifetime learning skills that have been slaughtered. Claude Code has already surpassed the programming capabilities of 99% of human programmers.
        </p>
      </div>
    </main>
  );
}
