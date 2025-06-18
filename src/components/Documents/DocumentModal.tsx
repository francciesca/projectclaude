import React, { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';
import { Document } from '../../types';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (document: Omit<Document, 'id' | 'companyId'>) => void;
  document?: Document | null;
}

export function DocumentModal({ isOpen, onClose, onSave, document }: DocumentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'insurance' as Document['type'],
    expiryDate: '',
    status: 'valid' as Document['status'],
    vehicleId: '',
    driverId: ''
  });

  useEffect(() => {
    if (document) {
      setFormData({
        name: document.name,
        type: document.type,
        expiryDate: document.expiryDate,
        status: document.status,
        vehicleId: document.vehicleId || '',
        driverId: document.driverId || ''
      });
    } else {
      setFormData({
        name: '',
        type: 'insurance',
        expiryDate: '',
        status: 'valid',
        vehicleId: '',
        driverId: ''
      });
    }
  }, [document, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      vehicleId: formData.vehicleId || undefined,
      driverId: formData.driverId || undefined
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="text-blue-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {document ? 'Editar Documento' : 'Agregar Documento'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Documento *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Documento *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="insurance">Seguro</option>
                <option value="registration">Registro</option>
                <option value="permit">Permiso</option>
                <option value="technical-review">Revisión Técnica</option>
                <option value="other">Otro</option>
              </select>
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
                <option value="valid">Vigente</option>
                <option value="expiring">Por Vencer</option>
                <option value="expired">Vencido</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Vencimiento *
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID del Vehículo (opcional)
              </label>
              <input
                type="text"
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleChange}
                placeholder="Ej: ABC-123"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID del Conductor (opcional)
              </label>
              <input
                type="text"
                name="driverId"
                value={formData.driverId}
                onChange={handleChange}
                placeholder="Ej: 12345678-9"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

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
              {document ? 'Actualizar' : 'Agregar'} Documento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}