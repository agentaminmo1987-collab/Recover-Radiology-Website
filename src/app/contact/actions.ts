"use server";

import { headers } from "next/headers";
import {
  enquirySchema,
  enquiryDriver,
  rateLimited,
  MIN_SUBMIT_MS,
} from "@/lib/enquiry";

export interface EnquiryState {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Enquiry submission.
 *
 * Order matters: rate limit, then parse, then spam checks, then store. Nothing
 * touches the driver until every gate has passed.
 *
 * The honeypot and the too-fast check both return a *success* state without
 * storing anything. Telling a bot it was detected only helps it adapt.
 */
export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return {
      error:
        "That is a few enquiries in a short time. Please call us on 08 7081 3078 instead.",
    };
  }

  const parsed = enquirySchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
    service: formData.get("service") ?? "not-sure",
    message: formData.get("message") ?? "",
    website: formData.get("website") ?? "",
    startedAt: formData.get("startedAt") ?? 0,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { error: "Please check the highlighted fields.", fieldErrors };
  }

  const data = parsed.data;

  // Honeypot filled, or submitted implausibly fast. Look successful, store nothing.
  const elapsed = Date.now() - Number(data.startedAt || 0);
  if (data.website || (data.startedAt > 0 && elapsed < MIN_SUBMIT_MS)) {
    return { ok: true };
  }

  try {
    await enquiryDriver().save({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      service: data.service,
      message: data.message || null,
      receivedAt: new Date().toISOString(),
    });
  } catch (err) {
    // Never log the submission itself. Message only, no personal data.
    console.error(
      "[enquiry] save failed:",
      err instanceof Error ? err.message : "unknown error",
    );
    return {
      error:
        "We could not send that just now. Please call us on 08 7081 3078 and we will help straight away.",
    };
  }

  return { ok: true };
}
