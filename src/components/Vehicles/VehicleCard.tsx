import React from 'react';
import { Car, Calendar, MapPin, Fuel } from 'lucide-react';
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

export function VehicleCard({ vehicle, onClick }: VehicleCardProps) {
  const status = statusColors[vehicle.status];
  
  return (
    <div
      onClick={onClick}
      className={`${status.bg} rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-gray-200`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Car className={status.text} size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-sm text-gray-600">{vehicle.year} • {vehicle.color}</p>
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
        
        {vehicle.nextMaintenance && (
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-2" />
            <span className="font-medium">Próximo mantenimiento:</span>
            <span className="ml-1">{new Date(vehicle.nextMaintenance).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}