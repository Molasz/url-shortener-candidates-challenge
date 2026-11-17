import { data, Link } from "react-router";
import type { Route } from "./+types/stats.$code";
import {
  baseUrl,
  getUrlStatsUseCase,
  UrlNotFoundError,
} from "@url-shortener/engine";
import { DeleteUrlButton } from "~/components/delete-url-button";
import { ErrorPage } from "~/components/error-page";
import { formatDate, formatNumber } from "~/lib/format";
import { deleteUrlFromForm } from "~/lib/url-actions.server";

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const url = await getUrlStatsUseCase.execute(params.code);

    return {
      found: true as const,
      baseUrl: baseUrl ?? "",
      url: {
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        clickCount: url.clickCount,
        createdAt: url.createdAt.toISOString(),
      },
    };
  } catch (error) {
    if (error instanceof UrlNotFoundError) {
      return data({ found: false as const }, { status: 404 });
    }

    throw error;
  }
}

export async function action({ request }: Route.ActionArgs) {
  return deleteUrlFromForm(request);
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Link details | URL Shortener" },
    {
      name: "description",
      content: "Click statistics for a shortened URL",
    },
  ];
}

export default function UrlStatsDetail({ loaderData }: Route.ComponentProps) {
  if (!loaderData.found) {
    return (
      <ErrorPage
        status={404}
        title="Short link not found"
        message="This short link doesn't exist or has been deleted."
      />
    );
  }

  const { baseUrl, url } = loaderData;
  const shortUrl = `${baseUrl}/s/${url.shortCode}`;

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12 dark:bg-gray-950">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          to="/stats"
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to statistics
        </Link>

        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col gap-4 border-b border-gray-200 p-6 sm:flex-row sm:items-start sm:justify-between dark:border-gray-800">
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase dark:text-gray-500">
                Short link
              </p>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block font-mono text-lg font-semibold break-all text-blue-600 hover:underline dark:text-blue-400"
              >
                {shortUrl}
              </a>
            </div>

            <DeleteUrlButton shortCode={url.shortCode} />
          </div>

          <dl className="grid gap-6 p-6 sm:grid-cols-3">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Clicks
              </dt>
              <dd className="mt-1 text-3xl font-bold tabular-nums text-gray-900 dark:text-gray-50">
                {formatNumber(url.clickCount)}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Created
              </dt>
              <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                <time dateTime={url.createdAt}>
                  {formatDate(url.createdAt)}
                </time>
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </dt>
              <dd className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-green-700 dark:text-green-400">
                <span
                  className="size-2 rounded-full bg-green-500"
                  aria-hidden="true"
                />
                Active
              </dd>
            </div>
          </dl>

          <div className="border-t border-gray-200 p-6 dark:border-gray-800">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Original URL
            </p>
            <p className="mt-1">
              <a
                href={url.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm break-all text-blue-600 hover:underline dark:text-blue-400"
              >
                {url.originalUrl}
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
