import { useState, useEffect, useCallback } from 'react';
import { Truck, Plus, Search, Filter, CreditCard as Edit, Trash2, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Service } from '../../types';
import { supabase } from '../../lib/supabase';
import { ServiceModal } from './ServiceModal';

interface Props {
  companyId: string;
}

export function ServicesModule({ companyId }: Props) {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase.rpc('services_resumen', { org_id: companyId });
    if (error) {
      setMessage({ type: 'error', text: 'Error al cargar servicios: ' + error.message });
    } else {
      setServices((data as Service[]) || []);
    }
    setIsLoading(false);
  }, [companyId]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    let filtered = services;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.client_id.toLowerCase().includes(term) ||
        s.vehicle_id.toLowerCase().includes(term) ||
        s.chofer_nombre.toLowerCase().includes(term) ||
        s.origen.toLowerCase().includes(term) ||
        s.destino.toLowerCase().includes(term)
      );
    }
    if (typeFilter !== 'all') filtered = filtered.filter(s => s.service_type === typeFilter);
    if (paymentFilter !== 'all') filtered = filtered.filter(s => s.payment_status === paymentFilter);
    setFilteredServices(filtered);
  }, [services, searchTerm, typeFilter, paymentFilter]);

  const showTemporaryMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleSave = async (data: Omit<Service, 'id' | 'company_id'>) => {
    if (editingService) {
      const { error } = await supabase
        .from('services')
        .update(data)
        .eq('id', editingService.id);
      if (error) {
        showTemporaryMessage('error', 'Error al actualizar: ' + error.message);
        return;
      }
      showTemporaryMessage('success', 'Servicio actualizado correctamente');
    } else {
      const { error } = await supabase
        .from('services')
        .insert({ ...data, company_id: companyId });
      if (error) {
        showTemporaryMessage('error', 'Error al crear servicio: ' + error.message);
        return;
      }
      showTemporaryMessage('success', 'Servicio creado correctamente');
    }
    setShowModal(false);
    setEditingService(null);
    fetchServices();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Esta seguro de que desea eliminar este servicio?')) return;
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) {
      showTemporaryMessage('error', 'Error al eliminar: ' + error.message);
      return;
    }
    showTemporaryMessage('success', 'Servicio eliminado');
    fetchServices();
  };

  const getPaymentStatusColor = (status: string) => {
    if (status === 'paid') return 'bg-green-100 text-green-800';
    if (status === 'partial') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getPaymentStatusLabel = (status: string) => {
    if (status === 'paid') return 'Pagado';
    if (status === 'partial') return 'Parcial';
    return 'Pendiente';
  };

  const getPaymentIcon = (status: string) => {
    if (status === 'paid') return <CheckCircle className="text-green-500" size={18} />;
    if (status === 'partial') return <Clock className="text-yellow-500" size={18} />;
    return <AlertTriangle className="text-red-500" size={18} />;
  };

  const getTypeLabel = (type: string) => {
    if (type === 'transport') return 'Transporte';
    if (type === 'machinery') return 'Maquinaria';
    if (type === 'lowboy') return 'Cama Baja';
    if (type === 'crane') return 'Grua';
    return 'Otro';
  };

  const stats = {
    total: services.length,
    pending: services.filter(s => s.payment_status === 'pending').length,
    partial: services.filter(s => s.payment_status === 'partial').length,
    paid: services.filter(s => s.payment_status === 'paid').length,
    totalRevenue: services.reduce((sum, s) => sum + (s.valor_cobrado || 0), 0),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Servicios Operacionales</h1>
          <p className="text-gray-600">Gestiona los servicios de transporte y maquinaria</p>
        </div>
        <button
          onClick={() => { setEditingService(null); setShowModal(true); }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Nuevo Servicio
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Pendientes</p>
          <p className="text-2xl font-bold text-red-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Parciales</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.partial}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Pagados</p>
          <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Ingresos</p>
          <p className="text-2xl font-bold text-blue-600">${stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Buscar por cliente, patente, chofer, origen o destino..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">Todos los tipos</option>
              <option value="transport">Transporte</option>
              <option value="machinery">Maquinaria</option>
              <option value="lowboy">Cama Baja</option>
              <option value="crane">Grua</option>
              <option value="other">Otro</option>
            </select>
            <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="partial">Parcial</option>
              <option value="paid">Pagado</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Truck className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{service.client_id}</h3>
                    <p className="text-sm text-gray-600">{getTypeLabel(service.service_type)} - {new Date(service.service_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-green-600">${(service.valor_cobrado || 0).toLocaleString()}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(service.payment_status)}`}>
                    {getPaymentIcon(service.payment_status)}
                    <span className="ml-1">{getPaymentStatusLabel(service.payment_status)}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Patente:</span> {service.vehicle_id}
                </div>
                <div>
                  <span className="font-medium">Chofer:</span> {service.chofer_nombre}
                </div>
                <div>
                  <span className="font-medium">Origen:</span> {service.origen}
                </div>
                <div>
                  <span className="font-medium">Destino:</span> {service.destino}
                </div>
              </div>

              {service.trabajo_realizado && (
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">Trabajo:</span> {service.trabajo_realizado}
                </p>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => { setEditingService(service); setShowModal(true); }}
                  className="inline-flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Edit size={16} className="mr-1" /> Editar
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="inline-flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} className="mr-1" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Truck className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron servicios</h3>
          <p className="text-gray-600">
            {searchTerm || typeFilter !== 'all' || paymentFilter !== 'all'
              ? 'Ajusta los filtros de busqueda'
              : 'Crea tu primer servicio operacional'}
          </p>
        </div>
      )}

      <ServiceModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingService(null); }}
        onSave={handleSave}
        service={editingService}
        companyId={companyId}
      />
    </div>
  );
}
