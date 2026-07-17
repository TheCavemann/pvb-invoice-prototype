import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import LockedFeatureModal from '../components/shared/LockedFeatureModal';

export default function Layout() {
  const [lockedModalOpen, setLockedModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-page">
      <Sidebar onLockedClick={() => setLockedModalOpen(true)} />
      <div className="ml-[260px] flex min-h-screen flex-col">
        <Topbar />
        <main className="flex-1 px-8 pb-10">
          <Outlet />
        </main>
      </div>
      <LockedFeatureModal open={lockedModalOpen} onClose={() => setLockedModalOpen(false)} />
    </div>
  );
}
