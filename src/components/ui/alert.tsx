import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/components/shared/cn";

const alertVariants = cva("ui-alert", {
  variants: {
    variant: {
      info: "ui-alert-info",
      success: "ui-alert-success",
      warning: "ui-alert-warning",
      danger: "ui-alert-danger",
    },
  },
  defaultVariants: { variant: "info" },
});

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {}
export function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div
      className={cn(alertVariants({ variant }), className)}
      role={variant === "danger" ? "alert" : "status"}
      {...props}
    />
  );
}
export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("ui-alert-title", className)} {...props} />;
}
export function AlertDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("ui-alert-description", className)} {...props} />;
}
