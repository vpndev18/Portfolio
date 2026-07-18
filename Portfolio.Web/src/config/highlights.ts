/**
 * Certifications, courses, talks — the "proof" strip.
 *
 * The section hides itself when this array is empty, so removing everything is a
 * valid state. Only list things you can actually point at.
 */

export interface Highlight {
  title: string
  /** One line of context — where, when, what it means. */
  description: string
  /** Short label rendered as a badge, e.g. "Certification", "Talk", "OSS". */
  kind: string
  year?: string
  /** Public credential URL, if there is one. Renders the card as a link. */
  url?: string
  /** Shown in mono type under the description when present. */
  credentialId?: string
}

export const highlights: Highlight[] = [
  {
    title: 'Docker Training Course for the Absolute Beginner',
    description:
      'KodeKloud — containers, images, and Compose, applied directly to the multi-stage builds behind my projects.',
    kind: 'Certification',
    year: 'Jun 2026',
    url: 'https://learn.kodekloud.com/certificate/3ec22644-e443-4eca-86fb-abc3ef344a68',
  },
  {
    title: 'DevOps Pre-Requisite Course',
    description:
      'KodeKloud — Linux, networking, and CI/CD fundamentals underpinning the GitHub Actions pipelines I run.',
    kind: 'Certification',
    year: 'Feb 2026',
    url: 'https://learn.kodekloud.com/certificate/91d09ffc-e6e6-4554-bcf3-4a032fa74a2f',
    credentialId: '91d09ffc-e6e6-4554-bcf3-4a032fa74a2f',
  },
]
