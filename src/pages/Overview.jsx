import { Link } from 'react-router-dom';
import { transactions } from '../data/transactions';
import { formatNaira } from '../utils/format';
import TransactionsTable from '../components/transactions/TransactionsTable';
import { ArrowUpRightIcon, ArrowDownLeftIcon, TransactionsIcon } from '../icons/Icons';

const outflowTotal = transactions
  .filter((txn) => txn.type === 'Outflow')
  .reduce((sum, txn) => sum + txn.amount, 0);

const inflowTotal = transactions
  .filter((txn) => txn.type === 'Inflow')
  .reduce((sum, txn) => sum + txn.amount, 0);

const totalVolume = outflowTotal + inflowTotal;

const recentTransactions = transactions.slice(0, 5);

const stats = [
  {
    label: 'Outflow',
    value: outflowTotal,
    icon: ArrowUpRightIcon,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
  },
  {
    label: 'Inflow',
    value: inflowTotal,
    icon: ArrowDownLeftIcon,
    iconBg: 'bg-success-bg',
    iconColor: 'text-success',
  },
  {
    label: 'Total Volume',
    value: totalVolume,
    icon: TransactionsIcon,
    iconBg: 'bg-brand-lavender',
    iconColor: 'text-brand-blue',
  },
];

export default function Overview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <div
              className={`mb-4 flex h-9 w-9 items-center justify-center rounded-full ${stat.iconBg} ${stat.iconColor}`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{formatNaira(stat.value)}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent transactions</h2>
          <Link to="/transactions" className="text-sm font-medium text-brand-blue hover:underline">
            View all
          </Link>
        </div>
        <TransactionsTable transactions={recentTransactions} />
      </div>
    </div>
  );
}
