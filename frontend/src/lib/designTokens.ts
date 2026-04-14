/**
 * AmravatiTransit Design Tokens
 * Rapido-inspired dark transit app theme
 * Usage: Import and use in components, Tailwind config, and CSS
 */

// ─────────────────────────────────────────────────────────────
// COLOR PALETTE
// ─────────────────────────────────────────────────────────────
export const colors = {
  // Background Colors
  background: "#0D0D0D", // Primary dark background
  card: "#1A1A1A", // Layered dark cards
  overlay: "rgba(13, 13, 13, 0.9)", // Semi-transparent overlay
  
  // Primary Accent
  primary: "#FFD000", // Yellow accent
  primaryLight: "#FFE54D", // Lighter yellow for hover
  primaryDark: "#D4A400", // Darker yellow for pressed
  
  // Text Colors
  foreground: "#FFFFFF", // Primary text
  muted: "#A0A0A0", // Secondary text
  mutedLight: "#666666", // Lighter muted
  
  // Semantic Colors
  success: "#22C55E", // Green - success/on-time
  danger: "#EF4444", // Red - alerts/delayed
  warning: "#F59E0B", // Amber - warnings
  info: "#3B82F6", // Blue - information
  
  // Borders
  border: "rgba(255, 255, 255, 0.08)", // Subtle borders
  borderLight: "rgba(255, 255, 255, 0.12)", // Slightly visible borders
  borderHover: "rgba(255, 208, 0, 0.3)", // Hover state border
} as const;

// ─────────────────────────────────────────────────────────────
// SPACING SCALE
// ─────────────────────────────────────────────────────────────
export const spacing = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  "2xl": "2.5rem", // 40px
  "3xl": "3rem", // 48px
} as const;

// ─────────────────────────────────────────────────────────────
// BORDER RADIUS
// ─────────────────────────────────────────────────────────────
export const borderRadius = {
  none: "0",
  sm: "4px",
  base: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px", // Pill buttons
  "2xl": "24px", // Large rounded cards
  full: "9999px",
} as const;

// ─────────────────────────────────────────────────────────────
// TYPOGRAPHY
// ─────────────────────────────────────────────────────────────
export const typography = {
  // Font families
  fontFamily: {
    sans: "'Inter', 'Geist', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', sans-serif",
    mono: "'Monaco', 'Courier New', monospace",
  },
  
  // Font sizes
  fontSize: {
    xs: "12px",
    sm: "13px",
    base: "15px",
    lg: "18px",
    xl: "22px",
    "2xl": "26px",
    "3xl": "32px",
  },
  
  // Font weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    base: 1.5,
    relaxed: 1.75,
  },
} as const;

// ─────────────────────────────────────────────────────────────
// SHADOWS
// ─────────────────────────────────────────────────────────────
export const shadows = {
  none: "none",
  xs: "0 1px 2px rgba(0, 0, 0, 0.3)",
  sm: "0 2px 4px rgba(0, 0, 0, 0.3)",
  base: "0 4px 12px rgba(0, 0, 0, 0.4)",
  md: "0 8px 24px rgba(0, 0, 0, 0.5)",
  lg: "0 12px 32px rgba(0, 0, 0, 0.6)",
  
  // Colored shadows for emphasis
  primary: "0 0 12px rgba(255, 208, 0, 0.2)", // Yellow glow
  primaryStrong: "0 0 24px rgba(255, 208, 0, 0.3)",
  success: "0 0 12px rgba(34, 197, 94, 0.2)", // Green glow
  danger: "0 0 12px rgba(239, 68, 68, 0.2)", // Red glow
} as const;

// ─────────────────────────────────────────────────────────────
// TRANSITIONS & ANIMATIONS
// ─────────────────────────────────────────────────────────────
export const transitions = {
  durations: {
    fast: "150ms",
    base: "200ms",
    slow: "300ms",
    slower: "500ms",
  },
  
  timings: {
    linear: "linear",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  
  // Pre-combined transition strings
  default: "all 200ms ease-in-out",
  colors: "color 200ms ease-in-out, background-color 200ms ease-in-out",
  transform: "transform 200ms ease-in-out",
  smooth: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

// ─────────────────────────────────────────────────────────────
// COMPONENT SIZES
// ─────────────────────────────────────────────────────────────
export const sizes = {
  // Button sizes
  button: {
    sm: {
      height: "32px",
      padding: "0 12px",
      fontSize: "12px",
      borderRadius: "8px",
    },
    base: {
      height: "40px",
      padding: "0 16px",
      fontSize: "14px",
      borderRadius: "12px",
    },
    lg: {
      height: "48px",
      padding: "0 20px",
      fontSize: "16px",
      borderRadius: "14px",
    },
    fab: {
      size: "56px", // Floating action button
      borderRadius: "999px",
    },
  },
  
  // Input sizes
  input: {
    height: "44px",
    padding: "8px 16px",
    fontSize: "14px",
    borderRadius: "12px",
  },
  
  // Card sizes
  card: {
    sm: {
      padding: "12px",
      borderRadius: "12px",
    },
    base: {
      padding: "16px",
      borderRadius: "12px",
    },
    lg: {
      padding: "20px",
      borderRadius: "16px",
    },
  },
  
  // Navigation
  nav: {
    height: "64px", // Bottom nav height (mobile)
    topHeight: "56px", // Top nav height
  },
  
  // Icons
  icon: {
    sm: "16px",
    base: "20px",
    md: "24px",
    lg: "32px",
    xl: "48px",
  },
} as const;

// ─────────────────────────────────────────────────────────────
// BREAKPOINTS
// ─────────────────────────────────────────────────────────────
export const breakpoints = {
  xs: "320px",
  sm: "480px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// ─────────────────────────────────────────────────────────────
// Z-INDEX SCALE
// ─────────────────────────────────────────────────────────────
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1050,
  fixed: 1060,
  modalBackdrop: 1070,
  modal: 1080,
  popover: 1090,
  tooltip: 1100,
  notification: 1110,
  topbar: 40,
  sidebar: 30,
  nav: 50,
} as const;

// ─────────────────────────────────────────────────────────────
// PRESET STYLES (CSS-in-JS objects)
// ─────────────────────────────────────────────────────────────
export const presets = {
  // Card styles
  card: {
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: borderRadius.lg,
    padding: sizes.card.base.padding,
    boxShadow: shadows.xs,
  },
  
  // Button primary
  buttonPrimary: {
    backgroundColor: colors.primary,
    color: colors.background,
    fontWeight: typography.fontWeight.bold,
    borderRadius: borderRadius.md,
    cursor: "pointer",
    transition: transitions.default,
    "&:hover": {
      backgroundColor: colors.primaryLight,
      opacity: 0.9,
    },
    "&:active": {
      backgroundColor: colors.primaryDark,
      transform: "scale(0.98)",
    },
  },
  
  // Button secondary (outline)
  buttonSecondary: {
    backgroundColor: "transparent",
    color: colors.foreground,
    border: `2px solid ${colors.primary}`,
    fontWeight: typography.fontWeight.bold,
    borderRadius: borderRadius.md,
    cursor: "pointer",
    transition: transitions.default,
    "&:hover": {
      backgroundColor: "rgba(255, 208, 0, 0.08)",
    },
    "&:active": {
      backgroundColor: "rgba(255, 208, 0, 0.15)",
    },
  },
  
  // Input dark
  input: {
    backgroundColor: colors.background,
    color: colors.foreground,
    border: `1px solid ${colors.border}`,
    borderRadius: borderRadius.md,
    padding: "8px 16px",
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.sans,
    transition: transitions.default,
    "&:hover": {
      borderColor: colors.borderLight,
    },
    "&:focus": {
      outline: "none",
      borderColor: colors.primary,
      boxShadow: `0 0 8px ${colors.primary}20`,
    },
  },
  
  // Pill/rounded filter
  pill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    backgroundColor: colors.card,
    color: colors.muted,
    border: `1px solid ${colors.border}`,
    borderRadius: borderRadius.xl,
    cursor: "pointer",
    transition: transitions.default,
    fontWeight: typography.fontWeight.medium,
    "&:hover": {
      borderColor: colors.borderLight,
    },
    "&.active": {
      backgroundColor: colors.primary,
      color: colors.background,
      fontWeight: typography.fontWeight.bold,
    },
  },
} as const;

// ─────────────────────────────────────────────────────────────
// ANIMATION KEYFRAMES (CSS)
// ─────────────────────────────────────────────────────────────
export const keyframes = `
  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes slideDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  @keyframes heartbeat {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
` as const;

// ─────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────

/**
 * Create a consistent transition string
 */
export function createTransition(
  properties: string[] = ["all"],
  duration: keyof typeof transitions.durations = "base",
  timing: keyof typeof transitions.timings = "easeInOut"
): string {
  return properties
    .map((prop) => `${prop} ${transitions.durations[duration]} ${transitions.timings[timing]}`)
    .join(", ");
}

/**
 * Create a shadow with opacity
 */
export function createShadow(
  color: string,
  blur: number = 12,
  spread: number = 0,
  opacity: number = 0.2
): string {
  return `0 0 ${blur}px ${spread}px ${color}${Math.round(opacity * 255).toString(16).padStart(2, "0")}`;
}

/**
 * Create a consistent button style
 */
export function createButtonStyle(variant: "primary" | "secondary" | "ghost" = "primary") {
  const baseStyle = `
    font-weight: ${typography.fontWeight.bold};
    border-radius: ${borderRadius.md};
    cursor: pointer;
    transition: ${transitions.default};
    border: none;
    padding: ${sizes.button.base.padding};
    height: ${sizes.button.base.height};
    font-size: ${typography.fontSize.base};
  `;

  switch (variant) {
    case "primary":
      return `
        ${baseStyle}
        background-color: ${colors.primary};
        color: ${colors.background};
        &:hover {
          background-color: ${colors.primaryLight};
        }
        &:active {
          transform: scale(0.98);
        }
      `;
    case "secondary":
      return `
        ${baseStyle}
        background-color: transparent;
        color: ${colors.primary};
        border: 2px solid ${colors.primary};
        &:hover {
          background-color: rgba(255, 208, 0, 0.1);
        }
      `;
    case "ghost":
      return `
        ${baseStyle}
        background-color: transparent;
        color: ${colors.foreground};
        &:hover {
          background-color: ${colors.card};
        }
      `;
    default:
      return baseStyle;
  }
}

// ─────────────────────────────────────────────────────────────
// USAGE EXAMPLES (in comments)
// ─────────────────────────────────────────────────────────────
/*
// In React component:
import { colors, spacing, borderRadius, transitions } from '@/lib/designTokens';

const StyledDiv = styled.div`
  background-color: ${colors.card};
  padding: ${spacing.md};
  border-radius: ${borderRadius.lg};
  border: 1px solid ${colors.border};
  transition: ${transitions.default};
  
  &:hover {
    border-color: ${colors.borderHover};
  }
`;

// In Tailwind classes (already configured in tailwind.config.ts):
<div className="bg-card px-4 py-3 rounded-lg border border-white/8 hover:border-white/12 transition-all">

// Custom inline style:
const buttonStyle = createButtonStyle('primary');
*/

export default {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
  transitions,
  sizes,
  breakpoints,
  zIndex,
  presets,
  keyframes,
  createTransition,
  createShadow,
  createButtonStyle,
} as const;
