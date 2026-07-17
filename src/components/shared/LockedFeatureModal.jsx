import { CloseIcon } from '../../icons/Icons';

export default function LockedFeatureModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
        <p className="pr-6 text-sm text-gray-600">
          This feature unlocks once your KYC is approved. We&apos;ll notify you as soon as your
          KYC is verified.
        </p>
      </div>
    </div>
  );
}
