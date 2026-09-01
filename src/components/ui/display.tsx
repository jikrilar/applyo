"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/components/shared/cn";

export function Badge({
  className,
  variant = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "neutral" | "yellow" | "blue" | "green" | "pink" | "danger";
}) {
  return <span className={cn("ui-badge", `ui-badge-${variant}`, className)} {...props} />;
}
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("ui-card", className)} {...props} />;
}
export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("ui-card-header", className)} {...props} />;
}
export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("ui-card-title", className)} {...props} />;
}
export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("ui-card-description", className)} {...props} />;
}
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("ui-card-content", className)} {...props} />;
}
export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("ui-card-footer", className)} {...props} />;
}
export const Avatar = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>) => (
  <AvatarPrimitive.Root className={cn("ui-avatar", className)} {...props} />
);
export const AvatarImage = AvatarPrimitive.Image;
export const AvatarFallback = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>) => (
  <AvatarPrimitive.Fallback className={cn("ui-avatar-fallback", className)} {...props} />
);
export function Divider({
  className,
  orientation = "horizontal",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn("ui-divider", `ui-divider-${orientation}`, className)}
      {...props}
    />
  );
}
export const Tabs = TabsPrimitive.Root;
export const TabsList = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) => (
  <TabsPrimitive.List className={cn("ui-tabs-list", className)} {...props} />
);
export const TabsTrigger = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) => (
  <TabsPrimitive.Trigger className={cn("ui-tabs-trigger", className)} {...props} />
);
export const TabsContent = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) => (
  <TabsPrimitive.Content className={cn("ui-tabs-content", className)} {...props} />
);
export function StatCard({
  label,
  value,
  detail,
  tone = "blue",
  className,
}: {
  label: string;
  value: React.ReactNode;
  detail?: React.ReactNode;
  tone?: "blue" | "yellow" | "pink" | "green";
  className?: string;
}) {
  return (
    <Card className={cn("ui-stat-card", `ui-stat-${tone}`, className)}>
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </Card>
  );
}
export function StatusIndicator({
  label,
  status = "neutral",
  className,
}: {
  label: string;
  status?: "neutral" | "success" | "warning" | "danger" | "info";
  className?: string;
}) {
  return (
    <span className={cn("ui-status", className)}>
      <span className={cn("ui-status-dot", `ui-status-${status}`)} aria-hidden="true" />
      {label}
    </span>
  );
}
