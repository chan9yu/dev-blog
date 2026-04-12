/**
 * Blocking script to initialize theme before first paint
 * This prevents FOUC (Flash of Unstyled Content) by:
 * 1. Reading theme from localStorage (client preference)
 * 2. Syncing to cookie for SSR
 * 3. Applying dark class immediately
 * 4. Falling back to system preference if no stored theme
 */
export const themeInitScript = `
(function() {
  const THEME_KEY = 'theme';
  const THEME_MAX_AGE = 31536000;

  function setCookie(theme) {
    document.cookie = THEME_KEY + '=' + theme + '; path=/; max-age=' + THEME_MAX_AGE + '; SameSite=Lax';
  }

  function applyTheme(isDark) {
    document.documentElement.classList.toggle('dark', isDark);
  }

  var storedTheme = localStorage.getItem(THEME_KEY);

  if (storedTheme) {
    setCookie(storedTheme);
    applyTheme(storedTheme === 'dark');
  } else {
    var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = isDark ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, theme);
    setCookie(theme);
    applyTheme(isDark);
  }
})();
`
	.replace(/\s+/g, " ")
	.trim();
