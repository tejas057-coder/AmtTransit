import React from 'react';
import { adminSpacing } from '@/lib/adminDesignTokens';
import SettingRow, { SectionCard, FieldInput } from './SettingRow';
import type { AdminProfile } from '../../../types/adminSettings.types';

interface Props {
  data: AdminProfile;
  onChange: (patch: Partial<AdminProfile>) => void;
}

const ProfileSection: React.FC<Props> = ({ data, onChange }) => (
  <div>
    {/* Avatar */}
    <div style={{ display: 'flex', alignItems: 'center', gap: adminSpacing.lg, marginBottom: adminSpacing.xl }}>
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #FFD000 0%, #E6BB00 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: 800,
          color: '#0D0D0D',
          flexShrink: 0,
          letterSpacing: '-0.5px',
        }}
      >
        {data.avatar}
      </div>
      <div>
        <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '16px' }}>{data.name}</div>
        <div
          style={{
            display: 'inline-block',
            marginTop: '6px',
            backgroundColor: '#FFD00022',
            border: '1px solid #FFD00044',
            color: '#FFD000',
            fontSize: '11px',
            fontWeight: 600,
            borderRadius: '6px',
            padding: '2px 10px',
          }}
        >
          {data.role}
        </div>
      </div>
    </div>

    <SectionCard>
      <SettingRow label="Full Name" description="Display name shown in admin panel and reports">
        <FieldInput value={data.name} onChange={(v) => onChange({ name: v })} />
      </SettingRow>
      <SettingRow label="Email Address" description="Used for login and system notifications">
        <FieldInput value={data.email} onChange={(v) => onChange({ email: v })} type="email" />
      </SettingRow>
      <SettingRow label="Phone Number" description="Emergency contact for operational alerts">
        <FieldInput value={data.phone} onChange={(v) => onChange({ phone: v })} type="tel" />
      </SettingRow>
      <SettingRow label="Role" description="Account permission level (contact Super Admin to change)" last>
        <div style={{
          height: '36px', display: 'flex', alignItems: 'center', paddingLeft: '10px',
          fontSize: '13px', color: '#888888',
        }}>
          {data.role}
        </div>
      </SettingRow>
    </SectionCard>
  </div>
);

export default ProfileSection;
