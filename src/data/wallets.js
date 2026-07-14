import { mulberry32 } from '../utils/random';

const rand = mulberry32(20240714);

function pick(list) {
  return list[Math.floor(rand() * list.length)];
}

function randomInt(min, max) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

const BUSINESSES = [
  { name: 'Zenith Foodstuffs Limited', branches: ['Head Office', 'Ikeja Branch'] },
  { name: 'Coral Reef Logistics Ltd', branches: ['Head Office'] },
  { name: 'Northgate Textiles Limited', branches: ['Head Office', 'Kano Branch'] },
  { name: 'Bluewave Energy Ltd', branches: ['Head Office'] },
  { name: 'Prestige Autoparts Limited', branches: ['Head Office'] },
  { name: 'Sunrise Agro Ventures Ltd', branches: ['Head Office', 'Ibadan Branch'] },
  { name: 'Maple Leaf Furniture Limited', branches: ['Head Office'] },
  { name: 'Ivory Coast Beauty Supplies Ltd', branches: ['Head Office'] },
  { name: 'Falcon Freight Services Limited', branches: ['Head Office', 'Port Harcourt Branch'] },
  { name: 'Golden Harvest Bakery Ltd', branches: ['Head Office'] },
  { name: 'Silverline Electronics Limited', branches: ['Head Office'] },
  { name: 'Crestview Pharmaceuticals Ltd', branches: ['Head Office', 'Abuja Branch'] },
  { name: 'Amberstone Construction Limited', branches: ['Head Office'] },
  { name: 'Palmgrove Hospitality Ltd', branches: ['Head Office'] },
  { name: 'Cobalt Digital Solutions Limited', branches: ['Head Office'] },
];

const WALLET_TYPES = ['Settlement', 'Expense', 'Savings', 'Api'];

function randomWalletId() {
  return `PVB-WL-${randomInt(10000000, 99999999)}`;
}

function randomAccountNumber() {
  return String(randomInt(1000000000, 9999999999));
}

function randomBalance(type) {
  // A few zero-balance wallets, like the real dashboard.
  if (rand() < 0.12) return 0;
  const scale = type === 'Savings' ? 4_000_000 : type === 'Settlement' ? 8_000_000 : 1_500_000;
  const naira = randomInt(0, scale);
  const kobo = randomInt(0, 99);
  return Number(`${naira}.${String(kobo).padStart(2, '0')}`);
}

function randomDateCreated() {
  const start = new Date('2023-01-01').getTime();
  const end = new Date('2026-07-01').getTime();
  const date = new Date(start + rand() * (end - start));
  return date.toISOString().slice(0, 10);
}

function buildWalletsForBusiness(business, walletCount) {
  const wallets = [];
  const typesToUse = [];

  // Every business gets one Settlement, one Expense, one Savings at minimum,
  // then fill the rest with a mix (including some Api wallets).
  typesToUse.push('Settlement', 'Expense', 'Savings');
  while (typesToUse.length < walletCount) {
    typesToUse.push(pick(WALLET_TYPES));
  }

  typesToUse.slice(0, walletCount).forEach((type) => {
    const isApi = type === 'Api';
    const branch = isApi ? 'API Accounts' : pick(business.branches);
    const balance = randomBalance(type);

    wallets.push({
      id: randomWalletId(),
      businessName: business.name,
      branchName: branch,
      walletName: isApi ? 'API Wallet' : `${type} Wallet`,
      walletType: type,
      balance,
      accountNumber: isApi ? 'N/A' : randomAccountNumber(),
      accountName: isApi ? 'N/A' : business.name.toUpperCase(),
      status: rand() < 0.9 ? 'active' : 'inactive',
      dateCreated: randomDateCreated(),
    });
  });

  return wallets;
}

function generateWallets() {
  const wallets = [];
  const counts = [5, 4, 4, 3, 4, 5, 3, 4, 5, 3, 4, 4, 3, 5, 4]; // sums to 60

  BUSINESSES.forEach((business, index) => {
    wallets.push(...buildWalletsForBusiness(business, counts[index] ?? 4));
  });

  return wallets;
}

export const wallets = generateWallets();

export const businessNames = BUSINESSES.map((b) => b.name);

export const branchNames = [...new Set(BUSINESSES.flatMap((b) => b.branches).concat('API Accounts'))];
