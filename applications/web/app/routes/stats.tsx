import { Link } from "react-router";
import type { Route } from "./+types/stats";
import { baseUrl, listUrlsUseCase } from "@url-shortener/engine";
import { DeleteUrlButton } from "~/components/delete-url-button";
import { formatDate, formatNumber } from "~/lib/format";
import { deleteUrlFromForm } from "~/lib/url-actions.server";

export async function loader() {
  const urls = await listUrlsUseCase.execute();

  return {
    baseUrl: baseUrl ?? "",
    urls: urls.map((url) => ({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      clickCount: url.clickCount,
      createdAt: url.createdAt.toISOString(),
    })),
  };
}

export async function action({ request }: Route.ActionArgs) {
  return deleteUrlFromForm(request);
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Statistics | URL Shortener" },
    {
      name: "description",
      content: "Click statistics for your shortened URLs",
    },
  ];
}

export default function Stats({ loaderData }: Route.ComponentProps) {
  const { baseUrl, urls } = loaderData;
  const totalClicks = urls.reduce((sum, url) => sum + url.clickCount, 0);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12 dark:bg-gray-950">
      <div className="mx-auto w-full max-w-4xl">
        <header>
          <Link
            to="/"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            ← Back to shortener
          </Link>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Statistics
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Every active short link and how many times it has been visited.
          </p>
        </header>

        <section
          className="mt-8 grid gap-4 sm:grid-cols-2"
          aria-label="Summary"
        >
          <SummaryCard label="Active links" value={urls.length} />
          <SummaryCard label="Total clicks" value={totalClicks} />
        </section>

        {urls.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              No links yet
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Shorten your first URL to start collecting click statistics.
            </p>
            <Link
              to="/"
              className="mt-5 inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
            >
              Create a short link
            </Link>
          </div>
        ) : (
          <ul className="mt-8 divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
            {urls.map((url) => (
              <li
                key={url.shortCode}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <a
                    href={`${baseUrl}/s/${url.shortCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm font-semibold break-all text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {baseUrl}/s/{url.shortCode}
                  </a>
                  <p
                    className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400"
                    title={url.originalUrl}
                  >
                    {url.originalUrl}
                  </p>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    Created <time dateTime={url.createdAt}>{formatDate(url.createdAt)}</time>
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <div className="flex items-baseline gap-2 sm:flex-col sm:items-end">
                    <span className="text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-50">
                      {formatNumber(url.clickCount)}
                    </span>
                    <span className="text-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
                      {url.clickCount === 1 ? "click" : "clicks"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to={`/stats/${url.shortCode}`}
                      className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Details
                    </Link>
                    <DeleteUrlButton shortCode={url.shortCode} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-3xl font-bold tabular-nums text-gray-900 dark:text-gray-50">
        {formatNumber(value)}
      </p>
    </div>
  );
}
