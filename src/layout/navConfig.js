import {
  OverviewIcon,
  BriefcaseIcon,
  TransactionsIcon,
  WalletIcon,
  PosIcon,
  FeesIcon,
  SettingsIcon,
} from '../icons/Icons';

export const navConfig = [
  { label: 'Overview', icon: OverviewIcon, path: '/overview' },
  {
    label: 'Business Mgt.',
    icon: BriefcaseIcon,
    basePath: '/business-management',
    children: [
      { label: 'Business Profile', path: '/business-management/profile' },
      { label: 'Flagged Businesses', path: '/business-management/flagged' },
      { label: 'Onboarding API Requests', path: '/business-management/onboarding-api-requests' },
      { label: 'Investify', path: '/business-management/investify' },
      { label: 'Safelock', path: '/business-management/safelock' },
    ],
  },
  { label: 'Transactions', icon: TransactionsIcon, path: '/transactions' },
  { label: 'Wallets', icon: WalletIcon, path: '/wallets' },
  {
    label: 'POS Terminals',
    icon: PosIcon,
    basePath: '/pos-terminals',
    children: [
      { label: 'Terminal Requests', path: '/pos-terminals/requests' },
      { label: 'Terminal Inventory', path: '/pos-terminals/inventory' },
    ],
  },
  { label: 'Fees & Interest', icon: FeesIcon, path: '/fees-and-interest' },
  {
    label: 'Settings',
    icon: SettingsIcon,
    basePath: '/settings',
    children: [
      { label: 'Admin Users', path: '/settings/admin-users' },
      { label: 'Roles & Permissions', path: '/settings/roles-permissions' },
    ],
  },
];

export const pageTitles = {
  '/overview': 'Overview',
  '/transactions': 'Transactions',
  '/wallets': 'Wallets',
  '/business-management/profile': 'Business Profile',
  '/business-management/flagged': 'Flagged Businesses',
  '/business-management/onboarding-api-requests': 'Onboarding API Requests',
  '/business-management/investify': 'Investify',
  '/business-management/safelock': 'Safelock',
  '/pos-terminals/requests': 'Terminal Requests',
  '/pos-terminals/inventory': 'Terminal Inventory',
  '/fees-and-interest': 'Fees & Interest',
  '/settings/admin-users': 'Admin Users',
  '/settings/roles-permissions': 'Roles & Permissions',
};
