import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Eye, CreditCard as Edit, Trash2, Star } from 'lucide-react';
import { Driver } from '../../types';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { DriverModal } from './DriverModal';
import { DriverDetailModal } from './DriverDetailModal';

interface Props {
  companyId: string;
}

export function DriversModule({ companyId }: Props) {
  const { data: drivers, isLoading, addItem, updateItem, deleteItem } = useSupabaseData<Driver>('drivers', companyId);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  useEffect(() => {
    let filtered = drivers;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(term) ||
        d.rut.toLowerCase().includes(term) ||
        d.email.toLowerCase().includes(term) ||
        d.license_number.toLowerCase().includes(term)
      );
    }
    setFilteredDrivers(filtered);
  }, [drivers, searchTerm]);

  const handleAddDriver = async (data: Omit<Driver, 'id' | 'company_id'>) => {
    await addItem(data as Omit<Driver, 'id'>);
    setShowModal(false);
  };

  const handleEditDriver = async (data: Omit<Driver, 'id' | 'company_id'>) => {
    if (editingDriver) {
      await updateItem(editingDriver.id, data);
      setEditingDriver(null);
      setShowModal(false);
    }
  };

  const handleDeleteDriver = async (id: string) => {
    if (confirm('Esta seguro de que desea eliminar este conductor?')) {
      await deleteItem(id);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={16} className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
    ));
  };

  const getLicenseStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry < 0) return { label: 'Vencida', color: 'bg-red-100 text-red-800' };
    if (daysUntilExpiry <= 30) return { label: 'Por vencer', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Vigente', color: 'bg-green-100 text-green-800' };
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion de Conductores</h1>
          <p className="text-gray-600">Administra los conductores de tu empresa</p>
        </div>
        <button
          onClick={() => { setEditingDriver(null); setShowModal(true); }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Agregar Conductor
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{drivers.length}</p>
            </div>
            <Users className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Con Vehiculo</p>
              <p className="text-2xl font-bold text-green-600">{drivers.filter(d => d.assigned_vehicle).length}</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lic. por Vencer</p>
              <p className="text-2xl font-bold text-yellow-600">
                {drivers.filter(d => {
                  const days = Math.ceil((new Date(d.license_expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  return days <= 30 && days > 0;
                }).length}
              </p>
            </div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rating Promedio</p>
              <p className="text-2xl font-bold text-blue-600">
                {drivers.length > 0 ? (drivers.reduce((acc, d) => acc + d.rating, 0) / drivers.length).toFixed(1) : '0.0'}
              </p>
            </div>
            <Star className="text-yellow-500 fill-current" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar por nombre, RUT, email o licencia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => {
          const licenseStatus = getLicenseStatus(driver.license_expiry);
          return (
            <div key={driver.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {driver.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{driver.name}</h3>
                      <p className="text-sm text-gray-600">{driver.rut}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${licenseStatus.color}`}>
                    {licenseStatus.label}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Email:</span>
                    <span className="ml-2">{driver.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Telefono:</span>
                    <span className="ml-2">{driver.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Licencia:</span>
                    <span className="ml-2 font-mono">{driver.license_number}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium text-gray-600">Rating:</span>
                    <div className="flex items-center space-x-1 ml-2">
                      {renderStars(driver.rating)}
                      <span className="text-sm text-gray-600 ml-1">({driver.rating})</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between space-x-2">
                  <button onClick={() => { setSelectedDriver(driver); setShowDetailModal(true); }} className="flex-1 flex items-center justify-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye size={16} className="mr-1" /> Ver
                  </button>
                  <button onClick={() => { setEditingDriver(driver); setShowModal(true); }} className="flex-1 flex items-center justify-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <Edit size={16} className="mr-1" /> Editar
                  </button>
                  <button onClick={() => handleDeleteDriver(driver.id)} className="flex-1 flex items-center justify-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={16} className="mr-1" /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDrivers.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron conductores</h3>
          <p className="text-gray-600">{searchTerm ? 'Intenta ajustar la busqueda' : 'Comienza agregando tu primer conductor'}</p>
        </div>
      )}

      <DriverModal isOpen={showModal} onClose={() => { setShowModal(false); setEditingDriver(null); }} onSave={editingDriver ? handleEditDriver : handleAddDriver} driver={editingDriver} />
      <DriverDetailModal isOpen={showDetailModal} onClose={() => { setShowDetailModal(false); setSelectedDriver(null); }} driver={selectedDriver} onEdit={(d) => { setShowDetailModal(false); setEditingDriver(d); setShowModal(true); }} />
    </div>
  );
}
