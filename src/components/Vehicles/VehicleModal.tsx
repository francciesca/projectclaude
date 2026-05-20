import React, { useState, useEffect } from 'react';
import { X, Car } from 'lucide-react';
import { Vehicle } from '../../types';
import { AutocompleteInput } from '../AutocompleteInput';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicle: Omit<Vehicle, 'id' | 'company_id'>) => void;
  vehicle?: Vehicle | null;
  companyId?: string;
}

const vehicleTypes = [
  { value: 'auto', label: 'Automovil' },
  { value: 'camioneta', label: 'Camioneta' },
  { value: 'camion', label: 'Camion' },
  { value: 'cama-baja', label: 'Cama Baja' },
  { value: 'furgon', label: 'Furgon' },
  { value: 'bus', label: 'Bus' },
  { value: 'maquinaria', label: 'Maquinaria' },
  { value: 'otro', label: 'Otro' },
];

const defaultForm = {
  vin: '',
  plate: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  color: '',
  vehicle_type: 'auto' as Vehicle['vehicle_type'],
  purchase_date: '',
  mileage: 0,
  status: 'available' as Vehicle['status'],
  last_maintenance: '',
  last_maintenance_mileage: 0,
  next_maintenance: '',
  next_maintenance_mileage: 0,
  maintenance_interval: 10000,
  technical_review_expiry: '',
  current_client: '',
};

export function VehicleModal({ isOpen, onClose, onSave, vehicle, companyId }: VehicleModalProps) {
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (vehicle) {
      setFormData({
        vin: vehicle.vin,
        plate: vehicle.plate,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        vehicle_type: vehicle.vehicle_type,
        purchase_date: vehicle.purchase_date,
        mileage: vehicle.mileage,
        status: vehicle.status,
        last_maintenance: vehicle.last_maintenance || '',
        last_maintenance_mileage: vehicle.last_maintenance_mileage || 0,
        next_maintenance: vehicle.next_maintenance || '',
        next_maintenance_mileage: vehicle.next_maintenance_mileage || 0,
        maintenance_interval: vehicle.maintenance_interval,
        technical_review_expiry: vehicle.technical_review_expiry || '',
        current_client: vehicle.current_client || '',
      });
    } else {
      setFormData(defaultForm);
    }
  }, [vehicle, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextMileage = formData.mileage + formData.maintenance_interval;
    onSave({
      ...formData,
      next_maintenance_mileage: nextMileage,
      last_maintenance: formData.last_maintenance || undefined,
      last_maintenance_mileage: formData.last_maintenance_mileage || undefined,
      next_maintenance: formData.next_maintenance || undefined,
      technical_review_expiry: formData.technical_review_expiry || undefined,
      current_client: formData.current_client || undefined,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['year', 'mileage', 'last_maintenance_mileage', 'next_maintenance_mileage', 'maintenance_interval'].includes(name)
        ? parseInt(value) || 0
        : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Car className="text-blue-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {vehicle ? 'Editar Vehiculo' : 'Agregar Vehiculo'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informacion Basica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">VIN *</label>
                <input type="text" name="vin" value={formData.vin} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Matricula *</label>
                <input type="text" name="plate" value={formData.plate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                <select name="vehicle_type" value={formData.vehicle_type} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  {vehicleTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marca *</label>
                {companyId ? (
                  <AutocompleteInput
                    value={formData.brand}
                    onChange={(val) => setFormData(prev => ({ ...prev, brand: val }))}
                    companyId={companyId}
                    rpcName="search_marcas"
                    placeholder="Ej: Toyota"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ) : (
                  <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modelo *</label>
                <input type="text" name="model" value={formData.model} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ano *</label>
                <input type="number" name="year" value={formData.year} onChange={handleChange} min="1900" max={new Date().getFullYear() + 1} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color *</label>
                <input type="text" name="color" value={formData.color} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Compra *</label>
                <input type="date" name="purchase_date" value={formData.purchase_date} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado *</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  <option value="available">Disponible</option>
                  <option value="rented">Alquilado</option>
                  <option value="maintenance">Mantenimiento</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kilometraje</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kilometraje Actual *</label>
                <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Intervalo Mant. (km) *</label>
                <input type="number" name="maintenance_interval" value={formData.maintenance_interval} onChange={handleChange} min="1000" step="1000" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Km Ultimo Mant.</label>
                <input type="number" name="last_maintenance_mileage" value={formData.last_maintenance_mileage} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mantenimiento y Documentos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ultimo Mantenimiento</label>
                <input type="date" name="last_maintenance" value={formData.last_maintenance} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Proximo Mantenimiento</label>
                <input type="date" name="next_maintenance" value={formData.next_maintenance} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vencimiento Rev. Tecnica</label>
                <input type="date" name="technical_review_expiry" value={formData.technical_review_expiry} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cliente Actual</label>
                <input type="text" name="current_client" value={formData.current_client} onChange={handleChange} placeholder="Nombre del cliente" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          {formData.mileage > 0 && formData.maintenance_interval > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Informacion Calculada</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-600">Proximo mantenimiento en:</span>
                  <span className="ml-2 font-semibold">{(formData.mileage + formData.maintenance_interval).toLocaleString()} km</span>
                </div>
                <div>
                  <span className="text-blue-600">Kilometros restantes:</span>
                  <span className="ml-2 font-semibold">{formData.maintenance_interval.toLocaleString()} km</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {vehicle ? 'Actualizar' : 'Agregar'} Vehiculo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
