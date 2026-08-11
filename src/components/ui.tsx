import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * Shared primitives. Every one of these consumes layer-3 component tokens, so
 * nothing here knows a hex value and everything inverts correctly per mode.
 */

const cx = (...parts: (string | false | undefined)[]) =>
  parts.filter(Boolean).join(" ");

/* ---------------------------------------------------------------- Button -- */

type ButtonVariant = "primary" | "ghost";
type ButtonSize = "md" | "lg";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-semibold " +
  "transition-[background-color,border-color,color,transform] duration-[var(--rr-dur-micro)] " +
  "ease-[var(--rr-ease)] active:translate-y-px disabled:opacity-60 disabled:pointer-events-none";

// Every target clears 44x44px, a High-severity rule in ui-ux-pro-max and §4.4.
const buttonSizes: Record<ButtonSize, string> = {
  md: "min-h-[44px] px-5 py-2.5 text-[0.975rem]",
  lg: "min-h-[52px] px-7 py-3 text-[1.0625rem]",
};

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:bg-[var(--btn-primary-bg-hover)]",
  ghost:
    "border border-[var(--btn-ghost-border)] text-[var(--btn-ghost-text)] hover:border-accent hover:text-accent",
};

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      {...rest}
      className={cx(buttonBase, buttonSizes[size], buttonVariants[variant], className)}
    />
  );
}

interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      {...rest}
      className={cx(buttonBase, buttonSizes[size], buttonVariants[variant], className)}
    />
  );
}

/* ------------------------------------------------------------------ Type -- */

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.9rem] font-medium tracking-[0.01em] text-accent">
      {children}
    </p>
  );
}

export function H2({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cx(
        "text-balance text-[clamp(1.9rem,4.2vw,3rem)] font-semibold leading-[1.12] tracking-[-0.02em]",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-[62ch] text-pretty text-[1.075rem] leading-[1.6] text-fg-muted md:text-[1.175rem]">
      {children}
    </p>
  );
}

/* --------------------------------------------------------------- Layout --- */

export function Section({
  children,
  id,
  className,
  tone = "base",
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  /** `raised` lifts the surface a step so adjacent bands separate without a rule. */
  tone?: "base" | "raised" | "sunken";
}) {
  const tones = {
    base: "",
    raised: "bg-band-raised backdrop-blur-[2px]",
    sunken: "bg-band-sunken backdrop-blur-[2px]",
  } as const;
  return (
    <section
      id={id}
      className={cx(
        "relative py-[var(--rr-space-2xl)] md:py-[var(--rr-space-3xl)]",
        tones[tone],
        className,
      )}
    >
      <div className="mx-auto w-full max-w-[1180px] px-6 md:px-10">{children}</div>
    </section>
  );
}

/* ----------------------------------------------------------------- Card --- */

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card-bg)] p-6 md:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------- Fact row --- */

/**
 * A measured value with its label. The number uses the mono face because it is
 * a real measurement; that restriction is what keeps the instrumentation
 * language meaningful rather than decorative.
 */
export function Fact({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div>
      <p className="tabular text-[1.6rem] font-medium leading-none text-accent md:text-[1.9rem]">
        {value}
      </p>
      <p className="mt-2 text-[0.95rem] leading-snug text-fg-muted">{label}</p>
    </div>
  );
}
