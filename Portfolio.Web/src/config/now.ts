// /now page content. Edit this file to update the page — no DB, no redeploy
// dance, just commit. Inspired by https://nownownow.com.

export const nowContent = {
  updatedAt: '2026-05-10',
  intro:
    "What I'm focused on right now. I update this when things change — usually monthly.",
  sections: [
    {
      heading: 'Working on',
      items: [
        'Building this portfolio (Phase 4 — Cmd+K, blog polish, /now).',
        'Polishing the .NET reference patterns in BoilerplateApi for re-use across projects.',
      ],
    },
    {
      heading: 'Learning',
      items: [
        'Vertical slice architecture in larger codebases — how it scales beyond toy examples.',
        'Postgres internals: index types, query planning, partial indexes.',
      ],
    },
    {
      heading: 'Reading',
      items: [
        '"Designing Data-Intensive Applications" — Martin Kleppmann.',
        'Eric Evans on bounded contexts; revisiting after a year of practice.',
      ],
    },
    {
      heading: 'Open to',
      items: [
        'Contract or full-time backend / full-stack work (.NET-leaning).',
        'Pair-programming sessions on hard EF Core / Postgres problems.',
      ],
    },
  ],
} as const
