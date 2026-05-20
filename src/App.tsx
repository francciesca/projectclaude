import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/Auth/LoginForm';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { Dashboard } from './components/Dashboard/Dashboard';
import { VehiclesModule } from './components/Vehicles/VehiclesModule';
import { DriversModule } from './components/Drivers/DriversModule';
import { DocumentsModule } from './components/Documents/DocumentsModule';
import { MaintenanceModule } from './components/Maintenance/MaintenanceModule';
import { ServicesModule } from './components/Services/ServicesModule';

function App() {
  const { user, profile, isLoading, companyId } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticacion...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <LoginForm />;
  }

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} companyId={companyId!} />;
      case 'vehicles':
        return <VehiclesModule companyId={companyId!} />;
      case 'drivers':
        return <DriversModule companyId={companyId!} />;
      case 'documents':
        return <DocumentsModule companyId={companyId!} />;
      case 'maintenance':
        return <MaintenanceModule companyId={companyId!} />;
      case 'services':
        return <ServicesModule companyId={companyId!} />;
      default:
        return <Dashboard onNavigate={handleNavigate} companyId={companyId!} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white pt-16">
          <Navigation
            activeTab={activeTab}
            setActiveTab={handleNavigate}
            isMobile={true}
            onItemClick={() => setIsMobileMenuOpen(false)}
          />
        </div>
      )}

      <div className="hidden md:block">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
