import React, { useState } from 'react';
import { X, Car, Edit, Calendar, Shield, Wrench, Plus, FileText, Building2, AlertTriangle, Fuel } from 'lucide-react';
import { Vehicle } from '../../types';

interface VehicleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onEdit: (vehicle: Vehicle) => void;
}

interface Insurance {
  id: string;
  name: string;
  policy: string;
  coverage: string;
  expiryDate: string;
  status: 'active' | 'expired';
  cost: number;
}

interface MaintenanceRecord {
  id: string;
  date: string;
  type: string;
  description: string;
  cost: number;
  workshop: string;
  mileage: number;
}

const vehicleTypeLabels = {
  'auto': 'Automóvil',
  'camioneta': 'Camioneta',
  'camion': 'Camión',
  'cama-baja': 'Cama Baja',
  'furgon': 'Furgón',
  'bus': 'Bus',
  'maquinaria': 'Maquinaria',
  'otro': 'Otro'
};

export function VehicleDetailModal({ isOpen, onClose, vehicle, onEdit }: VehicleDetailModalProps) {
  const [activeTab, setActiveTab] = useState('info');
  
  // Mock data for insurance and maintenance
  const [insurances] = useState<Insurance[]>([
    {
      id: '1',
      name: 'Seguro Obligatorio',
      policy: 'SO-2024-001',
      coverage: 'Responsabilidad Civil',
      expiryDate: '2024-12-31',
      status: 'active',
      cost: 120000
    },
    {
      id: '2',
      name: 'Seguro Complementario',
      policy: 'SC-2024-002',
      coverage: 'Todo Riesgo',
      expiryDate: '2024-08-15',
      status: 'active',
      cost: 450000
    }
  ]);

  const [maintenanceHistory] = useState<MaintenanceRecord[]>([
    {
      id: '1',
      date: '2024-01-15',
      type: 'Mantenimiento Preventivo',
      description: 'Cambio de aceite y filtros',
      cost: 85000,
      workshop: 'Taller Central',
      mileage: 23000
    },
    {
      id: '2',
      date: '2023-10-20',
      type: 'Reparación',
      description: 'Cambio de pastillas de freno',
      cost: 120000,
      workshop: 'AutoService Plus',
      mileage: 20500
    }
  ]);

  if (!isOpen || !vehicle) return null;

  const statusColors = {
    available: { bg: 'bg-green-100', text: 'text-green-800', label: 'Disponible' },
    rented: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Alquilado' },
    maintenance: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Mantenimiento' }
  };

  const status = statusColors[vehicle.status];

  // Calculate maintenance status
  const kmUntilMaintenance = vehicle.nextMaintenanceMileage ? vehicle.nextMaintenanceMileage - vehicle.mileage : null;
  const needsMaintenance = kmUntilMaintenance !== null && kmUntilMaintenance <= 1000;
  
  // Check technical review status
  const today = new Date();
  const technicalReviewDate = vehicle.technicalReviewExpiry ? new Date(vehicle.technicalReviewExpiry) : null;
  const daysUntilTechnicalReview = technicalReviewDate ? Math.ceil((technicalReviewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;
  const technicalReviewExpiring = daysUntilTechnicalReview !== null && daysUntilTechnicalReview <= 30;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500 rounded-lg">
              <Car className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {vehicle.brand} {vehicle.model}
              </h2>
              <p className="text-gray-600">{vehicle.year} • {vehicle.color} • {vehicleTypeLabels[vehicle.vehicleType]}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                  {status.label}
                </span>
                {(needsMaintenance || technicalReviewExpiring) && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <AlertTriangle size={12} className="mr-1" />
                    Requiere Atención
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(vehicle)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit size={16} className="mr-2" />
              Editar Vehículo
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'info', label: 'Información', icon: Car },
              { id: 'insurance', label: 'Seguros', icon: Shield },
              { id: 'maintenance', label: 'Mantenimiento', icon: Wrench }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IconComponent size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Alerts Section */}
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
                        <span>
                          {kmUntilMaintenance! > 0 
                            ? `Mantenimiento próximo en ${kmUntilMaintenance!.toLocaleString()} km`
                            : `Mantenimiento vencido por ${Math.abs(kmUntilMaintenance!).toLocaleString()} km`
                          }
                        </span>
                      </div>
                    )}
                    {technicalReviewExpiring && (
                      <div className="flex items-center text-red-700">
                        <Calendar size={16} className="mr-2" />
                        <span>
                          {daysUntilTechnicalReview! > 0 
                            ? `Revisión técnica vence en ${daysUntilTechnicalReview} días`
                            : `Revisión técnica vencida hace ${Math.abs(daysUntilTechnicalReview!)} días`
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">VIN</label>
                      <p className="text-gray-900 font-mono">{vehicle.vin}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Matrícula</label>
                      <p className="text-gray-900 font-mono text-lg font-bold">{vehicle.plate}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Tipo de Vehículo</label>
                      <p className="text-gray-900">{vehicleTypeLabels[vehicle.vehicleType]}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Fecha de Compra</label>
                      <p className="text-gray-900">{new Date(vehicle.purchaseDate).toLocaleDateString()}</p>
                    </div>
                    {vehicle.currentClient && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Cliente/Empresa Actual</label>
                        <p className="text-gray-900 flex items-center">
                          <Building2 size={16} className="mr-2 text-blue-500" />
                          {vehicle.currentClient}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Kilometraje y Mantenimiento</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Kilometraje Actual</label>
                      <p className="text-gray-900 flex items-center">
                        <Fuel size={16} className="mr-2 text-blue-500" />
                        {vehicle.mileage.toLocaleString()} km
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Intervalo de Mantenimiento</label>
                      <p className="text-gray-900">{vehicle.maintenanceInterval.toLocaleString()} km</p>
                    </div>
                    {vehicle.lastMaintenance && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Último Mantenimiento</label>
                        <p className="text-gray-900">{new Date(vehicle.lastMaintenance).toLocaleDateString()}</p>
                        {vehicle.lastMaintenanceMileage && (
                          <p className="text-sm text-gray-600">En {vehicle.lastMaintenanceMileage.toLocaleString()} km</p>
                        )}
                      </div>
                    )}
                    {vehicle.nextMaintenanceMileage && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Próximo Mantenimiento</label>
                        <p className={`font-semibold ${needsMaintenance ? 'text-red-600' : 'text-gray-900'}`}>
                          {vehicle.nextMaintenanceMileage.toLocaleString()} km
                        </p>
                        {kmUntilMaintenance !== null && (
                          <p className={`text-sm ${needsMaintenance ? 'text-red-600' : 'text-gray-600'}`}>
                            {kmUntilMaintenance > 0 
                              ? `Faltan ${kmUntilMaintenance.toLocaleString()} km` 
                              : `Vencido por ${Math.abs(kmUntilMaintenance).toLocaleString()} km`
                            }
                          </p>
                        )}
                      </div>
                    )}
                    {vehicle.technicalReviewExpiry && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Revisión Técnica</label>
                        <p className={`font-semibold ${technicalReviewExpiring ? 'text-red-600' : 'text-gray-900'}`}>
                          {new Date(vehicle.technicalReviewExpiry).toLocaleDateString()}
                        </p>
                        {daysUntilTechnicalReview !== null && (
                          <p className={`text-sm ${technicalReviewExpiring ? 'text-red-600' : 'text-gray-600'}`}>
                            {daysUntilTechnicalReview > 0 
                              ? `Vence en ${daysUntilTechnicalReview} días` 
                              : `Vencida hace ${Math.abs(daysUntilTechnicalReview)} días`
                            }
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Bars */}
              {vehicle.nextMaintenanceMileage && vehicle.lastMaintenanceMileage && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Progreso de Mantenimiento</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progreso actual</span>
                      <span>{Math.round(((vehicle.mileage - vehicle.lastMaintenanceMileage) / vehicle.maintenanceInterval) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          needsMaintenance ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ 
                          width: `${Math.min(100, ((vehicle.mileage - vehicle.lastMaintenanceMileage) / vehicle.maintenanceInterval) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'insurance' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Seguros Complementarios</h3>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Plus size={16} className="mr-2" />
                  Agregar Seguro
                </button>
              </div>
              
              <div className="space-y-4">
                {insurances.map((insurance) => (
                  <div key={insurance.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{insurance.name}</h4>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            insurance.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {insurance.status === 'active' ? 'Activo' : 'Vencido'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Póliza:</span>
                            <span className="ml-2 font-mono">{insurance.policy}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Cobertura:</span>
                            <span className="ml-2">{insurance.coverage}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Vencimiento:</span>
                            <span className="ml-2">{new Date(insurance.expiryDate).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Costo:</span>
                            <span className="ml-2 font-semibold">${insurance.cost.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Historial de Mantenimiento</h3>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus size={16} className="mr-2" />
                  Agregar Registro
                </button>
              </div>
              
              <div className="space-y-4">
                {maintenanceHistory.map((record) => (
                  <div key={record.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Calendar className="text-blue-500" size={16} />
                          <span className="font-semibold text-gray-900">{new Date(record.date).toLocaleDateString()}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-600">{record.mileage.toLocaleString()} km</span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">{record.type}</h4>
                        <p className="text-gray-600 text-sm mb-2">{record.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div>
                            <span className="text-gray-500">Taller:</span>
                            <span className="ml-2">{record.workshop}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Costo:</span>
                            <span className="ml-2 font-semibold text-green-600">${record.cost.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800">
                        <FileText size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}