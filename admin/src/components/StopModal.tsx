import { useState, useEffect } from 'react';
import { Stop } from '../services/stopsService';

interface StopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (stopData: Omit<Stop, 'id' | 'created_at'>) => void;
  editingStop: Stop | null;
  loading: boolean;
}

const ZONES = [
  'Civil Lines',
  'Rajapeth',
  'Badnera',
  'Camp',
  'MIDC',
  'University',
  'Other'
];

export default function StopModal({ isOpen, onClose, onSave, editingStop, loading }: StopModalProps) {
  const [stopName, setStopName] = useState('');
  const [stopCode, setStopCode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [zone, setZone] = useState('Civil Lines');
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (editingStop) {
        // Edit mode - populate form
        setStopName(editingStop.stop_name);
        setStopCode(editingStop.stop_code);
        setLatitude(editingStop.latitude.toString());
        setLongitude(editingStop.longitude.toString());
        setZone(editingStop.zone);
        setIsActive(editingStop.is_active);
      } else {
        // Create mode - reset form
        setStopName('');
        setStopCode('');
        setLatitude('');
        setLongitude('');
        setZone('Civil Lines');
        setIsActive(true);
      }
      setErrors({});
    }
  }, [isOpen, editingStop]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!stopName.trim()) {
      newErrors.stopName = 'Stop name is required';
    }

    if (!stopCode.trim()) {
      newErrors.stopCode = 'Stop code is required';
    }

    if (latitude && (isNaN(Number(latitude)) || Number(latitude) < -90 || Number(latitude) > 90)) {
      newErrors.latitude = 'Valid latitude required (-90 to 90)';
    }

    if (longitude && (isNaN(Number(longitude)) || Number(longitude) < -180 || Number(longitude) > 180)) {
      newErrors.longitude = 'Valid longitude required (-180 to 180)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSave({
      stop_name: stopName.trim(),
      stop_code: stopCode.trim().toUpperCase(),
      latitude: latitude ? Number(latitude) : 0,
      longitude: longitude ? Number(longitude) : 0,
      zone,
      is_active: isActive
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {editingStop ? '✏️ Edit Stop' : '➕ Add New Stop'}
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Stop Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Stop Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={stopName}
              onChange={(e) => setStopName(e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all ${
                errors.stopName ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="e.g., Rajapeth Chowk"
            />
            {errors.stopName && (
              <p className="text-red-500 text-xs mt-1">{errors.stopName}</p>
            )}
          </div>

          {/* Stop Code */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Stop Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={stopCode}
              onChange={(e) => setStopCode(e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-mono uppercase ${
                errors.stopCode ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="e.g., AMR01"
            />
            {errors.stopCode && (
              <p className="text-red-500 text-xs mt-1">{errors.stopCode}</p>
            )}
          </div>

          {/* Latitude & Longitude */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all ${
                  errors.latitude ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="20.9374"
              />
              {errors.latitude && (
                <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all ${
                  errors.longitude ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="77.7796"
              />
              {errors.longitude && (
                <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>
              )}
            </div>
          </div>

          {/* Zone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Zone
            </label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all cursor-pointer"
            >
              {ZONES.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <p className="text-sm font-semibold text-gray-700">Active Status</p>
              <p className="text-xs text-gray-500">Is this stop currently operational?</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 font-semibold shadow-lg shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Stop'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
