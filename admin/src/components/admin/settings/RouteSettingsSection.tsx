import React from 'react';
import SettingRow, { SectionCard, FieldInput, Toggle } from './SettingRow';
import type { RouteSettings } from '../../../types/adminSettings.types';

interface Props {
  data: RouteSettings;
  onChange: (patch: Partial<RouteSettings>) => void;
}

const RouteSettingsSection: React.FC<Props> = ({ data, onChange }) => (
  <SectionCard>
    <SettingRow
      label="Default Route Frequency"
      description="Baseline headway between buses on the same route"
    >
      <FieldInput
        type="number"
        value={data.defaultFrequencyMinutes}
        onChange={(v) => onChange({ defaultFrequencyMinutes: Number(v) })}
        suffix="min"
      />
    </SettingRow>

    <SettingRow
      label="Buffer Time at Terminus"
      description="Extra dwell time allowed at start/end stops"
    >
      <FieldInput
        type="number"
        value={data.bufferTimeMinutes}
        onChange={(v) => onChange({ bufferTimeMinutes: Number(v) })}
        suffix="min"
      />
    </SettingRow>

    <SettingRow
      label="Dynamic Re-routing"
      description="Allow system to suggest alternative routes when disruptions detected"
    >
      <Toggle
        checked={data.enableDynamicRerouting}
        onChange={(v) => onChange({ enableDynamicRerouting: v })}
      />
    </SettingRow>

    <SettingRow
      label="Show Stop Codes"
      description="Display AMR-XXX codes alongside stop names in passenger app"
      last
    >
      <Toggle
        checked={data.showStopCodes}
        onChange={(v) => onChange({ showStopCodes: v })}
      />
    </SettingRow>
  </SectionCard>
);

export default RouteSettingsSection;
