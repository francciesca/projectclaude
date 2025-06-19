import React, { useState } from 'react';
import { Car, Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { Vehicle } from '../../types';
import { mockVehicles } from '../../data/mockData';
import { useCompany } from '../../hooks/useCompany';
import { useCompanyData } from '../../hooks/useLocalStorage';
import { VehicleCard } from './VehicleCard';
import { VehicleModal } from './VehicleModal';
import { VehicleDetailModal } from './VehicleDetailModal';

export function VehiclesModule() {
  const { currentCompany } = useCompany();
  
  // Usar almacenamiento local para persistir los datos
  const [vehicles, setVehicles] = useCompanyData<Vehicle[]>(
    'vehicles', 
    mockVehicles.filter(v => v.companyId === currentCompany.id),
    currentCompany.id
  );
  
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(vehicles);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Filter vehicles based on search and status
  React.useEffect(() => {
    let filtered = vehicles;

    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.status === statusFilter);
    }

    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm, statusFilter]);

  const handleAddVehicle = (vehicleData: Omit<Vehicle, 'id' | 'companyId'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: Date.now().toString(),
      companyId: currentCompany.id
    };
    const updatedVehicles = [...vehicles, newVehicle];
    setVehicles(updatedVehicles);
    setShowModal(false);
    
    // Mostrar confirmación
    alert('Vehículo agregado y guardado correctamente');
  };

  const handleEditVehicle = (vehicleData: Omit<Vehicle, 'id' | 'companyId'>) => {
    if (editingVehicle) {
      const updatedVehicles = vehicles.map(v =>
        v.id === editingVehicle.id ? { ...vehicleData, id: editingVehicle.id, companyId: currentCompany.id } : v
      );
      setVehicles(updatedVehicles);
      setEditingVehicle(null);
      setShowModal(false);
      
      // Mostrar confirmación
      alert('Vehículo actualizado y guardado correctamente');
    }
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    if (confirm('¿Está seguro de que desea eliminar este vehículo? Esta acción no se puede deshacer.')) {
      const updatedVehicles = vehicles.filter(v => v.id !== vehicleId);
      setVehicles(updatedVehicles);
      
      // Mostrar confirmación
      alert('Vehículo eliminado correctamente');
    }
  };

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDetailModal(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowModal(true);
  };

  const stats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === 'available').length,
    rented: vehicles.filter(v => v.status === 'rented').length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Vehículos</h1>
          <p className="text-gray-600">Administra la flota de {currentCompany.name}</p>
          <p className="text-sm text-green-600 mt-1">
            ✓ Datos guardados automáticamente en tu dispositivo
          </p>
        </div>
        <button
          onClick={() => {
            setEditingVehicle(null);
            setShowModal(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Agregar Vehículo
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Car className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Disponibles</p>
              <p className="text-2xl font-bold text-green-600">{stats.available}</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Alquilados</p>
              <p className="text-2xl font-bold text-purple-600">{stats.rented}</p>
            </div>
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Mantenimiento</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.maintenance}</p>
            </div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Buscar por matrícula, marca o modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="available">Disponible</option>
              <option value="rented">Alquilado</option>
              <option value="maintenance">Mantenimiento</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <VehicleCard vehicle={vehicle} onClick={() => handleViewDetails(vehicle)} />
            <div className="p-4 border-t border-gray-100">
              <div className="flex justify-between space-x-2">
                <button
                  onClick={() => handleViewDetails(vehicle)}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Eye size={16} className="mr-1" />
                  Ver Detalles
                </button>
                <button
                  onClick={() => handleEdit(vehicle)}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Edit size={16} className="mr-1" />
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} className="mr-1" />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <Car className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron vehículos</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza agregando tu primer vehículo'}
          </p>
        </div>
      )}

      {/* Add/Edit Vehicle Modal */}
      <VehicleModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingVehicle(null);
        }}
        onSave={editingVehicle ? handleEditVehicle : handleAddVehicle}
        vehicle={editingVehicle}
      />

      {/* Vehicle Detail Modal */}
      <VehicleDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedVehicle(null);
        }}
        vehicle={selectedVehicle}
        onEdit={(vehicle) => {
          setShowDetailModal(false);
          handleEdit(vehicle);
        }}
      />
    </div>
  );
}