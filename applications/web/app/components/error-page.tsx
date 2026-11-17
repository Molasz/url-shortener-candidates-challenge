import { Link } from "react-router";

interface ErrorPageProps {
  status: number;
  title: string;
  message: string;
  stack?: string;
}

export function ErrorPage({ status, title, message, stack }: ErrorPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-16 dark:bg-gray-950">
      <div className="w-full max-w-xl text-center">
        <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase dark:text-gray-500">
          Error {status}
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          {title}
        </h1>

        <p className="mt-4 text-base text-gray-600 dark:text-gray-300">
          {message}
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300 dark:focus-visible:ring-gray-100 dark:focus-visible:ring-offset-gray-950"
        >
          Back to home
        </Link>

        {stack && (
          <pre className="mt-10 max-h-80 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-left text-xs leading-relaxed text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </main>
  );
}
