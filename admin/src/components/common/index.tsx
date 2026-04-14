/**
 * Example Reusable Admin Components
 * These components implement the design system tokens
 */

import React from 'react';
import { adminColors, adminTypography, adminSpacing, adminBorders } from '@/lib/adminDesignTokens';

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, disabled, children, ...props }, ref) => {
    const variants = {
      primary: {
        backgroundColor: adminColors.primary.base,
        color: adminColors.text.inverse,
        '&:hover': { backgroundColor: adminColors.primary.hover },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: adminColors.text.secondary,
        border: `1px solid ${adminColors.border.base}`,
        '&:hover': { borderColor: adminColors.primary.base, color: adminColors.primary.base },
      },
      danger: {
        backgroundColor: adminColors.status.danger,
        color: '#FFFFFF',
        '&:hover': { backgroundColor: '#FF2222' },
      },
      success: {
        backgroundColor: adminColors.status.success,
        color: '#FFFFFF',
        '&:hover': { backgroundColor: '#1EA853' },
      },
    };

    const sizes = {
      sm: { height: '32px', fontSize: '12px', padding: '0 12px' },
      md: { height: '40px', fontSize: '14px', padding: '0 16px' },
      lg: { height: '48px', fontSize: '16px', padding: '0 24px' },
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        style={{
          ...variants[variant],
          ...sizes[size],
          borderRadius: adminBorders.radius.lg,
          fontWeight: 600,
          cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
          opacity: disabled || isLoading ? 0.5 : 1,
          transition: `all 200ms ease-in-out`,
          border: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: adminTypography.fontFamily.base,
        }}
        {...props}
      >
        {isLoading ? '...' : children}
      </button>
    );
  }
);

Button.displayName = 'Button';

// ============================================================================
// INPUT COMPONENT
// ============================================================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, ...props }, ref) => {
    return (
      <div style={{ marginBottom: adminSpacing.lg }}>
        {label && (
          <label
            style={{
              display: 'block',
              marginBottom: adminSpacing.sm,
              fontSize: adminTypography.styles.cardLabel.fontSize,
              fontWeight: adminTypography.fontWeight.medium,
              color: adminColors.text.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          style={{
            width: '100%',
            backgroundColor: adminColors.background.elevated,
            border: `1px solid ${error ? adminColors.status.danger : adminColors.border.base}`,
            color: adminColors.text.secondary,
            borderRadius: adminBorders.radius.lg,
            height: '40px',
            padding: `0 ${adminSpacing.md}`,
            fontSize: adminTypography.styles.body.fontSize,
            fontFamily: adminTypography.fontFamily.base,
            transition: `border-color 200ms, background-color 200ms`,
            boxSizing: 'border-box',
          }}
          {...props}
        />
        {error && (
          <p
            style={{
              marginTop: adminSpacing.xs,
              fontSize: '12px',
              color: adminColors.status.danger,
            }}
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p
            style={{
              marginTop: adminSpacing.xs,
              fontSize: '12px',
              color: adminColors.text.muted,
            }}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ============================================================================
// CARD COMPONENT
// ============================================================================

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, subtitle, children, footer }) => {
  return (
    <div
      style={{
        backgroundColor: adminColors.background.card,
        border: `1px solid ${adminColors.border.base}`,
        borderRadius: adminBorders.radius.lg,
        transition: `all 200ms ease-in-out`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = adminColors.background.elevated;
        e.currentTarget.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = adminColors.background.card;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {(title || subtitle) && (
        <div
          style={{
            padding: adminSpacing.lg,
            borderBottom: `1px solid ${adminColors.border.base}`,
          }}
        >
          {title && (
            <h3 style={{ ...adminTypography.styles.sectionHeading, marginBottom: subtitle ? adminSpacing.xs : 0 }}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p style={{ ...adminTypography.styles.caption }}>{subtitle}</p>
          )}
        </div>
      )}
      <div style={{ padding: adminSpacing.lg }}>{children}</div>
      {footer && (
        <div
          style={{
            padding: adminSpacing.lg,
            borderTop: `1px solid ${adminColors.border.base}`,
            display: 'flex',
            gap: adminSpacing.md,
            justifyContent: 'flex-end',
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// BADGE COMPONENT
// ============================================================================

interface BadgeProps {
  variant?: 'active' | 'inactive' | 'warning' | 'danger' | 'success' | 'info';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'inactive', children }) => {
  const variants = {
    active: {
      backgroundColor: adminColors.primary.base,
      color: adminColors.text.inverse,
    },
    inactive: {
      backgroundColor: adminColors.border.base,
      color: adminColors.text.muted,
    },
    warning: {
      backgroundColor: 'rgba(255, 153, 0, 0.13)',
      color: adminColors.status.warning,
    },
    danger: {
      backgroundColor: 'rgba(255, 68, 68, 0.13)',
      color: adminColors.status.danger,
    },
    success: {
      backgroundColor: 'rgba(34, 197, 94, 0.13)',
      color: adminColors.status.success,
    },
    info: {
      backgroundColor: 'rgba(59, 130, 246, 0.13)',
      color: '#3B82F6',
    },
  };

  return (
    <span
      style={{
        ...variants[variant],
        padding: `${adminSpacing.xs} ${adminSpacing.md}`,
        borderRadius: adminBorders.radius.full,
        fontSize: '11px',
        fontWeight: adminTypography.fontWeight.semibold,
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
};

// ============================================================================
// SIDEBAR ITEM COMPONENT
// ============================================================================

interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, onClick }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onClick={onClick}
      style={{
        height: '44px',
        paddingLeft: adminSpacing.lg,
        paddingRight: adminSpacing.lg,
        display: 'flex',
        alignItems: 'center',
        gap: adminSpacing.md,
        cursor: 'pointer',
        backgroundColor: isActive ? adminColors.primary.light : isHovered ? adminColors.background.elevated : 'transparent',
        color: isActive ? adminColors.primary.base : adminColors.text.secondary,
        fontWeight: isActive ? adminTypography.fontWeight.semibold : adminTypography.fontWeight.normal,
        transition: `all 200ms ease-in-out`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {icon && <span>{icon}</span>}
      <span style={{ fontSize: adminTypography.styles.body.fontSize }}>{label}</span>
    </div>
  );
};

// ============================================================================
// ALERT COMPONENT
// ============================================================================

interface AlertProps {
  type?: 'success' | 'danger' | 'warning' | 'info';
  onClose?: () => void;
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ type = 'info', onClose, children }) => {
  const colorMap = {
    success: {
      bg: 'rgba(34, 197, 94, 0.05)',
      border: 'rgba(34, 197, 94, 0.2)',
      text: adminColors.status.success,
    },
    danger: {
      bg: 'rgba(255, 68, 68, 0.05)',
      border: 'rgba(255, 68, 68, 0.2)',
      text: adminColors.status.danger,
    },
    warning: {
      bg: 'rgba(255, 153, 0, 0.05)',
      border: 'rgba(255, 153, 0, 0.2)',
      text: adminColors.status.warning,
    },
    info: {
      bg: 'rgba(59, 130, 246, 0.05)',
      border: 'rgba(59, 130, 246, 0.2)',
      text: '#3B82F6',
    },
  };

  const colors = colorMap[type];

  return (
    <div
      style={{
        padding: adminSpacing.lg,
        borderRadius: adminBorders.radius.lg,
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.bg,
        color: colors.text,
        fontSize: adminTypography.styles.body.fontSize,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: adminSpacing.lg,
      }}
    >
      <span>{children}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: colors.text,
            cursor: 'pointer',
            fontSize: '18px',
            padding: '0 0 0 16px',
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

// ============================================================================
// TABLE COMPONENT
// ============================================================================

interface TableProps {
  headers: string[];
  rows: (string | React.ReactNode)[][];
}

export const Table: React.FC<TableProps> = ({ headers, rows }) => {
  return (
    <div
      style={{
        overflow: 'x-auto',
        borderRadius: adminBorders.radius.lg,
        border: `1px solid ${adminColors.border.base}`,
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: adminColors.background.sidebar, borderBottom: `1px solid ${adminColors.border.base}` }}>
            {headers.map((header, i) => (
              <th
                key={i}
                style={{
                  padding: adminSpacing.md,
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: adminTypography.fontWeight.semibold,
                  color: adminColors.text.muted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              style={{
                borderBottom: `1px solid ${adminColors.border.base}`,
                transition: `background-color 200ms`,
                backgroundColor: adminColors.background.card,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = adminColors.background.elevated;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = adminColors.background.card;
              }}
            >
              {row.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  style={{
                    padding: adminSpacing.md,
                    fontSize: adminTypography.styles.body.fontSize,
                    color: adminColors.text.secondary,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
