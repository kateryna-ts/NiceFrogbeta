
export enum ListingType {
  FOR_SALE = 'FOR_SALE',
  FOR_RENT = 'FOR_RENT',
  SERVICES = 'SERVICES',
  VEHICLES = 'VEHICLES',
  REAL_ESTATE = 'REAL_ESTATE',
}

export interface Listing {
  id: string;
  title: string;
  price?: string;
  description: string;
  distance: string; // e.g., "50m away"
  image: string;
  type: ListingType;
  bleActive: boolean;
  bleDeviceId?: string; // The ID broadcasted by the beacon
  user?: string;
  latitude?: number;
  longitude?: number;
  details?: {
    beds?: number;
    baths?: number;
    company?: string;
    role?: string;
    mileage?: string;
  };
}

export interface BLEDevice {
  id: string;
  name: string;
  rssi: number; // Signal strength (simulated for web, as web bluetooth doesn't expose RSSI in simple request)
  proximity: 'Immediate' | 'Near' | 'Far';
  timestamp: number;
}

export interface DatingProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  interests: string[];
  distance: string;
  bio: string;
  avatarColor: string; // For anonymity
  image: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface TokenStat {
  name: string;
  value: number;
  color: string;
}

// --- USER & AUTH TYPES ---

export interface UserPreferences {
  intents: string[]; // 'BUY_SELL', 'REAL_ESTATE', 'JOBS', 'DATING', 'BROWSING'
  
  // Marketplace
  marketplaceCategories: string[];
  priceRange: [number, number];
  maxDistance: number; // Changed to number for slider

  // Dating
  datingLookingFor: string; // 'MEN', 'WOMEN', 'EVERYONE'
  datingAgeRange: [number, number];
  datingDistance: number; // Changed to number for slider
  relationshipType: string[];
  datingInterests: string[];
  
  // Jobs
  jobIndustries: string[];
  jobType: string[];
  salaryRange: [number, number];
  remotePreference: string;

  // Privacy & Config
  privacy: 'EVERYONE' | 'CONNECTIONS' | 'NOBODY';
  showLocation: boolean;
  allowDiscovery: boolean;
  showOnlineStatus: boolean;
  ephemeralMode: boolean;
  bleVisibility: boolean;
  fontSize: 'NORMAL' | 'LARGE';
  
  notifications: {
    messages: boolean;
    listings: boolean;
    matches: boolean;
    priceDrops: boolean;
  };
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  website?: string;
  dob: string;
  avatar?: string;
  coverPhoto?: string;
  username: string;
  bio: string;
  gender: string;
  location: string;
  joinedDate: string;
  onboardingComplete: boolean;
  preferences: UserPreferences;
  stats: {
    listings: number;
    connections: number;
    reviews: number;
  };
}
