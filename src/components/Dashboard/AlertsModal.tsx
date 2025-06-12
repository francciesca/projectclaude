import React from 'react';
import { X, AlertTriangle, Clock, FileX, Shield, Wrench } from 'lucide-react';
import { Alert } from '../../types';

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: Alert[];
}

const alertIcons = {
  maintenance: Wrench,
  document: FileX,
  license: Shield,
  insurance: Shield
};

const priorityColors = {
  low: 'text-blue-600 bg-blue-50 border-blue-200',
  medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  high: 'text-orange-600 bg-orange-50 border-orange-200',
  urgent: 'text-red-600 bg-red-50 border-red-200'
};

export function AlertsModal({ isOpen, onClose, alerts }: AlertsModalProps) {
  if (!isOpen) return null;

  const urgentAlerts = alerts.filter(alert => alert.priority === 'urgent').length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Alertas del Sistema</h2>
              <p className="text-sm text-gray-600">
                {urgentAlerts > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                    {urgentAlerts} Urgentes
                  </span>
                )}
                {alerts.length} alertas activas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            {alerts.map((alert) => {
              const IconComponent = alertIcons[alert.type];
              const priorityStyle = priorityColors[alert.priority];
              
              return (
                <div key={alert.id} className={`p-4 rounded-lg border ${priorityStyle}`}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <IconComponent size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold">{alert.title}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${priorityStyle}`}>
                          {alert.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock size={12} className="mr-1" />
                        {new Date(alert.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cerrar
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Marcar como Leídas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}