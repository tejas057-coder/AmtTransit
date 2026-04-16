import React from 'react';
import SettingRow, { SectionCard, FieldSelect, FieldInput, Toggle } from './SettingRow';
import type { DisplaySettings } from '../../../types/adminSettings.types';

const THEME_OPTIONS = [
  { value: 'dark', label: 'Dark (Rapido)' },
  { value: 'system', label: 'Follow System' },
];

interface Props {
  data: DisplaySettings;
  onChange: (patch: Partial<DisplaySettings>) => void;
}

const DisplaySection: React.FC<Props> = ({ data, onChange }) => (
  <SectionCard>
    <SettingRow
      label="Theme"
      description="Choose the admin panel colour theme"
    >
      <FieldSelect
        value={data.theme}
        onChange={(v) => onChange({ theme: v as DisplaySettings['theme'] })}
        options={THEME_OPTIONS}
      />
    </SettingRow>

    <SettingRow
      label="Default Map Zoom"
      description="Initial zoom level when the live map opens (1 = world, 20 = street)"
    >
      <FieldInput
        type="number"
        value={data.mapDefaultZoom}
        onChange={(v) => onChange({ mapDefaultZoom: Number(v) })}
      />
    </SettingRow>

    <SettingRow
      label="Compact Sidebar"
      description="Collapse sidebar to icons-only mode to save screen space"
      last
    >
      <Toggle
        checked={data.compactSidebar}
        onChange={(v) => onChange({ compactSidebar: v })}
      />
    </SettingRow>
  </SectionCard>
);

export default DisplaySection;
