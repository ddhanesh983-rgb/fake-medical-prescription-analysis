import React, { useState } from 'react';
import { Menu, X, Code2 } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenCodeExplorer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onOpenCodeExplorer }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'detect', label: 'Detect Prescription' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'history', label: 'History' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="text-xl font-bold tracking-tight text-slate-900 hover:text-sky-700 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2"
            >
              <span className="w-8 h-8 rounded bg-sky-700 text-white flex items-center justify-center font-bold text-sm">
                Rx
              </span>
              <span>RxShield</span>
            </button>
          </div>

          {/* Zone 2: Concise single-line navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  currentTab === link.id
                    ? 'text-sky-700 font-semibold border-b-2 border-sky-700 pb-0.5'
                    : 'hover:text-slate-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary action + Code viewer */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenCodeExplorer}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors whitespace-nowrap cursor-pointer"
              title="Inspect Python Flask backend files"
            >
              <Code2 className="w-3.5 h-3.5 text-slate-600" />
              <span>Python Source Files</span>
            </button>
            <button
              onClick={() => onNavigate('detect')}
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-700 rounded hover:bg-sky-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              Analyze Prescription
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-sm font-medium rounded ${
                currentTab === link.id ? 'bg-sky-50 text-sky-800' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              onOpenCodeExplorer();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded"
          >
            <Code2 className="w-4 h-4 text-slate-600" />
            <span>Python Source Code Files</span>
          </button>
        </div>
      )}
    </header>
  );
};
