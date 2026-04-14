/**
 * AmravatiTransit Admin Panel Design System
 * Rapido-inspired dark UI with comprehensive design tokens
 * 
 * This file exports all design system constants, utilities, and presets
 * organized by category for consistent UI implementation.
 */

// ============================================================================
// COLORS
// ============================================================================

export const adminColors = {
  // Backgrounds
  background: {
    page: '#0D0D0D',      // Page background
    card: '#1A1A1A',      // Card/panel background
    elevated: '#222222',  // Elevated card (hover)
    sidebar: '#111111',   // Sidebar background
  },

  // Primary Accent
  primary: {
    base: '#FFD000',      // Primary yellow accent
    hover: '#E6BB00',     // Accent on hover
    light: '#FFD00022',   // 13% opacity
  },

  // Status Colors
  status: {
    danger: '#FF4444',
    success: '#22C55E',
    warning: '#FF9900',
    info: '#3B82F6',
  },

  // Borders & Dividers
  border: {
    base: '#2A2A2A',
    muted: '#1A1A1A',
  },

  // Text
  text: {
    primary: '#FFFFFF',        // Primary text
    secondary: '#E5E5E5',      // Body text
    muted: '#888888',          // Muted/label text
    inverse: '#0D0D0D',        // Text on primary accent
  },

  // Semantic backgrounds for status badges
  semanticBg: {
    warning: '#FF990022',      // Warning with opacity
    danger: '#FF444422',       // Danger with opacity
  },
};

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const adminTypography = {
  // Font families
  fontFamily: {
    base: 'Inter, system-ui, -apple-system, sans-serif',
  },

  // Font weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Text styles
  styles: {
    pageTitle: {
      fontSize: '22px',
      fontWeight: 600,
      color: adminColors.text.primary,
      lineHeight: '1.4',
    },
    sectionHeading: {
      fontSize: '16px',
      fontWeight: 600,
      color: adminColors.text.primary,
      lineHeight: '1.5',
    },
    cardLabel: {
      fontSize: '12px',
      fontWeight: 500,
      color: adminColors.text.muted,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      lineHeight: '1.6',
    },
    body: {
      fontSize: '14px',
      fontWeight: 400,
      color: adminColors.text.secondary,
      lineHeight: '1.6',
    },
    caption: {
      fontSize: '12px',
      fontWeight: 400,
      color: adminColors.text.muted,
      lineHeight: '1.5',
    },
  },
};

// ============================================================================
// SPACING & SIZING
// ============================================================================

export const adminSpacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
  xxxl: '40px',
};

export const adminSizing = {
  // Header
  headerHeight: '56px',

  // Sidebar
  sidebarWidth: '240px',
  sidebarItemHeight: '44px',

  // Input/Button sizes
  inputHeight: '40px',
  buttonHeight: '40px',
  buttonSmall: '32px',

  // Grid gaps
  gridGap: '16px',
  gridGapSmall: '12px',
};

// ============================================================================
// BORDERS & RADIUS
// ============================================================================

export const adminBorders = {
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  width: {
    thin: '1px',
    medium: '2px',
  },
};

// ============================================================================
// SHADOWS
// ============================================================================

export const adminShadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
  primaryGlow: '0 0 20px rgba(255, 208, 0, 0.15)',
  dangerGlow: '0 0 20px rgba(255, 68, 68, 0.15)',
};

// ============================================================================
// TRANSITIONS & ANIMATIONS
// ============================================================================

export const adminTransitions = {
  fast: '150ms ease-in-out',
  normal: '200ms ease-in-out',
  slow: '300ms ease-in-out',
  slowest: '500ms ease-in-out',
};

// ============================================================================
// Z-INDEX
// ============================================================================

export const adminZIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  sidebar: 30,
  header: 40,
  modal: 50,
  tooltip: 60,
  notification: 70,
};

// ============================================================================
// COMPONENT PRESETS (CSS-in-JS / Tailwind utilities)
// ============================================================================

export const adminComponents = {
  // Input Fields
  input: {
    base: {
      backgroundColor: adminColors.background.elevated,
      border: `${adminBorders.width.thin} solid ${adminColors.border.base}`,
      color: adminColors.text.secondary,
      borderRadius: adminBorders.radius.lg,
      height: adminSizing.inputHeight,
      padding: `0 ${adminSpacing.md}`,
      fontSize: adminTypography.styles.body.fontSize,
      fontFamily: adminTypography.fontFamily.base,
      transition: `border-color ${adminTransitions.normal}, background-color ${adminTransitions.normal}`,
    },
    focus: {
      borderColor: adminColors.primary.base,
      outlineColor: 'transparent',
      backgroundColor: adminColors.background.card,
    },
    disabled: {
      backgroundColor: adminColors.border.muted,
      color: adminColors.text.muted,
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },

  // Primary Button
  buttonPrimary: {
    base: {
      backgroundColor: adminColors.primary.base,
      color: adminColors.text.inverse,
      fontWeight: adminTypography.fontWeight.semibold,
      borderRadius: adminBorders.radius.lg,
      height: adminSizing.buttonHeight,
      border: 'none',
      cursor: 'pointer',
      fontSize: adminTypography.styles.body.fontSize,
      fontFamily: adminTypography.fontFamily.base,
      transition: `background-color ${adminTransitions.normal}, box-shadow ${adminTransitions.normal}`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: `0 ${adminSpacing.lg}`,
    },
    hover: {
      backgroundColor: adminColors.primary.hover,
      boxShadow: adminShadows.primaryGlow,
    },
    active: {
      backgroundColor: '#E6BB00',
      transform: 'scale(0.98)',
    },
    disabled: {
      backgroundColor: adminColors.border.base,
      color: adminColors.text.muted,
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },

  // Ghost Button (outline)
  buttonGhost: {
    base: {
      border: `${adminBorders.width.thin} solid ${adminColors.border.base}`,
      backgroundColor: 'transparent',
      color: adminColors.text.secondary,
      fontWeight: adminTypography.fontWeight.normal,
      borderRadius: adminBorders.radius.lg,
      height: adminSizing.buttonHeight,
      cursor: 'pointer',
      fontSize: adminTypography.styles.body.fontSize,
      fontFamily: adminTypography.fontFamily.base,
      transition: `all ${adminTransitions.normal}`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: `0 ${adminSpacing.lg}`,
    },
    hover: {
      borderColor: adminColors.primary.base,
      color: adminColors.primary.base,
      backgroundColor: adminColors.primary.light,
    },
  },

  // Danger Button
  buttonDanger: {
    base: {
      backgroundColor: adminColors.status.danger,
      color: '#FFFFFF',
      fontWeight: adminTypography.fontWeight.semibold,
      borderRadius: adminBorders.radius.lg,
      height: adminSizing.buttonHeight,
      border: 'none',
      cursor: 'pointer',
      fontSize: adminTypography.styles.body.fontSize,
      fontFamily: adminTypography.fontFamily.base,
      transition: `all ${adminTransitions.normal}`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: `0 ${adminSpacing.lg}`,
    },
    hover: {
      backgroundColor: '#FF2222',
      boxShadow: adminShadows.dangerGlow,
    },
  },

  // Table styles
  table: {
    base: {
      backgroundColor: adminColors.background.card,
      borderCollapse: 'collapse',
      width: '100%',
      borderRadius: adminBorders.radius.lg,
      overflow: 'hidden',
    },
    header: {
      backgroundColor: adminColors.background.sidebar,
      borderBottom: `${adminBorders.width.thin} solid ${adminColors.border.base}`,
    },
    headerCell: {
      color: adminColors.text.muted,
      fontWeight: adminTypography.fontWeight.semibold,
      fontSize: '12px',
      padding: adminSpacing.md,
      textAlign: 'left',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    row: {
      borderBottom: `${adminBorders.width.thin} solid ${adminColors.border.base}`,
      transition: `background-color ${adminTransitions.normal}`,
    },
    rowHover: {
      backgroundColor: adminColors.background.elevated,
    },
    cell: {
      color: adminColors.text.secondary,
      padding: adminSpacing.md,
      fontSize: adminTypography.styles.body.fontSize,
    },
  },

  // Badge/Pill
  badge: {
    active: {
      backgroundColor: adminColors.primary.base,
      color: adminColors.text.inverse,
      padding: `${adminSpacing.xs} ${adminSpacing.md}`,
      borderRadius: adminBorders.radius.full,
      fontSize: '11px',
      fontWeight: adminTypography.fontWeight.semibold,
      display: 'inline-block',
      whiteSpace: 'nowrap',
    },
    inactive: {
      backgroundColor: adminColors.border.base,
      color: adminColors.text.muted,
      padding: `${adminSpacing.xs} ${adminSpacing.md}`,
      borderRadius: adminBorders.radius.full,
      fontSize: '11px',
      fontWeight: adminTypography.fontWeight.semibold,
      display: 'inline-block',
      whiteSpace: 'nowrap',
    },
    warning: {
      backgroundColor: adminColors.semanticBg.warning,
      color: adminColors.status.warning,
      padding: `${adminSpacing.xs} ${adminSpacing.md}`,
      borderRadius: adminBorders.radius.full,
      fontSize: '11px',
      fontWeight: adminTypography.fontWeight.semibold,
      display: 'inline-block',
      whiteSpace: 'nowrap',
    },
    danger: {
      backgroundColor: adminColors.semanticBg.danger,
      color: adminColors.status.danger,
      padding: `${adminSpacing.xs} ${adminSpacing.md}`,
      borderRadius: adminBorders.radius.full,
      fontSize: '11px',
      fontWeight: adminTypography.fontWeight.semibold,
      display: 'inline-block',
      whiteSpace: 'nowrap',
    },
  },

  // Card
  card: {
    base: {
      backgroundColor: adminColors.background.card,
      border: `${adminBorders.width.thin} solid ${adminColors.border.base}`,
      borderRadius: adminBorders.radius.lg,
      padding: adminSpacing.lg,
      transition: `all ${adminTransitions.normal}`,
    },
    hover: {
      backgroundColor: adminColors.background.elevated,
      borderColor: adminColors.border.base,
      boxShadow: adminShadows.lg,
    },
  },

  // Sidebar item
  sidebarItem: {
    base: {
      height: adminSizing.sidebarItemHeight,
      display: 'flex',
      alignItems: 'center',
      padding: `0 ${adminSpacing.lg}`,
      color: adminColors.text.secondary,
      cursor: 'pointer',
      transition: `all ${adminTransitions.normal}`,
      fontSize: adminTypography.styles.body.fontSize,
      fontFamily: adminTypography.fontFamily.base,
    },
    active: {
      backgroundColor: adminColors.primary.light,
      color: adminColors.primary.base,
      fontWeight: adminTypography.fontWeight.semibold,
    },
    hover: {
      backgroundColor: adminColors.background.elevated,
    },
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create a consistent transition string
 * @param property - CSS property to transition
 * @param duration - Duration key ('fast', 'normal', 'slow', 'slowest')
 * @returns Transition CSS value
 */
export function createAdminTransition(
  property: string = 'all',
  duration: keyof typeof adminTransitions = 'normal'
): string {
  return `${property} ${adminTransitions[duration]}`;
}

/**
 * Create a glowing shadow effect
 * @param color - Hex color to glow
 * @param intensity - Opacity intensity (0-100)
 * @returns Box shadow CSS value
 */
export function createAdminGlow(color: string, intensity: number = 15): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const opacity = intensity / 100;
  return `0 0 20px rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Create badge styling for different variants
 * @param variant - Badge variant ('active', 'inactive', 'warning', 'danger')
 * @returns Object with badge styles
 */
export function getAdminBadgeStyle(
  variant: 'active' | 'inactive' | 'warning' | 'danger'
): Record<string, any> {
  return adminComponents.badge[variant];
}

/**
 * Create button styling for different variants
 * @param variant - Button variant ('primary', 'ghost', 'danger')
 * @returns Object with button states
 */
export function getAdminButtonStyle(
  variant: 'primary' | 'ghost' | 'danger'
): Record<string, any> {
  if (variant === 'primary') return adminComponents.buttonPrimary;
  if (variant === 'ghost') return adminComponents.buttonGhost;
  if (variant === 'danger') return adminComponents.buttonDanger;
  return adminComponents.buttonPrimary;
}

/**
 * Create a responsive grid with consistent gap
 * @param columns - Number of columns on desktop
 * @param gap - Gap size ('small' or 'normal')
 * @returns CSS Grid properties
 */
export function createAdminGrid(
  columns: number = 3,
  gap: 'small' | 'normal' = 'normal'
): Record<string, any> {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(300px, 1fr))`,
    gap: gap === 'small' ? adminSizing.gridGapSmall : adminSizing.gridGap,
  };
}

// ============================================================================
// PRESET LAYOUTS
// ============================================================================

export const adminLayouts = {
  // Main admin layout with sidebar
  mainLayout: {
    wrapper: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: adminColors.background.page,
      fontFamily: adminTypography.fontFamily.base,
    },
    sidebar: {
      position: 'fixed',
      left: 0,
      top: 0,
      width: adminSizing.sidebarWidth,
      height: '100vh',
      backgroundColor: adminColors.background.sidebar,
      borderRight: `${adminBorders.width.thin} solid ${adminColors.border.base}`,
      overflowY: 'auto',
      overflowX: 'hidden',
      zIndex: adminZIndex.sidebar,
    },
    content: {
      marginLeft: adminSizing.sidebarWidth,
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      height: adminSizing.headerHeight,
      backgroundColor: adminColors.background.sidebar,
      borderBottom: `${adminBorders.width.thin} solid ${adminColors.border.base}`,
      display: 'flex',
      alignItems: 'center',
      paddingLeft: adminSpacing.xl,
      paddingRight: adminSpacing.xl,
      zIndex: adminZIndex.header,
    },
    main: {
      flex: 1,
      padding: adminSpacing.xl,
      overflowY: 'auto',
    },
  },

  // Page container
  pageContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
  },

  // Form group
  formGroup: {
    marginBottom: adminSpacing.xl,
  },

  // Section
  section: {
    marginBottom: adminSpacing.xxl,
  },
};

// ============================================================================
// EXPORT ALL AS DEFAULT
// ============================================================================

export const adminDesignSystem = {
  colors: adminColors,
  typography: adminTypography,
  spacing: adminSpacing,
  sizing: adminSizing,
  borders: adminBorders,
  shadows: adminShadows,
  transitions: adminTransitions,
  zIndex: adminZIndex,
  components: adminComponents,
  layouts: adminLayouts,
};

export default adminDesignSystem;
