import { useState } from 'react';
import { formatNaira } from '../../utils/format';
import { formatTransactionDate } from '../../data/transactions';
import { CloseIcon, CopyIcon, PrinterIcon } from '../../icons/Icons';
import StatusBadge from './StatusBadge';

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}

function CopyableField({ label, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be denied in some environments; fail silently.
    }
  };

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        <p className="font-mono text-sm font-medium text-gray-900">{value}</p>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${label}`}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <CopyIcon className="h-3.5 w-3.5" />
        </button>
        {copied && <span className="text-xs font-medium text-success">Copied</span>}
      </div>
    </div>
  );
}

export default function TransactionDetailsSheet({ transaction, onClose }) {
  if (!transaction) return null;

  const isOutflow = transaction.type === 'Outflow';

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-black/30"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-[440px] flex-col overflow-y-auto bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <p className="text-lg font-bold text-gray-900">Transaction Details</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-6 px-5 py-5">
          <div className="rounded-xl bg-success-bg p-5 text-center">
            <p className={`text-2xl font-bold ${isOutflow ? 'text-danger' : 'text-success'}`}>
              {isOutflow ? '-' : '+'}
              {formatNaira(transaction.amount)}
            </p>
            <p className="mt-1 text-sm text-gray-600">From: {transaction.from}</p>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            <Field label="Transaction ID" value={transaction.id} />
            <Field label="Account type" value={transaction.accountType} />
            <Field label="Account name" value={transaction.accountName} />
            <Field label="Destination Account" value={transaction.destinationAccount} />
            <Field label="Transaction type" value={transaction.type} />
            <Field label="Transaction category" value={transaction.category} />
            <Field label="Date" value={formatTransactionDate(transaction.date)} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Status</p>
              <div className="mt-1">
                <StatusBadge status={transaction.status} />
              </div>
            </div>
            <Field label="Business" value={transaction.businessName} />
            <Field label="Fee" value={formatNaira(transaction.fee)} />
          </div>

          <div className="space-y-5 border-t border-gray-100 pt-5">
            <Field label="Description" value={transaction.description} />
            <CopyableField label="Provider Reference" value={transaction.providerReference} />
            <CopyableField label="Peer reference" value={transaction.peerReference} />
            <CopyableField label="Session ID" value={transaction.sessionId} />
          </div>
        </div>

        <div className="border-t border-gray-100 px-5 py-4">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-blue px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-dark"
          >
            <PrinterIcon className="h-4 w-4" />
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
