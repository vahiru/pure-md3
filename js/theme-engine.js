import { themeFromSourceColor, applyTheme, hexFromArgb } from 'https://esm.run/@material/material-color-utilities';

const colorInput = document.getElementById('source-color');
const colorValueSpan = document.getElementById('source-color-value');
const darkModeToggle = document.getElementById('dark-mode-toggle');

const STORAGE_KEY = 'm3-pure-theme';

// 1. Theme Update Logic
function updateTheme(sourceColor, mode) {
  const theme = themeFromSourceColor(sourceColor);
  
  let isDark = mode === 'dark';
  if (mode === 'auto') {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  // Apply all theme variables automatically
  applyTheme(theme, { target: document.body, dark: isDark });
  
  // --- BUG FIX: Explicitly set surface color ---
  const scheme = isDark ? theme.schemes.dark : theme.schemes.light;
  const surface = hexFromArgb(scheme.surface);
  document.body.style.setProperty('--md-sys-color-surface', surface);
  // --- End of Bug Fix ---

  document.body.classList.toggle('dark-theme', isDark);
  document.body.classList.toggle('light-theme', !isDark);
  
  colorValueSpan.textContent = colorInput.value.toUpperCase();
  savePreferences();
}

// 2. Persistence
function savePreferences() {
  const prefs = {
    color: colorInput.value,
    mode: getSelectedMode()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

function loadPreferences() {
  const prefs = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (prefs) {
    colorInput.value = prefs.color;
    setSelectedMode(prefs.mode);
  } else {
    // Default to 'auto' if no preference is saved
    setSelectedMode('auto');
  }
  
  // Initial theme render
  const sourceColor = parseInt(colorInput.value.replace('#', ''), 16);
  updateTheme(sourceColor, prefs?.mode || 'auto');
}

// Helper functions for segmented button
function getSelectedMode() {
  const selectedButton = darkModeToggle.querySelector('md-segmented-button[selected]');
  return selectedButton ? selectedButton.getAttribute('value') : 'auto';
}

function setSelectedMode(mode) {
  // Deselect all buttons first
  darkModeToggle.querySelectorAll('md-segmented-button').forEach(btn => {
    btn.removeAttribute('selected');
  });
  // Select the correct one
  const buttonToSelect = darkModeToggle.querySelector(`md-segmented-button[value="${mode}"]`);
  if (buttonToSelect) {
    buttonToSelect.setAttribute('selected', '');
  }
}

// 3. Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // --- UPDATED: Listen on the new sidebar trigger ---
  const themeTrigger = document.getElementById('theme-trigger');
  const themeDialog = document.getElementById('theme-dialog');

  if (themeTrigger && themeDialog) {
    themeTrigger.addEventListener('click', () => {
      themeDialog.show();
    });
  }
  // --- End of Update ---

  if (!colorInput || !darkModeToggle) {
    console.error('Theme control elements not found.');
    return;
  }
  
  // Load saved preferences on startup
  loadPreferences();

  // Listen for color changes
  colorInput.addEventListener('input', () => {
    const sourceColor = parseInt(colorInput.value.replace('#', ''), 16);
    updateTheme(sourceColor, getSelectedMode());
  });

  // Listen for dark mode changes
  darkModeToggle.addEventListener('segmented-button-set-selection', (e) => {
    const newMode = e.detail.button.getAttribute('value');
    const sourceColor = parseInt(colorInput.value.replace('#', ''), 16);
    setSelectedMode(newMode); // Manually update selection state for consistency
    updateTheme(sourceColor, newMode);
  });
  
  // Listen for OS theme changes (for 'auto' mode)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getSelectedMode() === 'auto') {
      const sourceColor = parseInt(colorInput.value.replace('#', ''), 16);
      updateTheme(sourceColor, 'auto');
    }
  });
});
