import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Wrench } from 'lucide-react';
import { Maintenance } from '../../types';

interface MaintenanceCalendarProps {
  maintenances: Maintenance[];
}

export function MaintenanceCalendar({ maintenances }: MaintenanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getMaintenancesForDate = (date: Date | null) => {
    if (!date) return [];
    
    const dateString = date.toISOString().split('T')[0];
    return maintenances.filter(maintenance => 
      maintenance.scheduledDate === dateString
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const isToday = (date: Date | null) => {
    if (!date) return false;
    return date.toDateString() === today.toDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500';
      case 'in-progress':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">
              Calendario de Mantenimiento
            </h2>
          </div>
          <button
            onClick={goToToday}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
          >
            Hoy
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {daysOfWeek.map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 border-b border-gray-200">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((date, index) => {
          const dayMaintenances = getMaintenancesForDate(date);
          
          return (
            <div
              key={index}
              className={`min-h-[100px] p-2 border border-gray-100 ${
                date ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
              } ${isToday(date) ? 'bg-blue-50 border-blue-200' : ''}`}
            >
              {date && (
                <>
                  <div className={`text-sm font-medium mb-1 ${
                    isToday(date) ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {date.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {dayMaintenances.slice(0, 2).map((maintenance) => (
                      <div
                        key={maintenance.id}
                        className={`text-xs p-1 rounded text-white ${getStatusColor(maintenance.status)}`}
                        title={`${maintenance.vehicleId} - ${maintenance.type}`}
                      >
                        <div className="flex items-center space-x-1">
                          <Wrench size={10} />
                          <span className="truncate">{maintenance.vehicleId}</span>
                        </div>
                      </div>
                    ))}
                    
                    {dayMaintenances.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayMaintenances.length - 2} más
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Programado</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span>En Progreso</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Completado</span>
        </div>
      </div>
    </div>
  );
}