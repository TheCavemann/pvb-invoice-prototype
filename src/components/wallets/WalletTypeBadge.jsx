const styles = {
  Settlement: 'bg-brand-lavender text-brand-blue',
  Expense: 'bg-pending-bg text-pending',
  Savings: 'bg-success-bg text-success',
  Api: 'bg-gray-100 text-gray-600',
};

export default function WalletTypeBadge({ type }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[type] ?? 'bg-gray-100 text-gray-600'
      }`}
    >
      {type}
    </span>
  );
}
