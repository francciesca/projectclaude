export interface User {
  username: string;
  role: 'admin' | 'user';
  name: string;
}

export interface Company {
  id: string;
  name: string;
}

export interface Vehicle {
  id: string;
  vin: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  vehicleType: 'camion' | 'camioneta' | 'cama-baja' | 'auto' | 'furgon' | 'bus' | 'maquinaria' | 'otro';
  purchaseDate: string;
  mileage: number;
  status: 'available' | 'rented' | 'maintenance';
  lastMaintenance?: string;
  lastMaintenanceMileage?: number;
  nextMaintenance?: string;
  nextMaintenanceMileage?: number;
  maintenanceInterval: number; // Kilometros entre mantenimientos
  technicalReviewExpiry?: string; // Fecha de vencimiento de revisión técnica
  currentClient?: string; // Cliente o empresa actual
  companyId: string;
}

export interface Driver {
  id: string;
  rut: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  licenseNumber: string;
  licenseExpiry: string;
  rating: number;
  monthlyHours: number;
  assignedVehicle?: string;
  companyId: string;
}

export interface MaintenanceTask {
  id: string;
  name: string;
  completed: boolean;
}

export interface Maintenance {
  id: string;
  vehicleId: string;
  type: 'preventive' | 'corrective';
  priority: 'low' | 'medium' | 'high';
  scheduledDate: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  progress: number;
  tasks: MaintenanceTask[];
  cost?: number;
  workshop?: string;
  notes?: string;
  companyId: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'insurance' | 'registration' | 'permit' | 'technical-review' | 'other';
  expiryDate: string;
  status: 'valid' | 'expiring' | 'expired';
  vehicleId?: string;
  driverId?: string;
  companyId: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'maintenance' | 'document' | 'license' | 'insurance' | 'technical-review';
  date: string;
  companyId: string;
}