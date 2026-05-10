// Single source of truth for site-wide personal info.
// Swap these values to rebrand the portfolio.
export const siteConfig = {
  name: 'Vallabh',
  fullName: 'Vallabh',
  role: 'Backend Engineer · .NET & TypeScript',
  tagline:
    'I build durable backends and the lean UIs that sit on top of them — with .NET, EF Core, Postgres, and React.',
  email: 'vaibhav@cartoq.com',
  location: 'India',
  // Drop the file at Portfolio.Web/public/resume.pdf for this link to work.
  resumeUrl: '/resume.pdf',
  socials: {
    github: 'https://github.com/yourname',
    linkedin: 'https://www.linkedin.com/in/yourname',
    twitter: 'https://twitter.com/yourname',
  },
  nav: [
    { label: 'Work', href: '/projects' },
    { label: 'Writing', href: '/blog' },
    { label: 'Now', href: '/now' },
    { label: 'About', href: '/about' },
  ],
} as const
