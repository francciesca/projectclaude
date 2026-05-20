export interface Company {
  id: string;
  name: string;
  created_at?: string;
}

export interface Profile {
  id: string;
  name: string;
  role: 'admin' | 'user';
  company_id: string;
  created_at?: string;
}

export interface Vehicle {
  id: string;
  vin: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  vehicle_type: 'camion' | 'camioneta' | 'cama-baja' | 'auto' | 'furgon' | 'bus' | 'maquinaria' | 'otro';
  purchase_date: string;
  mileage: number;
  status: 'available' | 'rented' | 'maintenance';
  last_maintenance?: string;
  last_maintenance_mileage?: number;
  next_maintenance?: string;
  next_maintenance_mileage?: number;
  maintenance_interval: number;
  technical_review_expiry?: string;
  current_client?: string;
  company_id: string;
  created_at?: string;
}

export interface Driver {
  id: string;
  rut: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  license_number: string;
  license_expiry: string;
  rating: number;
  monthly_hours: number;
  assigned_vehicle?: string;
  company_id: string;
  created_at?: string;
}

export interface MaintenanceTask {
  id: string;
  name: string;
  completed: boolean;
}

export interface Maintenance {
  id: string;
  vehicle_id: string;
  type: 'preventive' | 'corrective';
  priority: 'low' | 'medium' | 'high';
  scheduled_date: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  progress: number;
  tasks: MaintenanceTask[];
  cost?: number;
  workshop?: string;
  notes?: string;
  company_id: string;
  created_at?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'insurance' | 'registration' | 'permit' | 'technical-review' | 'other';
  expiry_date: string;
  status: 'valid' | 'expiring' | 'expired';
  vehicle_id?: string;
  driver_id?: string;
  company_id: string;
  created_at?: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'maintenance' | 'document' | 'license' | 'insurance' | 'technical-review';
  date: string;
  company_id: string;
  created_at?: string;
}

export interface Service {
  id: string;
  client_id: string;
  vehicle_id: string;
  service_date: string;
  service_type: string;
  chofer_nombre: string;
  chofer_telefono: string;
  origen: string;
  destino: string;
  trabajo_realizado: string;
  valor_cobrado: number;
  payment_status: 'pending' | 'partial' | 'paid';
  payment_date: string;
  observaciones: string;
  company_id: string;
  created_at?: string;
}
