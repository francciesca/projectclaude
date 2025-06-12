import React, { useState, useEffect } from 'react';
import { X, Wrench, Plus, Trash2 } from 'lucide-react';
import { Maintenance, MaintenanceTask } from '../../types';

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (maintenance: Omit<Maintenance, 'id' | 'companyId'>) => void;
  maintenance?: Maintenance | null;
}

export function MaintenanceModal({ isOpen, onClose, onSave, maintenance }: MaintenanceModalProps) {
  const [formData, setFormData] = useState({
    vehicleId: '',
    type: 'preventive' as Maintenance['type'],
    priority: 'medium' as Maintenance['priority'],
    scheduledDate: '',
    status: 'scheduled' as Maintenance['status'],
    progress: 0,
    cost: '',
    workshop: '',
    notes: ''
  });

  const [tasks, setTasks] = useState<MaintenanceTask[]>([
    { id: '1', name: '', completed: false }
  ]);

  useEffect(() => {
    if (maintenance) {
      setFormData({
        vehicleId: maintenance.vehicleId,
        type: maintenance.type,
        priority: maintenance.priority,
        scheduledDate: maintenance.scheduledDate,
        status: maintenance.status,
        progress: maintenance.progress,
        cost: maintenance.cost?.toString() || '',
        workshop: maintenance.workshop || '',
        notes: maintenance.notes || ''
      });
      setTasks(maintenance.tasks.length > 0 ? maintenance.tasks : [{ id: '1', name: '', completed: false }]);
    } else {
      setFormData({
        vehicleId: '',
        type: 'preventive',
        priority: 'medium',
        scheduledDate: '',
        status: 'scheduled',
        progress: 0,
        cost: '',
        workshop: '',
        notes: ''
      });
      setTasks([{ id: '1', name: '', completed: false }]);
    }
  }, [maintenance, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validTasks = tasks.filter(task => task.name.trim() !== '');
    onSave({
      ...formData,
      cost: formData.cost ? parseFloat(formData.cost) : undefined,
      workshop: formData.workshop || undefined,
      notes: formData.notes || undefined,
      tasks: validTasks
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'progress' ? parseInt(value) || 0 : value
    }));
  };

  const handleTaskChange = (taskId: string, name: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, name } : task
    ));
  };

  const addTask = () => {
    const newTask: MaintenanceTask = {
      id: Date.now().toString(),
      name: '',
      completed: false
    };
    setTasks(prev => [...prev, newTask]);
  };

  const removeTask = (taskId: string) => {
    if (tasks.length > 1) {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wrench className="text-blue-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {maintenance ? 'Editar Mantenimiento' : 'Programar Mantenimiento'}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID del Vehículo *
              </label>
              <input
                type="text"
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleChange}
                placeholder="Ej: ABC-123"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Mantenimiento *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="preventive">Preventivo</option>
                <option value="corrective">Correctivo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad *
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Programada *
              </label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
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
                <option value="scheduled">Programado</option>
                <option value="in-progress">En Progreso</option>
                <option value="completed">Completado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progreso (%)
              </label>
              <input
                type="number"
                name="progress"
                value={formData.progress}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Costo (opcional)
              </label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                min="0"
                step="1000"
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taller (opcional)
              </label>
              <input
                type="text"
                name="workshop"
                value={formData.workshop}
                onChange={handleChange}
                placeholder="Nombre del taller"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tasks Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Tareas de Mantenimiento
              </label>
              <button
                type="button"
                onClick={addTask}
                className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                <Plus size={16} className="mr-1" />
                Agregar Tarea
              </button>
            </div>
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div key={task.id} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={task.name}
                    onChange={(e) => handleTaskChange(task.id, e.target.value)}
                    placeholder={`Tarea ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {tasks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTask(task.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas (opcional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Notas adicionales sobre el mantenimiento..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              {maintenance ? 'Actualizar' : 'Programar'} Mantenimiento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}