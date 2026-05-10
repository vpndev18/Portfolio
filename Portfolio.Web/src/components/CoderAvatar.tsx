import { cn } from '@/lib/utils'

// Stylized "coder" avatar — flat illustration, themed to the site palette.
// Stand-in until a real bitmoji asset is dropped at /public/bitmoji.png.
export function CoderAvatar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative aspect-square w-full max-w-[260px] select-none',
        className,
      )}
      aria-label="Illustration of the site's author at a laptop"
    >
      {/* Soft glow halo behind the avatar */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.25),transparent_60%)] blur-2xl" />

      <svg
        viewBox="0 0 200 200"
        className="relative h-full w-full drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
        role="img"
      >
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#1f2025" />
            <stop offset="100%" stopColor="#0d0d10" />
          </radialGradient>
          <linearGradient id="hoodieGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2a2a30" />
            <stop offset="100%" stopColor="#18181b" />
          </linearGradient>
          <linearGradient id="screenGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#0a3a2a" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>
        </defs>

        {/* Backdrop circle */}
        <circle cx="100" cy="100" r="95" fill="url(#bgGrad)" />
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke="#27272a"
          strokeWidth="1"
        />

        {/* Subtle code-grid pattern */}
        <g opacity="0.18" stroke="#34d399" strokeWidth="0.5">
          <line x1="0" y1="40" x2="200" y2="40" />
          <line x1="0" y1="80" x2="200" y2="80" />
          <line x1="0" y1="120" x2="200" y2="120" />
          <line x1="0" y1="160" x2="200" y2="160" />
        </g>

        {/* Hoodie body */}
        <path
          d="M40 200 C 40 160, 60 145, 100 145 C 140 145, 160 160, 160 200 Z"
          fill="url(#hoodieGrad)"
        />
        {/* Hoodie strings */}
        <line
          x1="92"
          y1="155"
          x2="92"
          y2="180"
          stroke="#0a0a0c"
          strokeWidth="1.5"
        />
        <line
          x1="108"
          y1="155"
          x2="108"
          y2="180"
          stroke="#0a0a0c"
          strokeWidth="1.5"
        />
        <circle cx="92" cy="181" r="2" fill="#0a0a0c" />
        <circle cx="108" cy="181" r="2" fill="#0a0a0c" />

        {/* Hoodie hood (around head) */}
        <path
          d="M55 95 C 55 70, 75 55, 100 55 C 125 55, 145 70, 145 95 L 142 110 L 58 110 Z"
          fill="#1f1f23"
        />

        {/* Face */}
        <ellipse cx="100" cy="105" rx="30" ry="34" fill="#d4a373" />

        {/* Hair tuft */}
        <path
          d="M75 88 C 80 78, 95 73, 100 75 C 110 73, 122 78, 125 90 C 122 84, 110 82, 100 82 C 90 82, 80 86, 75 88 Z"
          fill="#1a1a1d"
        />

        {/* Glasses */}
        <g stroke="#fafafa" strokeWidth="1.6" fill="none">
          <circle cx="88" cy="105" r="9" />
          <circle cx="112" cy="105" r="9" />
          <line x1="97" y1="105" x2="103" y2="105" />
          <line x1="79" y1="103" x2="74" y2="100" />
          <line x1="121" y1="103" x2="126" y2="100" />
        </g>
        {/* Reflected screen glint in glasses */}
        <circle cx="86" cy="103" r="2.5" fill="#34d399" opacity="0.85" />
        <circle cx="110" cy="103" r="2.5" fill="#34d399" opacity="0.85" />

        {/* Headphone band */}
        <path
          d="M70 88 C 75 65, 125 65, 130 88"
          stroke="#fafafa"
          strokeWidth="2.5"
          fill="none"
        />
        {/* Earcups */}
        <ellipse cx="68" cy="100" rx="6" ry="9" fill="#0a0a0c" stroke="#fafafa" strokeWidth="1" />
        <ellipse cx="132" cy="100" rx="6" ry="9" fill="#0a0a0c" stroke="#fafafa" strokeWidth="1" />

        {/* Smile */}
        <path
          d="M92 122 Q 100 128 108 122"
          stroke="#3f2516"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />

        {/* Laptop in foreground */}
        <g transform="translate(40 168)">
          <rect width="120" height="20" rx="2" fill="#27272a" />
          <rect x="3" y="2" width="114" height="14" rx="1" fill="url(#screenGrad)" />
          {/* Tiny code lines on screen */}
          <g fill="#34d399" opacity="0.85">
            <rect x="8" y="5" width="22" height="1.5" rx="0.5" />
            <rect x="32" y="5" width="14" height="1.5" rx="0.5" />
            <rect x="8" y="9" width="10" height="1.5" rx="0.5" />
            <rect x="20" y="9" width="30" height="1.5" rx="0.5" />
            <rect x="8" y="13" width="40" height="1.5" rx="0.5" />
          </g>
        </g>
      </svg>
    </div>
  )
}
