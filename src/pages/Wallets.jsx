import { useEffect, useMemo, useState } from 'react';
import { wallets as allWallets, businessNames, branchNames } from '../data/wallets';
import { emptyFilters } from '../data/filterDefaults';
import SearchBar from '../components/wallets/SearchBar';
import FilterPanel from '../components/wallets/FilterPanel';
import WalletsTable from '../components/wallets/WalletsTable';

const DEMO_STATES = [
  { value: 'success', label: 'Success' },
  { value: 'loading', label: 'Loading' },
  { value: 'error', label: 'Error' },
];

function matchesFilters(wallet, search, filters) {
  const q = search.trim().toLowerCase();
  if (q) {
    const haystack = [
      wallet.id,
      wallet.accountNumber,
      wallet.accountName,
      wallet.businessName,
    ]
      .join(' ')
      .toLowerCase();
    if (!haystack.includes(q)) return false;
  }

  if (filters.types.length && !filters.types.includes(wallet.walletType)) return false;
  if (filters.business && wallet.businessName !== filters.business) return false;
  if (filters.branch && wallet.branchName !== filters.branch) return false;
  if (filters.status && wallet.status !== filters.status) return false;
  if (filters.dateFrom && wallet.dateCreated < filters.dateFrom) return false;
  if (filters.dateTo && wallet.dateCreated > filters.dateTo) return false;
  if (filters.balanceMin && wallet.balance < Number(filters.balanceMin)) return false;
  if (filters.balanceMax && wallet.balance > Number(filters.balanceMax)) return false;

  return true;
}

export default function Wallets() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [demoState, setDemoState] = useState('loading');

  useEffect(() => {
    if (demoState !== 'loading') return;
    const timer = setTimeout(() => setDemoState('success'), 700);
    return () => clearTimeout(timer);
  }, [demoState]);

  useEffect(() => {
    setPage(1);
  }, [search, filters, pageSize]);

  const filtered = useMemo(
    () => allWallets.filter((wallet) => matchesFilters(wallet, search, filters)),
    [search, filters],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageWallets = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleRetry = () => setDemoState('loading');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <SearchBar value={search} onChange={setSearch} />
          <FilterPanel
            filters={filters}
            onApply={setFilters}
            businessNames={businessNames}
            branchNames={branchNames}
          />
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 text-xs font-medium text-gray-500">
          <span className="px-2 text-gray-400">Preview state:</span>
          {DEMO_STATES.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setDemoState(opt.value)}
              className={`rounded-md px-2.5 py-1 transition-colors ${
                demoState === opt.value
                  ? 'bg-brand-lavender text-brand-blue'
                  : 'hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <WalletsTable
        status={demoState}
        wallets={pageWallets}
        onRetry={handleRetry}
        totalCount={filtered.length}
        page={currentPage}
        pageCount={pageCount}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
