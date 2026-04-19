import type { ITerminalOptions } from '@xterm/xterm';

export const CODEX_DEVICE_AUTH_URL = 'https://auth.openai.com/codex/device';
export const SHELL_RESTART_DELAY_MS = 200;
export const TERMINAL_INIT_DELAY_MS = 100;
export const TERMINAL_RESIZE_DELAY_MS = 50;

// CLI prompt overlay detection
export const PROMPT_DEBOUNCE_MS = 500;
export const PROMPT_BUFFER_SCAN_LINES = 20;
export const PROMPT_OPTION_SCAN_LINES = 15;
export const PROMPT_MAX_OPTIONS = 5;
export const PROMPT_MIN_OPTIONS = 2;

export const TERMINAL_OPTIONS: ITerminalOptions = {
  cursorBlink: true,
  fontSize: 14,
  fontFamily: '"JetBrainsMono Nerd Font", "JetBrains Mono", Menlo, Monaco, "Courier New", monospace',
  allowProposedApi: true,
  allowTransparency: false,
  convertEol: true,
  scrollback: 10000,
  tabStopWidth: 4,
  windowsMode: false,
  macOptionIsMeta: true,
  macOptionClickForcesSelection: true,
  // Cyberpunk-relax palette — mirrors the CloudCLI UI theme + oh-my-posh prompt so
  // ANSI-coloring tools (ls, git, grep, bat, oh-my-posh itself) share one hue family.
  theme: {
    background: '#18171a',
    foreground: '#e6eaf0',
    cursor: '#c5a3e5',
    cursorAccent: '#18171a',
    selectionBackground: '#4e3fb8',
    selectionForeground: '#ffffff',
    black: '#18171a',
    red: '#e5615d',
    green: '#a7c47a',
    yellow: '#e8d07a',
    blue: '#865df5',
    magenta: '#c5a3e5',
    cyan: '#7ec4cf',
    white: '#e6eaf0',
    brightBlack: '#7c7c85',
    brightRed: '#f07a76',
    brightGreen: '#bfd891',
    brightYellow: '#f0dd8a',
    brightBlue: '#a080f5',
    brightMagenta: '#d7bcef',
    brightCyan: '#9dd5dd',
    brightWhite: '#ffffff',
  },
};
