import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { wallets } from '../data/wallets';
import { transactions as allTransactions } from '../data/transactions';
import { formatNaira } from '../utils/format';
import TransactionsTable from '../components/transactions/TransactionsTable';
import TransactionDetailsSheet from '../components/shared/TransactionDetailsSheet';
import { ArrowLeftIcon, CopyIcon, SearchIcon } from '../icons/Icons';

export default function WalletTransactions() {
  const { walletId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const highlightTransactionId = location.state?.highlightTransactionId ?? null;
  const wallet = wallets.find((w) => w.id === walletId);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  const walletTransactions = useMemo(
    () => allTransactions.filter((txn) => txn.walletId === walletId),
    [walletId],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return walletTransactions;
    return walletTransactions.filter((txn) =>
      [txn.id, txn.businessName, txn.from, txn.to, txn.description]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [walletTransactions, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageTransactions = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    if (!highlightTransactionId) return;
    const idx = filtered.findIndex((txn) => txn.id === highlightTransactionId);
    if (idx >= 0) setPage(Math.floor(idx / pageSize) + 1);
  }, [highlightTransactionId, filtered, pageSize]);

  useEffect(() => {
    if (!highlightTransactionId) return;
    const txn = walletTransactions.find((t) => t.id === highlightTransactionId);
    if (txn) setSelectedTxn(txn);
  }, [highlightTransactionId, walletTransactions]);

  if (!wallet) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <p className="text-sm text-gray-500">Wallet not found.</p>
        <button
          type="button"
          onClick={() => navigate('/wallets')}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue hover:underline"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to wallets
        </button>
      </div>
    );
  }

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(wallet.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be denied in some environments; fail silently.
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Transactions for {wallet.walletName} ~ {formatNaira(wallet.balance)}
          </h2>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
            <span className="font-mono">{wallet.id}</span>
            <button
              type="button"
              onClick={handleCopyId}
              aria-label="Copy wallet ID"
              className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <CopyIcon className="h-3.5 w-3.5" />
            </button>
            {copied && <span className="text-xs font-medium text-success">Copied</span>}
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/wallets')}
          className="flex items-center gap-1.5 text-sm font-medium text-brand-blue hover:underline"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to wallets
        </button>
      </div>

      <div className="relative w-full max-w-sm">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search transactions"
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
        />
      </div>

      <TransactionsTable
        transactions={pageTransactions}
        page={currentPage}
        pageCount={pageCount}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onRowClick={setSelectedTxn}
        highlightRowId={highlightTransactionId}
      />

      <TransactionDetailsSheet transaction={selectedTxn} onClose={() => setSelectedTxn(null)} />
    </div>
  );
}
