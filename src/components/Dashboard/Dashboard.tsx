import React, { useState } from 'react';
import { Car, CheckCircle, Wrench, DollarSign, AlertTriangle, Calendar, FileText, Users } from 'lucide-react';
import { StatCard } from './StatCard';
import { AlertsModal } from './AlertsModal';
import { useCompany } from '../../hooks/useCompany';
import { useCompanyData } from '../../hooks/useLocalStorage';
import { mockVehicles, mockAlerts, mockDrivers, mockMaintenance, mockDocuments } from '../../data/mockData';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const { currentCompany } = useCompany();

  // Obtener datos guardados localmente
  const [vehicles] = useCompanyData('vehicles', mockVehicles.filter(v => v.companyId === currentCompany.id), currentCompany.id);
  const [alerts] = useCompanyData('alerts', mockAlerts.filter(a => a.companyId === currentCompany.id), currentCompany.id);
  const [drivers] = useCompanyData('drivers', mockDrivers.filter(d => d.companyId === currentCompany.id), currentCompany.id);
  const [maintenance] = useCompanyData('maintenances', mockMaintenance.filter(m => m.companyId === currentCompany.id), currentCompany.id);
  const [documents] = useCompanyData('documents', mockDocuments.filter(d => d.companyId === currentCompany.id), currentCompany.id);

  // Calculate statistics
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.status === 'available').length;
  const rentedVehicles = vehicles.filter(v => v.status === 'rented').length;
  const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;
  const urgentAlerts = alerts.filter(a => a.priority === 'urgent').length;
  const activeDrivers = drivers.length;
  const pendingMaintenance = maintenance.filter(m => m.status !== 'completed').length;
  const expiringDocuments = documents.filter(d => d.status === 'expiring' || d.status === 'expired').length;

  const handleStatClick = (type: string) => {
    switch (type) {
      case 'vehicles':
        onNavigate('vehicles');
        break;
      case 'available':
        onNavigate('vehicles');
        // Here you would also set a filter for available vehicles
        break;
      case 'maintenance':
        onNavigate('maintenance');
        break;
      case 'rented':
        onNavigate('vehicles');
        // Here you would also set a filter for rented vehicles
        break;
      case 'drivers':
        onNavigate('drivers');
        break;
      case 'documents':
        onNavigate('documents');
        break;
    }
  };

  const quickActions = [
    { title: 'Agregar Vehículo', icon: Car, action: () => onNavigate('vehicles') },
    { title: 'Nuevo Conductor', icon: Users, action: () => onNavigate('drivers') },
    { title: 'Programar Mantenimiento', icon: Wrench, action: () => onNavigate('maintenance') },
    { title: 'Subir Documento', icon: FileText, action: () => onNavigate('documents') }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
          <p className="text-gray-600">Resumen general de la flota de {currentCompany.name}</p>
          <p className="text-sm text-green-600 mt-1">
            ✓ Datos guardados automáticamente en tu dispositivo
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowAlertsModal(true)}
            className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
          >
            <AlertTriangle size={16} className="mr-2" />
            {urgentAlerts > 0 && (
              <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold mr-2">
                {urgentAlerts}
              </span>
            )}
            Ver Alertas
          </button>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Vehículos"
          value={totalVehicles}
          icon={Car}
          color="blue"
          onClick={() => handleStatClick('vehicles')}
        />
        <StatCard
          title="Disponibles"
          value={availableVehicles}
          icon={CheckCircle}
          color="green"
          onClick={() => handleStatClick('available')}
        />
        <StatCard
          title="En Mantenimiento"
          value={maintenanceVehicles}
          icon={Wrench}
          color="yellow"
          onClick={() => handleStatClick('maintenance')}
        />
        <StatCard
          title="Alquilados"
          value={rentedVehicles}
          icon={DollarSign}
          color="purple"
          onClick={() => handleStatClick('rented')}
        />
      </div>

      {/* Secondary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Conductores Activos"
          value={activeDrivers}
          icon={Users}
          color="blue"
          onClick={() => handleStatClick('drivers')}
        />
        <StatCard
          title="Mantenimientos Pendientes"
          value={pendingMaintenance}
          icon={Calendar}
          color="yellow"
          onClick={() => handleStatClick('maintenance')}
        />
        <StatCard
          title="Documentos por Vencer"
          value={expiringDocuments}
          icon={FileText}
          color="red"
          onClick={() => handleStatClick('documents')}
        />
        <StatCard
          title="Alertas Urgentes"
          value={urgentAlerts}
          icon={AlertTriangle}
          color="red"
          onClick={() => setShowAlertsModal(true)}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors mb-3">
                  <IconComponent className="text-blue-600" size={24} />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">{action.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Sistema de almacenamiento local activado</span>
            <span className="text-xs text-gray-500 ml-auto">Ahora</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Datos cargados desde almacenamiento local</span>
            <span className="text-xs text-gray-500 ml-auto">Hace 1 minuto</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Todos los cambios se guardan automáticamente</span>
            <span className="text-xs text-gray-500 ml-auto">Permanente</span>
          </div>
        </div>
      </div>

      {/* Alerts Modal */}
      <AlertsModal
        isOpen={showAlertsModal}
        onClose={() => setShowAlertsModal(false)}
        alerts={alerts}
      />
    </div>
  );
}