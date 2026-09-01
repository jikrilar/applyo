"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { Check } from "lucide-react";
import { cn } from "@/components/shared/cn";

const FieldContext = React.createContext<{ descriptionId?: string; errorId?: string }>({});

export function Field({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const id = React.useId();
  return (
    <FieldContext.Provider value={{ descriptionId: `${id}-description`, errorId: `${id}-error` }}>
      <div className={cn("ui-field", className)} {...props} />
    </FieldContext.Provider>
  );
}

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn("ui-label", className)} {...props} />
));
Label.displayName = "Label";

export function FieldHelp({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  const { descriptionId } = React.useContext(FieldContext);
  return <p id={descriptionId} className={cn("ui-field-help", className)} {...props} />;
}

export function FieldError({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  const { errorId } = React.useContext(FieldContext);
  return <p id={errorId} className={cn("ui-field-error", className)} role="alert" {...props} />;
}

function describedBy(context: React.ContextType<typeof FieldContext>, invalid?: boolean) {
  return [context.descriptionId, invalid && context.errorId].filter(Boolean).join(" ") || undefined;
}

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, "aria-invalid": invalid, "aria-describedby": ariaDescribedBy, ...props }, ref) => {
  const context = React.useContext(FieldContext);
  return (
    <input
      ref={ref}
      className={cn("ui-input", className)}
      aria-invalid={invalid}
      aria-describedby={ariaDescribedBy ?? describedBy(context, Boolean(invalid))}
      {...props}
    />
  );
});
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, "aria-invalid": invalid, "aria-describedby": ariaDescribedBy, ...props }, ref) => {
  const context = React.useContext(FieldContext);
  return (
    <textarea
      ref={ref}
      className={cn("ui-input ui-textarea", className)}
      aria-invalid={invalid}
      aria-describedby={ariaDescribedBy ?? describedBy(context, Boolean(invalid))}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, "aria-invalid": invalid, "aria-describedby": ariaDescribedBy, ...props }, ref) => {
  const context = React.useContext(FieldContext);
  return (
    <select
      ref={ref}
      className={cn("ui-input ui-select", className)}
      aria-invalid={invalid}
      aria-describedby={ariaDescribedBy ?? describedBy(context, Boolean(invalid))}
      {...props}
    />
  );
});
Select.displayName = "Select";

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root ref={ref} className={cn("ui-checkbox", className)} {...props}>
    <CheckboxPrimitive.Indicator>
      <Check aria-hidden="true" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";

export const RadioGroup = RadioGroupPrimitive.Root;
export const Radio = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item ref={ref} className={cn("ui-radio", className)} {...props}>
    <RadioGroupPrimitive.Indicator className="ui-radio-dot" />
  </RadioGroupPrimitive.Item>
));
Radio.displayName = "Radio";

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root ref={ref} className={cn("ui-switch", className)} {...props}>
    <SwitchPrimitive.Thumb className="ui-switch-thumb" />
  </SwitchPrimitive.Root>
));
Switch.displayName = "Switch";
