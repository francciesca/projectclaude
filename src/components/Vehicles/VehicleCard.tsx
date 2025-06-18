import React from 'react';
import { Car, Calendar, MapPin, Fuel, Wrench, Building2, AlertTriangle } from 'lucide-react';
import { Vehicle } from '../../types';

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick: () => void;
}

const statusColors = {
  available: { bg: 'bg-green-50', text: 'text-green-800', badge: 'bg-green-100 text-green-800' },
  rented: { bg: 'bg-purple-50', text: 'text-purple-800', badge: 'bg-purple-100 text-purple-800' },
  maintenance: { bg: 'bg-yellow-50', text: 'text-yellow-800', badge: 'bg-yellow-100 text-yellow-800' }
};

const statusLabels = {
  available: 'Disponible',
  rented: 'Alquilado',
  maintenance: 'Mantenimiento'
};

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

export function VehicleCard({ vehicle, onClick }: VehicleCardProps) {
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
    <div
      onClick={onClick}
      className={`${status.bg} rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-gray-200 relative`}
    >
      {/* Alerts */}
      {(needsMaintenance || technicalReviewExpiring) && (
        <div className="absolute top-3 right-3">
          <AlertTriangle className="text-red-500" size={20} />
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Car className={status.text} size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-sm text-gray-600">
              {vehicle.year} • {vehicle.color} • {vehicleTypeLabels[vehicle.vehicleType]}
            </p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.badge}`}>
          {statusLabels[vehicle.status]}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin size={16} className="mr-2" />
          <span className="font-medium">Matrícula:</span>
          <span className="ml-1 font-mono">{vehicle.plate}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Fuel size={16} className="mr-2" />
          <span className="font-medium">Kilometraje:</span>
          <span className="ml-1">{vehicle.mileage.toLocaleString()} km</span>
        </div>

        {vehicle.currentClient && (
          <div className="flex items-center text-sm text-gray-600">
            <Building2 size={16} className="mr-2" />
            <span className="font-medium">Cliente:</span>
            <span className="ml-1 truncate">{vehicle.currentClient}</span>
          </div>
        )}
        
        {/* Maintenance Info */}
        {vehicle.nextMaintenanceMileage && (
          <div className="flex items-center text-sm text-gray-600">
            <Wrench size={16} className="mr-2" />
            <span className="font-medium">Próximo mantenimiento:</span>
            <span className={`ml-1 ${needsMaintenance ? 'text-red-600 font-semibold' : ''}`}>
              {vehicle.nextMaintenanceMileage.toLocaleString()} km
            </span>
          </div>
        )}

        {kmUntilMaintenance !== null && (
          <div className="text-xs">
            <span className={`font-medium ${needsMaintenance ? 'text-red-600' : 'text-gray-500'}`}>
              {kmUntilMaintenance > 0 
                ? `Faltan ${kmUntilMaintenance.toLocaleString()} km` 
                : `Mantenimiento vencido por ${Math.abs(kmUntilMaintenance).toLocaleString()} km`
              }
            </span>
          </div>
        )}

        {/* Technical Review Info */}
        {vehicle.technicalReviewExpiry && (
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-2" />
            <span className="font-medium">Revisión técnica:</span>
            <span className={`ml-1 ${technicalReviewExpiring ? 'text-red-600 font-semibold' : ''}`}>
              {new Date(vehicle.technicalReviewExpiry).toLocaleDateString()}
            </span>
          </div>
        )}

        {daysUntilTechnicalReview !== null && technicalReviewExpiring && (
          <div className="text-xs">
            <span className="font-medium text-red-600">
              {daysUntilTechnicalReview > 0 
                ? `Vence en ${daysUntilTechnicalReview} días` 
                : `Vencida hace ${Math.abs(daysUntilTechnicalReview)} días`
              }
            </span>
          </div>
        )}
      </div>

      {/* Progress bar for maintenance */}
      {vehicle.nextMaintenanceMileage && vehicle.lastMaintenanceMileage && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Progreso mantenimiento</span>
            <span className="text-xs text-gray-500">
              {Math.round(((vehicle.mileage - vehicle.lastMaintenanceMileage) / vehicle.maintenanceInterval) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                needsMaintenance ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ 
                width: `${Math.min(100, ((vehicle.mileage - vehicle.lastMaintenanceMileage) / vehicle.maintenanceInterval) * 100)}%` 
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}