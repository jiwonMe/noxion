import type { NextRequest } from "next/server";
import type { NoxionConfig } from "@noxion/core";

export interface RevalidateHandlerOptions {
  config: NoxionConfig;
  revalidatePath: (path: string) => void;
}

export function createRevalidateHandler(options: RevalidateHandlerOptions) {
  const { config, revalidatePath } = options;
  const secret = config.revalidateSecret ?? process.env.REVALIDATE_SECRET;

  return async function handler(request: NextRequest) {
    const body = await request.json().catch(() => ({}));
    const token = (body as Record<string, unknown>).secret as string | undefined;

    if (!secret) {
      return new Response(
        JSON.stringify({ error: "Revalidation secret not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (token !== secret) {
      return new Response(
        JSON.stringify({ error: "Invalid secret" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const slug = (body as Record<string, unknown>).slug as string | undefined;

    revalidatePath("/");
    if (slug) {
      revalidatePath(`/${slug}`);
    }

    return new Response(
      JSON.stringify({ revalidated: true, slug: slug ?? null }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  };
}
