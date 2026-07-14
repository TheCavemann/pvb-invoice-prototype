import { useLocation } from 'react-router-dom';
import { pageTitles } from '../layout/navConfig';

export default function ComingSoon() {
  const { pathname, state } = useLocation();
  const title = pageTitles[pathname] ?? 'This section';
  const businessName = state?.businessName;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
      {businessName && (
        <p className="mb-2 text-sm font-semibold text-gray-900">{businessName}</p>
      )}
      <p className="text-sm text-gray-500">
        <span className="font-medium text-gray-700">{title}</span> is not part of this
        prototype. Full detail lives on the <span className="font-medium text-gray-700">Wallets</span>{' '}
        page for this review.
      </p>
    </div>
  );
}
