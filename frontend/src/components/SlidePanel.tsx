'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Optional width override — defaults to max-w-lg (32rem) */
  widthClass?: string;
}

/**
 * Right-side slide-over panel with backdrop.
 * - Closes on backdrop click or Escape key.
 * - Locks body scroll while open.
 * - Smooth slide+fade transition.
 */
export default function SlidePanel({
  isOpen,
  onClose,
  title,
  children,
  widthClass = 'max-w-lg',
}: SlidePanelProps) {
  // Lock body scroll + handle Escape
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black transition-opacity duration-300 ease-out ${
          isOpen ? 'opacity-50' : 'opacity-0'
        }`}
      />

      {/* Panel */}
      <div
        className={`absolute right-0 top-0 h-full w-full ${widthClass} bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors rounded p-1 hover:bg-gray-100"
            aria-label="Close panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">{children}</div>
      </div>
    </div>
  );
}