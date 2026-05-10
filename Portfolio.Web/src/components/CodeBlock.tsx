import { useState, type HTMLAttributes } from 'react'
import { Check, Copy } from 'lucide-react'

// Drop-in replacement for ReactMarkdown's `pre` element.
// Adds a copy-to-clipboard button positioned in the top-right of the block.
export function CodeBlock(props: HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false)

  async function copy(e: React.MouseEvent<HTMLButtonElement>) {
    const pre = e.currentTarget.parentElement?.querySelector('pre')
    const text = pre?.innerText ?? ''
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard API can fail in non-secure contexts; silently ignore.
    }
  }

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Copied' : 'Copy code'}
        className="absolute right-2 top-2 inline-flex h-7 items-center gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]/90 px-2 font-mono text-[11px] text-[var(--color-muted)] opacity-0 backdrop-blur transition-all group-hover:opacity-100 hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)]"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3" /> Copied
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" /> Copy
          </>
        )}
      </button>
      <pre {...props} />
    </div>
  )
}
