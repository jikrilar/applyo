"use client";

import * as React from "react";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/components/shared/cn";

export const DropdownMenu = Dropdown.Root;
export const DropdownMenuTrigger = Dropdown.Trigger;
export const DropdownMenuGroup = Dropdown.Group;
export const DropdownMenuSeparator = (
  props: React.ComponentPropsWithoutRef<typeof Dropdown.Separator>,
) => <Dropdown.Separator className={cn("ui-menu-separator", props.className)} {...props} />;
export function DropdownMenuContent({
  className,
  sideOffset = 8,
  ...props
}: React.ComponentPropsWithoutRef<typeof Dropdown.Content>) {
  return (
    <Dropdown.Portal>
      <Dropdown.Content
        sideOffset={sideOffset}
        className={cn("ui-menu-content", className)}
        {...props}
      />
    </Dropdown.Portal>
  );
}
export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof Dropdown.Item>,
  React.ComponentPropsWithoutRef<typeof Dropdown.Item>
>(({ className, ...props }, ref) => (
  <Dropdown.Item ref={ref} className={cn("ui-menu-item", className)} {...props} />
));
DropdownMenuItem.displayName = "DropdownMenuItem";
export function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Dropdown.CheckboxItem>) {
  return (
    <Dropdown.CheckboxItem className={cn("ui-menu-item ui-menu-check-item", className)} {...props}>
      <span className="ui-menu-indicator">
        <Dropdown.ItemIndicator>
          <Check />
        </Dropdown.ItemIndicator>
      </span>
      {children}
    </Dropdown.CheckboxItem>
  );
}
export const DropdownMenuSub = Dropdown.Sub;
export function DropdownMenuSubTrigger({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Dropdown.SubTrigger>) {
  return (
    <Dropdown.SubTrigger className={cn("ui-menu-item", className)} {...props}>
      {children}
      <ChevronRight className="ui-menu-chevron" />
    </Dropdown.SubTrigger>
  );
}
export function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Dropdown.SubContent>) {
  return (
    <Dropdown.Portal>
      <Dropdown.SubContent className={cn("ui-menu-content", className)} {...props} />
    </Dropdown.Portal>
  );
}

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverClose = PopoverPrimitive.Close;
export function PopoverContent({
  className,
  sideOffset = 8,
  ...props
}: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        sideOffset={sideOffset}
        className={cn("ui-popover", className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

export const TooltipProvider = ({
  delayDuration = 350,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) => (
  <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />
);
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
export function TooltipContent({
  className,
  sideOffset = 6,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn("ui-tooltip", className)}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
}
