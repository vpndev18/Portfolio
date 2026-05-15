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
        'Shipping vallabhniturkar.com — this portfolio and writing space.',
        'Iterating on Foresight AI: Monte Carlo simulations + AI advice on top of .NET 9 minimal APIs.',
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
