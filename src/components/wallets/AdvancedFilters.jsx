import { useEffect, useState } from 'react';
import { ChevronDownIcon } from '../../icons/Icons';
import { WALLET_TYPES, emptyAdvancedFilters } from '../../data/filterDefaults';

function countActive(filters) {
  let count = 0;
  if (filters.types.length) count += 1;
  if (filters.status) count += 1;
  if (filters.dateFrom || filters.dateTo) count += 1;
  if (filters.balanceMin || filters.balanceMax) count += 1;
  return count;
}

export default function AdvancedFilters({ filters, onApply }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  const toggleType = (type) => {
    setDraft((d) => ({
      ...d,
      types: d.types.includes(type) ? d.types.filter((t) => t !== type) : [...d.types, type],
    }));
  };

  const activeCount = countActive(filters);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
      >
        Advanced filters
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-blue px-1 text-xs font-semibold text-white">
            {activeCount}
          </span>
        )}
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-2 w-full max-w-xl rounded-xl border border-gray-200 bg-white p-4 sm:w-[420px]">
          <div className="space-y-4">
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Wallet type
              </p>
              <div className="flex flex-wrap gap-1.5">
                {WALLET_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleType(type)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      draft.types.includes(type)
                        ? 'border-brand-blue bg-brand-lavender text-brand-blue'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Date created
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={draft.dateFrom}
                  onChange={(e) => setDraft((d) => ({ ...d, dateFrom: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm text-gray-700 focus:border-brand-blue focus:outline-none"
                />
                <span className="text-xs text-gray-400">to</span>
                <input
                  type="date"
                  value={draft.dateTo}
                  onChange={(e) => setDraft((d) => ({ ...d, dateTo: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm text-gray-700 focus:border-brand-blue focus:outline-none"
                />
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Balance range (₦)
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={draft.balanceMin}
                  onChange={(e) => setDraft((d) => ({ ...d, balanceMin: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-blue focus:outline-none"
                />
                <span className="text-xs text-gray-400">to</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={draft.balanceMax}
                  onChange={(e) => setDraft((d) => ({ ...d, balanceMax: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-blue focus:outline-none"
                />
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </p>
              <div className="flex gap-1.5">
                {[
                  { value: '', label: 'All' },
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, status: opt.value }))}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      draft.status === opt.value
                        ? 'border-brand-blue bg-brand-lavender text-brand-blue'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={() => {
                setDraft(emptyAdvancedFilters);
                onApply(emptyAdvancedFilters);
              }}
              className="text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={() => {
                onApply(draft);
                setOpen(false);
              }}
              className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-dark"
            >
              Apply filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
