"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitEnquiry, type EnquiryState } from "@/app/contact/actions";
import { clinic } from "@/lib/clinic";

/**
 * The only interactive client component on the site.
 *
 * It is a real <form> with a server action, so it submits and validates without
 * JavaScript. The client bundle adds inline errors, a success state and the
 * timing field; none of it is required for the form to work.
 */

const services = [
  { value: "not-sure", label: "Not sure yet" },
  { value: "ultrasound", label: "Ultrasound" },
  { value: "ct", label: "CT" },
  { value: "x-ray", label: "X-ray" },
  { value: "interventional", label: "Interventional procedure" },
];

const fieldBase =
  "w-full rounded-[var(--radius-md)] border bg-[var(--field-bg)] px-4 py-3 text-[1.05rem] " +
  "text-[var(--field-text)] placeholder:text-[var(--field-placeholder)] " +
  "transition-colors duration-[var(--rr-dur-micro)] min-h-[52px]";

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Always a visible label. Placeholder-only labelling is a High-severity
          failure in the ui-ux-pro-max forms rules and disappears on focus. */}
      <label htmlFor={id} className="block text-[0.95rem] font-medium text-fg">
        {label}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-[0.88rem] text-fg-subtle">
          {hint}
        </p>
      ) : null}
      <div className="mt-2">{children}</div>
      {/* Error sits next to its field, never only at the top of the form. */}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 text-[0.92rem] font-medium text-[var(--danger)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function EnquiryForm() {
  const [state, formAction, pending] = useActionState<EnquiryState, FormData>(
    submitEnquiry,
    {},
  );
  const [startedAt, setStartedAt] = useState(0);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => setStartedAt(Date.now()), []);
  useEffect(() => {
    if (state.ok) successRef.current?.focus();
  }, [state.ok]);

  const err = state.fieldErrors ?? {};
  const border = (k: string) =>
    err[k] ? "border-[var(--field-invalid)]" : "border-[var(--field-border)]";

  if (state.ok) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className="rounded-[var(--radius-lg)] border border-accent bg-surface-sunken p-8"
      >
        <h3 className="text-[1.3rem] font-semibold">Thank you, we have that.</h3>
        <p className="mt-3 text-pretty leading-[1.6] text-fg-muted">
          Our clerical team will be in touch. If it is urgent, calling is faster:{" "}
          <a
            href={clinic.phone.href}
            className="tabular font-medium text-accent hover:underline"
          >
            {clinic.phone.display}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-6">
      {state.error ? (
        <p
          role="alert"
          className="rounded-[var(--radius-md)] border border-[var(--danger)] px-4 py-3 text-[0.98rem] text-[var(--danger)]"
        >
          {state.error}
        </p>
      ) : null}

      <Field id="name" label="Your name" error={err.name}>
        <input
          id="name"
          name="name"
          required
          autoComplete="name"
          aria-describedby={err.name ? "name-error" : undefined}
          className={`${fieldBase} ${border("name")}`}
        />
      </Field>

      <Field
        id="phone"
        label="Phone"
        hint="The fastest way for us to reach you."
        error={err.phone}
      >
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          aria-describedby={err.phone ? "phone-error" : "phone-hint"}
          className={`${fieldBase} ${border("phone")}`}
        />
      </Field>

      <Field id="email" label="Email" hint="Optional." error={err.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          aria-describedby={err.email ? "email-error" : "email-hint"}
          className={`${fieldBase} ${border("email")}`}
        />
      </Field>

      <Field id="service" label="What do you need?" error={err.service}>
        <select
          id="service"
          name="service"
          defaultValue="not-sure"
          className={`${fieldBase} ${border("service")}`}
        >
          {services.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        id="message"
        label="Anything else?"
        hint="Optional. Please do not include detailed medical history here."
        error={err.message}
      >
        <textarea
          id="message"
          name="message"
          rows={4}
          aria-describedby={err.message ? "message-error" : "message-hint"}
          className={`${fieldBase} resize-y`}
        />
      </Field>

      {/* Honeypot. Hidden from everyone, including screen readers. */}
      <div aria-hidden className="hidden">
        <label htmlFor="website">Do not fill this in</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="startedAt" value={startedAt} />

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-[52px] w-full items-center justify-center rounded-[var(--radius-md)] bg-[var(--btn-primary-bg)] px-7 font-semibold text-[var(--btn-primary-text)] transition-colors hover:bg-[var(--btn-primary-bg-hover)] disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending..." : "Send enquiry"}
      </button>

      <p className="text-[0.88rem] leading-[1.55] text-fg-subtle">
        We use these details only to respond to your enquiry. We do not share
        them, and this form is not a way to send clinical information. For
        anything urgent, call{" "}
        <a href={clinic.phone.href} className="tabular text-accent hover:underline">
          {clinic.phone.display}
        </a>
        .
      </p>
    </form>
  );
}
