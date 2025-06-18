import React, { useState, useEffect } from 'react';
import { X, Car } from 'lucide-react';
import { Vehicle } from '../../types';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicle: Omit<Vehicle, 'id' | 'companyId'>) => void;
  vehicle?: Vehicle | null;
}

const vehicleTypes = [
  { value: 'auto', label: 'Automóvil' },
  { value: 'camioneta', label: 'Camioneta' },
  { value: 'camion', label: 'Camión' },
  { value: 'cama-baja', label: 'Cama Baja' },
  { value: 'furgon', label: 'Furgón' },
  { value: 'bus', label: 'Bus' },
  { value: 'maquinaria', label: 'Maquinaria' },
  { value: 'otro', label: 'Otro' }
];

export function VehicleModal({ isOpen, onClose, onSave, vehicle }: VehicleModalProps) {
  const [formData, setFormData] = useState({
    vin: '',
    plate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    vehicleType: 'auto' as Vehicle['vehicleType'],
    purchaseDate: '',
    mileage: 0,
    status: 'available' as Vehicle['status'],
    lastMaintenance: '',
    lastMaintenanceMileage: 0,
    nextMaintenance: '',
    nextMaintenanceMileage: 0,
    maintenanceInterval: 10000,
    technicalReviewExpiry: '',
    currentClient: ''
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        vin: vehicle.vin,
        plate: vehicle.plate,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        vehicleType: vehicle.vehicleType,
        purchaseDate: vehicle.purchaseDate,
        mileage: vehicle.mileage,
        status: vehicle.status,
        lastMaintenance: vehicle.lastMaintenance || '',
        lastMaintenanceMileage: vehicle.lastMaintenanceMileage || 0,
        nextMaintenance: vehicle.nextMaintenance || '',
        nextMaintenanceMileage: vehicle.nextMaintenanceMileage || 0,
        maintenanceInterval: vehicle.maintenanceInterval,
        technicalReviewExpiry: vehicle.technicalReviewExpiry || '',
        currentClient: vehicle.currentClient || ''
      });
    } else {
      setFormData({
        vin: '',
        plate: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        color: '',
        vehicleType: 'auto',
        purchaseDate: '',
        mileage: 0,
        status: 'available',
        lastMaintenance: '',
        lastMaintenanceMileage: 0,
        nextMaintenance: '',
        nextMaintenanceMileage: 0,
        maintenanceInterval: 10000,
        technicalReviewExpiry: '',
        currentClient: ''
      });
    }
  }, [vehicle, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate next maintenance based on current mileage and interval
    const nextMaintenanceMileage = formData.mileage + formData.maintenanceInterval;
    
    onSave({
      ...formData,
      nextMaintenanceMileage,
      lastMaintenance: formData.lastMaintenance || undefined,
      lastMaintenanceMileage: formData.lastMaintenanceMileage || undefined,
      nextMaintenance: formData.nextMaintenance || undefined,
      technicalReviewExpiry: formData.technicalReviewExpiry || undefined,
      currentClient: formData.currentClient || undefined
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['year', 'mileage', 'lastMaintenanceMileage', 'nextMaintenanceMileage', 'maintenanceInterval'].includes(name) 
        ? parseInt(value) || 0 
        : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Car className="text-blue-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {vehicle ? 'Editar Vehículo' : 'Agregar Vehículo'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información Básica */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VIN *
                </label>
                <input
                  type="text"
                  name="vin"
                  value={formData.vin}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matrícula *
                </label>
                <input
                  type="text"
                  name="plate"
                  value={formData.plate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Vehículo *
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {vehicleTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marca *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo *
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año *
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color *
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Compra *
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="available">Disponible</option>
                  <option value="rented">Alquilado</option>
                  <option value="maintenance">Mantenimiento</option>
                </select>
              </div>
            </div>
          </div>

          {/* Información de Kilometraje */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Kilometraje</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kilometraje Actual *
                </label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intervalo de Mantenimiento (km) *
                </label>
                <input
                  type="number"
                  name="maintenanceInterval"
                  value={formData.maintenanceInterval}
                  onChange={handleChange}
                  min="1000"
                  step="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Km del Último Mantenimiento
                </label>
                <input
                  type="number"
                  name="lastMaintenanceMileage"
                  value={formData.lastMaintenanceMileage}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Información de Mantenimiento y Documentos */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mantenimiento y Documentos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Último Mantenimiento
                </label>
                <input
                  type="date"
                  name="lastMaintenance"
                  value={formData.lastMaintenance}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Próximo Mantenimiento
                </label>
                <input
                  type="date"
                  name="nextMaintenance"
                  value={formData.nextMaintenance}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vencimiento Revisión Técnica
                </label>
                <input
                  type="date"
                  name="technicalReviewExpiry"
                  value={formData.technicalReviewExpiry}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente/Empresa Actual
                </label>
                <input
                  type="text"
                  name="currentClient"
                  value={formData.currentClient}
                  onChange={handleChange}
                  placeholder="Nombre del cliente o empresa"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Información Calculada */}
          {formData.mileage > 0 && formData.maintenanceInterval > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Información Calculada</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-600">Próximo mantenimiento en:</span>
                  <span className="ml-2 font-semibold">{(formData.mileage + formData.maintenanceInterval).toLocaleString()} km</span>
                </div>
                <div>
                  <span className="text-blue-600">Kilómetros restantes:</span>
                  <span className="ml-2 font-semibold">{formData.maintenanceInterval.toLocaleString()} km</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {vehicle ? 'Actualizar' : 'Agregar'} Vehículo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}