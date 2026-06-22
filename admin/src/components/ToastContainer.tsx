import { Toast, useToast } from '../hooks/use-toast';

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[10000] flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const getToastStyles = () => {
    switch (toast.variant) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-[#C8F135]/95 to-[#B8E125]/95',
          border: 'border-[#C8F135]',
          icon: '✓',
          iconBg: 'bg-black/20',
          textColor: 'text-[#0F0F0F]',
          descColor: 'text-[#0F0F0F]/80',
        };
      case 'destructive':
        return {
          bg: 'bg-gradient-to-r from-red-600/95 to-red-700/95',
          border: 'border-red-500',
          icon: '✕',
          iconBg: 'bg-white/20',
          textColor: 'text-white',
          descColor: 'text-white/80',
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-orange-500/95 to-orange-600/95',
          border: 'border-orange-400',
          icon: '⚠',
          iconBg: 'bg-white/20',
          textColor: 'text-white',
          descColor: 'text-white/80',
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-[#1A1A1A]/95 to-[#2A2A2A]/95',
          border: 'border-[#C8F135]/50',
          icon: 'ℹ',
          iconBg: 'bg-[#C8F135]/20',
          textColor: 'text-white',
          descColor: 'text-[#888]',
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div
      className={`${styles.bg} ${styles.border} border backdrop-blur-xl rounded-xl shadow-2xl p-4 animate-in slide-in-from-right fade-in duration-300 hover:scale-[1.02] transition-all cursor-pointer`}
      onClick={onDismiss}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`${styles.iconBg} ${styles.textColor} w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold shadow-lg`}
        >
          {styles.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-bold text-sm ${styles.textColor} mb-1`}>{toast.title}</h4>
          {toast.description && (
            <p className={`text-xs ${styles.descColor} leading-relaxed`}>{toast.description}</p>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className={`${styles.textColor}/60 hover:${styles.textColor} transition-colors flex-shrink-0`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      {toast.duration !== Infinity && (
        <div className="mt-3 h-1 bg-black/10 rounded-full overflow-hidden">
          <div
            className={`h-full ${styles.iconBg} animate-pulse`}
            style={{
              animation: `shrink ${toast.duration}ms linear forwards`,
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
