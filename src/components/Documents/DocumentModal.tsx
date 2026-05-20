import React, { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';
import { Document } from '../../types';
import { AutocompleteInput } from '../AutocompleteInput';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (document: Omit<Document, 'id' | 'company_id'>) => void;
  document?: Document | null;
  companyId?: string;
}

const defaultForm = {
  name: '',
  type: 'insurance' as Document['type'],
  expiry_date: '',
  status: 'valid' as Document['status'],
  vehicle_id: '',
  driver_id: '',
};

export function DocumentModal({ isOpen, onClose, onSave, document, companyId }: DocumentModalProps) {
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (document) {
      setFormData({
        name: document.name,
        type: document.type,
        expiry_date: document.expiry_date,
        status: document.status,
        vehicle_id: document.vehicle_id || '',
        driver_id: document.driver_id || '',
      });
    } else {
      setFormData(defaultForm);
    }
  }, [document, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      vehicle_id: formData.vehicle_id || undefined,
      driver_id: formData.driver_id || undefined,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="text-blue-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {document ? 'Editar Documento' : 'Agregar Documento'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                <option value="insurance">Seguro</option>
                <option value="registration">Registro</option>
                <option value="permit">Permiso</option>
                <option value="technical-review">Rev. Tecnica</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado *</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                <option value="valid">Vigente</option>
                <option value="expiring">Por Vencer</option>
                <option value="expired">Vencido</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Vencimiento *</label>
              <input type="date" name="expiry_date" value={formData.expiry_date} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Patente Vehiculo</label>
              {companyId ? (
                <AutocompleteInput
                  value={formData.vehicle_id}
                  onChange={(val) => setFormData(prev => ({ ...prev, vehicle_id: val }))}
                  companyId={companyId}
                  rpcName="search_patentes"
                  placeholder="Opcional"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <input type="text" name="vehicle_id" value={formData.vehicle_id} onChange={handleChange} placeholder="Opcional" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ID Conductor</label>
              <input type="text" name="driver_id" value={formData.driver_id} onChange={handleChange} placeholder="Opcional" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {document ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
