import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import Overview from './pages/Overview';
import Transactions from './pages/Transactions';
import Wallets from './pages/Wallets';
import WalletTransactions from './pages/WalletTransactions';
import ComingSoon from './pages/ComingSoon';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="wallets" element={<Wallets />} />
        <Route path="wallets/:walletId" element={<WalletTransactions />} />
        <Route path="overdraft" element={<ComingSoon />} />
        <Route path="bulk-transfers" element={<ComingSoon />} />
        <Route path="api-wallets" element={<ComingSoon />} />
        <Route path="business-management/*" element={<ComingSoon />} />
        <Route path="pos-terminals/*" element={<ComingSoon />} />
        <Route path="fees-and-interest" element={<ComingSoon />} />
        <Route path="settings/*" element={<ComingSoon />} />
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
