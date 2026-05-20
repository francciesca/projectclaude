import { useState } from 'react';
import { Menu, X, Building2, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export function Header({ isMobileMenuOpen, setIsMobileMenuOpen }: HeaderProps) {
  const { profile, logout } = useAuth();

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-sm sm:text-lg font-bold text-gray-900">
                  REGISTRO DE FLOTAS
                </h1>
                <p className="text-xs text-gray-600">
                  {profile?.name} <span className="text-blue-600 font-medium capitalize">({profile?.role})</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Cerrar Sesion</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
