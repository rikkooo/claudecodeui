import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const LIGHT = 'light';
const DARK = 'dark';
const CYBERPUNK = 'cyberpunk';
const THEMES = [LIGHT, DARK, CYBERPUNK];

const META_THEME_COLOR = {
  [LIGHT]: '#ffffff',
  [DARK]: '#0c1117',
  [CYBERPUNK]: '#111012',
};

function applyThemeToDom(theme) {
  const root = document.documentElement;
  root.classList.remove('dark', 'cyberpunk');
  if (theme === DARK) {
    root.classList.add('dark');
  } else if (theme === CYBERPUNK) {
    root.classList.add('dark', 'cyberpunk');
  }

  const statusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (statusBar) {
    statusBar.setAttribute('content', theme === LIGHT ? 'default' : 'black-translucent');
  }

  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    themeColor.setAttribute('content', META_THEME_COLOR[theme] ?? META_THEME_COLOR[LIGHT]);
  }
}

function initialTheme() {
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null;
  if (saved && THEMES.includes(saved)) return saved;
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
  }
  return LIGHT;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(initialTheme);

  useEffect(() => {
    applyThemeToDom(theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* noop — private mode, etc. */
    }
  }, [theme]);

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (event) => {
      const saved = localStorage.getItem('theme');
      if (!saved) {
        setThemeState(event.matches ? DARK : LIGHT);
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const setTheme = (next) => {
    if (!THEMES.includes(next)) return;
    setThemeState(next);
  };

  const toggleDarkMode = () => {
    setThemeState((prev) => (prev === LIGHT ? DARK : LIGHT));
  };

  const value = {
    theme,
    setTheme,
    availableThemes: THEMES,
    isDarkMode: theme !== LIGHT,
    toggleDarkMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
