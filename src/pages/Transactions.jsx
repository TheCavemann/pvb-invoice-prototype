import { useEffect, useMemo, useState } from 'react';
import { SearchIcon, FilterIcon } from '../icons/Icons';
import { transactions as allTransactions } from '../data/transactions';
import TransactionsTable from '../components/transactions/TransactionsTable';
import TransactionDetailsSheet from '../components/shared/TransactionDetailsSheet';

export default function Transactions() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedTxn, setSelectedTxn] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allTransactions;
    return allTransactions.filter((txn) =>
      [txn.id, txn.businessName, txn.description].join(' ').toLowerCase().includes(q),
    );
  }, [search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageTransactions = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transaction"
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          <FilterIcon className="h-4 w-4" />
          Filter
        </button>
      </div>

      <TransactionsTable
        transactions={pageTransactions}
        page={currentPage}
        pageCount={pageCount}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onRowClick={setSelectedTxn}
      />

      <TransactionDetailsSheet transaction={selectedTxn} onClose={() => setSelectedTxn(null)} />
    </div>
  );
}
