export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  nationality?: string;
  preferredLanguage: string;
  emergencyContact?: EmergencyContact;
  medicalNotes?: string;
  travelStatus?: TravelStatus;
  role: 'tourist' | 'admin' | 'hospital_admin';
  isVerified: boolean;
  createdAt: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface TravelStatus {
  country: string;
  city: string;
  arrivalDate: string;
  departureDate?: string;
  insuranceProvider?: string;
  policyNumber?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  nationality?: string;
  preferredLanguage?: string;
  emergencyContact?: EmergencyContact;
}

export interface Hospital {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email?: string;
  website?: string;
  coverImage?: string;
  images: string[];
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  languages: string[];
  specialties: string[];
  isVerified: boolean;
  hasEmergency: boolean;
  is24Hours: boolean;
  operatingHours: OperatingHours;
  distance?: number;
  doctors: Doctor[];
  pricing: PricingCategory[];
  reviews: Review[];
  isFavorite?: boolean;
}

export interface OperatingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  isClosed: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  avatar?: string;
  specialty: string;
  qualifications: string[];
  languages: string[];
  consultationFee: number;
  currency: string;
  isAvailable: boolean;
  experience: number;
}

export interface PricingCategory {
  category: string;
  items: PricingItem[];
}

export interface PricingItem {
  name: string;
  priceMin: number;
  priceMax: number;
  currency: string;
  notes?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  content: string;
  visitDate?: string;
  createdAt: string;
  helpful: number;
}

export interface ChatRoom {
  id: string;
  hospitalId?: string;
  hospitalName?: string;
  hospitalAvatar?: string;
  participants: ChatParticipant[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  type: 'support' | 'hospital' | 'emergency';
  createdAt: string;
  updatedAt: string;
}

export interface ChatParticipant {
  userId: string;
  name: string;
  avatar?: string;
  role: 'user' | 'support' | 'hospital_staff';
  isOnline: boolean;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'image' | 'location' | 'system';
  isRead: boolean;
  createdAt: string;
}

export interface EmergencyRequest {
  id: string;
  userId: string;
  status: EmergencyStatus;
  location: GeoLocation;
  nearestHospital?: Hospital;
  assignedAmbulance?: string;
  eta?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type EmergencyStatus =
  | 'pending'
  | 'acknowledged'
  | 'dispatched'
  | 'en_route'
  | 'arrived'
  | 'completed'
  | 'cancelled';

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface HospitalFilters {
  query?: string;
  specialty?: string;
  language?: string;
  hasEmergency?: boolean;
  is24Hours?: boolean;
  minRating?: number;
  maxDistance?: number;
  sortBy?: 'distance' | 'rating' | 'name';
}

export interface Specialty {
  id: string;
  name: string;
  icon: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'emergency' | 'chat' | 'booking' | 'general';
  data?: Record<string, string>;
  isRead: boolean;
  createdAt: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export type Language = 'en' | 'es' | 'hi';

export interface AppSettings {
  theme: ThemeMode;
  language: Language;
  notificationsEnabled: boolean;
  locationEnabled: boolean;
  hapticEnabled: boolean;
}

// Navigation types
export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  VerifyOTP: { email: string; type: 'signup' | 'reset' };
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Hospitals: undefined;
  Emergency: undefined;
  Chat: undefined;
  Profile: undefined;
};

export type HospitalStackParamList = {
  HospitalList: undefined;
  HospitalDetail: { hospitalId: string };
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Settings: undefined;
  Favorites: undefined;
  EditProfile: undefined;
  LanguageSelect: undefined;
  ChatRoom: { roomId: string; title: string };
};

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
