import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2 text-xs text-amber-900">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />
          <p className="font-normal text-amber-900 leading-normal">
            <strong className="font-semibold text-amber-950">Academic Screening Notice:</strong> This platform is a clinical triaging and screening tool developed for a B.Sc. Data Science capstone project. It cannot definitively confirm or disprove authenticity. Final verification must always be performed by a qualified pharmacist or issuing medical institution.
          </p>
        </div>
      </div>
    </div>
  );
};
