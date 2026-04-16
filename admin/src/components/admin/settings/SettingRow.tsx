import React from 'react';
import { adminColors, adminBorders, adminSpacing } from '@/lib/adminDesignTokens';

// ─── Toggle ───────────────────────────────────────────────────────────────────
interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}
export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, disabled }) => (
  <button
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => !disabled && onChange(!checked)}
    style={{
      width: '44px',
      height: '24px',
      borderRadius: 999,
      border: 'none',
      backgroundColor: checked ? '#FFD000' : '#2A2A2A',
      position: 'relative',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background-color 160ms ease',
      flexShrink: 0,
      opacity: disabled ? 0.5 : 1,
    }}
  >
    <span
      style={{
        position: 'absolute',
        top: '3px',
        left: checked ? '23px' : '3px',
        width: '18px',
        height: '18px',
        borderRadius: 999,
        backgroundColor: checked ? '#0D0D0D' : '#888888',
        transition: 'left 160ms ease',
      }}
    />
  </button>
);

// ─── SettingRow ───────────────────────────────────────────────────────────────
interface SettingRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  last?: boolean;
}
const SettingRow: React.FC<SettingRowProps> = ({ label, description, children, last }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: adminSpacing.lg,
      paddingTop: adminSpacing.lg,
      paddingBottom: adminSpacing.lg,
      borderBottom: last ? 'none' : `1px solid ${adminColors.border.base}`,
    }}
  >
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ color: '#E5E5E5', fontWeight: 600, fontSize: '13px' }}>{label}</div>
      {description && (
        <div style={{ color: '#888888', fontSize: '11px', marginTop: '3px', lineHeight: 1.5 }}>
          {description}
        </div>
      )}
    </div>
    <div style={{ flexShrink: 0 }}>{children}</div>
  </div>
);

export default SettingRow;

// ─── FieldInput ───────────────────────────────────────────────────────────────
interface FieldInputProps {
  value: string | number;
  onChange: (val: string) => void;
  type?: 'text' | 'number' | 'email' | 'tel';
  suffix?: string;
  style?: React.CSSProperties;
}
export const FieldInput: React.FC<FieldInputProps> = ({
  value, onChange, type = 'text', suffix, style,
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        height: '36px',
        borderRadius: adminBorders.radius.md,
        border: `1px solid ${adminColors.border.base}`,
        backgroundColor: '#1A1A1A',
        color: '#E5E5E5',
        padding: '0 10px',
        fontSize: '13px',
        width: type === 'number' ? '80px' : '200px',
        outline: 'none',
        ...style,
      }}
    />
    {suffix && (
      <span style={{ color: '#888888', fontSize: '12px', whiteSpace: 'nowrap' }}>{suffix}</span>
    )}
  </div>
);

// ─── FieldSelect ─────────────────────────────────────────────────────────────
interface FieldSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
}
export const FieldSelect: React.FC<FieldSelectProps> = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{
      height: '36px',
      borderRadius: adminBorders.radius.md,
      border: `1px solid ${adminColors.border.base}`,
      backgroundColor: '#1A1A1A',
      color: '#E5E5E5',
      padding: '0 10px',
      fontSize: '13px',
      cursor: 'pointer',
      outline: 'none',
    }}
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

// ─── SectionCard ─────────────────────────────────────────────────────────────
interface SectionCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}
export const SectionCard: React.FC<SectionCardProps> = ({ children, style }) => (
  <div
    style={{
      backgroundColor: '#1A1A1A',
      border: `1px solid ${adminColors.border.base}`,
      borderRadius: '12px',
      overflow: 'hidden',
      ...style,
    }}
  >
    <div style={{ padding: `0 ${adminSpacing.lg}` }}>{children}</div>
  </div>
);
