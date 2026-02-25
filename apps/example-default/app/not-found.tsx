import Link from "next/link";
import { EmptyState } from "@noxion/theme-default";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6">
      <EmptyState
        title="404"
        message="This page could not be found."
      />
      <Link
        href="/"
        className="px-6 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
