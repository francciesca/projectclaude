import React, { useState } from 'react';
import { Users, Plus, Search, Filter, Eye, Edit, Trash2, Star } from 'lucide-react';
import { Driver } from '../../types';
import { mockDrivers } from '../../data/mockData';
import { useCompany } from '../../hooks/useCompany';
import { useCompanyData } from '../../hooks/useLocalStorage';
import { DriverModal } from './DriverModal';
import { DriverDetailModal } from './DriverDetailModal';

export function DriversModule() {
  const { currentCompany } = useCompany();
  
  // Usar almacenamiento local para persistir los datos
  const [drivers, setDrivers] = useCompanyData<Driver[]>(
    'drivers', 
    mockDrivers.filter(d => d.companyId === currentCompany.id),
    currentCompany.id
  );
  
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>(drivers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  // Filter drivers based on search
  React.useEffect(() => {
    let filtered = drivers;

    if (searchTerm) {
      filtered = filtered.filter(driver =>
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDrivers(filtered);
  }, [drivers, searchTerm]);

  const handleAddDriver = (driverData: Omit<Driver, 'id' | 'companyId'>) => {
    const newDriver: Driver = {
      ...driverData,
      id: Date.now().toString(),
      companyId: currentCompany.id
    };
    const updatedDrivers = [...drivers, newDriver];
    setDrivers(updatedDrivers);
    setShowModal(false);
    
    // Mostrar confirmación
    alert('Conductor agregado y guardado correctamente');
  };

  const handleEditDriver = (driverData: Omit<Driver, 'id' | 'companyId'>) => {
    if (editingDriver) {
      const updatedDrivers = drivers.map(d =>
        d.id === editingDriver.id ? { ...driverData, id: editingDriver.id, companyId: currentCompany.id } : d
      );
      setDrivers(updatedDrivers);
      setEditingDriver(null);
      setShowModal(false);
      
      // Mostrar confirmación
      alert('Conductor actualizado y guardado correctamente');
    }
  };

  const handleDeleteDriver = (driverId: string) => {
    if (confirm('¿Está seguro de que desea eliminar este conductor? Esta acción no se puede deshacer.')) {
      const updatedDrivers = drivers.filter(d => d.id !== driverId);
      setDrivers(updatedDrivers);
      
      // Mostrar confirmación
      alert('Conductor eliminado correctamente');
    }
  };

  const handleViewDetails = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowDetailModal(true);
  };

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setShowModal(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const getLicenseStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return { status: 'expired', label: 'Vencida', color: 'bg-red-100 text-red-800' };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'expiring', label: 'Por vencer', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { status: 'valid', label: 'Vigente', color: 'bg-green-100 text-green-800' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Conductores</h1>
          <p className="text-gray-600">Administra los conductores de {currentCompany.name}</p>
          <p className="text-sm text-green-600 mt-1">
            ✓ Datos guardados automáticamente en tu dispositivo
          </p>
        </div>
        <button
          onClick={() => {
            setEditingDriver(null);
            setShowModal(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Agregar Conductor
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Conductores</p>
              <p className="text-2xl font-bold text-gray-900">{drivers.length}</p>
            </div>
            <Users className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Con Vehículo Asignado</p>
              <p className="text-2xl font-bold text-green-600">
                {drivers.filter(d => d.assignedVehicle).length}
              </p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Licencias por Vencer</p>
              <p className="text-2xl font-bold text-yellow-600">
                {drivers.filter(d => {
                  const daysUntilExpiry = Math.ceil((new Date(d.licenseExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
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
              <p className="text-2xl font-bold text-purple-600">
                {drivers.length > 0 ? (drivers.reduce((acc, d) => acc + d.rating, 0) / drivers.length).toFixed(1) : '0.0'}
              </p>
            </div>
            <Star className="text-yellow-500 fill-current" size={24} />
          </div>
        </div>
      </div>

      {/* Search */}
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

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => {
          const licenseStatus = getLicenseStatus(driver.licenseExpiry);
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
                    <span className="font-medium">Teléfono:</span>
                    <span className="ml-2">{driver.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Licencia:</span>
                    <span className="ml-2 font-mono">{driver.licenseNumber}</span>
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
                  <button
                    onClick={() => handleViewDetails(driver)}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye size={16} className="mr-1" />
                    Ver Detalles
                  </button>
                  <button
                    onClick={() => handleEdit(driver)}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Edit size={16} className="mr-1" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteDriver(driver.id)}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Eliminar
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
          <p className="text-gray-600">
            {searchTerm
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza agregando tu primer conductor'}
          </p>
        </div>
      )}

      {/* Add/Edit Driver Modal */}
      <DriverModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingDriver(null);
        }}
        onSave={editingDriver ? handleEditDriver : handleAddDriver}
        driver={editingDriver}
      />

      {/* Driver Detail Modal */}
      <DriverDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedDriver(null);
        }}
        driver={selectedDriver}
        onEdit={(driver) => {
          setShowDetailModal(false);
          handleEdit(driver);
        }}
      />
    </div>
  );
}