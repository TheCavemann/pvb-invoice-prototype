import { useEffect, useMemo, useState } from 'react';
import { wallets as allWallets } from '../data/wallets';
import { emptyAdvancedFilters } from '../data/filterDefaults';
import WalletSearchCard from '../components/wallets/WalletSearchCard';
import AdvancedFilters from '../components/wallets/AdvancedFilters';
import WalletsTable from '../components/wallets/WalletsTable';

const SEARCH_TYPES = [
  { value: 'walletId', label: 'Wallet ID' },
  { value: 'accountNumber', label: 'Account Number' },
  { value: 'businessName', label: 'Business Name' },
  { value: 'branchName', label: 'Branch Name' },
];

const MULTI_RESULT_TYPES = ['businessName', 'branchName'];

const DEMO_STATES = [
  { value: 'success', label: 'Success' },
  { value: 'loading', label: 'Loading' },
  { value: 'error', label: 'Error' },
];

function runSearch(searchType, searchValue) {
  const q = searchValue.trim().toLowerCase();
  if (!q) return [];

  switch (searchType) {
    case 'walletId':
      return allWallets.filter((wallet) => wallet.id.toLowerCase() === q);
    case 'accountNumber':
      return allWallets.filter((wallet) => wallet.accountNumber.toLowerCase() === q);
    case 'businessName':
      return allWallets.filter((wallet) => wallet.businessName.toLowerCase().includes(q));
    case 'branchName':
      return allWallets.filter((wallet) => wallet.branchName.toLowerCase().includes(q));
    default:
      return [];
  }
}

function matchesAdvancedFilters(wallet, filters) {
  if (filters.types.length && !filters.types.includes(wallet.walletType)) return false;
  if (filters.status && wallet.status !== filters.status) return false;
  if (filters.dateFrom && wallet.dateCreatedISO < filters.dateFrom) return false;
  if (filters.dateTo && wallet.dateCreatedISO > filters.dateTo) return false;
  if (filters.balanceMin && wallet.balance < Number(filters.balanceMin)) return false;
  if (filters.balanceMax && wallet.balance > Number(filters.balanceMax)) return false;
  return true;
}

export default function Wallets() {
  const [searchType, setSearchType] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState(emptyAdvancedFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [demoState, setDemoState] = useState('success');

  const baseResults = useMemo(() => {
    if (!hasSearched) return [];
    return runSearch(searchType, searchValue);
  }, [hasSearched, searchType, searchValue]);

  const showAdvancedFilters =
    hasSearched && MULTI_RESULT_TYPES.includes(searchType) && baseResults.length > 1;

  const filteredResults = useMemo(() => {
    if (!showAdvancedFilters) return baseResults;
    return baseResults.filter((wallet) => matchesAdvancedFilters(wallet, advancedFilters));
  }, [baseResults, advancedFilters, showAdvancedFilters]);

  useEffect(() => {
    setPage(1);
  }, [filteredResults, pageSize]);

  useEffect(() => {
    if (demoState !== 'loading') return;
    const timer = setTimeout(() => setDemoState('success'), 600);
    return () => clearTimeout(timer);
  }, [demoState]);

  const pageCount = Math.max(1, Math.ceil(filteredResults.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageResults = filteredResults.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearch = () => {
    if (!searchType || !searchValue.trim()) return;
    setHasSearched(true);
    setAdvancedFilters(emptyAdvancedFilters);
    setPage(1);
    setDemoState('loading');
  };

  const handleClear = () => {
    setSearchType('');
    setSearchValue('');
    setHasSearched(false);
    setAdvancedFilters(emptyAdvancedFilters);
    setPage(1);
    setDemoState('success');
  };

  const handleRetry = () => setDemoState('loading');

  return (
    <div className="space-y-4">
      <WalletSearchCard
        searchTypes={SEARCH_TYPES}
        searchType={searchType}
        onSearchTypeChange={setSearchType}
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        onSearch={handleSearch}
        onClear={handleClear}
        hasSearched={hasSearched}
      />

      {hasSearched && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              {showAdvancedFilters && (
                <AdvancedFilters filters={advancedFilters} onApply={setAdvancedFilters} />
              )}
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
            wallets={pageResults}
            onRetry={handleRetry}
            totalCount={filteredResults.length}
            page={currentPage}
            pageCount={pageCount}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}
    </div>
  );
}
