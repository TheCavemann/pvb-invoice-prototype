const stats = [
  { label: 'Total businesses', value: '1,284' },
  { label: 'Total wallet balance', value: '₦482,910,340.00' },
  { label: "Today's transactions", value: '3,972' },
  { label: 'Active POS terminals', value: '618' },
];

export default function Overview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <p className="text-sm text-gray-500">
          This is a prototype stub for the Overview page. Full detail lives on the{' '}
          <span className="font-medium text-gray-700">Wallets</span> page for this review.
        </p>
      </div>
    </div>
  );
}
