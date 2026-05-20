import { useState } from 'react';
import { X, Car, CreditCard as Edit, Calendar, Shield, Wrench, FileText, Building2, AlertTriangle, Fuel } from 'lucide-react';
import { Vehicle } from '../../types';

interface VehicleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onEdit: (vehicle: Vehicle) => void;
}

const vehicleTypeLabels: Record<string, string> = {
  auto: 'Automovil',
  camioneta: 'Camioneta',
  camion: 'Camion',
  'cama-baja': 'Cama Baja',
  furgon: 'Furgon',
  bus: 'Bus',
  maquinaria: 'Maquinaria',
  otro: 'Otro',
};

export function VehicleDetailModal({ isOpen, onClose, vehicle, onEdit }: VehicleDetailModalProps) {
  const [activeTab, setActiveTab] = useState('info');

  if (!isOpen || !vehicle) return null;

  const statusColors = {
    available: { bg: 'bg-green-100', text: 'text-green-800', label: 'Disponible' },
    rented: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Alquilado' },
    maintenance: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Mantenimiento' },
  };

  const status = statusColors[vehicle.status];
  const kmUntilMaintenance = vehicle.next_maintenance_mileage ? vehicle.next_maintenance_mileage - vehicle.mileage : null;
  const needsMaintenance = kmUntilMaintenance !== null && kmUntilMaintenance <= 1000;

  const today = new Date();
  const technicalReviewDate = vehicle.technical_review_expiry ? new Date(vehicle.technical_review_expiry) : null;
  const daysUntilTechnicalReview = technicalReviewDate ? Math.ceil((technicalReviewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;
  const technicalReviewExpiring = daysUntilTechnicalReview !== null && daysUntilTechnicalReview <= 30;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500 rounded-lg">
              <Car className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{vehicle.brand} {vehicle.model}</h2>
              <p className="text-gray-600">{vehicle.year} - {vehicle.color} - {vehicleTypeLabels[vehicle.vehicle_type]}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                  {status.label}
                </span>
                {(needsMaintenance || technicalReviewExpiring) && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <AlertTriangle size={12} className="mr-1" />
                    Requiere Atencion
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => onEdit(vehicle)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Edit size={16} className="mr-2" />
              Editar
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'info', label: 'Informacion', icon: Car },
              { id: 'insurance', label: 'Seguros', icon: Shield },
              { id: 'maintenance', label: 'Mantenimiento', icon: Wrench },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IconComponent size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'info' && (
            <div className="space-y-6">
              {(needsMaintenance || technicalReviewExpiring) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                    <AlertTriangle className="mr-2" size={20} />
                    Alertas Importantes
                  </h3>
                  <div className="space-y-2">
                    {needsMaintenance && (
                      <div className="flex items-center text-red-700">
                        <Wrench size={16} className="mr-2" />
                        <span>{kmUntilMaintenance! > 0 ? `Mantenimiento proximo en ${kmUntilMaintenance!.toLocaleString()} km` : `Mantenimiento vencido por ${Math.abs(kmUntilMaintenance!).toLocaleString()} km`}</span>
                      </div>
                    )}
                    {technicalReviewExpiring && (
                      <div className="flex items-center text-red-700">
                        <Calendar size={16} className="mr-2" />
                        <span>{daysUntilTechnicalReview! > 0 ? `Rev. tecnica vence en ${daysUntilTechnicalReview} dias` : `Rev. tecnica vencida hace ${Math.abs(daysUntilTechnicalReview!)} dias`}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informacion Basica</h3>
                  <div className="space-y-3">
                    <div><label className="text-sm font-medium text-gray-500">VIN</label><p className="text-gray-900 font-mono">{vehicle.vin}</p></div>
                    <div><label className="text-sm font-medium text-gray-500">Matricula</label><p className="text-gray-900 font-mono text-lg font-bold">{vehicle.plate}</p></div>
                    <div><label className="text-sm font-medium text-gray-500">Tipo de Vehiculo</label><p className="text-gray-900">{vehicleTypeLabels[vehicle.vehicle_type]}</p></div>
                    <div><label className="text-sm font-medium text-gray-500">Fecha de Compra</label><p className="text-gray-900">{vehicle.purchase_date ? new Date(vehicle.purchase_date).toLocaleDateString() : '-'}</p></div>
                    {vehicle.current_client && (
                      <div><label className="text-sm font-medium text-gray-500">Cliente Actual</label><p className="text-gray-900 flex items-center"><Building2 size={16} className="mr-2 text-blue-500" />{vehicle.current_client}</p></div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Kilometraje y Mantenimiento</h3>
                  <div className="space-y-3">
                    <div><label className="text-sm font-medium text-gray-500">Kilometraje Actual</label><p className="text-gray-900 flex items-center"><Fuel size={16} className="mr-2 text-blue-500" />{vehicle.mileage.toLocaleString()} km</p></div>
                    <div><label className="text-sm font-medium text-gray-500">Intervalo de Mantenimiento</label><p className="text-gray-900">{vehicle.maintenance_interval.toLocaleString()} km</p></div>
                    {vehicle.last_maintenance && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Ultimo Mantenimiento</label>
                        <p className="text-gray-900">{new Date(vehicle.last_maintenance).toLocaleDateString()}</p>
                        {vehicle.last_maintenance_mileage && <p className="text-sm text-gray-600">En {vehicle.last_maintenance_mileage.toLocaleString()} km</p>}
                      </div>
                    )}
                    {vehicle.next_maintenance_mileage && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Proximo Mantenimiento</label>
                        <p className={`font-semibold ${needsMaintenance ? 'text-red-600' : 'text-gray-900'}`}>{vehicle.next_maintenance_mileage.toLocaleString()} km</p>
                        {kmUntilMaintenance !== null && (
                          <p className={`text-sm ${needsMaintenance ? 'text-red-600' : 'text-gray-600'}`}>
                            {kmUntilMaintenance > 0 ? `Faltan ${kmUntilMaintenance.toLocaleString()} km` : `Vencido por ${Math.abs(kmUntilMaintenance).toLocaleString()} km`}
                          </p>
                        )}
                      </div>
                    )}
                    {vehicle.technical_review_expiry && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Revision Tecnica</label>
                        <p className={`font-semibold ${technicalReviewExpiring ? 'text-red-600' : 'text-gray-900'}`}>{new Date(vehicle.technical_review_expiry).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {vehicle.next_maintenance_mileage && vehicle.last_maintenance_mileage && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Progreso de Mantenimiento</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progreso actual</span>
                      <span>{Math.round(((vehicle.mileage - vehicle.last_maintenance_mileage) / vehicle.maintenance_interval) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className={`h-3 rounded-full transition-all duration-300 ${needsMaintenance ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, ((vehicle.mileage - vehicle.last_maintenance_mileage) / vehicle.maintenance_interval) * 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'insurance' && (
            <div className="text-center py-12 text-gray-500">
              <Shield size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Los seguros se gestionan desde el modulo de Documentos.</p>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="text-center py-12 text-gray-500">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <p>El historial de mantenimiento se gestiona desde el modulo de Mantenimiento.</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button onClick={onClose} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
