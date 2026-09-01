import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/components/shared/cn";
import { Spinner } from "./feedback";

export const buttonVariants = cva("ui-button", {
  variants: {
    variant: {
      primary: "ui-button-primary",
      secondary: "ui-button-secondary",
      ghost: "ui-button-ghost",
      danger: "ui-button-danger",
      link: "ui-button-link",
    },
    size: {
      sm: "ui-button-sm",
      md: "ui-button-md",
      lg: "ui-button-lg",
      icon: "ui-button-icon",
    },
  },
  defaultVariants: { variant: "primary", size: "md" },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingLabel?: string;
}

export function Button({
  asChild = false,
  className,
  children,
  disabled,
  loading = false,
  loadingLabel = "Memuat",
  type = "button",
  variant,
  size,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={asChild ? undefined : disabled || loading}
      aria-disabled={asChild && (disabled || loading) ? true : undefined}
      aria-busy={loading || undefined}
      type={asChild ? undefined : type}
      {...props}
    >
      {loading && <Spinner size="sm" label={loadingLabel} />}
      {children}
    </Comp>
  );
}
