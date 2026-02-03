export const colors = {
  // Primary palette - Pagaleve Cyan Blue
  primary: {
    main: '#0693E3',
    light: '#39B5F5',
    dark: '#0574B3',
    contrast: '#FFFFFF',
  },

  // Secondary palette - Pagaleve Purple
  secondary: {
    main: '#9B51E0',
    light: '#B57EF0',
    dark: '#7C41B3',
    contrast: '#FFFFFF',
  },

  // Neutral palette
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
  },

  // Semantic colors
  success: {
    main: '#00D084',
    light: '#34E0A1',
    dark: '#00A86B',
    contrast: '#FFFFFF',
  },

  error: {
    main: '#CF2E2E',
    light: '#E25858',
    dark: '#A82424',
    contrast: '#FFFFFF',
  },

  warning: {
    main: '#FF6900',
    light: '#FF8A3D',
    dark: '#CC5400',
    contrast: '#FFFFFF',
  },

  info: {
    main: '#0693E3',
    light: '#39B5F5',
    dark: '#0574B3',
    contrast: '#FFFFFF',
  },

  // Background colors
  background: {
    default: '#FFFFFF',
    paper: '#F8FAFC',
    elevated: '#FFFFFF',
  },

  // Text colors
  text: {
    primary: '#0F172A',
    secondary: '#64748B',
    disabled: '#94A3B8',
    inverse: '#FFFFFF',
  },

  // Border colors
  border: {
    default: '#E2E8F0',
    focus: '#0693E3',
    error: '#CF2E2E',
  },
} as const;

export type Colors = typeof colors;
