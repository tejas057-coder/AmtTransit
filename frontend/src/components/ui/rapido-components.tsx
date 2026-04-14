import { cn } from "@/lib/utils";

/**
 * Rapido Design System Component Utilities
 * Use these utility functions to create consistent components
 */

// ============ CARD ============
export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-card border border-white/8 rounded-[16px] p-4", className)}>
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("flex items-center justify-between mb-3", className)}>{children}</div>;
}

export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <h3 className={cn("text-foreground font-bold text-lg", className)}>{children}</h3>;
}

export function CardDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-muted-foreground font-normal text-sm", className)}>{children}</p>
  );
}

// ============ BUTTONS ============
export function PrimaryButton({
  children,
  className,
  disabled = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "bg-primary text-primary-foreground font-bold rounded-[12px] px-4 py-3",
        "hover:opacity-90 transition-opacity",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className,
  disabled = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "border border-white/50 text-foreground font-medium rounded-[12px] px-4 py-3",
        "hover:bg-muted/30 transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function IconButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "p-2 rounded-[12px] hover:bg-muted/50 transition-colors",
        "text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// ============ BADGES ============
export function StatusBadge({
  status,
  className,
}: {
  status: "on-time" | "delayed" | "arrived";
  className?: string;
}) {
  const statusConfig = {
    "on-time": { bg: "bg-primary", text: "text-primary-foreground", label: "On Time" },
    delayed: { bg: "bg-danger", text: "text-destructive-foreground", label: "Delayed" },
    arrived: { bg: "bg-success", text: "text-success-foreground", label: "Arrived" },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "px-3 py-1 rounded-[20px] text-sm font-medium inline-block",
        config.bg,
        config.text,
        className
      )}
    >
      {config.label}
    </span>
  );
}

// ============ CHIPS ============
export function Chip({
  label,
  icon: Icon,
  onRemove,
  className,
}: {
  label: string;
  icon?: React.ReactNode;
  onRemove?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 bg-primary/10 text-primary",
        "px-3 py-1.5 rounded-[20px] text-sm font-medium",
        className
      )}
    >
      {Icon && <span className="flex items-center justify-center">{Icon}</span>}
      <span>{label}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:text-primary-foreground transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  );
}

// ============ TEXT ============
export function Text({
  children,
  variant = "body",
  className,
}: {
  children: React.ReactNode;
  variant?: "heading" | "subheading" | "body" | "label" | "muted";
  className?: string;
}) {
  const variants = {
    heading: "text-foreground font-bold text-xl",
    subheading: "text-foreground font-bold text-lg",
    body: "text-foreground font-normal text-base",
    label: "text-foreground font-medium text-sm",
    muted: "text-muted-foreground font-normal text-sm",
  };

  return <p className={cn(variants[variant], className)}>{children}</p>;
}

// ============ DIVIDER ============
export function Divider({ className }: { className?: string }) {
  return <div className={cn("border-t border-white/8", className)} />;
}

// ============ ALERT ============
export function Alert({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "danger" | "success" | "warning";
  className?: string;
}) {
  const colors = {
    default: "bg-muted/30 text-foreground border-muted",
    danger: "bg-danger/10 text-danger border-danger/30",
    success: "bg-success/10 text-success border-success/30",
    warning: "bg-primary/10 text-primary border-primary/30",
  };

  return (
    <div
      className={cn(
        "border rounded-[12px] px-4 py-3",
        colors[variant],
        className
      )}
    >
      {children}
    </div>
  );
}

// ============ INPUT ============
export function Input({
  placeholder,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      placeholder={placeholder}
      className={cn(
        "w-full bg-card border border-white/20 text-foreground placeholder-muted-foreground",
        "rounded-[12px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50",
        "transition-all font-normal",
        className
      )}
      {...props}
    />
  );
}

// ============ NAVIGATION ITEM ============
export function NavItem({
  children,
  active = false,
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { active?: boolean }) {
  return (
    <a
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-[12px] font-medium transition-all",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}
