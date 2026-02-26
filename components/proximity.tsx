import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, MapPin, User, ShoppingBag, Settings, ChevronRight, Clock, AlertCircle, MessageCircle, Smartphone } from 'lucide-react';
import { Modal, Button, Badge, Switch, Slider } from './ui';
import { PhoneConfig, sendSMS } from './sms';

// --- A. TYPES ---

export type AlertType = 'dating' | 'marketplace';

export interface DatingAlert {
  type: 'dating';
  enabled: boolean;
  ageMin: number;
  ageMax: number;
  interests: string[];
  radiusMeters: number;
  notifyVia: ('inApp' | 'browser')[]; 
}

export interface MarketplaceAlert {
  type: 'marketplace';
  enabled: boolean;
  keywords: string;
  categories: string[];
  maxPrice: number;
  radiusMeters: number;
  notifyVia: ('inApp' | 'browser')[];
}

export type AlertPreference = DatingAlert | MarketplaceAlert;

export interface ProximityNotification {
  id: string;
  timestamp: number;
  alertType: AlertType;
  matchName: string;
  matchDetail: string;
  matchGradient: string;
  matchInitial: string;
  distance: string;
  read: boolean;
}

interface MockItem {
  id: string;
  type: AlertType;
  name: string;
  age?: number;
  interests?: string[];
  category?: string;
  price?: number;
  distance: string;
  gradient: string;
  initial: string;
  detail: string;
}

// --- B. MOCK DATA ---

const MOCK_NEARBY: MockItem[] = [
  { id: 'm1', type: 'dating', name: 'Sarah', age: 27, interests: ['Yoga', 'Coffee', 'Travel'], distance: '12m away', gradient: 'bg-pink-500', initial: 'S', detail: 'Age 27 • Yoga, Coffee' },
  { id: 'm2', type: 'marketplace', name: 'MacBook Pro M1', category: 'Electronics', price: 850, distance: '45m away', gradient: 'bg-blue-500', initial: 'M', detail: 'Electronics • $850' },
  { id: 'm3', type: 'dating', name: 'James', age: 32, interests: ['Tech', 'Startups', 'Fitness'], distance: '8m away', gradient: 'bg-green-500', initial: 'J', detail: 'Age 32 • Tech, Startups' },
  { id: 'm4', type: 'marketplace', name: 'Vintage Lamp', category: 'Furniture', price: 45, distance: '120m away', gradient: 'bg-yellow-500', initial: 'V', detail: 'Furniture • $45' },
  { id: 'm5', type: 'dating', name: 'Elena', age: 24, interests: ['Art', 'Music', 'Design'], distance: '30m away', gradient: 'bg-purple-500', initial: 'E', detail: 'Age 24 • Art, Music' },
  { id: 'm6', type: 'marketplace', name: 'Fixie Bike', category: 'Vehicles', price: 200, distance: '15m away', gradient: 'bg-red-500', initial: 'F', detail: 'Vehicles • $200' },
  { id: 'm7', type: 'dating', name: 'Marcus', age: 29, interests: ['Food', 'Travel', 'Startups'], distance: '55m away', gradient: 'bg-indigo-500', initial: 'M', detail: 'Age 29 • Food, Travel' },
  { id: 'm8', type: 'marketplace', name: 'Textbooks', category: 'Books', price: 20, distance: '5m away', gradient: 'bg-orange-500', initial: 'T', detail: 'Books • $20' },
];

// --- C. HOOK ---

export function useProximityEngine(alerts: AlertPreference[], phoneConfig?: PhoneConfig) {
  const [notifications, setNotifications] = useState<ProximityNotification[]>([]);
  const [activeToast, setActiveToast] = useState<ProximityNotification | null>(null);

  useEffect(() => {
    if (alerts.length === 0) return;

    const checkMatch = () => {
      // Pick a random item
      const randomItem = MOCK_NEARBY[Math.floor(Math.random() * MOCK_NEARBY.length)];
      
      // Check against alerts
      let matchFound = false;

      for (const alert of alerts) {
        if (!alert.enabled) continue;

        if (alert.type === 'dating' && randomItem.type === 'dating') {
          const ageMatch = (randomItem.age || 0) >= alert.ageMin && (randomItem.age || 0) <= alert.ageMax;
          const interestMatch = alert.interests.some(i => (randomItem.interests || []).includes(i));
          if (ageMatch && interestMatch) {
            matchFound = true;
          }
        } else if (alert.type === 'marketplace' && randomItem.type === 'marketplace') {
          const catMatch = alert.categories.includes(randomItem.category || '');
          const keywordMatch = alert.keywords.split(',').some(k => k.trim() && randomItem.name.toLowerCase().includes(k.trim().toLowerCase()));
          const priceMatch = (randomItem.price || 0) <= alert.maxPrice;
          
          if ((catMatch || keywordMatch) && priceMatch) {
            matchFound = true;
          }
        }

        if (matchFound) {
          const newNotif: ProximityNotification = {
            id: `notif_${Date.now()}`,
            timestamp: Date.now(),
            alertType: alert.type,
            matchName: randomItem.name,
            matchDetail: randomItem.detail,
            matchGradient: randomItem.gradient,
            matchInitial: randomItem.initial,
            distance: randomItem.distance,
            read: false
          };

          setNotifications(prev => [newNotif, ...prev]);
          setActiveToast(newNotif);

          if (alert.notifyVia.includes('browser') && 'Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification('NiceFrog Alert', { 
                body: `${randomItem.name} is nearby! ${randomItem.detail}`,
                icon: '/frog.png' // Assuming this exists or browser will ignore
              });
            } catch (e) {
              console.error("Notification error", e);
            }
          }

          if (phoneConfig?.verified && phoneConfig?.notifyOnAlert) {
            const smsBody = alert.type === 'dating'
              ? `🐸 NiceFrog: ${randomItem.name} (${randomItem.detail}) is ${randomItem.distance}. Open the app to connect!`
              : `🐸 NiceFrog: ${randomItem.name} - ${randomItem.detail} is ${randomItem.distance}. Open the app to see it!`;
            sendSMS(phoneConfig.twilioWebhookUrl, phoneConfig.phoneNumber, smsBody);
          }

          break; // Don't trigger multiple alerts for same item in one tick
        }
      }
    };

    const interval = setInterval(checkMatch, 12000);
    return () => clearInterval(interval);
  }, [alerts, phoneConfig]);

  const dismissToast = () => setActiveToast(null);
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, activeToast, dismissToast, markAllRead, unreadCount };
}

// --- D. PREFERENCES MODAL ---

interface AlertPreferencesModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (prefs: AlertPreference[]) => void;
  currentPrefs: AlertPreference[];
  phoneConfig: PhoneConfig | null;
  onConnectPhone: () => void;
}

export const AlertPreferencesModal: React.FC<AlertPreferencesModalProps> = ({ open, onClose, onSave, currentPrefs, phoneConfig, onConnectPhone }) => {
  const [activeTab, setActiveTab] = useState<AlertType>('dating');
  
  // Initialize state from props or defaults
  const [datingAlert, setDatingAlert] = useState<DatingAlert>({
    type: 'dating', enabled: false, ageMin: 18, ageMax: 35, interests: [], radiusMeters: 100, notifyVia: ['inApp']
  });
  const [marketAlert, setMarketAlert] = useState<MarketplaceAlert>({
    type: 'marketplace', enabled: false, keywords: '', categories: [], maxPrice: 100, radiusMeters: 100, notifyVia: ['inApp']
  });

  useEffect(() => {
    if (open) {
      const existingDating = currentPrefs.find(p => p.type === 'dating') as DatingAlert;
      const existingMarket = currentPrefs.find(p => p.type === 'marketplace') as MarketplaceAlert;
      if (existingDating) setDatingAlert(existingDating);
      if (existingMarket) setMarketAlert(existingMarket);
    }
  }, [open, currentPrefs]);

  const handleSave = () => {
    const newPrefs: AlertPreference[] = [];
    if (datingAlert.enabled) newPrefs.push(datingAlert);
    if (marketAlert.enabled) newPrefs.push(marketAlert);
    // If disabled but configured, we might still want to save them? 
    // The prompt says "Toggle to enable/disable". Usually this means we save the config but enabled=false.
    // But the prompt says "Only show this banner if alertPrefs.length === 0".
    // So if I save a disabled alert, length is > 0.
    // I will save both objects regardless of enabled state, so user preferences persist.
    // Wait, if I save them, the banner disappears. That's probably desired behavior (user has "set up" alerts).
    onSave([datingAlert, marketAlert]);
  };

  const requestPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  const INTERESTS_LIST = ['Yoga', 'Coffee', 'Startups', 'Tech', 'Design', 'Travel', 'Fitness', 'Art', 'Music', 'Food'];
  const CATEGORIES_LIST = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Sports', 'Vehicles', 'Food', 'Other'];
  const RADIUS_OPTIONS = [50, 100, 250, 500];

  return (
    <Modal isOpen={open} onClose={onClose} title="Proximity Alerts">
      <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
        {(['dating', 'marketplace'] as AlertType[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
              activeTab === tab ? 'bg-white text-frog-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab} Alerts
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === 'dating' ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
              <span className="font-bold text-gray-700">Enable Dating Alerts</span>
              <Switch checked={datingAlert.enabled} onChange={(c) => setDatingAlert({...datingAlert, enabled: c})} />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Age Range</label>
              <div className="flex items-center gap-4">
                <input 
                  type="number" 
                  value={datingAlert.ageMin} 
                  onChange={e => setDatingAlert({...datingAlert, ageMin: Number(e.target.value)})}
                  className="w-20 h-10 text-center bg-gray-50 border border-gray-200 rounded-full focus:border-frog-green outline-none" 
                />
                <span className="text-gray-400">-</span>
                <input 
                  type="number" 
                  value={datingAlert.ageMax} 
                  onChange={e => setDatingAlert({...datingAlert, ageMax: Number(e.target.value)})}
                  className="w-20 h-10 text-center bg-gray-50 border border-gray-200 rounded-full focus:border-frog-green outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Interests</label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS_LIST.map(int => (
                  <button
                    key={int}
                    onClick={() => {
                      const newInts = datingAlert.interests.includes(int) 
                        ? datingAlert.interests.filter(i => i !== int)
                        : [...datingAlert.interests, int];
                      setDatingAlert({...datingAlert, interests: newInts});
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                      datingAlert.interests.includes(int)
                        ? 'bg-frog-green text-white border-frog-green'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {int}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Detection Radius</label>
              <div className="flex gap-2">
                {RADIUS_OPTIONS.map(r => (
                  <button
                    key={r}
                    onClick={() => setDatingAlert({...datingAlert, radiusMeters: r})}
                    className={`flex-1 py-2 rounded-full text-xs font-bold border transition-colors ${
                      datingAlert.radiusMeters === r
                        ? 'bg-frog-dark text-white border-frog-dark'
                        : 'bg-white text-gray-600 border-gray-200'
                    }`}
                  >
                    {r}m
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Notify Via</label>
              <div className="flex gap-2">
                {['inApp', 'browser'].map((via) => (
                  <button
                    key={via}
                    onClick={() => {
                      const v = via as 'inApp' | 'browser';
                      const newVia = datingAlert.notifyVia.includes(v)
                        ? datingAlert.notifyVia.filter(x => x !== v)
                        : [...datingAlert.notifyVia, v];
                      setDatingAlert({...datingAlert, notifyVia: newVia});
                    }}
                    className={`flex-1 py-2 rounded-full text-xs font-bold border transition-colors ${
                      datingAlert.notifyVia.includes(via as any)
                        ? 'bg-frog-green text-white border-frog-green'
                        : 'bg-white text-gray-600 border-gray-200'
                    }`}
                  >
                    {via === 'inApp' ? 'In-App' : 'Browser Push'}
                  </button>
                ))}
              </div>
              {datingAlert.notifyVia.includes('browser') && 'Notification' in window && Notification.permission !== 'granted' && (
                <button onClick={requestPermission} className="mt-2 text-xs text-frog-green font-bold underline">
                  Request Browser Permission
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
             <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
              <span className="font-bold text-gray-700">Enable Marketplace Alerts</span>
              <Switch checked={marketAlert.enabled} onChange={(c) => setMarketAlert({...marketAlert, enabled: c})} />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Keywords</label>
              <input 
                type="text" 
                value={marketAlert.keywords}
                onChange={e => setMarketAlert({...marketAlert, keywords: e.target.value})}
                placeholder="MacBook, couch, guitar..."
                className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-frog-green outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Categories</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES_LIST.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      const newCats = marketAlert.categories.includes(cat) 
                        ? marketAlert.categories.filter(c => c !== cat)
                        : [...marketAlert.categories, cat];
                      setMarketAlert({...marketAlert, categories: newCats});
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                      marketAlert.categories.includes(cat)
                        ? 'bg-frog-green text-white border-frog-green'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Max Price</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input 
                  type="number" 
                  value={marketAlert.maxPrice}
                  onChange={e => setMarketAlert({...marketAlert, maxPrice: Number(e.target.value)})}
                  className="w-full h-12 pl-8 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-frog-green outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Detection Radius</label>
              <div className="flex gap-2">
                {RADIUS_OPTIONS.map(r => (
                  <button
                    key={r}
                    onClick={() => setMarketAlert({...marketAlert, radiusMeters: r})}
                    className={`flex-1 py-2 rounded-full text-xs font-bold border transition-colors ${
                      marketAlert.radiusMeters === r
                        ? 'bg-frog-dark text-white border-frog-dark'
                        : 'bg-white text-gray-600 border-gray-200'
                    }`}
                  >
                    {r}m
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Notify Via</label>
              <div className="flex gap-2">
                {['inApp', 'browser'].map((via) => (
                  <button
                    key={via}
                    onClick={() => {
                      const v = via as 'inApp' | 'browser';
                      const newVia = marketAlert.notifyVia.includes(v)
                        ? marketAlert.notifyVia.filter(x => x !== v)
                        : [...marketAlert.notifyVia, v];
                      setMarketAlert({...marketAlert, notifyVia: newVia});
                    }}
                    className={`flex-1 py-2 rounded-full text-xs font-bold border transition-colors ${
                      marketAlert.notifyVia.includes(via as any)
                        ? 'bg-frog-green text-white border-frog-green'
                        : 'bg-white text-gray-600 border-gray-200'
                    }`}
                  >
                    {via === 'inApp' ? 'In-App' : 'Browser Push'}
                  </button>
                ))}
              </div>
              {marketAlert.notifyVia.includes('browser') && 'Notification' in window && Notification.permission !== 'granted' && (
                <button onClick={requestPermission} className="mt-2 text-xs text-frog-green font-bold underline">
                  Request Browser Permission
                </button>
              )}
            </div>
          </div>
        )}

        <Button onClick={handleSave} className="w-full">Save Preferences</Button>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600">
                {phoneConfig?.verified ? `SMS: ${phoneConfig.phoneNumber}` : 'No phone connected'}
              </span>
            </div>
            <button
              onClick={onConnectPhone}
              className="text-sm text-green-600 font-medium hover:text-green-700"
            >
              {phoneConfig?.verified ? 'Change' : 'Connect Phone →'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// --- E. NOTIFICATION TOAST ---

export const NotificationToast: React.FC<{ notification: ProximityNotification | null; onDismiss: () => void; onChat: (n: ProximityNotification) => void }> = ({ notification, onDismiss, onChat }) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(onDismiss, 8000);
      return () => clearTimeout(timer);
    }
  }, [notification, onDismiss]);

  if (!notification) return null;

  return (
    <div className={`fixed bottom-4 left-4 right-4 max-w-sm mx-auto z-[100] transition-all duration-300 transform ${notification ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 relative">
        <div className="p-4 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${notification.matchGradient}`}>
            {notification.matchInitial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-bold text-gray-900 truncate">{notification.matchName}</h4>
              <span className="text-[10px] font-bold text-frog-green bg-frog-green/10 px-2 py-0.5 rounded-full">{notification.distance}</span>
            </div>
            <p className="text-sm text-gray-500 truncate">{notification.matchDetail}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onChat(notification)} className="p-2 bg-frog-green/10 hover:bg-frog-green/20 rounded-full text-frog-green transition-colors">
              <MessageCircle size={18} />
            </button>
            <button onClick={onDismiss} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-gray-100 w-full">
          <div className="h-full bg-frog-green animate-[progress_8s_linear_forwards]" />
        </div>
        <style>{`
          @keyframes progress { from { width: 100%; } to { width: 0%; } }
        `}</style>
      </div>
    </div>
  );
};

// --- F. NOTIFICATION BELL ---

interface NotificationBellProps {
  unreadCount: number;
  notifications: ProximityNotification[];
  onOpenAlerts: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ unreadCount, notifications, onOpenAlerts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors relative"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border border-frog-dark" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 origin-top-right">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Notifications</h3>
            {unreadCount > 0 && <Badge color="bg-red-100 text-red-600 border-red-200">{unreadCount} new</Badge>}
          </div>
          
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Bell size={32} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">No alerts yet.</p>
              </div>
            ) : (
              notifications.slice(0, 5).map(n => (
                <div key={n.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-3 ${!n.read ? 'bg-frog-green/5' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex shrink-0 items-center justify-center text-white font-bold text-sm ${n.matchGradient}`}>
                    {n.matchInitial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className={`text-sm truncate ${!n.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{n.matchName}</h4>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">Just now</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mb-1">{n.matchDetail}</p>
                    <div className="flex items-center gap-2">
                      <Badge icon>{n.distance}</Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <button 
            onClick={() => { setIsOpen(false); onOpenAlerts(); }}
            className="w-full p-3 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-frog-forest border-t border-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            <Settings size={14} />
            Set Alert Preferences
          </button>
        </div>
      )}
    </div>
  );
};
