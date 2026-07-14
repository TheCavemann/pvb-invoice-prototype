import { SearchIcon, FilterIcon } from '../icons/Icons';

export default function Transactions() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            disabled
            placeholder="Search transaction"
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
          />
        </div>
        <button
          type="button"
          disabled
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600"
        >
          <FilterIcon className="h-4 w-4" />
          Filter
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <p className="text-sm text-gray-500">
          This is a prototype stub for the Transactions page. Full detail lives on the{' '}
          <span className="font-medium text-gray-700">Wallets</span> page for this review.
        </p>
      </div>
    </div>
  );
}
