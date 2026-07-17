import { createContext, useContext, useState } from 'react';

const KycContext = createContext(null);

export function KycProvider({ children }) {
  const [kycStatus, setKycStatus] = useState('pending');

  return (
    <KycContext.Provider value={{ kycStatus, setKycStatus }}>{children}</KycContext.Provider>
  );
}

export function useKyc() {
  const ctx = useContext(KycContext);
  if (!ctx) throw new Error('useKyc must be used within a KycProvider');
  return ctx;
}
