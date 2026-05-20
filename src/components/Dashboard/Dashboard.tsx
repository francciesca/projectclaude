import { useState, useEffect } from 'react';
import { Car, DollarSign, AlertTriangle, FileText, Wrench, Users, Calendar } from 'lucide-react';
import { StatCard } from './StatCard';
import { AlertsModal } from './AlertsModal';
import { supabase } from '../../lib/supabase';
import { Alert } from '../../types';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  companyId: string;
}

interface DashboardResumen {
  vehicles_available: number;
  active_rentals: number;
  pending_payments: number;
  expiring_documents: number;
  upcoming_maintenance: number;
}

export function Dashboard({ onNavigate, companyId }: DashboardProps) {
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [resumen, setResumen] = useState<DashboardResumen | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      setIsLoading(true);

      const [resumenResult, alertsResult] = await Promise.all([
        supabase.rpc('dashboard_resumen_full', {
          org_id: companyId,
          doc_range: 30,
          maint_range: 15,
        }),
        supabase.rpc('dashboard_alertas_full', {
          org_id: companyId,
        }),
      ]);

      if (resumenResult.data) {
        setResumen(resumenResult.data as DashboardResumen);
      }

      if (alertsResult.data) {
        setAlerts(alertsResult.data as Alert[]);
      }

      setIsLoading(false);
    }

    if (companyId) {
      fetchDashboard();
    }
  }, [companyId]);

  const urgentAlerts = alerts.filter(a => a.priority === 'urgent').length;

  const quickActions = [
    { title: 'Agregar Vehiculo', icon: Car, action: () => onNavigate('vehicles') },
    { title: 'Nuevo Conductor', icon: Users, action: () => onNavigate('drivers') },
    { title: 'Programar Mantenimiento', icon: Wrench, action: () => onNavigate('maintenance') },
    { title: 'Subir Documento', icon: FileText, action: () => onNavigate('documents') },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
          <p className="text-gray-600">Resumen general de la flota</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button onClick={() => setShowAlertsModal(true)} className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
            <AlertTriangle size={16} className="mr-2" />
            {urgentAlerts > 0 && <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold mr-2">{urgentAlerts}</span>}
            Ver Alertas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Vehiculos Disponibles"
          value={resumen?.vehicles_available ?? 0}
          icon={Car}
          color="green"
          onClick={() => onNavigate('vehicles')}
        />
        <StatCard
          title="Alquileres Activos"
          value={resumen?.active_rentals ?? 0}
          icon={DollarSign}
          color="blue"
          onClick={() => onNavigate('vehicles')}
        />
        <StatCard
          title="Pagos Pendientes"
          value={resumen?.pending_payments ?? 0}
          icon={DollarSign}
          color="yellow"
          onClick={() => onNavigate('maintenance')}
        />
        <StatCard
          title="Docs por Vencer"
          value={resumen?.expiring_documents ?? 0}
          icon={FileText}
          color="red"
          onClick={() => onNavigate('documents')}
        />
        <StatCard
          title="Mant. Proximo"
          value={resumen?.upcoming_maintenance ?? 0}
          icon={Calendar}
          color="yellow"
          onClick={() => onNavigate('maintenance')}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rapidas</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button key={index} onClick={action.action} className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors mb-3">
                  <IconComponent className="text-blue-600" size={24} />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">{action.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AlertsModal isOpen={showAlertsModal} onClose={() => setShowAlertsModal(false)} alerts={alerts} />
    </div>
  );
}
