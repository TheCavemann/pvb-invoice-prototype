import { formatNaira } from '../../utils/format';
import { formatTransactionDate } from '../../data/transactions';
import StatusBadge from '../shared/StatusBadge';
import RowActionsMenu from '../shared/RowActionsMenu';
import Pagination from '../shared/Pagination';

const columns = [
  'Business name',
  'Description',
  'Reference',
  'Amount',
  'Status',
  'Date',
  '',
];

export default function TransactionsTable({
  transactions,
  page,
  pageCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) {
  const showPagination = page != null;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {columns.map((col) => (
                <th
                  key={col || 'actions'}
                  scope="col"
                  className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/60">
                <td className="whitespace-nowrap px-4 py-3.5 font-medium text-gray-900">
                  {txn.businessName}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-gray-600">{txn.description}</td>
                <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-gray-500">
                  {txn.id}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 font-medium">
                  {txn.type === 'Outflow' ? (
                    <span className="text-danger">-{formatNaira(txn.amount)}</span>
                  ) : (
                    <span className="text-gray-900">+{formatNaira(txn.amount)}</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  <StatusBadge status={txn.status} />
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-gray-600">
                  {formatTransactionDate(txn.date)}
                </td>
                <td className="whitespace-nowrap px-2 py-3.5">
                  <RowActionsMenu businessName={txn.businessName} label={txn.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showPagination && (
        <Pagination
          page={page}
          pageCount={pageCount}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}
