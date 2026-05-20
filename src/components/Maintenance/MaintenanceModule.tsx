import React, { useState, useEffect } from 'react';
import { Wrench, Plus, Search, Filter, Calendar, Clock, CheckCircle, Play } from 'lucide-react';
import { Maintenance } from '../../types';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { MaintenanceModal } from './MaintenanceModal';
import { MaintenanceCalendar } from './MaintenanceCalendar';

interface Props {
  companyId: string;
}

export function MaintenanceModule({ companyId }: Props) {
  const { data: maintenances, isLoading, addItem, updateItem } = useSupabaseData<Maintenance>('maintenances', companyId);
  const [filteredMaintenances, setFilteredMaintenances] = useState<Maintenance[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState<Maintenance | null>(null);

  useEffect(() => {
    let filtered = maintenances;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(m =>
        m.vehicle_id.toLowerCase().includes(term) ||
        m.workshop?.toLowerCase().includes(term)
      );
    }
    if (statusFilter !== 'all') filtered = filtered.filter(m => m.status === statusFilter);
    if (typeFilter !== 'all') filtered = filtered.filter(m => m.type === typeFilter);
    setFilteredMaintenances(filtered);
  }, [maintenances, searchTerm, statusFilter, typeFilter]);

  const handleAddMaintenance = async (data: Omit<Maintenance, 'id' | 'company_id'>) => {
    await addItem(data as Omit<Maintenance, 'id'>);
    setShowModal(false);
  };

  const handleEditMaintenance = async (data: Omit<Maintenance, 'id' | 'company_id'>) => {
    if (editingMaintenance) {
      await updateItem(editingMaintenance.id, data);
      setEditingMaintenance(null);
      setShowModal(false);
    }
  };

  const handleProgressUpdate = async (id: string, increment: number) => {
    const m = maintenances.find(x => x.id === id);
    if (!m) return;
    const newProgress = Math.min(100, Math.max(0, m.progress + increment));
    let newStatus = m.status;
    if (newProgress === 100) newStatus = 'completed';
    else if (newProgress > 0 && m.status === 'scheduled') newStatus = 'in-progress';
    await updateItem(id, { progress: newProgress, status: newStatus });
  };

  const handleTaskToggle = async (maintenanceId: string, taskId: string) => {
    const m = maintenances.find(x => x.id === maintenanceId);
    if (!m) return;
    const updatedTasks = m.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    const completedTasks = updatedTasks.filter(t => t.completed).length;
    const newProgress = updatedTasks.length > 0 ? Math.round((completedTasks / updatedTasks.length) * 100) : 0;
    let newStatus = m.status;
    if (newProgress === 100) newStatus = 'completed';
    else if (newProgress > 0 && m.status === 'scheduled') newStatus = 'in-progress';
    await updateItem(maintenanceId, { tasks: updatedTasks, progress: newProgress, status: newStatus });
  };

  const getStatusIcon = (status: string) => {
    if (status === 'scheduled') return <Clock className="text-blue-500" size={20} />;
    if (status === 'in-progress') return <Play className="text-yellow-500" size={20} />;
    if (status === 'completed') return <CheckCircle className="text-green-500" size={20} />;
    return <Wrench className="text-gray-500" size={20} />;
  };

  const getStatusColor = (status: string) => {
    if (status === 'scheduled') return 'bg-blue-100 text-blue-800';
    if (status === 'in-progress') return 'bg-yellow-100 text-yellow-800';
    if (status === 'completed') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'scheduled') return 'Programado';
    if (status === 'in-progress') return 'En Progreso';
    if (status === 'completed') return 'Completado';
    return status;
  };

  const getPriorityColor = (p: string) => {
    if (p === 'high') return 'bg-red-100 text-red-800';
    if (p === 'medium') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getPriorityLabel = (p: string) => {
    if (p === 'high') return 'Alta';
    if (p === 'medium') return 'Media';
    return 'Baja';
  };

  const stats = {
    total: maintenances.length,
    scheduled: maintenances.filter(m => m.status === 'scheduled').length,
    inProgress: maintenances.filter(m => m.status === 'in-progress').length,
    completed: maintenances.filter(m => m.status === 'completed').length,
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion de Mantenimiento</h1>
          <p className="text-gray-600">Administra el mantenimiento de la flota</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button onClick={() => setShowCalendar(!showCalendar)} className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Calendar size={16} className="mr-2" />
            {showCalendar ? 'Ocultar' : 'Ver'} Calendario
          </button>
          <button onClick={() => { setEditingMaintenance(null); setShowModal(true); }} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={16} className="mr-2" />
            Programar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Programados</p>
          <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">En Progreso</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Completados</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
      </div>

      {showCalendar && <MaintenanceCalendar maintenances={maintenances} />}

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Buscar por vehiculo o taller..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">Todos</option>
              <option value="scheduled">Programado</option>
              <option value="in-progress">En Progreso</option>
              <option value="completed">Completado</option>
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">Todos</option>
              <option value="preventive">Preventivo</option>
              <option value="corrective">Correctivo</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredMaintenances.map((maintenance) => (
          <div key={maintenance.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(maintenance.status)}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Vehiculo: {maintenance.vehicle_id}</h3>
                    <p className="text-sm text-gray-600">{maintenance.type === 'preventive' ? 'Preventivo' : 'Correctivo'} - {new Date(maintenance.scheduled_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(maintenance.priority)}`}>{getPriorityLabel(maintenance.priority)}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(maintenance.status)}`}>{getStatusLabel(maintenance.status)}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progreso</span>
                  <span className="text-sm text-gray-500">{maintenance.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-300 ${maintenance.status === 'completed' ? 'bg-green-500' : maintenance.status === 'in-progress' ? 'bg-yellow-500' : 'bg-blue-500'}`} style={{ width: `${maintenance.progress}%` }}></div>
                </div>
              </div>

              {maintenance.tasks && maintenance.tasks.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Tareas</h4>
                  <div className="space-y-2">
                    {maintenance.tasks.map((task) => (
                      <div key={task.id} className="flex items-center space-x-2">
                        <input type="checkbox" checked={task.completed} onChange={() => handleTaskToggle(maintenance.id, task.id)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>{task.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                {maintenance.workshop && <div><span className="font-medium">Taller:</span> {maintenance.workshop}</div>}
                {maintenance.cost && <div><span className="font-medium">Costo:</span> <span className="text-green-600 font-semibold">${maintenance.cost.toLocaleString()}</span></div>}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {maintenance.status !== 'completed' && (
                    <>
                      <button onClick={() => handleProgressUpdate(maintenance.id, 25)} className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors">+25%</button>
                      <button onClick={() => handleProgressUpdate(maintenance.id, 50)} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200 transition-colors">+50%</button>
                      <button onClick={() => handleProgressUpdate(maintenance.id, 100 - maintenance.progress)} className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors">Completar</button>
                    </>
                  )}
                </div>
                <button onClick={() => { setEditingMaintenance(maintenance); setShowModal(true); }} className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Editar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMaintenances.length === 0 && (
        <div className="text-center py-12">
          <Wrench className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron mantenimientos</h3>
          <p className="text-gray-600">{searchTerm || statusFilter !== 'all' || typeFilter !== 'all' ? 'Ajusta los filtros' : 'Programa tu primer mantenimiento'}</p>
        </div>
      )}

      <MaintenanceModal isOpen={showModal} onClose={() => { setShowModal(false); setEditingMaintenance(null); }} onSave={editingMaintenance ? handleEditMaintenance : handleAddMaintenance} maintenance={editingMaintenance} companyId={companyId} />
    </div>
  );
}
