import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { navConfig } from './navConfig';
import { ChevronDownIcon, LockIcon } from '../icons/Icons';
import { useKyc } from '../context/KycContext';

const linkBase =
  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors';
const linkInactive = 'text-gray-600 hover:bg-gray-50';
const linkActive = 'bg-brand-lavender text-brand-blue';
const linkLocked = 'w-full text-left text-gray-400 opacity-50';

function SidebarLink({ path, icon: Icon, label, locked, onLockedClick }) {
  if (locked) {
    return (
      <button type="button" onClick={onLockedClick} className={`${linkBase} ${linkLocked}`}>
        {Icon && <Icon className="h-5 w-5 shrink-0" />}
        <span>{label}</span>
      </button>
    );
  }

  return (
    <NavLink
      to={path}
      className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
    >
      {Icon && <Icon className="h-5 w-5 shrink-0" />}
      <span>{label}</span>
    </NavLink>
  );
}

function CollapsibleNavItem({ item, onLockedClick }) {
  const location = useLocation();
  const isChildActive = location.pathname.startsWith(item.basePath);
  const [open, setOpen] = useState(isChildActive);
  const Icon = item.icon;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${linkBase} w-full justify-between ${
          isChildActive && !open ? linkActive : linkInactive
        }`}
      >
        <span className="flex items-center gap-3">
          <Icon className="h-5 w-5 shrink-0" />
          <span>{item.label}</span>
        </span>
        <ChevronDownIcon
          className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="ml-5 mt-1 flex flex-col gap-0.5 border-l border-gray-200 pl-4">
          {item.children.map((child) =>
            child.locked ? (
              <button
                key={child.path}
                type="button"
                onClick={onLockedClick}
                className="rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-400 opacity-50"
              >
                {child.label}
              </button>
            ) : (
              <NavLink
                key={child.path}
                to={child.path}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? linkActive : linkInactive
                  }`
                }
              >
                {child.label}
              </NavLink>
            ),
          )}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ onLockedClick }) {
  const { kycStatus } = useKyc();
  const isApproved = kycStatus === 'approved';

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-[260px] flex-col border-r border-gray-200 bg-white">
      <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-lavender text-sm font-semibold text-brand-blue">
          AC
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-gray-900">Arinze Chibueze</p>
          <p className="text-xs text-gray-500">Admin</p>
        </div>
        <ChevronDownIcon className="h-4 w-4 shrink-0 text-gray-400" />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navConfig.map((item) =>
          item.children ? (
            <CollapsibleNavItem
              key={item.label}
              item={isApproved ? { ...item, children: item.children.map((c) => ({ ...c, locked: false })) } : item}
              onLockedClick={onLockedClick}
            />
          ) : (
            <SidebarLink
              key={item.path}
              path={item.path}
              icon={item.icon}
              label={item.label}
              locked={Boolean(item.locked) && !isApproved}
              onLockedClick={onLockedClick}
            />
          ),
        )}
      </nav>

      <div className="flex flex-col items-center gap-1.5 border-t border-gray-100 px-5 py-5">
        <LockIcon className="h-4 w-4 text-gray-400" />
        <div className="text-center leading-tight">
          <p className="text-sm font-extrabold tracking-tight text-gray-900">piggyvest</p>
          <p className="text-[10px] font-bold tracking-widest text-gray-400">BUSINESS</p>
        </div>
      </div>
    </aside>
  );
}
