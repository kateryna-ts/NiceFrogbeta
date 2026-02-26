
import { Listing, ListingType, DatingProfile, TeamMember, TokenStat } from './types';

export const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Vintage Mid-Century Lamp',
    price: '$120',
    description: 'Beautiful condition, original wiring. Seller is at the cafe.',
    distance: '15m away',
    image: 'https://picsum.photos/400/300?random=1',
    type: ListingType.FOR_SALE,
    bleActive: true,
    bleDeviceId: 'NF-BEACON-A1',
    user: 'Chloe B.'
  },
  {
    id: '2',
    title: '2019 Mercedes C-Class',
    price: '$28,500',
    description: 'Low mileage, pristine condition. Parked on 4th St.',
    distance: '100m away',
    image: 'https://picsum.photos/400/300?random=2',
    type: ListingType.VEHICLES,
    bleActive: true,
    bleDeviceId: 'NF-BEACON-CAR2',
    details: { mileage: '24k miles' }
  },
  {
    id: '3',
    title: 'Sunny 2BR Loft in Arts District',
    price: '$3,200/mo',
    description: 'Available immediately. Open house right now!',
    distance: '50m away',
    image: 'https://picsum.photos/400/300?random=3',
    type: ListingType.FOR_RENT,
    bleActive: true,
    details: { beds: 2, baths: 1.5 },
    user: 'Julian Hayes'
  },
  {
    id: '4',
    title: 'Barista / Shift Lead',
    price: '$22/hr',
    description: 'Elena\'s Coffee Roastery. Looking for experienced staff.',
    distance: '30m away',
    image: 'https://picsum.photos/400/300?random=4',
    type: ListingType.SERVICES,
    bleActive: true,
    details: { company: 'Elena\'s Roastery', role: 'Full-time' }
  },
  {
    id: '5',
    title: 'Fender Stratocaster',
    price: '$850',
    description: 'Mint condition. Selling to upgrade.',
    distance: '85m away',
    image: 'https://picsum.photos/400/300?random=5',
    type: ListingType.FOR_SALE,
    bleActive: false,
    user: 'David C.'
  },
  {
    id: '6',
    title: 'Downtown Condo Sale',
    price: '$450,000',
    description: 'Luxury 1BR condo with city views. Motivated seller.',
    distance: '200m away',
    image: 'https://picsum.photos/400/300?random=6',
    type: ListingType.REAL_ESTATE,
    bleActive: true,
    bleDeviceId: 'NF-BEACON-HOME6',
    details: { beds: 1, baths: 1 },
    user: 'Metro Realty'
  }
];

export const DATING_PROFILES: DatingProfile[] = [
  {
    id: 'd1',
    name: 'Sarah',
    age: 28,
    gender: 'F',
    interests: ['Tech', 'Coffee', 'Hiking'],
    distance: 'Same Room',
    bio: 'Looking for someone to discuss startups with.',
    avatarColor: 'bg-gradient-to-br from-pink-500 to-rose-500',
    image: 'https://picsum.photos/400/400?random=50'
  },
  {
    id: 'd2',
    name: 'Mike',
    age: 32,
    gender: 'M',
    interests: ['Real Estate', 'DJing', 'Travel'],
    distance: '10m away',
    bio: 'Here for the networking event.',
    avatarColor: 'bg-gradient-to-br from-blue-500 to-indigo-500',
    image: 'https://picsum.photos/400/400?random=51'
  },
  {
    id: 'd3',
    name: 'Jess',
    age: 25,
    gender: 'F',
    interests: ['Art', 'Design', 'Yoga'],
    distance: '40m away',
    bio: 'Just moved to the neighborhood.',
    avatarColor: 'bg-gradient-to-br from-purple-500 to-violet-500',
    image: 'https://picsum.photos/400/400?random=52'
  }
];

export const TEAM: TeamMember[] = [
  {
    name: 'James Burchetta',
    role: 'CEO & Co-Founder',
    bio: 'Villanova University & Fordham Law School. Co-founder of CyberSettle.com (inventor of online dispute resolution). 40+ years in law & tech.',
    image: 'https://picsum.photos/200/200?random=10'
  },
  {
    name: 'Sumeet Sinha',
    role: 'Head of Strategy',
    bio: 'Columbia Law School. Former General Counsel at CrowdSurge (merged with Songkick). Expert in scaling early-stage tech companies & financing.',
    image: 'https://picsum.photos/200/200?random=11'
  }
];

export const TOKEN_DISTRIBUTION: TokenStat[] = [
  { name: 'Public Sale', value: 40, color: '#00e676' },
  { name: 'Team', value: 20, color: '#2979ff' },
  { name: 'Development', value: 20, color: '#aa00ff' },
  { name: 'Marketing', value: 10, color: '#ffea00' },
  { name: 'Reserve', value: 10, color: '#ff3d00' },
];

export const STICKER_PRODUCTS = [
  {
    id: 'starter',
    name: 'Starter Pack',
    count: 3,
    price: 19.99,
    desc: 'Perfect for individual sellers',
    features: ['3 High-Range Beacons', 'Pre-configured QR', '1 Year Battery'],
    badge: ''
  },
  {
    id: 'business',
    name: 'Business Pack',
    count: 10,
    price: 49.99,
    desc: 'For agents, restaurants & small businesses',
    features: ['10 High-Range Beacons', 'Analytics Dashboard', 'Priority Support'],
    badge: 'MOST POPULAR'
  },
  {
    id: 'enterprise',
    name: 'Enterprise Pack',
    count: 50,
    price: 179.99,
    desc: 'For large deployments',
    features: ['50 Beacons', 'API Access', 'Custom Branding'],
    badge: 'BEST VALUE'
  }
];
