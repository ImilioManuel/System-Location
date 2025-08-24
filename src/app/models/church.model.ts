export interface Church {
  id?: string;
  name: string;
  denomination: string;
  address: string;
  city: string;
  state: string;
  neighborhood?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  photo?: string;
  logoUrl?: string;
  responsible: string;
  phone: string;
  email: string;
  whatsapp: string;
  schedules?: WorshipSchedule[];
  approved?: boolean;
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorshipSchedule {
  day: string; // e.g., 'domingo', 'segunda', ...
  times: string[]; // e.g., ['09:00', '18:00']
}

export interface ChurchFormData {
  name: string;
  denomination: string;
  address: string;
  city: string;
  state: string;
  neighborhood?: string;
  latitude: number | null;
  longitude: number | null;
  photo?: File;
  schedulesText?: string; // Ex: "Domingo 09:00, 18:00; Quarta 19:30"
  responsible: string;
  phone: string;
  email: string;
  whatsapp: string;
}
