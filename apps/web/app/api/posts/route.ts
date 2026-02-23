import { NextResponse } from "next/server";
import { getPaginatedPosts, DEFAULT_PAGE_SIZE } from "../../../lib/notion";

export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(
    50,
    Math.max(1, Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE)
  );
  const tag = searchParams.get("tag") || undefined;
  const search = searchParams.get("search") || undefined;

  const result = await getPaginatedPosts({ page, pageSize, tag, search });

  const posts = result.data.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    date: post.metadata.date,
    tags: post.metadata.tags,
    coverImage: post.coverImage,
    category: post.metadata.category,
    description: post.description,
    author: post.metadata.author,
  }));

  return NextResponse.json({
    posts,
    page: result.page,
    pageSize: result.pageSize,
    total: result.total,
    hasMore: result.hasMore,
  });
}
