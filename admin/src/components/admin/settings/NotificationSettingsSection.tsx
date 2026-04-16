import React from 'react';
import SettingRow, { SectionCard, FieldSelect, Toggle } from './SettingRow';
import type { NotificationSettings } from '../../../types/adminSettings.types';

const DIGEST_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'never', label: 'Never' },
];

interface Props {
  data: NotificationSettings;
  onChange: (patch: Partial<NotificationSettings>) => void;
}

const NotificationSettingsSection: React.FC<Props> = ({ data, onChange }) => (
  <SectionCard>
    <SettingRow
      label="Delay Alerts"
      description="Push notification when a bus is running more than 5 minutes late"
    >
      <Toggle checked={data.delayAlerts} onChange={(v) => onChange({ delayAlerts: v })} />
    </SettingRow>

    <SettingRow
      label="Bus Approaching Alerts"
      description="Notify passengers 2 stops before their marked stop"
    >
      <Toggle
        checked={data.busApproachingAlerts}
        onChange={(v) => onChange({ busApproachingAlerts: v })}
      />
    </SettingRow>

    <SettingRow
      label="Maintenance Due Alerts"
      description="Alert fleet manager when a bus approaches its service interval"
    >
      <Toggle
        checked={data.maintenanceDueAlerts}
        onChange={(v) => onChange({ maintenanceDueAlerts: v })}
      />
    </SettingRow>

    <SettingRow
      label="Email Digest"
      description="Receive a summary of fleet activity via email"
      last
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Toggle
          checked={data.emailDigest}
          onChange={(v) => onChange({ emailDigest: v })}
        />
        {data.emailDigest && (
          <FieldSelect
            value={data.emailDigestFrequency}
            onChange={(v) =>
              onChange({ emailDigestFrequency: v as NotificationSettings['emailDigestFrequency'] })
            }
            options={DIGEST_OPTIONS}
          />
        )}
      </div>
    </SettingRow>
  </SectionCard>
);

export default NotificationSettingsSection;
