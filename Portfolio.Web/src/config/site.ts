// Single source of truth for site-wide personal info.
// Swap these values to rebrand the portfolio.
export const siteConfig = {
  name: 'Vallabh',
  fullName: 'Vallabh',
  role: 'Backend Engineer · .NET & TypeScript',
  // Shown in the nav logo. Kept here so it can't drift from the real domain.
  domain: 'vallabhniturkar.com',
  tagline:
    'I build durable backends and the lean UIs that sit on top of them — with .NET, EF Core, Postgres, and React.',
  email: 'vallabhwork18@gmail.com',
  location: 'India',
  // Drop the file at Portfolio.Web/public/resume.pdf for this link to work.
  resumeUrl: '/resume.pdf',
  socials: {
    github: 'https://github.com/vpndev18',
    linkedin: 'https://www.linkedin.com/in/vallabhniturkar/',
  },
  // Top-level nav. The home page is a single indexed page, so these are
  // in-page anchors; standalone routes still exist for deep links.
  nav: [
    { label: 'Work', href: '/#projects' },
    { label: 'Writing', href: '/#blog' },
    { label: 'About', href: '/about' },
  ],
  // Order of the sections on the home page, used by the sticky section rail.
  sections: [
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'blog', label: 'Writing' },
    { id: 'highlights', label: 'Highlights' },
    { id: 'contact', label: 'Contact' },
  ],
} as const
