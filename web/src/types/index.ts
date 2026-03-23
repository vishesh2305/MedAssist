export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  nationality?: string;
  preferredLanguage?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalNotes?: string;
  travelStatus: 'TOURIST' | 'LOCAL';
  role: 'TRAVELER' | 'HOSPITAL_ADMIN' | 'SUPER_ADMIN';
  emailVerified: boolean;
  phoneVerified: boolean;
  avatarUrl?: string;
  deviceTokens?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Hospital {
  id: string;
  name: string;
  slug: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  website?: string;
  coverImage?: string;
  images: string[];
  isVerified: boolean;
  isEmergencyCapable: boolean;
  availabilityStatus: 'OPEN' | 'CLOSED' | 'LIMITED';
  rating: number;
  reviewCount: number;
  adminUserId?: string;
  createdAt: string;
  updatedAt: string;
  languages: string[];
  specialties: string[];
  doctors?: Doctor[];
  pricing?: Pricing[];
  reviews?: Review[];
  distance?: number;
  // Google Places enrichment fields
  directionsUrl?: string;
  googleMapsUrl?: string;
  googleRating?: number;
  googleReviewCount?: number;
  googleReviews?: GoogleReview[];
  photos?: string[];
  openingHours?: string[];
  isOpenNow?: boolean | null;
}

export interface GoogleReview {
  authorName: string;
  rating: number;
  text: string;
  time: number;
  profilePhotoUrl?: string;
  relativeTime: string;
}

export interface Doctor {
  id: string;
  hospitalId: string;
  name: string;
  specialty: string;
  qualifications?: string;
  languages: string[];
  avatarUrl?: string;
  isAvailable: boolean;
  consultationFee: number | null;
  experience: number;
  createdAt: string;
}

export interface Pricing {
  id: string;
  hospitalId: string;
  serviceName: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  currency: string;
  description?: string;
}

export interface Review {
  id: string;
  hospitalId: string;
  userId: string;
  rating: number;
  title: string | null;
  content: string;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}

export interface Favorite {
  id: string;
  userId: string;
  hospitalId: string;
  createdAt: string;
  hospital?: Hospital;
}

export interface EmergencyLog {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  status: 'TRIGGERED' | 'RESPONDED' | 'RESOLVED' | 'CANCELLED';
  nearestHospitalId?: string;
  ambulanceCalled: boolean;
  notes?: string;
  createdAt: string;
  resolvedAt?: string;
  nearestHospital?: Hospital;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatarUrl?: string;
  };
}

export interface ChatRoom {
  id: string;
  name?: string;
  type: 'SUPPORT' | 'EMERGENCY' | 'CONSULTATION';
  userId: string;
  hospitalId?: string;
  isActive: boolean;
  createdAt: string;
  messages?: ChatMessage[];
  hospital?: Hospital;
}

export interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  senderRole: 'USER' | 'HOSPITAL' | 'ADMIN' | 'SYSTEM';
  content: string;
  translatedContent?: string;
  messageType: 'TEXT' | 'IMAGE' | 'LOCATION' | 'SYSTEM';
  isRead: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'EMERGENCY' | 'CHAT' | 'REVIEW' | 'SYSTEM' | 'PROMOTION' | 'APPOINTMENT';
  data?: any;
  isRead: boolean;
  createdAt: string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  deviceInfo?: string;
  ipAddress?: string;
  expiresAt: string;
  createdAt: string;
}

export interface Specialty {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

export interface RecentlyViewed {
  id: string;
  userId: string;
  hospitalId: string;
  viewedAt: string;
  hospital?: Hospital;
}

export interface HospitalFilters {
  search?: string;
  specialty?: string;
  language?: string;
  minRating?: number;
  maxDistance?: number;
  emergencyOnly?: boolean;
  city?: string;
  sortBy?: 'distance' | 'rating' | 'name';
  page?: number;
  limit?: number;
  lat?: number;
  lng?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface DashboardStats {
  totalUsers: number;
  totalHospitals: number;
  totalReviews: number;
  totalEmergencies: number;
  activeEmergencies: number;
  registrationsOverTime?: { date: string; count: number }[];
  emergenciesByStatus?: { status: string; count: number }[];
  recentActivity?: { id: string; type: string; description: string; createdAt: string }[];
}

// Medical Passport
export interface MedicalPassport {
  id: string;
  userId: string;
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | '';
  allergies: string[];
  medications: string[];
  conditions: string[];
  vaccinations: VaccinationRecord[];
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insurancePhone?: string;
  insuranceExpiry?: string;
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VaccinationRecord {
  name: string;
  date: string;
}

// Medical Documents
export interface MedicalDocument {
  id: string;
  userId: string;
  title: string;
  type: 'PRESCRIPTION' | 'LAB_REPORT' | 'XRAY' | 'DISCHARGE_SUMMARY' | 'INSURANCE_CARD' | 'VACCINATION_RECORD' | 'OTHER';
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  shareToken?: string;
  shareExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Consultations / Telemedicine
export interface Consultation {
  id: string;
  userId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatarUrl?: string;
  type: 'VIDEO' | 'AUDIO' | 'CHAT';
  status: 'SCHEDULED' | 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  scheduledAt: string;
  duration?: number;
  description?: string;
  diagnosis?: string;
  prescription?: string;
  price: number;
  currency: string;
  rating?: number;
  meetingLink?: string;
  createdAt: string;
  updatedAt: string;
}

// Payments
export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  type: 'CONSULTATION' | 'PACKAGE' | 'DOCUMENT' | 'OTHER';
  description: string;
  referenceId?: string;
  paymentIntentId?: string;
  createdAt: string;
}

// Trip Plans
export interface TripPlan {
  id: string;
  userId: string;
  destinationCountry: string;
  destinationCode: string;
  startDate: string;
  endDate: string;
  vaccinations: TripVaccination[];
  emergencyNumbers: EmergencyNumber[];
  healthAlerts: string[];
  packingList: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TripVaccination {
  name: string;
  status: 'REQUIRED' | 'RECOMMENDED' | 'OPTIONAL';
  description?: string;
}

export interface EmergencyNumber {
  service: string;
  number: string;
}

// Pharmacy
export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  distance?: number;
  isOpen?: boolean;
  openingHours?: string;
}

export interface MedicineEquivalent {
  originalName: string;
  equivalentName: string;
  country: string;
  requiresPrescription: boolean;
  activeIngredient?: string;
  notes?: string;
}

// Embassy
export interface Embassy {
  id: string;
  nationality: string;
  country: string;
  name: string;
  address: string;
  phone: string;
  emergencyPhone?: string;
  email?: string;
  website?: string;
  hours?: string;
  latitude?: number;
  longitude?: number;
}

// Wait Times
export interface WaitTimeEstimate {
  id: string;
  hospitalId: string;
  department: string;
  estimatedMinutes: number;
  reportedAt: string;
  reportedBy?: string;
  dayOfWeek?: number;
}

// Medical Tourism Packages
export interface MedicalPackage {
  id: string;
  title: string;
  category: 'DENTAL' | 'COSMETIC' | 'EYE' | 'CARDIAC' | 'ORTHOPEDIC' | 'GENERAL';
  hospitalName: string;
  city: string;
  country: string;
  description: string;
  imageUrl?: string;
  price: number;
  currency: string;
  duration: string;
  includes: string[];
  rating: number;
  reviewCount: number;
  highlights?: string[];
  itinerary?: string[];
  createdAt: string;
}

// Corporate Programs
export interface CorporateProgram {
  id: string;
  companyName: string;
  plan: 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE';
  employeeCount: number;
  activeTravelers: number;
  status: 'ACTIVE' | 'INACTIVE' | 'TRIAL';
  contactEmail: string;
  contactPhone?: string;
  startDate: string;
  endDate?: string;
  createdAt: string;
  employees?: CorporateEmployee[];
}

export interface CorporateEmployee {
  id: string;
  programId: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  travelStatus: 'TRAVELING' | 'HOME';
  currentCountry?: string;
  createdAt: string;
}
