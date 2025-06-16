import React, { useState } from 'react';
import { Menu, X, Building2, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCompany } from '../../hooks/useCompany';

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export function Header({ isMobileMenuOpen, setIsMobileMenuOpen }: HeaderProps) {
  const { user, logout } = useAuth();
  const { currentCompany, companies, changeCompany } = useCompany();
  const [showCompanySelector, setShowCompanySelector] = useState(false);

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
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
                <h1 
                  className="text-sm sm:text-lg font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => setShowCompanySelector(!showCompanySelector)}
                >
                  REGISTRO DE FLOTAS
                </h1>
                <p className="text-xs text-gray-600">
                  Trabajando en: <span className="font-semibold text-blue-600">{currentCompany.name}</span>
                </p>
              </div>
            </div>
            
            {/* Selector de empresa */}
            {showCompanySelector && (
              <div className="absolute top-16 left-4 z-50 bg-white rounded-lg shadow-xl border border-gray-200 min-w-[200px]">
                <div className="p-2">
                  <p className="text-sm font-medium text-gray-700 px-3 py-2">Seleccionar Empresa</p>
                  {companies.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => {
                        changeCompany(company);
                        setShowCompanySelector(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        company.id === currentCompany.id
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {company.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Usuario y logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Overlay para cerrar selector */}
      {showCompanySelector && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowCompanySelector(false)}
        />
      )}
    </header>
  );
}