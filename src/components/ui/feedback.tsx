import * as React from "react";
import { cn } from "@/components/shared/cn";

export function Spinner({
  className,
  label = "Memuat",
  size = "md",
}: {
  className?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span
      className={cn("ui-spinner", `ui-spinner-${size}`, className)}
      role="status"
      aria-label={label}
    />
  );
}

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("ui-skeleton", className)} aria-hidden="true" {...props} />;
}

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div className={cn("ui-empty-state", className)} {...props}>
      {icon && (
        <div className="ui-empty-state-icon" aria-hidden="true">
          {icon}
        </div>
      )}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}
