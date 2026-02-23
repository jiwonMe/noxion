import { createHmac, timingSafeEqual } from "node:crypto";
import type { NoxionConfig } from "@noxion/core";

type NotionWebhookEventType =
  | "page.properties_updated"
  | "page.content_updated"
  | "page.created"
  | "page.deleted"
  | "page.undeleted"
  | string;

/** @see https://developers.notion.com/reference/webhook-payloads */
interface NotionWebhookPayload {
  id: string;
  timestamp: string;
  workspace_id: string;
  workspace_name?: string;
  subscription_id: string;
  integration_id: string;
  type: NotionWebhookEventType;
  attempt_number: number;
  authors?: Array<{ id: string; type: string }>;
  entity: {
    id: string;
    type: string;
  };
  data?: {
    parent?: { id: string; type: string };
    updated_properties?: Array<{ id: string; name: string }>;
    updated_blocks?: Array<{ id: string; type: string }>;
  };
  verification_token?: string;
}

export interface NotionWebhookHandlerOptions {
  config: NoxionConfig;
  revalidatePath: (path: string) => void;
  /**
   * Webhook verification token from Notion for HMAC-SHA256 signature validation.
   * Falls back to `NOTION_WEBHOOK_SECRET` environment variable.
   */
  webhookSecret?: string;
}

const HANDLED_EVENTS: NotionWebhookEventType[] = [
  "page.properties_updated",
  "page.content_updated",
  "page.created",
  "page.deleted",
  "page.undeleted",
];

function verifySignature(
  rawBody: string,
  signatureHeader: string,
  secret: string
): boolean {
  const calculated = `sha256=${createHmac("sha256", secret).update(rawBody).digest("hex")}`;
  try {
    return timingSafeEqual(
      Buffer.from(calculated),
      Buffer.from(signatureHeader)
    );
  } catch {
    return false;
  }
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Creates a Next.js route handler that receives Notion Integration Webhooks
 * and triggers on-demand ISR revalidation.
 *
 * @example
 * ```ts
 * // app/api/notion-webhook/route.ts
 * import { revalidatePath } from "next/cache";
 * import { createNotionWebhookHandler } from "@noxion/adapter-nextjs";
 * import { siteConfig } from "../../../lib/config";
 *
 * const handler = createNotionWebhookHandler({
 *   config: siteConfig,
 *   revalidatePath,
 * });
 *
 * export async function POST(request: Request) {
 *   return handler(request);
 * }
 * ```
 */
export function createNotionWebhookHandler(
  options: NotionWebhookHandlerOptions
) {
  const { revalidatePath } = options;
  const secret =
    options.webhookSecret ?? process.env.NOTION_WEBHOOK_SECRET;

  return async function handler(request: Request) {
    const rawBody = await request.text();

    let payload: NotionWebhookPayload;
    try {
      payload = JSON.parse(rawBody) as NotionWebhookPayload;
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    // --- Verification handshake (one-time during subscription setup) ---
    if (payload.verification_token) {
      console.log(
        "[noxion] Notion webhook verification token received:",
        payload.verification_token
      );
      return json({
        message: "Verification token received. Paste this token in your Notion integration settings to complete verification.",
        verification_token: payload.verification_token,
      });
    }

    // --- HMAC-SHA256 signature validation ---
    if (secret) {
      const signature = request.headers.get("x-notion-signature");
      if (!signature || !verifySignature(rawBody, signature, secret)) {
        return json({ error: "Invalid signature" }, 401);
      }
    }

    // --- Event routing ---
    const { type: eventType, entity } = payload;
    const entityId = entity?.id;

    if (entity?.type !== "page") {
      return json({ skipped: true, reason: `Unhandled entity type: ${entity?.type}` });
    }

    if (!HANDLED_EVENTS.includes(eventType)) {
      return json({ skipped: true, reason: `Unhandled event type: ${eventType}` });
    }

    revalidatePath("/");
    revalidatePath("/tag/[tag]");

    console.log(
      `[noxion] Webhook: ${eventType} for page ${entityId}` +
        (payload.data?.updated_properties
          ? ` (properties: ${payload.data.updated_properties.map((p) => p.name).join(", ")})`
          : "")
    );

    return json({ revalidated: true, event: eventType, entityId });
  };
}
