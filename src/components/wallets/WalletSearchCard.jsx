const PLACEHOLDERS = {
  walletId: 'e.g. PVB-WL-28150057',
  accountNumber: 'e.g. 3042704238',
  businessName: 'e.g. Zenith Foodstuffs Limited',
  branchName: 'e.g. Head Office',
  transactionReference: 'e.g. PSP-REF-227592439',
  sessionId: 'e.g. SESS-7592276801',
};

export default function WalletSearchCard({
  searchTypes,
  searchType,
  onSearchTypeChange,
  searchValue,
  onSearchValueChange,
  onSearch,
  onClear,
  hasSearched,
}) {
  const canSearch = Boolean(searchType) && searchValue.trim().length > 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <p className="text-base font-bold text-gray-900">Search wallets</p>
      <p className="mt-1 text-sm text-gray-500">
        Choose what you want to search by, then enter a value to find a wallet.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Search with
          </label>
          <select
            value={searchType}
            onChange={(e) => onSearchTypeChange(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:border-brand-blue focus:outline-none"
          >
            <option value="">Select a search type</option>
            {searchTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {searchType && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Search value
            </label>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchValueChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && canSearch) onSearch();
              }}
              placeholder={PLACEHOLDERS[searchType]}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button
          type="button"
          onClick={onSearch}
          disabled={!canSearch}
          className="rounded-lg bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          Search
        </button>
        {hasSearched && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
