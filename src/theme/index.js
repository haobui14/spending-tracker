// Central theme configuration for the Spending Tracker application
// This file consolidates all colors, spacing, typography, and component styles

// ====================
// COLOR PALETTE
// ====================

export const colors = {
  // Primary Brand Colors
  primary: {
    main: '#219a6f',
    light: '#4caf8f',
    dark: '#1a7a5a',
    contrastText: '#ffffff',
  },

  // Financial Status Colors
  financial: {
    paid: {
      main: '#059669',
      light: '#10b981',
      dark: '#047857',
      background: '#d1fae5',
      border: '#a7f3d0',
      text: '#065f46',
    },
    unpaid: {
      main: '#dc2626',
      light: '#ef4444',
      dark: '#b91c1c',
      background: '#fee2e2',
      border: '#fecaca',
      text: '#991b1b',
    },
    partial: {
      main: '#d97706',
      light: '#f59e0b',
      dark: '#b45309',
      background: '#fef3c7',
      border: '#fde68a',
      text: '#92400e',
    },
  },

  // Neutral Colors (Professional)
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },

  // Semantic Colors
  semantic: {
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
      background: '#d1fae5',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
      background: '#fef3c7',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
      background: '#fee2e2',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
      background: '#dbeafe',
    },
  },

  // Background Colors
  background: {
    default: '#f8fafc',
    paper: '#ffffff',
    elevated: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Text Colors
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
    tertiary: '#94a3b8',
    inverse: '#ffffff',
  },

  // Border Colors
  border: {
    light: '#e2e8f0',
    medium: '#cbd5e1',
    dark: '#94a3b8',
  },

  // Calendar Specific Colors
  calendar: {
    current: '#2563eb',
    selected: '#1976d2',
    gradient: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(45deg, #1976d2 0%, #1565c0 100%)',
    },
  },

  // NavBar Colors
  navbar: {
    background: '#ffffff',
    text: '#000000',
    border: '#e0eafc',
    drawer: '#232a3a',
    hover: 'rgba(33,154,111,0.08)',
    hoverStrong: 'rgba(33,154,111,0.15)',
    logout: '#ff4d4d',
  },
};

// ====================
// TYPOGRAPHY
// ====================

export const typography = {
  fontFamily: {
    primary: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    system: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
  
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// ====================
// SPACING
// ====================

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

// ====================
// SHADOWS
// ====================

export const shadows = {
  sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
  md: '0 4px 12px rgba(0, 0, 0, 0.1)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.1)',
  xl: '0 12px 32px rgba(0, 0, 0, 0.1)',
  '2xl': '0 20px 40px rgba(0, 0, 0, 0.15)',
};

// ====================
// BORDER RADIUS
// ====================

export const borderRadius = {
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: '50%',
};

// ====================
// BREAKPOINTS
// ====================

export const breakpoints = {
  xs: '0px',
  sm: '600px',
  md: '900px',
  lg: '1200px',
  xl: '1536px',
};

// ====================
// COMPONENT STYLES
// ====================

export const components = {
  // Card Styles
  card: {
    default: {
      backgroundColor: colors.background.paper,
      border: `1px solid ${colors.border.light}`,
      borderRadius: borderRadius.md,
      boxShadow: shadows.sm,
      transition: 'box-shadow 0.2s ease',
      '&:hover': {
        boxShadow: shadows.md,
      },
    },
    elevated: {
      backgroundColor: colors.background.paper,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.lg,
      border: 'none',
    },
  },

  // Button Styles
  button: {
    primary: {
      backgroundColor: colors.primary.main,
      color: colors.primary.contrastText,
      fontWeight: typography.fontWeight.semibold,
      borderRadius: borderRadius.md,
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: colors.primary.dark,
      },
    },
    financial: {
      paid: {
        backgroundColor: colors.financial.paid.background,
        color: colors.financial.paid.text,
        border: `1px solid ${colors.financial.paid.border}`,
      },
      unpaid: {
        backgroundColor: colors.financial.unpaid.background,
        color: colors.financial.unpaid.text,
        border: `1px solid ${colors.financial.unpaid.border}`,
      },
      partial: {
        backgroundColor: colors.financial.partial.background,
        color: colors.financial.partial.text,
        border: `1px solid ${colors.financial.partial.border}`,
      },
    },
  },

  // Chip Styles
  chip: {
    paid: {
      backgroundColor: colors.financial.paid.background,
      color: colors.financial.paid.text,
      border: `1px solid ${colors.financial.paid.border}`,
      fontWeight: typography.fontWeight.medium,
    },
    unpaid: {
      backgroundColor: colors.financial.unpaid.background,
      color: colors.financial.unpaid.text,
      border: `1px solid ${colors.financial.unpaid.border}`,
      fontWeight: typography.fontWeight.medium,
    },
    partial: {
      backgroundColor: colors.financial.partial.background,
      color: colors.financial.partial.text,
      border: `1px solid ${colors.financial.partial.border}`,
      fontWeight: typography.fontWeight.medium,
    },
  },

  // Form Styles
  form: {
    input: {
      borderRadius: borderRadius.md,
      border: `1px solid ${colors.border.light}`,
      '&:focus': {
        borderColor: colors.primary.main,
        boxShadow: `0 0 0 2px ${colors.primary.main}20`,
      },
    },
  },

  // List Styles
  list: {
    item: {
      borderRadius: borderRadius.md,
      border: `1px solid ${colors.border.light}`,
      backgroundColor: colors.background.paper,
      transition: 'background-color 0.2s ease',
      '&:hover': {
        backgroundColor: colors.neutral[50],
      },
    },
  },

  // Header Styles
  header: {
    professional: {
      backgroundColor: colors.background.paper,
      borderBottom: `2px solid ${colors.border.light}`,
      boxShadow: shadows.sm,
    },
  },

  // Status Indicator Styles
  status: {
    container: {
      backgroundColor: colors.background.paper,
      border: `1px solid ${colors.border.light}`,
      borderRadius: borderRadius.md,
      padding: `${spacing.md}px ${spacing.lg}px`,
    },
  },
};

// ====================
// GRADIENTS
// ====================

export const gradients = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  success: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
  info: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
  warning: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
  error: 'linear-gradient(135deg, #FF5722 0%, #D84315 100%)',
  calendar: {
    light: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    dark: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
  },
};

// ====================
// RESPONSIVE HELPERS
// ====================

export const responsive = {
  mobile: {
    padding: spacing.md,
    fontSize: typography.fontSize.sm,
  },
  desktop: {
    padding: spacing.xl,
    fontSize: typography.fontSize.base,
  },
};

// ====================
// ANIMATION
// ====================

export const animation = {
  transition: {
    fast: '0.15s ease',
    normal: '0.2s ease',
    slow: '0.3s ease',
  },
  
  hover: {
    transform: 'translateY(-2px)',
    boxShadow: shadows.lg,
  },

  focus: {
    outline: `2px solid ${colors.primary.main}`,
    outlineOffset: '2px',
  },
};

// ====================
// UTILITY FUNCTIONS
// ====================

export const utils = {
  // Get financial status color
  getFinancialStatusColor: (status) => {
    switch (status) {
      case 'paid':
        return colors.financial.paid;
      case 'partial':
        return colors.financial.partial;
      case 'unpaid':
        return colors.financial.unpaid;
      default:
        return colors.neutral[400];
    }
  },

  // Get financial status chip styles
  getFinancialStatusChip: (status) => {
    return components.chip[status] || components.chip.unpaid;
  },

  // Get responsive spacing
  getResponsiveSpacing: (isMobile, desktopValue, mobileValue) => {
    return isMobile ? (mobileValue || desktopValue / 2) : desktopValue;
  },

  // Get responsive font size
  getResponsiveFontSize: (isMobile, desktopSize, mobileSize) => {
    return isMobile ? (mobileSize || desktopSize) : desktopSize;
  },

  // Create hover styles
  createHoverStyles: (baseStyles, hoverOverrides = {}) => ({
    ...baseStyles,
    transition: animation.transition.normal,
    '&:hover': {
      ...animation.hover,
      ...hoverOverrides,
    },
  }),
};

// ====================
// EXPORTS
// ====================

const theme = {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
  breakpoints,
  components,
  gradients,
  responsive,
  animation,
  utils,
};

export default theme;
