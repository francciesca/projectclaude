import React, { useState, useEffect } from 'react';
import { X, Users } from 'lucide-react';
import { Driver } from '../../types';

interface DriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (driver: Omit<Driver, 'id' | 'company_id'>) => void;
  driver?: Driver | null;
}

const defaultForm = {
  rut: '',
  name: '',
  phone: '',
  email: '',
  address: '',
  license_number: '',
  license_expiry: '',
  rating: 5,
  monthly_hours: 0,
  assigned_vehicle: '',
};

export function DriverModal({ isOpen, onClose, onSave, driver }: DriverModalProps) {
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (driver) {
      setFormData({
        rut: driver.rut,
        name: driver.name,
        phone: driver.phone,
        email: driver.email,
        address: driver.address,
        license_number: driver.license_number,
        license_expiry: driver.license_expiry,
        rating: driver.rating,
        monthly_hours: driver.monthly_hours,
        assigned_vehicle: driver.assigned_vehicle || '',
      });
    } else {
      setFormData(defaultForm);
    }
  }, [driver, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      assigned_vehicle: formData.assigned_vehicle || undefined,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' || name === 'monthly_hours' ? parseFloat(value) || 0 : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {driver ? 'Editar Conductor' : 'Agregar Conductor'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">RUT *</label>
              <input type="text" name="rut" value={formData.rut} onChange={handleChange} placeholder="12.345.678-9" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefono *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+56 9 1234 5678" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Direccion *</label>
              <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Numero de Licencia *</label>
              <input type="text" name="license_number" value={formData.license_number} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vencimiento de Licencia *</label>
              <input type="date" name="license_expiry" value={formData.license_expiry} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
              <select name="rating" value={formData.rating} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value={1}>1 - Muy Malo</option>
                <option value={2}>2 - Malo</option>
                <option value={3}>3 - Regular</option>
                <option value={4}>4 - Bueno</option>
                <option value={5}>5 - Excelente</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Horas Mensuales</label>
              <input type="number" name="monthly_hours" value={formData.monthly_hours} onChange={handleChange} min="0" max="300" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehiculo Asignado</label>
              <input type="text" name="assigned_vehicle" value={formData.assigned_vehicle} onChange={handleChange} placeholder="ID del vehiculo (opcional)" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {driver ? 'Actualizar' : 'Agregar'} Conductor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
