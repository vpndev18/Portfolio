/**
 * Skills, grouped by category.
 *
 * Every entry here is backed by real usage in a shipped project — the source
 * column in the audit that produced this list was BoilerplateApi,
 * ExpenseTracker, Financial Twin, todolist, and GitHubActionsDemo. Keep it that
 * way: a portfolio that lists things you haven't used is a liability in an
 * interview, not an asset.
 */

export interface SkillGroup {
  category: string
  /** Short line explaining how you actually use these. */
  note: string
  items: string[]
}

export const skills: SkillGroup[] = [
  {
    category: 'Languages',
    note: 'C# is home. C++ and Python for algorithms and tooling; TypeScript when something has to ship to a browser.',
    items: ['C#', 'C++', 'Python', 'TypeScript', 'SQL', 'Bash'],
  },
  {
    category: 'Backend',
    note: 'ASP.NET Core across .NET 8 and 9 — controllers where it fits, minimal APIs where it does not.',
    items: [
      'ASP.NET Core',
      'Minimal APIs',
      'MediatR / CQRS',
      'FluentValidation',
      'SignalR',
      'JWT auth',
      'Serilog',
      'Swagger / OpenAPI',
    ],
  },
  {
    category: 'Data',
    note: 'EF Core against both major engines, plus caching and vector search where the workload calls for it.',
    items: [
      'EF Core',
      'PostgreSQL',
      'SQL Server',
      'Redis',
      'Qdrant',
      'Migrations',
    ],
  },
  {
    category: 'Frontend',
    note: 'Enough React and Tailwind to put a working UI on top of my own APIs. Backend is where I go deep.',
    items: ['React', 'Vite', 'Tailwind CSS'],
  },
  {
    category: 'DevOps',
    note: 'Multi-stage Docker builds and CI that gates on secrets, tests, and a real image build.',
    items: [
      'Docker',
      'Docker Compose',
      'GitHub Actions',
      'gitleaks',
      'Cloudflare Workers',
      'Fly.io',
      'xUnit',
    ],
  },
  {
    category: 'AI',
    note: 'Gemini integrations, including a retrieval pipeline over a vector store.',
    items: ['Google Gemini', 'RAG / vector search', 'Monte Carlo simulation'],
  },
]
