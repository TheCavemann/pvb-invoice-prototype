import { formatNaira } from '../../data/wallets';
import WalletTypeBadge from './WalletTypeBadge';
import RowActionsMenu from './RowActionsMenu';
import { SkeletonRows, EmptyState, ErrorState } from './TableStates';
import Pagination from './Pagination';

const columns = [
  'Business name',
  'Branch name',
  'Wallet name',
  'Wallet ID',
  'Wallet type',
  'Balance',
  'Account Number',
  'Account Name',
  '',
];

export default function WalletsTable({
  status,
  wallets,
  onRetry,
  totalCount,
  page,
  pageCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left text-sm">
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
            {status === 'loading' && <SkeletonRows />}
            {status === 'error' && <ErrorState onRetry={onRetry} />}
            {status === 'success' && wallets.length === 0 && <EmptyState />}
            {status === 'success' &&
              wallets.length > 0 &&
              wallets.map((wallet) => (
                <tr key={wallet.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/60">
                  <td className="whitespace-nowrap px-4 py-3.5 font-medium text-gray-900">
                    {wallet.businessName}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-gray-600">{wallet.branchName}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-gray-600">{wallet.walletName}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-gray-500">
                    {wallet.id}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <WalletTypeBadge type={wallet.walletType} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 font-medium text-gray-900">
                    <span className={wallet.balance === 0 ? 'text-gray-400' : undefined}>
                      {formatNaira(wallet.balance)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-gray-600">{wallet.accountNumber}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-gray-600">{wallet.accountName}</td>
                  <td className="whitespace-nowrap px-2 py-3.5">
                    <RowActionsMenu wallet={wallet} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {status === 'success' && totalCount > 0 && (
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
