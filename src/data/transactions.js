import { mulberry32 } from '../utils/random';
import { wallets } from './wallets';

const rand = mulberry32(88342021);

function pick(list) {
  return list[Math.floor(rand() * list.length)];
}

function randomInt(min, max) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

const CATEGORIES = [
  'Wallet funding',
  'Payment to supplier',
  'POS settlement',
  'Bill payment',
  'Transfer to savings',
  'Card transaction',
  'Refund',
  'Payroll disbursement',
  'Merchant payout',
  'Airtime purchase',
];

const CATEGORY_DESCRIPTIONS = {
  'Wallet funding': 'Funds added to the wallet via bank transfer',
  'Payment to supplier': 'Payment made to a registered supplier',
  'POS settlement': 'Settlement from POS terminal transactions',
  'Bill payment': 'Payment for a registered utility bill',
  'Transfer to savings': 'Internal transfer to the Savings wallet',
  'Card transaction': 'Card transaction processed via Pocket',
  Refund: 'Refund issued for a previous transaction',
  'Payroll disbursement': 'Payroll disbursement to staff accounts',
  'Merchant payout': 'Payout to merchant settlement account',
  'Airtime purchase': 'Airtime purchase via wallet balance',
};

const EXTERNAL_PARTIES = [
  { name: 'Adaeze Obi', bank: 'GTBank' },
  { name: 'Chinedu Okafor', bank: 'Access Bank' },
  { name: 'Amina Yusuf', bank: 'Zenith Bank' },
  { name: 'Tunde Bakare', bank: 'UBA' },
  { name: 'Ngozi Eze', bank: 'First Bank' },
  { name: 'Bola Adekunle', bank: 'Fidelity Bank' },
  { name: 'Ifeoma Nwachukwu', bank: 'Union Bank' },
  { name: 'Segun Ojo', bank: 'Sterling Bank' },
];

function randomReference() {
  return `PVB-TXN-${randomInt(10000000, 99999999)}`;
}

function randomProviderReference() {
  return `PSP-REF-${randomInt(100000000, 999999999)}`;
}

function randomPeerReference() {
  return `PEER-${randomInt(100000000, 999999999)}`;
}

function randomSessionId() {
  return `SESS-${randomInt(1000000000, 9999999999)}`;
}

function randomExternalAccountNumber() {
  return String(randomInt(1000000000, 9999999999));
}

function randomAmount() {
  const naira = randomInt(2_000, 3_000_000);
  const kobo = randomInt(0, 99);
  return Number(`${naira}.${String(kobo).padStart(2, '0')}`);
}

function randomFee() {
  if (rand() < 0.4) return 0;
  const naira = randomInt(10, 500);
  const kobo = randomInt(0, 99);
  return Number(`${naira}.${String(kobo).padStart(2, '0')}`);
}

function randomDate() {
  const start = new Date('2026-05-01').getTime();
  const end = new Date('2026-07-14').getTime();
  return new Date(start + rand() * (end - start));
}

function buildTransactionsForWallet(wallet, count) {
  const transactions = [];

  for (let i = 0; i < count; i += 1) {
    const type = rand() < 0.52 ? 'Inflow' : 'Outflow';
    const category = pick(CATEGORIES);
    const party = pick(EXTERNAL_PARTIES);
    const walletLabel = `${wallet.businessName} • ${wallet.walletName}`;
    const partyLabel = `${party.name} - ${party.bank}`;
    const isApiWallet = wallet.accountNumber === 'N/A';

    const from = type === 'Outflow' ? walletLabel : partyLabel;
    const to = type === 'Outflow' ? partyLabel : walletLabel;
    const destinationAccount =
      type === 'Outflow'
        ? `${randomExternalAccountNumber()} (${party.bank})`
        : isApiWallet
          ? 'N/A'
          : `${wallet.accountNumber} (Pocket)`;

    transactions.push({
      id: randomReference(),
      walletId: wallet.id,
      businessName: wallet.businessName,
      walletName: wallet.walletName,
      accountType: `${wallet.walletType} Account`,
      accountName: wallet.accountName,
      type,
      category,
      description: CATEGORY_DESCRIPTIONS[category],
      amount: randomAmount(),
      fee: randomFee(),
      status: rand() < 0.85 ? 'Successful' : 'Pending',
      date: randomDate().toISOString(),
      from,
      to,
      destinationAccount,
      providerReference: randomProviderReference(),
      peerReference: randomPeerReference(),
      sessionId: randomSessionId(),
    });
  }

  return transactions;
}

function generateTransactions() {
  const transactions = [];

  wallets.forEach((wallet) => {
    const count = randomInt(2, 6);
    transactions.push(...buildTransactionsForWallet(wallet, count));
  });

  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export const transactions = generateTransactions();

export function formatTransactionDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
