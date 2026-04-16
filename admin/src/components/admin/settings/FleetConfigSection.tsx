import React from 'react';
import SettingRow, { SectionCard, FieldInput, Toggle } from './SettingRow';
import type { FleetConfig } from '../../../types/adminSettings.types';

interface Props {
  data: FleetConfig;
  onChange: (patch: Partial<FleetConfig>) => void;
}

const FleetConfigSection: React.FC<Props> = ({ data, onChange }) => (
  <SectionCard>
    <SettingRow
      label="Max Passenger Capacity"
      description="Default passenger limit per bus (used for occupancy calculations)"
    >
      <FieldInput
        type="number"
        value={data.maxPassengerCapacity}
        onChange={(v) => onChange({ maxPassengerCapacity: Number(v) })}
        suffix="seats"
      />
    </SettingRow>

    <SettingRow
      label="Low Fuel Threshold"
      description="Alert driver when fuel drops below this percentage"
    >
      <FieldInput
        type="number"
        value={data.lowFuelThreshold}
        onChange={(v) => onChange({ lowFuelThreshold: Number(v) })}
        suffix="%"
      />
    </SettingRow>

    <SettingRow
      label="Maintenance Interval"
      description="Schedule maintenance reminders at this odometer frequency"
    >
      <FieldInput
        type="number"
        value={data.maintenanceIntervalKm}
        onChange={(v) => onChange({ maintenanceIntervalKm: Number(v) })}
        suffix="km"
      />
    </SettingRow>

    <SettingRow
      label="Speed Limit"
      description="Maximum allowed speed — buses exceeding this trigger an alert"
    >
      <FieldInput
        type="number"
        value={data.speedLimitKmh}
        onChange={(v) => onChange({ speedLimitKmh: Number(v) })}
        suffix="km/h"
      />
    </SettingRow>

    <SettingRow
      label="Auto-Assign Drivers"
      description="Automatically pair available drivers to unassigned buses"
      last
    >
      <Toggle
        checked={data.autoAssignDrivers}
        onChange={(v) => onChange({ autoAssignDrivers: v })}
      />
    </SettingRow>
  </SectionCard>
);

export default FleetConfigSection;
