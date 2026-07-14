const base = {
  fill: 'none',
  viewBox: '0 0 24 24',
  strokeWidth: 1.7,
  stroke: 'currentColor',
};

export function OverviewIcon(props) {
  return (
    <svg {...base} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 10.5 12 3l9 7.5M5.25 9.75V20a.75.75 0 0 0 .75.75h3.75v-5.25a1.5 1.5 0 0 1 1.5-1.5h1.5a1.5 1.5 0 0 1 1.5 1.5v5.25H18a.75.75 0 0 0 .75-.75V9.75"
      />
    </svg>
  );
}

export function BriefcaseIcon(props) {
  return (
    <svg {...base} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 8.25h16.5a.75.75 0 0 1 .75.75v9.75a1.5 1.5 0 0 1-1.5 1.5H4.5a1.5 1.5 0 0 1-1.5-1.5V9a.75.75 0 0 1 .75-.75Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 8.25V6a1.5 1.5 0 0 1 1.5-1.5h4.5A1.5 1.5 0 0 1 15.75 6v2.25M3 13.5h18"
      />
    </svg>
  );
}

export function TransactionsIcon(props) {
  return (
    <svg {...base} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 4.5 4 8m0 0 3.5 3.5M4 8h16M16.5 19.5 20 16m0 0-3.5-3.5M20 16H4"
      />
    </svg>
  );
}

export function WalletIcon(props) {
  return (
    <svg {...base} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7.5A1.5 1.5 0 0 1 4.5 6h13.5A1.5 1.5 0 0 1 19.5 7.5v.75H4.5"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7.5v9A1.5 1.5 0 0 0 4.5 18h15a1.5 1.5 0 0 0 1.5-1.5v-6a1.5 1.5 0 0 0-1.5-1.5H16a2.25 2.25 0 0 0 0 4.5h4.5"
      />
    </svg>
  );
}

export function PosIcon(props) {
  return (
    <svg {...base} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 3.75h9l3 3v13.5a.75.75 0 0 1-.75.75H6a.75.75 0 0 1-.75-.75V4.5a.75.75 0 0 1 .75-.75Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6M9 12.75h6M9 16.5h3.5" />
    </svg>
  );
}

export function FeesIcon(props) {
  return (
    <svg {...base} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.75v10.5M14.75 9.375c0-.828-1.232-1.5-2.75-1.5s-2.75.672-2.75 1.5S10.732 10.875 12 10.875s2.75.672 2.75 1.5-1.232 1.5-2.75 1.5-2.75-.672-2.75-1.5"
      />
    </svg>
  );
}

export function SettingsIcon(props) {
  return (
    <svg {...base} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.417.36.762.716.958.356.196.784.223 1.161.052l.83-.375a1.125 1.125 0 0 1 1.365.41l.546.945c.275.476.176 1.083-.24 1.443l-.69.6a1.125 1.125 0 0 0 0 1.706l.69.6c.416.36.515.967.24 1.443l-.546.945a1.125 1.125 0 0 1-1.365.41l-.83-.375c-.377-.171-.805-.144-1.16.052-.357.196-.647.54-.717.958l-.149.894c-.09.542-.56.94-1.11.94h-1.093c-.55 0-1.02-.398-1.11-.94l-.149-.894a1.125 1.125 0 0 0-.716-.958 1.125 1.125 0 0 0-1.162-.052l-.83.375a1.125 1.125 0 0 1-1.364-.41l-.546-.945a1.125 1.125 0 0 1 .24-1.443l.69-.6a1.125 1.125 0 0 0 0-1.706l-.69-.6a1.125 1.125 0 0 1-.24-1.443l.546-.945a1.125 1.125 0 0 1 1.364-.41l.83.375c.377.171.806.144 1.162-.052.355-.196.645-.54.716-.958l.149-.894Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

export function ChevronDownIcon(props) {
  return (
    <svg {...base} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon(props) {
  return (
    <svg {...base} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function LockIcon(props) {
  return (
    <svg {...base} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 10.5V7.5a4.5 4.5 0 1 1 9 0v3M6.75 10.5h10.5a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5H6.75a1.5 1.5 0 0 1-1.5-1.5V12a1.5 1.5 0 0 1 1.5-1.5Z"
      />
    </svg>
  );
}

export function BellIcon(props) {
  return (
    <svg {...base} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.85 23.85 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022 23.85 23.85 0 0 0 5.455 1.31m5.714 0a24.26 24.26 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
      />
    </svg>
  );
}

export function HelpIcon(props) {
  return (
    <svg {...base} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.879 9.879a3 3 0 1 1 4.243 4.242c-.879.879-1.415 1.36-1.415 2.629M12 18.75h.008v.008H12v-.008Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
    </svg>
  );
}

export function SearchIcon(props) {
  return (
    <svg {...base} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  );
}

export function FilterIcon(props) {
  return (
    <svg {...base} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 4.5h18M6.75 12h10.5M10.5 19.5h3"
      />
    </svg>
  );
}

export function DotsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

export function ArrowLeftIcon(props) {
  return (
    <svg {...base} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

export function ArrowRightIcon(props) {
  return (
    <svg {...base} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
    </svg>
  );
}

export function CloseIcon(props) {
  return (
    <svg {...base} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

export function ExternalLinkIcon(props) {
  return (
    <svg {...base} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 6H18m0 0v4.5M18 6l-7.5 7.5M6 10.5V18a.75.75 0 0 0 .75.75h11.25"
      />
    </svg>
  );
}
