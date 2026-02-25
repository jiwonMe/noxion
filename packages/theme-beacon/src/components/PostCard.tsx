import type { PostCardProps } from "@noxion/renderer";

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + (dateStr.includes("T") ? "" : "T00:00:00"));
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function PostCard({ title, slug, date, tags, coverImage, category, description, author }: PostCardProps) {
  return (
    <a href={`/${slug}`} className="">
      {coverImage && (
        <div className="">
          <img src={coverImage} alt={title} loading="lazy" decoding="async" className="" />
        </div>
      )}

      <div className="">
        {category && <span className="">{category}</span>}

        <h3 className="">{title}</h3>

        {description && <p className="">{description}</p>}

        <div className="">
          {author && <span className="">{author}</span>}
          {author && date && <span aria-hidden="true">·</span>}
          {date && (
            <time dateTime={date} className="">
              {formatDate(date)}
            </time>
          )}
        </div>

        {tags.length > 0 && (
          <div className="">
            {tags.map((t) => (
              <span key={t} className="">{t}</span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
