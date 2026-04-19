import type { CSSProperties } from 'react';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CYBER_BG = '#18171a';
const CYBER_FG = '#e6eaf0';
const CYBER_COMMENT = '#7c7c85';
const CYBER_LAVENDER = '#c5a3e5';
const CYBER_INDIGO = '#9a88ff';
const CYBER_SAGE = '#a7c47a';
const CYBER_AMBER = '#e8d07a';
const CYBER_ROSE = '#e5a3b8';
const CYBER_PUNCT = '#9a9aa5';

type PrismStyle = Record<string, CSSProperties>;

export const cyberpunkSyntax: PrismStyle = {
  ...oneDark,
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    color: CYBER_FG,
    background: CYBER_BG,
    textShadow: 'none',
  },
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    color: CYBER_FG,
    background: CYBER_BG,
    textShadow: 'none',
  },
  ':not(pre) > code[class*="language-"]': {
    background: CYBER_BG,
  },
  comment: { color: CYBER_COMMENT, fontStyle: 'italic' },
  prolog: { color: CYBER_COMMENT },
  doctype: { color: CYBER_COMMENT },
  cdata: { color: CYBER_COMMENT },
  punctuation: { color: CYBER_PUNCT },
  property: { color: CYBER_LAVENDER },
  tag: { color: CYBER_LAVENDER },
  boolean: { color: CYBER_AMBER },
  number: { color: CYBER_AMBER },
  constant: { color: CYBER_ROSE },
  symbol: { color: CYBER_ROSE },
  deleted: { color: CYBER_ROSE },
  selector: { color: CYBER_SAGE },
  'attr-name': { color: CYBER_AMBER },
  string: { color: CYBER_SAGE },
  char: { color: CYBER_SAGE },
  builtin: { color: CYBER_LAVENDER },
  inserted: { color: CYBER_SAGE },
  operator: { color: CYBER_INDIGO },
  entity: { color: CYBER_LAVENDER, cursor: 'help' },
  url: { color: CYBER_INDIGO },
  '.language-css .token.string': { color: CYBER_SAGE },
  '.style .token.string': { color: CYBER_SAGE },
  atrule: { color: CYBER_LAVENDER },
  'attr-value': { color: CYBER_SAGE },
  keyword: { color: CYBER_LAVENDER },
  function: { color: CYBER_INDIGO },
  'class-name': { color: CYBER_AMBER },
  regex: { color: CYBER_ROSE },
  important: { color: CYBER_ROSE, fontWeight: 'bold' },
  variable: { color: CYBER_FG },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
};
