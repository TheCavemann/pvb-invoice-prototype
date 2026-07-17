import { useLocation } from 'react-router-dom';
import { pageTitles } from './navConfig';
import { BellIcon, HelpIcon } from '../icons/Icons';
import { useKyc } from '../context/KycContext';

const KYC_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
];

export default function Topbar() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] ?? (pathname.startsWith('/wallets/') ? 'Wallets' : 'Overview');
  const { kycStatus, setKycStatus } = useKyc();

  return (
    <header className="flex items-center justify-between px-8 py-6">
      <h1 className="text-[28px] font-bold text-gray-900">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 text-xs font-medium text-gray-500">
          <span className="px-2 text-gray-400">KYC:</span>
          {KYC_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setKycStatus(opt.value)}
              className={`rounded-md px-2.5 py-1 transition-colors ${
                kycStatus === opt.value ? 'bg-brand-lavender text-brand-blue' : 'hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
        >
          <BellIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Help"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
        >
          <HelpIcon className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
