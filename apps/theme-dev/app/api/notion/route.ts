import { NextRequest, NextResponse } from "next/server";
import { NotionAPI } from "notion-client";

const notion = new NotionAPI();

export async function GET(req: NextRequest) {
  const pageId = req.nextUrl.searchParams.get("pageId");
  if (!pageId) {
    return NextResponse.json({ error: "pageId is required" }, { status: 400 });
  }

  const cleaned = pageId.replace(/[^a-f0-9-]/gi, "");
  if (cleaned.length < 20) {
    return NextResponse.json({ error: "Invalid page ID format" }, { status: 400 });
  }

  try {
    const recordMap = await notion.getPage(cleaned);
    return NextResponse.json(recordMap);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to fetch page";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
