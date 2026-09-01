export interface Dealer {
  id: number;
  dealer_code: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface Salesperson {
  id: number;
  employee_code: string;
  name: string;
  email: string | null;
  phone: string | null;
  dealer_id: number;
  join_date: string | null;
  status: string;
  dealer?: Dealer;
}

export interface Customer {
  id: number;
  customer_code: string;
  full_name: string;
  nik: string | null;
  phone: string | null;
  email: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  occupation: string | null;
  status: string;
}

export interface VehicleModel {
  id: number;
  brand: string;
  model: string;
  variant: string | null;
  year: number | null;
  engine_cc: number | null;
  description: string | null;
  status: string;
}

export interface Lead {
  id: number;
  lead_code: string;
  name: string;
  phone: string | null;
  email: string | null;
  source: string | null;
  status: string;
  salesperson_id: number | null;
  dealer_id: number | null;
  estimated_budget: number | null;
  notes: string | null;
}

export interface FollowUp {
  id: number;
  lead_id: number | null;
  customer_id: number | null;
  salesperson_id: number;
  follow_up_date: string;
  follow_up_time: string | null;
  channel: string | null;
  purpose: string | null;
  notes: string | null;
  result: string | null;
  status: string;
}

export interface Vehicle {
  id: number;
  vehicle_code: string;
  vehicle_model_id: number;
  vin: string;
  engine_number: string;
  color: string | null;
  year: number | null;
  license_plate: string | null;
  odometer: number;
  dealer_id: number;
  status: string;
  model?: VehicleModel;
  dealer?: Dealer;
}

export interface SalesTransaction {
  id: number;
  transaction_number: string;
  customer_id: number | null;
  salesperson_id: number | null;
  dealer_id: number | null;
  vehicle_id: number | null;
  sale_date: string | null;
  vehicle_price: number;
  discount: number;
  additional_cost: number;
  final_price: number;
  payment_method: string | null;
  payment_status: string;
  status: string;
}

export interface ServiceRecord {
  id: number;
  service_number: string;
  vehicle_id: number;
  customer_id: number | null;
  dealer_id: number | null;
  service_date: string;
  odometer: number | null;
  service_type: string;
  complaint: string | null;
  diagnosis: string | null;
  notes: string | null;
  total_cost: number;
  status: string;
}

export interface Warranty {
  id: number;
  vehicle_id: number;
  customer_id: number | null;
  warranty_number: string;
  start_date: string;
  end_date: string;
  warranty_period: number;
  status: string;
  terms: string | null;
}

export interface WarrantyClaim {
  id: number;
  claim_number: string;
  vehicle_id: number;
  customer_id: number | null;
  warranty_id: number | null;
  service_record_id: number | null;
  claim_date: string;
  problem: string | null;
  diagnosis: string | null;
  resolution: string | null;
  cost: number;
  status: string;
}

export interface LoyaltyAccount {
  id: number;
  customer_id: number;
  tier_id: number | null;
  status: string;
  tier?: { name: string };
}

export interface SalesTarget {
  id: number;
  salesperson_id: number;
  dealer_id: number | null;
  period: string;
  target_units: number;
  target_revenue: number;
  start_date: string | null;
  end_date: string | null;
  status: string;
}

export interface ServiceBooking {
  id: number;
  booking_number: string;
  vehicle_id: number;
  customer_id: number | null;
  dealer_id: number | null;
  booking_date: string;
  booking_time: string | null;
  service_type: string;
  complaint: string | null;
  assigned_advisor_id: number | null;
  status: string;
}

export interface LoyaltyTier {
  id: number;
  name: string;
  minimum_points: number;
  maximum_points: number | null;
  benefits: string | null;
  status: string;
}

export interface Reward {
  id: number;
  code: string;
  name: string;
  description: string | null;
  points_required: number;
  stock: number;
  valid_from: string | null;
  valid_until: string | null;
  status: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  dealer_id: number | null;
  roles: string[];
  permissions: string[];
}