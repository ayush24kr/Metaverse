'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-slate-950 text-slate-100 flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-bold text-rose-400 mb-4">Something went wrong!</h2>
        <button
          onClick={() => reset()}
          className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
