/**
 * Build-time shim for the `lowlight` package. See the aliases in vite.config.ts.
 *
 * Why this exists: `rehype-highlight` does `import {common, createLowlight}
 * from 'lowlight'` at module scope, and `lowlight`'s `common` export statically
 * pulls in ~38 highlight.js grammars (~190 KB). Because the import is static and
 * `common` is the documented default, no bundler can tree-shake it away — even
 * when we pass an explicit `languages` option that makes it entirely unused.
 *
 * So we swap the package for this module, which re-exports the real
 * `createLowlight` and an *empty* `common`. rehype-highlight then registers
 * exactly the grammars we hand it in lib/highlight.ts and nothing else.
 *
 * `lowlight-core` is a second alias pointing straight at lowlight's own
 * implementation file — a bare deep import is blocked by the package's
 * `exports` map, and that file only depends on highlight.js/lib/core, so it
 * carries no grammars with it.
 */
// @ts-expect-error — virtual specifier resolved by the vite alias.
export { createLowlight } from 'lowlight-core'

/**
 * Deliberately empty: every language we support is registered explicitly.
 * Anything unregistered renders as un-highlighted plain code.
 */
export const common = {}
