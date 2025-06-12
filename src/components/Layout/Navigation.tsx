import React from 'react';
import { BarChart3, Car, Users, FileText, Wrench } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobile?: boolean;
  onItemClick?: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Tablero', icon: BarChart3 },
  { id: 'vehicles', label: 'Vehículos', icon: Car },
  { id: 'drivers', label: 'Conductores', icon: Users },
  { id: 'documents', label: 'Documentos', icon: FileText },
  { id: 'maintenance', label: 'Mantenimiento', icon: Wrench },
];

export function Navigation({ activeTab, setActiveTab, isMobile = false, onItemClick }: NavigationProps) {
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onItemClick?.();
  };

  if (isMobile) {
    return (
      <nav className="flex flex-col space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center space-x-2 px-3 py-4 border-b-2 transition-colors ${
                  activeTab === item.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}