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
