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
    vehicleType: 'auto',
    purchaseDate: '2022-01-15',
    mileage: 25000,
    status: 'available',
    lastMaintenance: '2024-01-15',
    lastMaintenanceMileage: 20000,
    nextMaintenance: '2024-07-15',
    nextMaintenanceMileage: 30000,
    maintenanceInterval: 10000,
    technicalReviewExpiry: '2024-12-31',
    currentClient: 'Empresa Logística Norte',
    companyId: '1'
  },
  {
    id: '2',
    vin: 'JH4KA3150KC007857',
    plate: 'DEF-456',
    brand: 'Chevrolet',
    model: 'NPR',
    year: 2021,
    color: 'Rojo',
    vehicleType: 'camion',
    purchaseDate: '2021-06-10',
    mileage: 45000,
    status: 'rented',
    lastMaintenance: '2024-02-10',
    lastMaintenanceMileage: 40000,
    nextMaintenance: '2024-08-10',
    nextMaintenanceMileage: 50000,
    maintenanceInterval: 10000,
    technicalReviewExpiry: '2024-06-15',
    currentClient: 'Constructora San Miguel',
    companyId: '1'
  },
  {
    id: '3',
    vin: 'JH4KA3150KC007858',
    plate: 'GHI-789',
    brand: 'Nissan',
    model: 'Frontier',
    year: 2023,
    color: 'Azul',
    vehicleType: 'camioneta',
    purchaseDate: '2023-03-20',
    mileage: 15000,
    status: 'maintenance',
    lastMaintenance: '2024-03-01',
    lastMaintenanceMileage: 10000,
    nextMaintenance: '2024-09-01',
    nextMaintenanceMileage: 20000,
    maintenanceInterval: 10000,
    technicalReviewExpiry: '2024-11-30',
    companyId: '1'
  },
  {
    id: '4',
    vin: 'JH4KA3150KC007859',
    plate: 'JKL-012',
    brand: 'Mercedes-Benz',
    model: 'Actros',
    year: 2020,
    color: 'Blanco',
    vehicleType: 'cama-baja',
    purchaseDate: '2020-08-15',
    mileage: 85000,
    status: 'available',
    lastMaintenance: '2024-01-20',
    lastMaintenanceMileage: 80000,
    nextMaintenance: '2024-06-20',
    nextMaintenanceMileage: 90000,
    maintenanceInterval: 10000,
    technicalReviewExpiry: '2024-04-30',
    currentClient: 'Transportes Pesados Ltda',
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
  },
  {
    id: '3',
    name: 'Revisión Técnica - DEF-456',
    type: 'technical-review',
    expiryDate: '2024-06-15',
    status: 'expiring',
    vehicleId: '2',
    companyId: '1'
  },
  {
    id: '4',
    name: 'Revisión Técnica - JKL-012',
    type: 'technical-review',
    expiryDate: '2024-04-30',
    status: 'expiring',
    vehicleId: '4',
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
  },
  {
    id: '3',
    title: 'Revisión Técnica por Vencer',
    description: 'La revisión técnica del vehículo DEF-456 vence el 15 de junio',
    priority: 'high',
    type: 'technical-review',
    date: '2024-05-15',
    companyId: '1'
  },
  {
    id: '4',
    title: 'Mantenimiento por Kilometraje',
    description: 'El vehículo ABC-123 está próximo a alcanzar los 30,000 km para mantenimiento',
    priority: 'medium',
    type: 'maintenance',
    date: '2024-03-14',
    companyId: '1'
  },
  {
    id: '5',
    title: 'Revisión Técnica Crítica',
    description: 'La revisión técnica del vehículo JKL-012 vence en 15 días',
    priority: 'urgent',
    type: 'technical-review',
    date: '2024-04-15',
    companyId: '1'
  }
];