"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitEnquiry, type EnquiryState } from "@/app/contact/actions";
import { clinic } from "@/lib/clinic";
import { ACCEPT_ATTR } from "@/lib/upload-constants";

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

/**
 * Parts of the day, not clock times. The clinic books against real availability
 * by phone, so offering "10:15am" would read as a slot the visitor had secured.
 */
const times = [
  { value: "", label: "No preference" },
  { value: "morning", label: "Morning" },
  { value: "midday", label: "Around midday" },
  { value: "afternoon", label: "Afternoon" },
  { value: "any", label: "Whatever is soonest" },
];

const isoDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

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
  const [picked, setPicked] = useState(0);
  /**
   * Date bounds are set after mount rather than at render.
   *
   * "Today" depends on the visitor's timezone, so computing it during SSR gives
   * the server one answer and the browser another, which is a hydration
   * mismatch. Until the effect runs the input simply has no bounds, and the
   * server revalidates the same window regardless.
   */
  const [bounds, setBounds] = useState({ min: "", max: "" });
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStartedAt(Date.now());
    const now = new Date();
    const limit = new Date(now);
    limit.setMonth(limit.getMonth() + 6);
    setBounds({ min: isoDay(now), max: isoDay(limit) });
  }, []);
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
        <p className="mt-3 text-pretty leading-[1.6] text-fg-muted" data-confirm-lede>
          Our clerical team will be in touch to confirm a time. If it is urgent,
          calling is faster:{" "}
          <a
            href={clinic.phone.href}
            className="tabular font-medium text-accent hover:underline"
          >
            {clinic.phone.display}
          </a>
          .
        </p>

        {/* The confirmation used to be a dead end: the one moment a visitor is
            most engaged, and the page gave them nowhere to go.

            These are ordered by what actually happens next, not by what we
            would like them to read. Preparation comes first because some scans
            need fasting or a full bladder and getting that wrong costs the
            patient a second trip. Cost is second because it is the most common
            unasked question. */}
        <div className="mt-8 border-t border-[var(--card-border)] pt-6">
          <h4 className="text-[0.8rem] font-semibold tracking-[0.01em] text-fg-subtle">
            While you wait to hear from us
          </h4>
          <ul className="mt-4 grid gap-3">
            {[
              {
                href: "/patient-information",
                label: "Preparing for your scan",
                hint: "Some scans need fasting or a full bladder. Worth checking now.",
              },
              {
                href: "/billing",
                label: "What it will cost",
                hint: "Most services are bulk billed. The exceptions are listed.",
              },
              {
                href: "/our-clinic",
                label: "See the clinic",
                hint: "The rooms, the parking, and where to find the door.",
              },
            ].map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group flex min-h-[56px] items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--card-border)] bg-[var(--card-bg)] px-5 py-3 transition-colors hover:border-accent"
                >
                  <span>
                    <span className="block font-semibold text-fg">{l.label}</span>
                    <span className="mt-0.5 block text-[0.88rem] leading-[1.4] text-fg-subtle">
                      {l.hint}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="shrink-0 text-accent transition-transform group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    // encType is explicit so the form still carries files when the action falls
    // back to a plain browser POST with JavaScript unavailable.
    <form
      action={formAction}
      encType="multipart/form-data"
      noValidate
      className="space-y-6"
    >
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

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id="preferredDate"
          label="Preferred date"
          hint="Optional. We will confirm by phone."
          error={err.preferredDate}
        >
          <input
            id="preferredDate"
            name="preferredDate"
            type="date"
            min={bounds.min || undefined}
            max={bounds.max || undefined}
            aria-describedby={
              err.preferredDate ? "preferredDate-error" : "preferredDate-hint"
            }
            className={`${fieldBase} ${border("preferredDate")}`}
          />
        </Field>

        <Field
          id="preferredTime"
          label="Preferred time"
          hint="Optional."
          error={err.preferredTime}
        >
          <select
            id="preferredTime"
            name="preferredTime"
            defaultValue=""
            aria-describedby={
              err.preferredTime ? "preferredTime-error" : "preferredTime-hint"
            }
            className={`${fieldBase} ${border("preferredTime")}`}
          >
            {times.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        id="referral"
        label="Your referral"
        hint="Optional. A photo of the paper form is fine. PDF, JPG, PNG or HEIC, up to 3 files, 10MB each."
        error={err.referral}
      >
        <input
          id="referral"
          name="referral"
          type="file"
          multiple
          accept={ACCEPT_ATTR}
          onChange={(e) => setPicked(Array.from(e.target.files ?? []).length)}
          aria-describedby={err.referral ? "referral-error" : "referral-hint"}
          className={
            "w-full rounded-[var(--radius-md)] border border-dashed px-4 py-3 text-[1.05rem] " +
            "text-fg-muted min-h-[52px] " +
            "file:mr-4 file:rounded-[var(--radius-sm)] file:border-0 " +
            "file:bg-surface-sunken file:px-4 file:py-2 file:text-[0.95rem] " +
            "file:font-semibold file:text-accent " +
            (err.referral
              ? "border-[var(--field-invalid)]"
              : "border-[var(--field-border)]")
          }
        />
        {picked > 0 ? (
          <p role="status" className="mt-2 text-[0.9rem] text-fg-muted">
            {picked === 1 ? "1 file ready to send." : `${picked} files ready to send.`}
          </p>
        ) : null}
      </Field>

      <Field
        id="message"
        label="Anything else?"
        hint="Optional. Your referral tells us what we need, so there is no need to retype your medical history here."
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
        We use these details, and anything you attach, only to book and carry out
        your scan. Referrals are stored securely and are not shared outside the
        practice and your referring doctor. See our{" "}
        <a href="/legal/privacy" className="text-accent hover:underline">
          privacy notice
        </a>
        . This form is not monitored outside business hours, so for anything
        urgent please call{" "}
        <a href={clinic.phone.href} className="tabular text-accent hover:underline">
          {clinic.phone.display}
        </a>
        .
      </p>
    </form>
  );
}
