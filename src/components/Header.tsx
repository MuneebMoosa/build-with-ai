import React from 'react';
import { Leaf } from 'lucide-react';

interface HeaderProps {
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <header className="bg-gradient-to-r from-green-700 to-green-500 text-white p-5 shadow-lg rounded-b-3xl mb-4 flex items-center justify-between z-10 relative">
      <div className="flex items-center space-x-3">
        <Leaf className="h-9 w-9 text-green-100 shrink-0 drop-shadow-sm" />

        <div className="hidden sm:block">
          <h1 className="text-2xl font-bold tracking-tight">Krishi AI</h1>
          <p className="text-xs text-green-100 font-medium whitespace-nowrap">കർഷകർക്കുള്ള AI സഹായി</p>
        </div>
        <div className="sm:hidden block">
          <h1 className="text-xl font-bold tracking-tight">Krishi AI</h1>
        </div>
      </div>
      <div>
        {children}
      </div>
    </header>
  );
};
