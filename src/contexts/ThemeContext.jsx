import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext();

const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }
  return context;
};

const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    // Get saved theme from localStorage, default to 'light'
    const saved = localStorage.getItem('themeMode');
    return saved || 'light';
  });

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Create MUI theme based on mode
  const theme = createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // Light mode colors
            primary: {
              main: '#1976d2',
            },
            background: {
              default: '#f5f5f5',
              paper: '#ffffff',
            },
          }
        : {
            // Dark mode colors
            primary: {
              main: '#90caf9',
            },
            background: {
              default: '#121212',
              paper: '#1e1e1e',
            },
          }),
    },
  });

  const value = {
    mode,
    toggleMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

// Export the hook separately to avoid Fast Refresh issues
// eslint-disable-next-line react-refresh/only-export-components
export { useThemeMode };

// Default export the main component
export default ThemeModeProvider;
