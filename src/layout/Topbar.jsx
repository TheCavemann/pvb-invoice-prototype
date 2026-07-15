import { useLocation } from 'react-router-dom';
import { pageTitles } from './navConfig';
import { BellIcon, HelpIcon } from '../icons/Icons';

export default function Topbar() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] ?? (pathname.startsWith('/wallets/') ? 'Wallets' : 'Overview');

  return (
    <header className="flex items-center justify-between px-8 py-6">
      <h1 className="text-[28px] font-bold text-gray-900">{title}</h1>
      <div className="flex items-center gap-3">
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
