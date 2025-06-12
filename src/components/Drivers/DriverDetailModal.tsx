import React from 'react';
import { X, Users, Phone, Mail, MapPin, CreditCard, Calendar, Star, Edit } from 'lucide-react';
import { Driver } from '../../types';

interface DriverDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: Driver | null;
  onEdit: (driver: Driver) => void;
}

export function DriverDetailModal({ isOpen, onClose, driver, onEdit }: DriverDetailModalProps) {
  if (!isOpen || !driver) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={20}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const getLicenseStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return { status: 'expired', label: 'Vencida', color: 'bg-red-100 text-red-800', days: Math.abs(daysUntilExpiry) };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'expiring', label: 'Por vencer', color: 'bg-yellow-100 text-yellow-800', days: daysUntilExpiry };
    } else {
      return { status: 'valid', label: 'Vigente', color: 'bg-green-100 text-green-800', days: daysUntilExpiry };
    }
  };

  const licenseStatus = getLicenseStatus(driver.licenseExpiry);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {driver.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{driver.name}</h2>
              <p className="text-gray-600">{driver.rut}</p>
              <div className="flex items-center space-x-1 mt-1">
                {renderStars(driver.rating)}
                <span className="text-sm text-gray-600 ml-2">({driver.rating})</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(driver)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit size={16} className="mr-2" />
              Editar Conductor
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="text-blue-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-medium text-gray-900">{driver.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="text-blue-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{driver.email}</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="text-blue-500 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Dirección</p>
                  <p className="font-medium text-gray-900">{driver.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* License Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Licencia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <CreditCard className="text-blue-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Número de Licencia</p>
                  <p className="font-medium text-gray-900 font-mono">{driver.licenseNumber}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-blue-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Vencimiento</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-900">
                      {new Date(driver.licenseExpiry).toLocaleDateString()}
                    </p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${licenseStatus.color}`}>
                      {licenseStatus.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {licenseStatus.status === 'expired' 
                      ? `Vencida hace ${licenseStatus.days} días`
                      : licenseStatus.status === 'expiring'
                      ? `Vence en ${licenseStatus.days} días`
                      : `Válida por ${licenseStatus.days} días más`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Laboral</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Horas Mensuales</p>
                    <p className="text-2xl font-bold text-blue-700">{driver.monthlyHours}</p>
                  </div>
                  <div className="text-blue-500">
                    <Calendar size={24} />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((driver.monthlyHours / 200) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    {Math.round((driver.monthlyHours / 200) * 100)}% de 200 horas objetivo
                  </p>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Rating</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold text-green-700">{driver.rating}</p>
                      <div className="flex items-center space-x-1">
                        {renderStars(driver.rating)}
                      </div>
                    </div>
                  </div>
                  <div className="text-green-500">
                    <Star size={24} />
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2">
                  {driver.rating >= 4.5 ? 'Excelente desempeño' :
                   driver.rating >= 4.0 ? 'Buen desempeño' :
                   driver.rating >= 3.0 ? 'Desempeño regular' : 'Necesita mejorar'}
                </p>
              </div>
            </div>
          </div>

          {/* Vehicle Assignment */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Asignación de Vehículo</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              {driver.assignedVehicle ? (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Users className="text-white\" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vehículo Asignado</p>
                    <p className="font-medium text-gray-900 font-mono">{driver.assignedVehicle}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Users className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-gray-500">Sin vehículo asignado</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}