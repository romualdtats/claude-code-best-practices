Title: Field Notes From Shipping Real Code With Claude

URL Source: https://diwank.space/field-notes-from-shipping-real-code-with-claude

Published Time: Wed, 09 Jul 2025 11:58:54 GMT

Markdown Content:
[June 7, 2025](https://diwank.space/field-notes-from-shipping-real-code-with-claude)
Vibe Coding Isn’t Just a Vibe
-----------------------------

![Image 1: Shimmering Substance - Jackson Pollock](https://cdn.blot.im/blog_b4f0291594b44dc8a105111fe0e6e166/_image_cache/8da4f924-0f2a-44c4-91f6-d285ace5e8a4.jpg)Shimmering Substance - Jackson Pollock

> **Note**: This post comes with a _NotebookLM_ podcast ([1](https://diwank.space/field-notes-from-shipping-real-code-with-claude#footnote-1FV8)linked at the bottom), and _three_ generated audio recordings.
> 
> 
> You can read the [conversation I had with ChatGPT](https://chatgpt.com/share/6844eaae-07d0-8001-a7f7-e532d63bf8a3) while preparing drafts of this post.
> 
> 
> Comments and discussion on the [related HN post](https://news.ycombinator.com/item?id=44211417).

00:00 / 00:00

[![Image 2: Download](https://cdn.jsdelivr.net/gh/SH20RAJ/soundwave@latest/assets/download.svg)](https://cdn.blot.im/folder/v-51fc31c6/blog_b4f0291594b44dc8a105111fe0e6e166/_assets/Field-Notes-from-Shi-11ad4df1c.mp3)

Think of this post as your field guide to a new way of building software. By the time you finish reading, you’ll understand not just the how but the why behind AI-assisted development that actually works.

### Here’s What You’re Going to Learn

First, we’ll explore how to genuinely achieve a 10x productivity boost—not through magic, but through deliberate practices that amplify AI’s strengths while compensating for its weaknesses.

Next, I’ll walk you through the infrastructure we use at [Julep](https://git.new/julep) to ship production code daily with Claude’s help. You’ll see our `CLAUDE.md` templates, our commit strategies, and guardrails.

Most importantly, you’ll understand why writing your own tests remains absolutely sacred, even (especially) in the age of AI. This single principle will save you from many a midnight debugging sessions.

> **This is the main insight:** Good development practices aren’t just nice-to-haves—they’re the difference between AI that amplifies your capabilities versus your chaos. The research bears this out. [2](https://diwank.space/field-notes-from-shipping-real-code-with-claude#footnote-2FV8)Teams using rigorous practices deploy 46 times more frequently and are 440 times faster from commit to deployment. This effect is even more pronounced when you add capable AI assistants into the mix.

Why This Post Exists: From Meme to Method
-----------------------------------------

Let me take you back to when this all started. [3](https://diwank.space/field-notes-from-shipping-real-code-with-claude#footnote-3FV8)_Andrej Karpathy_[4](https://diwank.space/field-notes-from-shipping-real-code-with-claude#footnote-4FV8)tweeted about “vibe-coding”—this idea of letting AI write your code while you just vibe. The developer community had a good laugh. It sounded like the ultimate developer fantasy: kick back, sip coffee, let the machines do the work.

![Image 3: The birth of “vibe coding”](https://cdn.blot.im/blog_b4f0291594b44dc8a105111fe0e6e166/_image_cache/e482b99a-9e1e-4f5b-b968-0bf6255566d2.png)The birth of “vibe coding”

Then _Anthropic_[released Sonnet 3.7 and Claude Code](https://www.anthropic.com/news/claude-3-7-sonnet), and something unexpected happened. The joke stopped being funny because it started being… possible? Of course, our trusty friend [Cursor](https://www.cursor.com/) had been around awhile but this new interface finally felt like _true vibe coding_.

At [Julep](https://git.new/julep), we build AI workflow orchestration. Our backend has years of accumulated decisions, patterns, and occasional technical debt. We have taken the utmost care to keep code quality high, and ample documentation for ourselves. However, the sheer size, and historical context of _why_ different parts of the code are organized the way they are takes weeks for a good engineer to grok.

> Without proper guardrails when using Claude, you’re basically playing whack-a-mole with an overeager intern.

Understanding Vibe-Coding
-------------------------

![Image 4: ‘pls fix’](https://cdn.blot.im/blog_b4f0291594b44dc8a105111fe0e6e166/_image_cache/e771b36e-bdb6-4c99-8949-0a3583bc6259.png)‘pls fix’

[5](https://diwank.space/field-notes-from-shipping-real-code-with-claude#footnote-5FV8)_Steve Yegge_ brilliantly coined the term _CHOP_—Chat-Oriented Programming in a slightly-dramatic-titled post [“The death of the junior developer”](https://sourcegraph.com/blog/the-death-of-the-junior-developer). It’s a perfect, and no-bs description of what it’s like to code with Claude.

Think of traditional coding like sculpting marble. You start with a blank block and carefully chisel away, line by line, function by function. Every stroke is deliberate, every decision yours. It’s satisfying but slow.

Vibe-coding is more like conducting an orchestra. You’re not playing every instrument—you’re directing, shaping, guiding. The AI provides the raw musical talent, but without your vision, it’s just noise.

There are three distinct postures you can take when vibe-coding, each suited to different phases in the development cycle:

1.   **AI as First-Drafter**: Here, AI generates initial implementations while you focus on architecture and design. It’s like having a junior developer who can type at the speed of thought but needs constant guidance. Perfect for boilerplate, CRUD operations, and standard patterns.

2.   **AI as Pair-Programmer**: This is the sweet spot for most development. You’re actively collaborating, bouncing ideas back and forth. The AI suggests approaches, you refine them. You sketch the outline, AI fills in details. It’s like pair programming with someone who has read every programming book ever written but has never actually shipped code.

3.   **AI as Validator**: Sometimes you write code and want a sanity check. AI reviews for bugs, suggests improvements, spots patterns you might have missed. Think of it as an incredibly well-read code reviewer who never gets tired or cranky.

> Instead of crafting every line, you’re reviewing, refining, directing. But—and this cannot be overstated—you remain the architect. Claude is your intern with encyclopedic knowledge but zero context about your specific system, your users, your business logic.

The Three Modes of Vibe-Coding: A Practical Framework
-----------------------------------------------------

After months of experimentation and more than a few production incidents, I’ve settled on three distinct modes of operation. Each has its own rhythm, its own guardrails, and its own use cases.

### Mode 1: _The Playground_

![Image 5: Lighter Fluid](https://cdn.blot.im/blog_b4f0291594b44dc8a105111fe0e6e166/_image_cache/ede9227b-cd8d-4505-ba93-21c9c7fcb31a.png)Lighter Fluid

**When to use it**: Weekend hacks, personal scripts, proof-of-concepts, and those “I wonder if…” moments that make programming fun.

In _Playground Mode_, you embrace the chaos. Claude writes 80-90% of the code while you provide just enough steering to keep things on track. It’s liberating and slightly terrifying. _Pro Tip:_ check out [claude-composer](https://github.com/possibilities/claude-composer) for going full-YOLO mode.

Here’s what Playground Mode looks like: You have an idea for a script to analyze your Spotify history. You open Claude, describe what you want in plain English, and watch as it generates a complete solution. No `CLAUDE.md` file, no careful prompting—just raw, unfiltered AI-written code.

The beauty of Playground Mode is its speed. You can go from idea to working prototype in minutes. The danger is that this cowboy coding style is absolutely inappropriate for anything that matters. Use it for experiments, never for production. Trust me, while the amazing folks preaching otherwise, good engineering principles still matter, [now more than ever](https://www.ikangai.com/vibe-coding-in-software-engineering/).

### Mode 2: _Pair Programming_

![Image 6: Compiling](https://cdn.blot.im/blog_b4f0291594b44dc8a105111fe0e6e166/_image_cache/d84d1867-c2b4-4ef9-8904-b7c69cf12154.webp)Compiling

**When to use it**: Projects under _~5,000 lines of code_, side projects with real users, demos (you don’t want to break), or well-scoped small services in larger systems.

This is where vibe-coding starts to shine. You need structure, but not so much that it slows you down. The key innovation here is the `CLAUDE.md` file—custom documentation that Claude automatically reads when invoked. From Anthropic’s [Best practices for Claude Code](https://www.anthropic.com/engineering/claude-code-best-practices):

> `CLAUDE.md` is a special file that Claude automatically pulls into context when starting a conversation:
> 
> 
> *   Common bash commands
> 
> *   Core files and utility functions
> 
> *   Code style guidelines
> 
> *   Testing instructions
> 
> *   Repository etiquette (e.g., branch naming, merge vs.rebase, etc.)
> 
> *   Other information you want Claude to remember

Instead of repeatedly explaining your project’s conventions, you document them once. Here’s a real example from a recent side project:

```
## Project: Analytics Dashboard  

This is a Next.js dashboard for visualizing user analytic:  

### Architecture Decisions  
- Server Components by default, Client Components only when necessary  
- tRPC for type-safe API calls  
- Prisma for database access with explicit select statements  
- Tailwind for styling (no custom CSS files)  

### Code Style  
- Formatting: Prettier with 100-char lines  
- Imports: sorted with simple-import-sort  
- Components: Pascal case, co-located with their tests  
- Hooks: always prefix with 'use'  

### Patterns to Follow  
- Data fetching happens in Server Components  
- Client Components receive data as props  
- Use Zod schemas for all external data  
- Error boundaries around every data display component  

### What NOT to Do  
- Don't use useEffect for data fetching  
- Don't create global state without explicit approval  
- Don't bypass TypeScript with 'any' types
```

00:00 / 00:00

[![Image 7: Download](https://cdn.jsdelivr.net/gh/SH20RAJ/soundwave@latest/assets/download.svg)](https://cdn.blot.im/folder/v-7fbbe556/blog_b4f0291594b44dc8a105111fe0e6e166/_assets/With-this-context-Cl-1332162e4.mp3)

With this context, Claude becomes remarkably effective. It’s like the difference between explaining your project to a new hire every single day versus having them read the onboarding docs once.

But _Pair Programming Mode_ requires more than just documentation. You need to actively guide the AI with what I call “anchor comments”—breadcrumbs that prevent Claude from wandering into the wilderness:

```
// AIDEV-NOTE: This component uses virtual scrolling for performance  
// See: https://tanstack.com/virtual/latest  
// Don't convert to regular mapping—we handle 10k+ items  

export function DataTable({ items }: DataTableProps) {  
  // Claude, when you edit this, maintain the virtual scrolling  
  ...  
}
```

These comments serve a dual purpose: they guide the AI and document your code for humans. It’s documentation that pays dividends in both directions. The **key distinction** between such “anchor comments” and regular comments: these are _written_, _maintained_, and _meant to be used_ by Claude itself. Here’s an _actual snippet_ from our [project’s CLAUDE.md](https://github.com/julep-ai/julep/blob/dev/AGENTS.md):

```
## Anchor comments  

Add specially formatted comments throughout the codebase, where appropriate, for yourself as inline knowledge that can be easily `grep`ped for.  

### Guidelines:  

- Use `AIDEV-NOTE:`, `AIDEV-TODO:`, or `AIDEV-QUESTION:` (all-caps prefix) for comments aimed at AI and developers.  
- Keep them concise (≤ 120 chars).  
- **Important:** Before scanning files, always first try to **locate existing anchors** `AIDEV-*` in relevant subdirectories.  
- **Update relevant anchors** when modifying associated code.  
- **Do not remove `AIDEV-NOTE`s** without explicit human instruction.  

Example:  
# AIDEV-NOTE: perf-hot-path; avoid extra allocations (see ADR-24)  
async def render_feed(...):  
    ...
```

### Mode 3: _Production/Monorepo Scale_

![Image 8: RTFM](https://cdn.blot.im/blog_b4f0291594b44dc8a105111fe0e6e166/_image_cache/97c55ab9-c876-4018-841f-ee014757e908.webp)RTFM

**When to use it**: Large codebases, systems with real users, anything where bugs cost money or reputation.

Claude can generate tremendous amounts of code, but integrating it into a complex system requires careful orchestration.

Let me start with a big caveat: **vibe coding at this scale does NOT scale very well,** yet. I definitely do see these systems getting significantly better at handling larger codebases _but_, for them to be effective, significant effort is needed to help them navigate, understand, and _safely_ hack on them without getting lost in a maze. Generally speaking, it’s better to section them into individual services, and [6](https://diwank.space/field-notes-from-shipping-real-code-with-claude#footnote-6FV8)sub modules when possible.

As a universal principle, good engineering practices apply to large-scale projects, vibe coded or not. For example, at production scale, boundaries become critical. Every integration point needs explicit documentation:

```
# AIDEV-NOTE: API Contract Boundary - v2.3.1  
# ANY changes require version bump and migration plan  
# See: docs/api-versioning.md  

@router.get("/users/{user_id}/feed")  
async def get_user_feed(user_id: UUID) -> FeedResponse:  
    # Claude: the response shape here is sacred  
    # Changes break real apps in production  
    ...
```

Without these boundaries, Claude will happily “improve” your API and break every client in production. Bottom line: larger projects should _definitely_ start adopting vibe coding in parts, and adopt methodologies that enhance that experience but, don’t expect to land large features reliably just yet. (as of _June 7, 2025 / AI epoch_)

Infrastructure: The Foundation of Sustainable AI Development
------------------------------------------------------------

### `CLAUDE.md`: Your Single Source of Truth

Let me be absolutely clear about this: `CLAUDE.md` is not optional documentation. Every minute you spend updating it saves an hour of cleanup later.

Think of `CLAUDE.md` as a constitution for your codebase. It establishes the fundamental laws that govern how code should be written, how systems interact, and what patterns to follow or avoid. Organizations that invest in developing the skills and capabilities of their teams get better outcomes—and your `CLAUDE.md` is that investment crystallized into documentation.

Here’s an abridged version of [our production `CLAUDE.md`](https://github.com/julep-ai/julep/blob/dev/AGENTS.md) structure, refined over thousands of AI-assisted commits:

```
# `CLAUDE.md` - Julep Backend Service  

## The Golden Rule  
When unsure about implementation details, ALWAYS ask the developer.  

## Project Context  
Julep enables developers to build stateful AI agents using declarative  
workflows.  

## Critical Architecture Decisions  

### Why Temporal?  
We use Temporal for workflow orchestration because:  
1. Workflows can run for days/weeks with perfect reliability  
2. Automatic recovery from any failure point  

### Why PostgreSQL + pgvector?  
1. ACID compliance for workflow state (can't lose user data)  
2. Vector similarity search for agent memory  

### Why TypeSpec?  
Single source of truth for API definitions:  
- OpenAPI specs  
- TypeScript/Python clients  
- Validation schemas  

## Code Style and Patterns  

### Anchor comments  

Add specially formatted comments throughout the codebase, where appropriate, for yourself as inline knowledge that can be easily `grep`ped for.  

### Guidelines:  

- Use `AIDEV-NOTE:`, `AIDEV-TODO:`, or `AIDEV-QUESTION:` (all-caps prefix) for comments aimed at AI and developers.  
- **Important:** Before scanning files, always first try to **grep for existing anchors** `AIDEV-*` in relevant subdirectories.  
- **Update relevant anchors** when modifying associated code.  
- **Do not remove `AIDEV-NOTE`s** without explicit human instruction.  
- Make sure to add relevant anchor comments, whenever a file or piece of code is:  
  * too complex, or  
  * very important, or  
  * confusing, or  
  * could have a bug  

## Domain Glossary (Claude, learn these!)  

- **Agent**: AI entity with memory, tools, and defined behavior  
- **Task**: Workflow definition composed of steps (NOT a Celery task)  
- **Execution**: Running instance of a task  
- **Tool**: Function an agent can call (browser, API, etc.)  
- **Session**: Conversation context with memory  
- **Entry**: Single interaction within a session  

## What AI Must NEVER Do  

1. **Never modify test files** - Tests encode human intent  
2. **Never change API contracts** - Breaks real applications  
3. **Never alter migration files** - Data loss risk  
4. **Never commit secrets** - Use environment variables  
5. **Never assume business logic** - Always ask  
6. **Never remove AIDEV- comments** - They're there for a reason  

Remember: We optimize for maintainability over cleverness.  
When in doubt, choose the boring solution.
```

This document becomes the shared context between you and Claude. It’s like having a senior developer whispering guidance in Claude’s ear throughout the coding session.

As your codebase grows, `CLAUDE.md` alone isn’t enough. You need inline guidance—what I call anchor comments. These serve as local context that prevents AI from making locally bad decisions.

Think of your codebase as a city and anchor comments as street signs. Without them, even smart visitors get lost. Here’s how we use them effectively:

```
# AIDEV-NOTE: Critical performance path - this serves 100k req/sec  
# DO NOT add database queries here  
def get_user_feed(user_id: UUID, cached_data: FeedCache) -> List[FeedItem]:  
    # We need to avoid mutating the cached data  
    items = cached_data.items[:]  

    # AIDEV-TODO: Implement pagination (ticket: FEED-123)  
    # Need cursor-based pagination for infinite scroll  

    # AIDEV-QUESTION: Why do we filter private items here instead of in cache?  
    # AIDEV-ANSWER: Historical context: Privacy rules can change between cache updates  
    filtered = [item for item in items if user_has_access(user_id, item)]  

    return filtered
```

These comments create a narrative that helps both AI and humans understand not just what the code does, but why it does it that way.

### Git Workflows for AI Development

One of the most underappreciated aspects of AI-assisted development is how it changes your git workflow. You’re now generating code at a pace that can quickly pollute your git history if you’re not careful.

It really only applies to very large codebases because it is _not_ a very straightforward tool, but I recommend using [git worktrees](https://www.anthropic.com/engineering/claude-code-best-practices#c-use-git-worktrees) to create isolated environments for AI experiments:

```
# Create an AI playground without polluting main  
git worktree add ../ai-experiments/cool-feature -b ai/cool-feature  

# Let Claude go wild in the isolated worktree  
cd ../ai-experiments/cool-feature  
# ... lots of experimental commits ...  

# Cherry-pick the good stuff back to main  
cd ../main-repo  
git cherry-pick abc123  # Just the commits that worked  

# Clean up when done  
git worktree remove ../ai-experiments/cool-feature
```

> **Pro tip**: Read about [how to use worktrees](https://dev.to/yankee/practical-guide-to-git-worktree-58o0), and check out the nifty [`wt`](https://github.com/taecontrol/wt) tool.

This approach gives you the best of both worlds: Claude can experiment freely while your main branch history stays clean and meaningful.

For commit messages, we’ve standardized on tagging AI-assisted commits:

```
feat: implement user feed caching [AI]  

- Add Redis-based cache for user feeds  
- Implement cache warming on user login  
- Add metrics for cache hit rate  

AI-assisted: core logic generated, tests human-written
```

This transparency helps during code review—reviewers know to pay extra attention to AI-generated code.

The Sacred Rule: Humans Write Tests
-----------------------------------

Now we come to the most important principle in AI-assisted development. It’s so important that I’m going to repeat it in multiple ways until it’s burned into your memory:

**Never. Let. AI. Write. Your. Tests.**

Tests are not just code that verifies other code works. Tests are executable specifications. They encode your actual intentions, your edge cases, your understanding of the problem domain. High performers excel at both speed and stability—there’s no trade-off. Tests are how you achieve both.

![Image 9: Beware…](https://cdn.blot.im/blog_b4f0291594b44dc8a105111fe0e6e166/_image_cache/5dd77e55-5b53-412a-a169-e61d88eff60a.png)Beware…

Let me illustrate why this matters with an example. Let’s say we asked Claude to implement a rate limiter:

```
class RateLimiter:  
    def __init__(self, max_requests: int, window_seconds: int):  
        self.max_requests = max_requests  
        self.window_seconds = window_seconds  
        self.requests = defaultdict(list)  

    def is_allowed(self, user_id: str) -> bool:  
        now = time.time()  
        user_requests = self.requests[user_id]  

        # Clean old requests  
        self.requests[user_id] = [  
            req_time for req_time in user_requests  
            if now - req_time < self.window_seconds  
        ]  

        if len(self.requests[user_id]) < self.max_requests:  
            self.requests[user_id].append(now)  
            return True  
        return False
```

Looks reasonable, right? Claude even helpfully generated tests:

```
def test_rate_limiter():  
    limiter = RateLimiter(max_requests=3, window_seconds=60)  

    assert limiter.is_allowed("user1") == True  
    assert limiter.is_allowed("user1") == True  
    assert limiter.is_allowed("user1") == True  
    assert limiter.is_allowed("user1") == False  # Limit reached
```

But here’s what Claude’s tests missed—what only a human who understands the business requirements would test: Claude’s implementation has a memory leak. Users who hit the API once and never return leave their data in memory forever. The AI-generated tests check the happy path but miss this critical production concern.

![Image 10: Vibe coding at its best](https://cdn.blot.im/blog_b4f0291594b44dc8a105111fe0e6e166/_image_cache/a4c32be3-f91c-44e3-aebd-c65f50fbd379.png)Vibe coding at its best

This is why humans write tests. We understand the context, the production environment, the edge cases that matter. At Julep, our rule is absolute:

```
## Testing Discipline  

| What | AI CAN Do | AI MUST NOT Do |  
|------|-----------|----------------|  
| Implementation | Generate business logic | Touch test files |  
| Test Planning | Suggest test scenarios | Write test code |  
| Debugging | Analyze test failures | Modify test expectations |  

If an AI tool touches a test file, the PR gets rejected. No exceptions.
```

Your tests are your specification. They’re your safety net. They’re the encoded wisdom of every bug you’ve fixed and every edge case you’ve discovered. Guard them zealously.

Scaling Without Drowning: Token Economics and Context Management
----------------------------------------------------------------

One of the most counterintuitive lessons in AI-assisted development is that being stingy with context to save tokens actually costs you more. It’s like trying to save money on gas by only filling your tank halfway—you just end up making more trips to the gas station.

Token budgets matter. Provide focused prompts, reduce diff length, and avoid large-file bloat by summarizing intent in advance. But “focused” doesn’t mean “minimal”—it means “relevant and complete.”

Let me show you the false economy of starved prompts:

**Starved Prompt Attempt:**

`"Add caching to the user endpoint"`
**Claude’s Response:** Implements caching… but:

*   Uses in-memory cache (won’t work with multiple servers)

*   No cache invalidation strategy

*   No metrics or monitoring

*   No consideration of cache stampede

**Result:** 3 more rounds of fixes, _4x the tokens spent_.

**Proper Context-Rich Prompt:**

```
Add Redis caching to the GET /users/{id} endpoint.  

Context:  
- This endpoint serves 50k requests/minute  
- We run 12 API servers behind a load balancer  
- User data changes infrequently (few times per day)  
- We already have Redis at cache.redis.internal:6379  
- Use our standard cache key pattern: "user:v1:{id}"  
- Include cache hit/miss metrics (we use Prometheus)  
- Implement cache-aside pattern with 1 hour TTL  
- Handle cache stampede with probabilistic early expiration  

See our caching guide: docs/patterns/caching.md
```

The lesson? Front-load context to avoid iteration cycles. Think of tokens like investing in good tools—the upfront cost pays for itself many times over.

In fact, I recommend that all projects should routinely ask Claude to look through the codebase changes, and add context to `CLAUDE.md`

### Fresh Sessions and Mental Models

Here’s another counterintuitive practice: use fresh Claude sessions for distinct tasks. It’s tempting to keep one long-running conversation, but this leads to context pollution.

Think of it like this: you wouldn’t use the same cutting board for vegetables after cutting raw chicken. Similarly, don’t use the same Claude session for database migrations after discussing frontend styling. The context bleeds through in subtle ways.

Our rule: One task, one session. When the task is done, start fresh. This keeps Claude’s “mental model” clean and focused.

00:00 / 00:00

[![Image 11: Download](https://cdn.jsdelivr.net/gh/SH20RAJ/soundwave@latest/assets/download.svg)](https://cdn.blot.im/folder/v-204607a8/blog_b4f0291594b44dc8a105111fe0e6e166/_assets/Case-Study-Shipping-d6a8a91f.mp3)

Case Study: Shipping Structured Errors in Production
----------------------------------------------------

Let me walk you through a real refactoring we did at Julep that showcases production-scale vibe-coding. We needed to replace our ad-hoc error handling with a structured error hierarchy across 500+ endpoints.

**The Human Decisions (The Why):**

First, we had to decide on our error taxonomy. This is pure architectural work—Claude can’t make these decisions because they involve understanding our business, our users, and our operational needs:

```
# SPEC.md - Error Hierarchy Design (Human-Written)  

## Error Philosophy  
- Client errors (4xx) must include actionable feedback  
- System errors (5xx) must include trace IDs for debugging  
- All errors must be JSON-serializable  
- Error codes must be stable (clients depend on them)  

## Hierarchy  
BaseError  
├── ClientError (4xx)  
│   ├── ValidationError  
│   │   ├── SchemaValidationError - Request doesn't match schema  
│   │   ├── BusinessRuleError - Valid schema, invalid business logic  
│   │   └── RateLimitError - Too many requests  
│   └── AuthError  
│       ├── AuthenticationError - Who are you?  
│       └── AuthorizationError - You can't do that  
└── SystemError (5xx)  
    ├── DatabaseError - Connection, timeout, deadlock  
    ├── ExternalServiceError - APIs, webhooks failing  
    └── InfrastructureError - Disk full, OOM, etc.  

## Error Response Format  
{  
  "error": {  
    "code": "VALIDATION_FAILED",     // Stable code for clients  
    "message": "Email already exists", // Human-readable  
    "details": { ... },               // Structured data  
    "trace_id": "abc-123-def"         // For debugging  
  }  
}
```

**The AI Execution (The How):**

With the specification clear, we unleashed Claude on the mechanical refactoring:

```
### Prompt to Claude:  

Refactor our error handling to match SPEC.md.  

Current state:  
- raise ValueError("Invalid email")  
- return {"error": "Something went wrong"}, 500  

Target state:  
- Use error hierarchy from SPEC.md  
- Include proper error codes  
- Add trace_id to all 5xx errors  

Start with the auth module. Show me the plan before implementing.
```

Claude’s plan was solid:

```
1. Create error hierarchy in `common/errors.py`  
2. Create error response formatter  
3. Update each module systematically  
4. Add error handling middleware
```

Claude was able to handle the tedious work of finding and updating 500+ error sites, while we focused on reviewing:

```
# Before (Claude found these patterns):  
if not user:  
    raise Exception("User not found")  

# After (Claude's refactoring):  
if not user:  
    raise AuthenticationError(  
        message="User not found",  
        code="USER_NOT_FOUND",  
        details={"identifier": email}  
    )
```

> Combined with our carefully written `CLAUDE.md` file, meticulous docs, regularly updated anchor comments, and clear instructions, results:
> 
> 
> *   Time: 4 hours instead of 2 days
> 
> *   Coverage: All 500+ error sites updated

Leadership and Culture in the AI Era
------------------------------------

Your role as a senior engineer has fundamentally shifted. You’re no longer just writing code—you’re curating knowledge, setting boundaries, and teaching both humans and AI systems how to work effectively.

Lean management and continuous delivery practices help improve software delivery performance, which in turn improves organizational performance—and this includes how you manage AI collaboration.

### The New Onboarding Checklist

When new developers join our team, they get two onboarding tracks: one for humans, one for working with AI. Here’s our combined checklist:

**Week 1: Foundation**

```
□ Read team `CLAUDE.md` files (start with root, then service-specific)  
□ Set up development environment  
□ Make first PR (human-written, no AI)
```

**Week 2: Guided AI Collaboration**

```
□ Set up Claude with team templates  
□ Complete "toy problem" with AI assistance  
□ Practice prompt patterns  
□ Create first AI-assisted PR (with supervision)
```

**Week 3: Independent Work**

```
□ Ship first significant AI-assisted feature  
□ Write tests for another developer's AI output  
□ Lead one code review session
```

### Building a Culture of Transparency

One cultural shift that’s essential: normalize disclosure of AI assistance. We’re not trying to hide that we use AI—we’re trying to use it responsibly. Every commit message that includes AI work gets tagged:

```
# Our .gitmessage template  
# feat/fix/docs: <description> [AI]?  
#  
# [AI] - Significant AI assistance (>50% generated)  
# [AI-minor] - Minor AI assistance (<50% generated)  
# [AI-review] - AI used for code review only  
#   
# Example:  
# feat: add Redis caching to user service [AI]  
#  
# AI generated the cache implementation and Redis client setup.  
# I designed the cache key structure and wrote all tests.  
# Manually verified cache invalidation logic works correctly.
```

This transparency serves multiple purposes:

1.   Reviewers know to pay extra attention

2.   Future debuggers understand the code’s provenance

3.   No one feels shame about using available tools

Creating an environment where developers can leverage AI effectively, without fear or shame, is part of building that high-performing culture.

Things Claude Should Never Touch (Carved in Stone)
--------------------------------------------------

Let’s be crystal clear about boundaries. These aren’t suggestions—they’re commandments. Violate them at your peril.

### The Sacred List of Never-Touch

**❌ Test Files**

```
# This is SACRED GROUND  
# No AI shall pass  
def test_critical_business_logic():  
    """This test encodes $10M worth of domain knowledge"""  
    pass
```

Tests encode human understanding. They’re your safety net, your specification, your accumulated wisdom. When Claude writes tests, it’s just verifying that the code does what the code does—not what it should do.

**❌ Database Migrations**

```
-- migrations/2024_01_15_restructure_users.sql  
-- DO NOT LET AI TOUCH THIS  
-- One wrong move = data loss = career loss  
ALTER TABLE users ADD COLUMN subscription_tier VARCHAR(20);  
UPDATE users SET subscription_tier = 'free' WHERE subscription_tier IS NULL;  
ALTER TABLE users ALTER COLUMN subscription_tier SET NOT NULL;
```

Migrations are irreversible in production. They require understanding of data patterns, deployment timing, and rollback strategies that AI cannot grasp.

**❌ Security-Critical Code**

```
# auth/jwt_validator.py  
# HUMAN EYES ONLY - Security boundary  
def validate_token(token: str) -> Optional[UserClaims]:  
    # Every line here has been security-reviewed  
    # Changes require security team approval  
    # AI suggestions actively dangerous here
```

**❌ API Contracts Without Versioning**

```
# openapi.yaml  
# Breaking this = breaking every client  
# AI doesn't understand mobile app release cycles  
paths:  
  /api/v1/users/{id}:  
    get:  
      responses:  
        200:  
          schema:  
            $ref: '#/definitions/UserResponse'  # FROZEN until v2
```

**❌ Configuration and Secrets**

```
# config/production.py  
DATABASE_URL = os.environ["DATABASE_URL"]  # Never hardcode  
STRIPE_SECRET_KEY = os.environ["STRIPE_SECRET_KEY"]  # Obviously  
FEATURE_FLAGS = {  
    "new_pricing": False,  # Requires product decision  
}
```

### The Hierarchy of AI Mistakes

Not all AI mistakes are equal. Here’s how we categorize them:

**Level 1: Annoying but Harmless**

*   Wrong formatting (your linter will catch it)

*   Verbose code (refactor later)

*   Suboptimal algorithms (profile will reveal)

**Level 2: Expensive to Fix**

*   Breaking internal APIs (requires coordination)

*   Changing established patterns (confuses team)

*   Adding unnecessary dependencies (bloat)

**Level 3: Career-Limiting**

*   Modifying tests to make them pass

*   Breaking API contracts

*   Leaking secrets or PII

*   Corrupting data migrations

Your guardrails should be proportional to the mistake level. Level 1 mistakes teach juniors. Level 3 mistakes teach you to update your LinkedIn.

The Future of Development: Where This Is Heading
------------------------------------------------

As I write this in 2025, we’re in the awkward adolescence of AI-assisted development. The tools are powerful but clumsy, like a teenager who just hit a growth spurt. But the trajectory is clear, and it’s accelerating.

Good documentation is foundational for successfully implementing DevOps capabilities. The teams that excel will be those who treat documentation as code, who maintain their `CLAUDE.md` files with the same rigor as their test suites.

What I see coming (~roughly in order of arrival):

*   Proactive AI that suggests improvements without prompting

*   AI that learns your team’s patterns and preferences

*   Persistent memory across sessions and projects

*   AI that understands entire codebases, not just files

But even as capabilities expand, the fundamentals remain: humans set direction, AI provides leverage. We’re tool users, and these are simply the most powerful tools we’ve ever created.

The Bottom Line: Start Here, Start Today
----------------------------------------

If you’ve made it this far, you’re probably feeling a mix of excitement and trepidation. That’s the right response. AI-assisted development is powerful, but it requires discipline and intentionality.

Here’s your action plan:

**Today:**

1.   Create a `CLAUDE.md` for your current project

2.   Add three anchor comments **yourself** to your gnarliest code

3.   Try one AI-assisted feature with proper boundaries

**This Week:**

1.   Establish AI commit message conventions with your team

2.   Run an AI-assisted coding session with a junior developer

3.   Write tests for one piece of AI-generated code

**This Month:**

1.   Measure your deployment frequency before/after AI adoption

2.   Create a prompt pattern library for common tasks

3.   Run a team retrospective on AI-assisted development

The most important thing? Start. Start small, start careful, but start. The developers who master this workflow aren’t necessarily smarter or more talented—they’re just the ones who started earlier and learned from more mistakes.

Software delivery performance predicts organizational performance. In an industry where speed and quality determine success, AI assistance isn’t a nice-to-have—it’s a competitive necessity. But only if you do it right.

Vibe-coding, despite its playful name, is serious business. It’s a new way of thinking about software development that amplifies human capabilities rather than replacing them. Master it, and you’ll ship better software faster than you ever thought possible. Ignore it, and you’ll watch competitors lap you while you’re still typing boilerplate.

The tools are here. The patterns are proven. The only question is: will you be conducting the orchestra, or still playing every instrument yourself?

### Ready to Dive In? Resources to Get Started:

📄 **Our Battle-Tested `CLAUDE.md` Template:**

[github.com/julep-ai/julep/blob/main/AGENTS.md](https://github.com/julep-ai/julep/blob/main/AGENTS.md)

🤝 **Questions? Find me on Twitter:**[@diwanksingh](https://twitter.com/diwanksingh)

💬 **Join the Discussion:** Share your own patterns and learnings

📚 **Recommended reading:**

*   Peter Senge – _The Fifth Discipline_ (2010)

*   _[“Beyond the 70 %: Maximising the Human 30 % of AI-Assisted Coding”](https://addyo.substack.com/p/future-proofing-your-software-engineering?utm\_source=chatgpt.com)_ (Mar 13 2025) – Addy Osmani

*   Mark Richards & Neal Ford – _[Fundamentals of Software Architecture](https://books.google.com/books/about/Fundamentals\_of\_Software\_Architecture.html)_, 2nd ed.(2025)

*   Nicole Forsgren, Jez Humble, Gene Kim - _[Accelerate: The Science of Lean Software and DevOps](https://itrevolution.com/product/accelerate/)_

**Remember**: perfect is the enemy of shipped. Start with one small project, establish your boundaries, and iterate. The future of development is here—it’s just not evenly distributed yet.

> Be part of the distribution.

* * *

1.   00:00 / 00:00

[![Image 12: Download](https://cdn.jsdelivr.net/gh/SH20RAJ/soundwave@latest/assets/download.svg)](https://cdn.blot.im/folder/v-32aee19c/blog_b4f0291594b44dc8a105111fe0e6e166/_assets/Field%20Notes%20From%20Shipping%20Real%20Code%20With%20Claude.wav) 

 NotebookLM Podcast on this post[↩︎](https://diwank.space/field-notes-from-shipping-real-code-with-claude#ref-1FV8)
2.   That statistic comes from the groundbreaking research in the book “Accelerate: The Science of Lean Software and DevOps” by Nicole Forsgren, Jez Humble, and Gene Kim.

The authors conducted a rigorous four-year study (2014-2017) surveying over 31,000 professionals across 2,000+ organizations. They used academic research methods to identify what separates high-performing technology organizations from low performers.

The specific statistics you’re asking about compare the **highest performers** to the **lowest performers** in their study:

High performers vs.Low Performers: Software Delivery

    *   46 times as many code deployments

    *   440 times as fast commit to deployment time

    *   170 times faster mean time to recover

    *   5 times lower change failure rate

The “Accelerate” research proves that practices matter more than tools. AI is an incredibly powerful tool, but without the practices—continuous integration, automated testing, trunk-based development, monitoring—you won’t see these multiplier effects.

That’s why I emphasize things like `CLAUDE.md` files, human-written tests, and careful boundaries. These ARE the practices that separate high performers from low performers, just adapted for the age of AI assistance.[↩︎](https://diwank.space/field-notes-from-shipping-real-code-with-claude#ref-2FV8)

3.   Andrej Karpathy is a Slovak-Canadian computer scientist who served as the director of artificial intelligence and Autopilot Vision at Tesla. He co-founded and formerly worked at OpenAI, where he specialized in deep learning and computer vision.

[https://karpathy.ai/](https://karpathy.ai/)[↩︎](https://diwank.space/field-notes-from-shipping-real-code-with-claude#ref-3FV8)

4.   [↩︎](https://diwank.space/field-notes-from-shipping-real-code-with-claude#ref-4FV8)
5.   Steve Yegge is an American computer programmer and blogger who is known for writing about programming languages, productivity and software culture through his “Stevey’s Drunken Blog Rants” site, followed by “Stevey’s Blog Rants.”

[https://en.wikipedia.org/wiki/Steve_Yegge](https://en.wikipedia.org/wiki/Steve_Yegge)[↩︎](https://diwank.space/field-notes-from-shipping-real-code-with-claude#ref-5FV8)

6.   I don’t mean `git submodule`s – in fact, don’t use them with coding assistants for sure, they are mine fields for models.[↩︎](https://diwank.space/field-notes-from-shipping-real-code-with-claude#ref-6FV8)

[Vibe Engineering](https://diwank.space/tagged/vibe-engineering)