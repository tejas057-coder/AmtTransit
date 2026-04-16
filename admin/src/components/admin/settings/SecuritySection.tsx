import React from 'react';
import SettingRow, { SectionCard, FieldInput, Toggle } from './SettingRow';
import type { SecuritySettings } from '../../../types/adminSettings.types';

interface Props {
  data: SecuritySettings;
  onChange: (patch: Partial<SecuritySettings>) => void;
}

const SecuritySection: React.FC<Props> = ({ data, onChange }) => (
  <SectionCard>
    <SettingRow
      label="Session Timeout"
      description="Automatically log out after this period of inactivity"
    >
      <FieldInput
        type="number"
        value={data.sessionTimeoutMinutes}
        onChange={(v) => onChange({ sessionTimeoutMinutes: Number(v) })}
        suffix="min"
      />
    </SettingRow>

    <SettingRow
      label="Two-Factor Authentication"
      description="Require OTP via SMS for every admin login"
    >
      <Toggle
        checked={data.requireTwoFactor}
        onChange={(v) => onChange({ requireTwoFactor: v })}
      />
    </SettingRow>

    <SettingRow
      label="IP Whitelist"
      description="Restrict admin access to specific IP addresses only"
    >
      <Toggle
        checked={data.ipWhitelistEnabled}
        onChange={(v) => onChange({ ipWhitelistEnabled: v })}
      />
    </SettingRow>

    <SettingRow
      label="Audit Log"
      description="Record all admin actions for compliance and review"
      last
    >
      <Toggle
        checked={data.auditLogEnabled}
        onChange={(v) => onChange({ auditLogEnabled: v })}
      />
    </SettingRow>
  </SectionCard>
);

export default SecuritySection;
