const COLUMN_COUNT = 10;

export function SkeletonRows({ rows = 8 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100 last:border-b-0">
          {Array.from({ length: COLUMN_COUNT }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div className="h-3.5 w-full max-w-[110px] animate-pulse rounded bg-gray-100" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function EmptyState({
  message = 'No wallet found — check the ID or account number and try again',
}) {
  return (
    <tr>
      <td colSpan={COLUMN_COUNT} className="px-4 py-16 text-center">
        <p className="text-sm font-medium text-gray-500">{message}</p>
      </td>
    </tr>
  );
}

export function ErrorState({ onRetry }) {
  return (
    <tr>
      <td colSpan={COLUMN_COUNT} className="px-4 py-16 text-center">
        <p className="mb-3 text-sm font-medium text-gray-500">
          Something went wrong loading wallets — retry
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-dark"
        >
          Retry
        </button>
      </td>
    </tr>
  );
}
