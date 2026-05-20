import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Wrench } from 'lucide-react';
import { Maintenance } from '../../types';

interface MaintenanceCalendarProps {
  maintenances: Maintenance[];
}

export function MaintenanceCalendar({ maintenances }: MaintenanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let day = 1; day <= lastDay.getDate(); day++) days.push(new Date(year, month, day));
    return days;
  };

  const getMaintenancesForDate = (date: Date | null) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return maintenances.filter(m => m.scheduled_date === dateString);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return d;
    });
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const isToday = (date: Date | null) => date?.toDateString() === today.toDateString();

  const getStatusColor = (status: string) => {
    if (status === 'scheduled') return 'bg-blue-500';
    if (status === 'in-progress') return 'bg-yellow-500';
    if (status === 'completed') return 'bg-green-500';
    return 'bg-gray-500';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Calendario</h2>
          </div>
          <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">Hoy</button>
        </div>
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
          <div className="flex items-center space-x-2">
            <button onClick={() => navigateMonth('prev')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft size={20} /></button>
            <button onClick={() => navigateMonth('next')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysOfWeek.map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 border-b border-gray-200">{day}</div>
        ))}
        {days.map((date, index) => {
          const dayMaintenances = getMaintenancesForDate(date);
          return (
            <div key={index} className={`min-h-[100px] p-2 border border-gray-100 ${date ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'} ${isToday(date) ? 'bg-blue-50 border-blue-200' : ''}`}>
              {date && (
                <>
                  <div className={`text-sm font-medium mb-1 ${isToday(date) ? 'text-blue-600' : 'text-gray-900'}`}>{date.getDate()}</div>
                  <div className="space-y-1">
                    {dayMaintenances.slice(0, 2).map((m) => (
                      <div key={m.id} className={`text-xs p-1 rounded text-white ${getStatusColor(m.status)}`} title={`${m.vehicle_id} - ${m.type}`}>
                        <div className="flex items-center space-x-1">
                          <Wrench size={10} />
                          <span className="truncate">{m.vehicle_id}</span>
                        </div>
                      </div>
                    ))}
                    {dayMaintenances.length > 2 && <div className="text-xs text-gray-500 text-center">+{dayMaintenances.length - 2} mas</div>}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-blue-500 rounded"></div><span>Programado</span></div>
        <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-yellow-500 rounded"></div><span>En Progreso</span></div>
        <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-green-500 rounded"></div><span>Completado</span></div>
      </div>
    </div>
  );
}
