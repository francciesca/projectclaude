import React, { useState, useEffect } from 'react';
import { X, Truck } from 'lucide-react';
import { Service } from '../../types';
import { AutocompleteInput } from '../AutocompleteInput';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Omit<Service, 'id' | 'company_id'>) => void;
  service?: Service | null;
  companyId: string;
}

const serviceTypes = [
  { value: 'transport', label: 'Transporte' },
  { value: 'machinery', label: 'Maquinaria' },
  { value: 'lowboy', label: 'Cama Baja' },
  { value: 'crane', label: 'Grua' },
  { value: 'other', label: 'Otro' },
];

const defaultForm = {
  client_id: '',
  vehicle_id: '',
  service_date: '',
  service_type: 'transport',
  chofer_nombre: '',
  chofer_telefono: '',
  origen: '',
  destino: '',
  trabajo_realizado: '',
  valor_cobrado: '',
  payment_status: 'pending' as Service['payment_status'],
  payment_date: '',
  observaciones: '',
};

export function ServiceModal({ isOpen, onClose, onSave, service, companyId }: ServiceModalProps) {
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (service) {
      setFormData({
        client_id: service.client_id,
        vehicle_id: service.vehicle_id,
        service_date: service.service_date,
        service_type: service.service_type,
        chofer_nombre: service.chofer_nombre,
        chofer_telefono: service.chofer_telefono,
        origen: service.origen,
        destino: service.destino,
        trabajo_realizado: service.trabajo_realizado,
        valor_cobrado: service.valor_cobrado?.toString() || '',
        payment_status: service.payment_status,
        payment_date: service.payment_date || '',
        observaciones: service.observaciones || '',
      });
    } else {
      setFormData(defaultForm);
    }
  }, [service, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      valor_cobrado: formData.valor_cobrado ? parseFloat(formData.valor_cobrado) : 0,
      payment_date: formData.payment_date || '',
      observaciones: formData.observaciones || '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Truck className="text-blue-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {service ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Datos del Servicio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cliente *</label>
                <input type="text" name="client_id" value={formData.client_id} onChange={handleChange} placeholder="Nombre o ID del cliente" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patente Vehiculo *</label>
                <AutocompleteInput
                  value={formData.vehicle_id}
                  onChange={(val) => setFormData(prev => ({ ...prev, vehicle_id: val }))}
                  companyId={companyId}
                  rpcName="search_patentes"
                  placeholder="Ej: ABC-123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha *</label>
                <input type="date" name="service_date" value={formData.service_date} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Servicio *</label>
                <select name="service_type" value={formData.service_type} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  {serviceTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Chofer / Operador</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Chofer *</label>
                <input type="text" name="chofer_nombre" value={formData.chofer_nombre} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefono Chofer</label>
                <input type="tel" name="chofer_telefono" value={formData.chofer_telefono} onChange={handleChange} placeholder="+56 9 1234 5678" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Ruta y Trabajo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Origen *</label>
                <input type="text" name="origen" value={formData.origen} onChange={handleChange} placeholder="Ciudad o direccion de origen" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destino *</label>
                <input type="text" name="destino" value={formData.destino} onChange={handleChange} placeholder="Ciudad o direccion de destino" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Trabajo Realizado *</label>
                <textarea name="trabajo_realizado" value={formData.trabajo_realizado} onChange={handleChange} rows={2} placeholder="Descripcion del trabajo realizado" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Pago</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valor Cobrado *</label>
                <input type="number" name="valor_cobrado" value={formData.valor_cobrado} onChange={handleChange} min="0" step="1000" placeholder="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado Pago *</label>
                <select name="payment_status" value={formData.payment_status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  <option value="pending">Pendiente</option>
                  <option value="partial">Parcial</option>
                  <option value="paid">Pagado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Pago</label>
                <input type="date" name="payment_date" value={formData.payment_date} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
            <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} rows={2} placeholder="Notas adicionales..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {service ? 'Actualizar' : 'Crear'} Servicio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
