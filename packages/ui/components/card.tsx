import * as React from "react";

import { cn } from "@/lib/utils";

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function Card({ className, ...props }, ref) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow",
        className,
      )}
      data-testid="Card"
      ref={ref}
      {...props}
    />
  );
});
Card.displayName = "Card";

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CardHeader({ className, ...props }, ref) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      data-testid="CardHeader"
      ref={ref}
      {...props}
    />
  );
});
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CardTitle({ className, ...props }, ref) {
  return (
    <div
      className={cn("font-semibold leading-none tracking-tight", className)}
      data-testid="CardTitle"
      ref={ref}
      {...props}
    />
  );
});
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CardDescription({ className, ...props }, ref) {
  return (
    <div
      className={cn("text-sm text-muted-foreground", className)}
      data-testid="CardDescription"
      ref={ref}
      {...props}
    />
  );
});
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CardContent({ className, ...props }, ref) {
  return (
    <div
      className={cn("p-6 pt-0", className)}
      data-testid="CardContent"
      ref={ref}
      {...props}
    />
  );
});
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CardFooter({ className, ...props }, ref) {
  return (
    <div
      className={cn("flex items-center p-6 pt-0", className)}
      data-testid="CardFooter"
      ref={ref}
      {...props}
    />
  );
});
CardFooter.displayName = "CardFooter";
