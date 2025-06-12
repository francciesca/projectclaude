import { Vehicle, Driver, Maintenance, Document, Alert } from '../types';

export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    vin: 'JH4KA3150KC007856',
    plate: 'ABC-123',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2022,
    color: 'Blanco',
    purchaseDate: '2022-01-15',
    mileage: 25000,
    status: 'available',
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-07-15',
    companyId: '1'
  },
  {
    id: '2',
    vin: 'JH4KA3150KC007857',
    plate: 'DEF-456',
    brand: 'Chevrolet',
    model: 'Spark',
    year: 2021,
    color: 'Rojo',
    purchaseDate: '2021-06-10',
    mileage: 45000,
    status: 'rented',
    lastMaintenance: '2024-02-10',
    nextMaintenance: '2024-08-10',
    companyId: '1'
  },
  {
    id: '3',
    vin: 'JH4KA3150KC007858',
    plate: 'GHI-789',
    brand: 'Nissan',
    model: 'Sentra',
    year: 2023,
    color: 'Azul',
    purchaseDate: '2023-03-20',
    mileage: 15000,
    status: 'maintenance',
    lastMaintenance: '2024-03-01',
    nextMaintenance: '2024-09-01',
    companyId: '1'
  }
];

export const mockDrivers: Driver[] = [
  {
    id: '1',
    rut: '12345678-9',
    name: 'Juan Pérez',
    phone: '+56 9 1234 5678',
    email: 'juan.perez@email.com',
    address: 'Av. Libertador 1234, Santiago',
    licenseNumber: 'A1234567',
    licenseExpiry: '2025-12-31',
    rating: 4.5,
    monthlyHours: 180,
    assignedVehicle: '1',
    companyId: '1'
  },
  {
    id: '2',
    rut: '87654321-0',
    name: 'María González',
    phone: '+56 9 8765 4321',
    email: 'maria.gonzalez@email.com',
    address: 'Calle Principal 567, Valparaíso',
    licenseNumber: 'B7654321',
    licenseExpiry: '2024-06-30',
    rating: 4.8,
    monthlyHours: 200,
    assignedVehicle: '2',
    companyId: '1'
  }
];

export const mockMaintenance: Maintenance[] = [
  {
    id: '1',
    vehicleId: '1',
    type: 'preventive',
    priority: 'medium',
    scheduledDate: '2024-07-15',
    status: 'scheduled',
    progress: 0,
    tasks: [
      { id: '1', name: 'Cambio de aceite', completed: false },
      { id: '2', name: 'Revisión de frenos', completed: false },
      { id: '3', name: 'Cambio de filtros', completed: false }
    ],
    companyId: '1'
  },
  {
    id: '2',
    vehicleId: '3',
    type: 'corrective',
    priority: 'high',
    scheduledDate: '2024-03-15',
    status: 'in-progress',
    progress: 50,
    tasks: [
      { id: '4', name: 'Reparación de motor', completed: true },
      { id: '5', name: 'Cambio de correa', completed: false },
      { id: '6', name: 'Prueba de funcionamiento', completed: false }
    ],
    cost: 850000,
    workshop: 'Taller Central',
    companyId: '1'
  }
];

export const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Seguro Obligatorio - ABC-123',
    type: 'insurance',
    expiryDate: '2024-12-31',
    status: 'valid',
    vehicleId: '1',
    companyId: '1'
  },
  {
    id: '2',
    name: 'Licencia de Conducir - Juan Pérez',
    type: 'permit',
    expiryDate: '2024-06-15',
    status: 'expiring',
    driverId: '1',
    companyId: '1'
  }
];

export const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Mantenimiento Urgente',
    description: 'El vehículo GHI-789 requiere mantenimiento correctivo inmediato',
    priority: 'urgent',
    type: 'maintenance',
    date: '2024-03-10',
    companyId: '1'
  },
  {
    id: '2',
    title: 'Documento por Vencer',
    description: 'Licencia de conducir de Juan Pérez vence en 15 días',
    priority: 'high',
    type: 'license',
    date: '2024-03-12',
    companyId: '1'
  }
];