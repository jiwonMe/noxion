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
