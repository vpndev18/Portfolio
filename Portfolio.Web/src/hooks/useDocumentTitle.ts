import { useEffect } from 'react'

const SUFFIX = ' · Vallabh'

// Sets `document.title` to `${title}${SUFFIX}` while the component is mounted,
// then restores the previous title on unmount. Pass null to skip a render
// (useful while a fetch is loading and you don't have a title yet).
export function useDocumentTitle(title: string | null | undefined) {
  useEffect(() => {
    if (!title) return
    const previous = document.title
    document.title = title.endsWith(SUFFIX) ? title : `${title}${SUFFIX}`
    return () => {
      document.title = previous
    }
  }, [title])
}

// Toggles a <meta name="robots" content="..."> on/off for the lifetime of the
// component. Used on /admin so it's never indexed even if someone links it.
export function useRobotsMeta(content: string) {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = content
    document.head.appendChild(meta)
    return () => {
      document.head.removeChild(meta)
    }
  }, [content])
}
