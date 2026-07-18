/**
 * Syntax-highlighting languages registered for blog posts.
 *
 * rehype-highlight defaults to highlight.js's "common" set — around 35
 * languages and ~190 KB of JS, most of which this site will never render. We
 * register only what actually appears in the posts; anything unregistered still
 * renders as plain code, just without colour.
 *
 * Adding a language you start writing about is one import plus one map entry.
 */
import bash from 'highlight.js/lib/languages/bash'
import csharp from 'highlight.js/lib/languages/csharp'
import css from 'highlight.js/lib/languages/css'
import dockerfile from 'highlight.js/lib/languages/dockerfile'
import ini from 'highlight.js/lib/languages/ini' // also covers .toml
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml' // also covers HTML
import yaml from 'highlight.js/lib/languages/yaml'

export const highlightLanguages = {
  bash,
  csharp,
  css,
  dockerfile,
  ini,
  javascript,
  json,
  sql,
  typescript,
  xml,
  yaml,
}
