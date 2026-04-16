import React from 'react';
import SettingRow, { SectionCard, FieldInput, Toggle } from './SettingRow';
import type { AnalyticsSettings } from '../../../types/adminSettings.types';

interface Props {
  data: AnalyticsSettings;
  onChange: (patch: Partial<AnalyticsSettings>) => void;
}

const AnalyticsSection: React.FC<Props> = ({ data, onChange }) => (
  <SectionCard>
    <SettingRow
      label="Data Retention Period"
      description="How long trip, location, and event logs are stored before auto-deletion"
    >
      <FieldInput
        type="number"
        value={data.retentionDays}
        onChange={(v) => onChange({ retentionDays: Number(v) })}
        suffix="days"
      />
    </SettingRow>

    <SettingRow
      label="Passenger Heatmaps"
      description="Visualise boarding density on the stop map using aggregated data"
    >
      <Toggle
        checked={data.enableHeatmaps}
        onChange={(v) => onChange({ enableHeatmaps: v })}
      />
    </SettingRow>

    <SettingRow
      label="Anonymous Data Sharing"
      description="Share anonymised usage stats to improve city transit planning"
      last
    >
      <Toggle
        checked={data.shareAnonymousData}
        onChange={(v) => onChange({ shareAnonymousData: v })}
      />
    </SettingRow>
  </SectionCard>
);

export default AnalyticsSection;
