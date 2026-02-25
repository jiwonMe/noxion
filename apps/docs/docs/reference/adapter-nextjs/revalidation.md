---
title: Revalidation & Webhooks
description: "@noxion/adapter-nextjs revalidation handlers — createRevalidateHandler and createNotionWebhookHandler"
---

# Revalidation & Webhooks

```ts
import {
  createRevalidateHandler,
  createNotionWebhookHandler,
} from "@noxion/adapter-nextjs";
```

---

## `createRevalidateHandler()`

Creates a route handler for on-demand ISR revalidation.

### Signature

```ts
function createRevalidateHandler(options: {
  config: NoxionConfig;
  revalidatePath: (path: string) => void;
}): (request: NextRequest) => Promise<Response>
```

### Request format

`POST /api/revalidate` with JSON body:

```json
{
  "secret": "YOUR_REVALIDATE_SECRET",
  "slug": "my-post-slug"
}
```

- `secret` is required
- `slug` is optional
- handler always revalidates `/`
- when `slug` is provided, handler also revalidates `/${slug}`

### Route usage

```ts
// app/api/revalidate/route.ts
import { revalidatePath } from "next/cache";
import { createRevalidateHandler } from "@noxion/adapter-nextjs";
import { siteConfig } from "../../../lib/config";

const handler = createRevalidateHandler({
  config: siteConfig,
  revalidatePath,
});

export async function POST(request: Request) {
  return handler(request as never);
}
```

---

## `createNotionWebhookHandler()`

Creates a route handler for Notion Integration Webhooks and triggers revalidation when supported page events arrive.

### Signature

```ts
function createNotionWebhookHandler(options: {
  config: NoxionConfig;
  revalidatePath: (path: string) => void;
  webhookSecret?: string;
}): (request: Request) => Promise<Response>
```

### Supported event types

- `page.properties_updated`
- `page.content_updated`
- `page.created`
- `page.deleted`
- `page.undeleted`

### Behavior

- Parses and validates webhook payload JSON
- Handles Notion verification token handshake
- Validates `x-notion-signature` when secret is configured
- Revalidates `/` and `/tag/[tag]` for supported page events

### Route usage

```ts
// app/api/notion-webhook/route.ts
import { revalidatePath } from "next/cache";
import { createNotionWebhookHandler } from "@noxion/adapter-nextjs";
import { siteConfig } from "../../../lib/config";

const handler = createNotionWebhookHandler({
  config: siteConfig,
  revalidatePath,
});

export async function POST(request: Request) {
  return handler(request);
}
```
