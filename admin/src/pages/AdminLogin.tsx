

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle } from 'lucide-react';
import { adminColors, adminSpacing, adminBorders } from '@/lib/adminDesignTokens';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const ADMIN_PASSWORD = ((import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env
    ?.VITE_ADMIN_PASSWORD ?? 'admin'
  ).trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setError('');

    const normalizedPassword = password.trim();
    if (!normalizedPassword) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    // Simulate API check
    setTimeout(() => {
      if (normalizedPassword === ADMIN_PASSWORD) {
        try {
          localStorage.setItem('adminAuth', 'true');
        } catch {
          // Continue with in-memory auth when storage is unavailable.
        }
        onLoginSuccess();
        navigate('/dashboard', { replace: true });
      } else {
        setError('Incorrect password. Please try again.');
        setPassword('');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: adminColors.background.page,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: adminSpacing.xl,
        }}
      >
        {/* Logo/Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: adminSpacing.xxxl,
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              margin: `0 auto ${adminSpacing.lg}`,
              backgroundColor: adminColors.primary.base,
              borderRadius: adminBorders.radius.lg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '24px',
              color: adminColors.text.inverse,
            }}
          >
            AT
          </div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 600,
              color: adminColors.text.primary,
              marginBottom: adminSpacing.sm,
            }}
          >
            AmravatiTransit
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: adminColors.text.muted,
            }}
          >
            Admin Portal
          </p>
        </div>

        {/* Login Card */}
        <div
          style={{
            backgroundColor: adminColors.background.card,
            border: `1px solid ${adminColors.border.base}`,
            borderRadius: adminBorders.radius.lg,
            padding: adminSpacing.xl,
            marginBottom: adminSpacing.lg,
          }}
        >
          <h2
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: adminColors.text.primary,
              marginBottom: adminSpacing.lg,
              textAlign: 'center',
            }}
          >
            Enter Admin Password
          </h2>

          {/* Error Alert */}
          {error && (
            <div
              style={{
                display: 'flex',
                gap: adminSpacing.md,
                padding: adminSpacing.md,
                backgroundColor: 'rgba(255, 68, 68, 0.1)',
                border: `1px solid ${adminColors.status.danger}`,
                borderRadius: adminBorders.radius.md,
                marginBottom: adminSpacing.lg,
                alignItems: 'flex-start',
              }}
            >
              <AlertCircle size={18} style={{ color: adminColors.status.danger, marginTop: '2px', flexShrink: 0 }} />
              <p
                style={{
                  fontSize: '13px',
                  color: adminColors.status.danger,
                  margin: 0,
                }}
              >
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: adminSpacing.lg }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: adminColors.text.muted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: adminSpacing.sm,
                }}
              >
                Password
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: adminSpacing.md,
                  borderRadius: adminBorders.radius.md,
                  border: `1px solid ${adminColors.border.base}`,
                  backgroundColor: adminColors.background.elevated,
                  padding: `0 ${adminSpacing.md}`,
                  transition: 'all 200ms ease-in-out',
                }}
              >
                <Lock size={18} style={{ color: adminColors.text.muted }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter password..."
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    color: adminColors.text.secondary,
                    fontSize: '14px',
                    outline: 'none',
                    padding: `${adminSpacing.md} 0`,
                    fontFamily: 'inherit',
                  }}
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !password}
              style={{
                width: '100%',
                height: '40px',
                backgroundColor:
                  isLoading || !password ? `${adminColors.primary.base}77` : adminColors.primary.base,
                border: 'none',
                borderRadius: adminBorders.radius.md,
                color: adminColors.text.inverse,
                fontSize: '14px',
                fontWeight: 600,
                cursor: isLoading || !password ? 'not-allowed' : 'pointer',
                transition: 'all 200ms ease-in-out',
                opacity: isLoading || !password ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading && password) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = adminColors.primary.hover;
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && password) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = adminColors.primary.base;
                }
              }}
            >
              {isLoading ? 'Verifying...' : 'Access Admin Portal'}
            </button>
          </form>
        </div>

        {/* Footer Info */}
        <div
          style={{
            textAlign: 'center',
            padding: adminSpacing.lg,
            backgroundColor: `${adminColors.primary.base}11`,
            border: `1px solid ${adminColors.primary.base}33`,
            borderRadius: adminBorders.radius.md,
          }}
        >
          <p
            style={{
              fontSize: '12px',
              color: adminColors.text.muted,
              margin: 0,
              marginBottom: adminSpacing.sm,
            }}
          >
            🔐 Secure Admin Access
          </p>
          <p
            style={{
              fontSize: '11px',
              color: adminColors.text.muted,
              margin: 0,
              lineHeight: '1.5',
            }}
          >
            For demo purposes. Each admin action is logged.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
