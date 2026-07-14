import { mulberry32 } from '../utils/random';
import { businessNames } from './wallets';

const rand = mulberry32(88342021);

function pick(list) {
  return list[Math.floor(rand() * list.length)];
}

function randomInt(min, max) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

const DESCRIPTIONS = [
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

function randomReference() {
  return `PVB-TXN-${randomInt(10000000, 99999999)}`;
}

function randomAmount() {
  const naira = randomInt(2_000, 3_000_000);
  const kobo = randomInt(0, 99);
  return Number(`${naira}.${String(kobo).padStart(2, '0')}`);
}

function randomDate() {
  const start = new Date('2026-06-01').getTime();
  const end = new Date('2026-07-14').getTime();
  return new Date(start + rand() * (end - start));
}

function generateTransactions(count) {
  const transactions = [];

  for (let i = 0; i < count; i += 1) {
    const type = rand() < 0.52 ? 'Inflow' : 'Outflow';
    const date = randomDate();

    transactions.push({
      id: randomReference(),
      businessName: pick(businessNames),
      description: pick(DESCRIPTIONS),
      type,
      amount: randomAmount(),
      status: rand() < 0.85 ? 'Successful' : 'Pending',
      date: date.toISOString(),
    });
  }

  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export const transactions = generateTransactions(48);

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
