import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DotsIcon, ExternalLinkIcon } from '../../icons/Icons';

export default function RowActionsMenu({ businessName, label }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative flex justify-end" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Actions for ${label}`}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
      >
        <DotsIcon className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-20 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              navigate('/business-management/profile', {
                state: { businessName },
              });
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
          >
            <ExternalLinkIcon className="h-4 w-4 text-gray-400" />
            Open business
          </button>
        </div>
      )}
    </div>
  );
}
