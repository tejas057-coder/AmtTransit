import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ margin: 0, color: '#FFFFFF', fontSize: '24px', fontWeight: 700 }}>Settings</h1>
      <p style={{ color: '#888888', marginTop: '8px' }}>Administrator settings panel.</p>
      <div
        style={{
          marginTop: '16px',
          backgroundColor: '#1A1A1A',
          border: '1px solid #2A2A2A',
          borderRadius: '12px',
          padding: '16px',
          color: '#E5E5E5',
        }}
      >
        Configure notification rules, roles, and system preferences here.
      </div>
    </div>
  );
};

export default SettingsPage;
