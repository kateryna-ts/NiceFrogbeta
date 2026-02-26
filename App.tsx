
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Bluetooth, User as UserIcon, Settings, LogOut, Sun, Moon, Camera, Check, Plus, ShoppingBag, Heart, Home, Briefcase, ArrowRight } from 'lucide-react';
// @ts-ignore
import { Html5QrcodeScanner } from "html5-qrcode";
import { PublicLandingPage, AuthenticatedHomeFeed, MarketplaceView, DatingView, BuyTokensView, BuyStickersView } from './components/sections';
import { AuthScreen, OnboardingWizard, ProfilePage, SettingsModal, EditProfileModal } from './components/auth';
import { Button, Modal, Badge } from './components/ui';
import { PostListingWizard, ListingDetailChat } from './components/modals';
import { useProximityEngine, AlertPreferencesModal, NotificationToast, NotificationBell, AlertPreference } from './components/proximity';
import { usePhoneConfig, ConnectPhoneModal } from './components/sms';
import { Listing, BLEDevice, User, ListingType } from './types';
import { MOCK_LISTINGS } from './constants';

const App: React.FC = () => {
  // --- THEME STATE ---
  const [darkMode, setDarkMode] = useState(false); // Default to light for the new design system base, though sections have specific BGs

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  // --- AUTH & USER STATE ---
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  // Navigation State
  const [view, setView] = useState<'HOME' | 'MARKETPLACE' | 'DATING' | 'TOKENS' | 'STICKERS' | 'PROFILE'>('HOME');
  
  // Modal States
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [listingModalOpen, setListingModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  
  // Data States
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [notification, setNotification] = useState<string | null>(null);
  
  // Proximity Alert State
  const [alertPrefs, setAlertPrefs] = useState<AlertPreference[]>([]);
  const [showAlertPrefsModal, setShowAlertPrefsModal] = useState(false);
  const { config: phoneConfig, saveConfig } = usePhoneConfig();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const { notifications, activeToast, dismissToast, markAllRead, unreadCount } = useProximityEngine(alertPrefs, phoneConfig);
  
  // Proximity Chat State
  const [proximityChat, setProximityChat] = useState<{ name: string; gradient: string; initial: string } | null>(null);
  const [proximityChatMessages, setProximityChatMessages] = useState<{id: number, sender: string, text: string, time: string}[]>([]);
  const proximityMessagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom for proximity chat
  useEffect(() => {
    proximityMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [proximityChatMessages, proximityChat]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setProximityChat(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleSendProximityMessage = (text: string) => {
    if (!text.trim()) return;
    setProximityChatMessages(prev => [...prev, { id: Date.now(), sender: 'me', text: text.trim(), time: 'now' }]);
  };

  // UI States
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('nicefrog_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- HANDLERS ---
  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('nicefrog_user', JSON.stringify(u));
    setAuthModalOpen(false); 
    setView('HOME');
  };

  const handleUpdateUser = (u: User) => {
    setUser(u);
    localStorage.setItem('nicefrog_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    localStorage.removeItem('nicefrog_user');
    setUser(null);
    setView('HOME');
    setSettingsOpen(false);
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const openAuth = (mode: 'LOGIN' | 'SIGNUP') => {
     setAuthInitialTab(mode);
     setAuthModalOpen(true);
     setMobileMenuOpen(false);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  // Listing Form State
  const [listingForm, setListingForm] = useState({
    title: '', category: ListingType.FOR_SALE, price: '', isFree: false, description: '', image: ''
  });

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listingForm.title || !listingForm.category) return;
    
    const newListing: Listing = {
      id: `new_${Date.now()}`,
      title: listingForm.title,
      price: listingForm.isFree ? 'FREE' : `$${listingForm.price}`,
      description: listingForm.description,
      distance: '0m',
      image: listingForm.image || 'https://picsum.photos/400/300?random=100',
      type: listingForm.category,
      bleActive: true,
      user: user?.username || 'Me'
    };

    setListings([newListing, ...listings]);
    setListingModalOpen(false);
    setNotification("Your listing is now live! 🐸");
    setTimeout(() => setNotification(null), 3000);
    setListingForm({ title: '', category: ListingType.FOR_SALE, price: '', isFree: false, description: '', image: '' });
  };

  // If user is logged in but hasn't completed onboarding
  if (user && !user.onboardingComplete) {
     return <OnboardingWizard user={user} onComplete={handleUpdateUser} />;
  }

  return (
    <div className={`min-h-screen font-sans bg-frog-bg text-frog-dark selection:bg-frog-green/30 ${user?.preferences.fontSize === 'LARGE' ? 'text-lg' : ''}`}>
      
      {/* --- NOTIFICATION --- */}
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-full shadow-2xl bg-white border border-frog-green/20 flex items-center gap-4 animate-fade-in-up">
           <span className="font-bold text-frog-forest">{notification}</span>
           <button onClick={() => setNotification(null)}><X size={16} /></button>
        </div>
      )}

      {/* --- NAVBAR --- */}
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 h-[80px] flex items-center border-b ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-md border-gray-100' 
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="container mx-auto px-6 max-w-7xl flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-xl cursor-pointer group" onClick={() => setView('HOME')}>
            <span className="text-3xl group-hover:scale-110 transition-transform">🐸</span>
            <span className={`tracking-tight transition-colors ${!user && !isScrolled ? 'text-white' : 'text-frog-forest'}`}>nicefrog</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {!user ? (
              <>
                {['Product', 'Use Cases', 'Privacy', 'Investors'].map((item) => (
                  <button 
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                    className={`text-sm font-medium transition-colors hover:text-frog-green ${!isScrolled ? 'text-white/80' : 'text-gray-600'}`}
                  >
                    {item}
                  </button>
                ))}
                <Button 
                  onClick={() => openAuth('SIGNUP')} 
                  className="bg-frog-green text-white hover:bg-[#1eb053] shadow-lg shadow-frog-green/20 border-0 rounded-full px-6"
                >
                  Get Early Access
                </Button>
              </>
            ) : (
              <>
                {['Home', 'Marketplace', 'Dating', 'Tokens', 'Stickers'].map((item) => (
                  <button 
                    key={item}
                    onClick={() => setView(item.toUpperCase() as any)}
                    className={`text-sm font-medium transition-colors hover:text-frog-green ${view === item.toUpperCase() ? 'text-frog-green' : 'text-gray-600'}`}
                  >
                    {item}
                  </button>
                ))}
                
                <div className="h-6 w-px bg-gray-200 mx-2"></div>

                <NotificationBell 
                  unreadCount={unreadCount} 
                  notifications={notifications} 
                  onOpenAlerts={() => setShowAlertPrefsModal(true)} 
                />

                {/* User Dropdown */}
                <div className="relative">
                   <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="block w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm hover:border-frog-green transition-colors bg-gray-200 dark:bg-[#333]">
                      {user.avatar ? (
                        <img src={user.avatar} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                          {user.firstName?.[0] || 'U'}
                        </div>
                      )}
                   </button>
                   {profileDropdownOpen && (
                     <div className="absolute right-0 mt-4 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 overflow-hidden animate-fade-in-up">
                        <button onClick={() => { setView('PROFILE'); setProfileDropdownOpen(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                           <UserIcon size={16} /> Profile
                        </button>
                        <button onClick={() => { setSettingsOpen(true); setProfileDropdownOpen(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                           <Settings size={16} /> Settings
                        </button>
                        <div className="h-px bg-gray-100 my-1"></div>
                        <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-500 flex items-center gap-2">
                           <LogOut size={16} /> Log Out
                        </button>
                     </div>
                   )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className={`lg:hidden p-2 ${!user && !isScrolled ? 'text-white' : 'text-frog-dark'}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
           <div className="lg:hidden absolute top-[80px] left-0 w-full bg-white border-b border-gray-100 py-4 animate-fade-in-up h-[calc(100vh-80px)] overflow-y-auto">
              {!user ? (
                 <div className="flex flex-col p-6 gap-4">
                    {['Product', 'Use Cases', 'Privacy', 'Investors'].map((item) => (
                      <button 
                        key={item}
                        onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                        className="text-lg font-medium text-left py-2 text-gray-800"
                      >
                        {item}
                      </button>
                    ))}
                    <div className="h-px bg-gray-100 my-2"></div>
                    <Button className="w-full justify-center h-12" onClick={() => openAuth('SIGNUP')}>Get Early Access</Button>
                    <Button variant="ghost" className="w-full justify-center h-12" onClick={() => openAuth('LOGIN')}>Log In</Button>
                 </div>
              ) : (
                 <div className="flex flex-col p-6 gap-4">
                    {['Home', 'Marketplace', 'Dating', 'Tokens', 'Stickers'].map((item) => (
                      <button 
                        key={item}
                        onClick={() => { setView(item.toUpperCase() as any); setMobileMenuOpen(false); }}
                        className="text-lg font-medium text-left py-2 text-gray-800"
                      >
                        {item}
                      </button>
                    ))}
                    <div className="h-px bg-gray-100 my-2"></div>
                    <button onClick={() => { setView('PROFILE'); setMobileMenuOpen(false); }} className="text-lg font-medium text-left py-2 text-gray-800">Profile</button>
                    <button onClick={handleLogout} className="text-lg font-medium text-left py-2 text-red-500">Log Out</button>
                 </div>
              )}
           </div>
        )}
      </nav>

      {/* --- CONTENT --- */}
      <main>
        {view === 'HOME' && (
          !user ? (
            <PublicLandingPage 
              onSignUp={() => openAuth('SIGNUP')} 
              onLogin={() => openAuth('LOGIN')} 
            />
          ) : (
            <AuthenticatedHomeFeed 
               user={user}
               onNavigate={(v: any) => setView(v)}
               onSell={() => setListingModalOpen(true)}
               showProximityNudge={alertPrefs.length === 0}
               onSetupAlerts={() => setShowAlertPrefsModal(true)}
            />
          )
        )}
        {view === 'MARKETPLACE' && (
          <MarketplaceView 
             listings={listings} 
             openDetail={(item: Listing) => { setSelectedListing(item); setDetailModalOpen(true); }} 
             onPostListing={() => user ? setListingModalOpen(true) : openAuth('SIGNUP')}
          />
        )}
        {view === 'DATING' && <DatingView phoneConfig={phoneConfig} />}
        {view === 'TOKENS' && <BuyTokensView />}
        {view === 'STICKERS' && <BuyStickersView />}
        {view === 'PROFILE' && (
          user ? <ProfilePage user={user} onEdit={() => setEditProfileOpen(true)} phoneConfig={phoneConfig} onConnectPhone={() => setShowPhoneModal(true)} /> : <div className="min-h-screen flex items-center justify-center"><Button onClick={() => openAuth('LOGIN')}>Log In to View Profile</Button></div>
        )}
      </main>

      {/* --- MODALS --- */}
      {authModalOpen && (
        <div style={{position:'fixed',inset:0,zIndex:9999,backgroundColor:'rgba(13,31,20,0.8)',display:'flex',alignItems:'center',justifyContent:'center'}} onClick={(e:React.MouseEvent) => { if(e.target === e.currentTarget) setAuthModalOpen(false); }}>
           <AuthScreen 
              onLogin={handleLogin} 
              onClose={() => setAuthModalOpen(false)} 
              initialMode={authInitialTab}
              isModal={true} 
           />
        </div>
      )}

      {user && (
         <>
            <SettingsModal 
               isOpen={settingsOpen} 
               onClose={() => setSettingsOpen(false)} 
               user={user} 
               onSave={handleUpdateUser}
               onLogout={handleLogout}
               onToggleTheme={toggleTheme}
               isDarkMode={darkMode}
            />

            <EditProfileModal 
               isOpen={editProfileOpen}
               onClose={() => setEditProfileOpen(false)}
               user={user}
               onSave={handleUpdateUser}
            />

            {/* POST LISTING WIZARD MODAL */}
            <PostListingWizard 
               isOpen={listingModalOpen} 
               onClose={() => setListingModalOpen(false)} 
               user={user}
               onPost={(newListing) => {
                 setListings([newListing, ...listings]);
                 setListingModalOpen(false);
                 setNotification("Your listing is now live! 🐸");
                 setTimeout(() => setNotification(null), 3000);
               }}
            />
         </>
      )}

      {/* LISTING DETAIL & CHAT MODAL */}
      <ListingDetailChat 
         isOpen={detailModalOpen}
         onClose={() => setDetailModalOpen(false)}
         listing={selectedListing}
         user={user}
         onAuth={() => openAuth('LOGIN')}
         phoneConfig={phoneConfig}
      />

      {/* PROXIMITY ALERTS */}
      <NotificationToast 
        notification={activeToast} 
        onDismiss={dismissToast} 
        onChat={(notif) => { 
          setProximityChat({ name: notif.matchName, gradient: notif.matchGradient, initial: notif.matchInitial }); 
          setProximityChatMessages([{ id: 1, sender: 'them', text: "Hey! I'm nearby — want to connect? 👋", time: 'now' }]); 
          dismissToast(); 
        }}
      />
      <AlertPreferencesModal 
        open={showAlertPrefsModal} 
        onClose={() => setShowAlertPrefsModal(false)} 
        onSave={(prefs) => { setAlertPrefs(prefs); setShowAlertPrefsModal(false); }} 
        currentPrefs={alertPrefs} 
        phoneConfig={phoneConfig}
        onConnectPhone={() => setShowPhoneModal(true)}
      />

      {/* PHONE CONNECT MODAL */}
      <ConnectPhoneModal
        open={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        currentConfig={phoneConfig}
        onSave={saveConfig}
      />

      {/* PROXIMITY CHAT MODAL */}
      <Modal isOpen={!!proximityChat} onClose={() => setProximityChat(null)} title={proximityChat?.name || 'Chat'}>
        <div className="flex flex-col h-[500px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white rounded-xl border border-gray-100 mb-4">
            {proximityChatMessages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-2 text-sm shadow-sm ${
                  msg.sender === 'me' 
                    ? 'bg-frog-green text-white rounded-2xl rounded-br-sm' 
                    : 'bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={proximityMessagesEndRef} />
          </div>

          {/* Input */}
          <form 
            onSubmit={(e) => { 
              e.preventDefault(); 
              const input = e.currentTarget.elements.namedItem('msg') as HTMLInputElement;
              handleSendProximityMessage(input.value);
              input.value = '';
            }}
            className="flex gap-2 items-center border-t pt-3"
          >
            <input 
              name="msg"
              type="text" 
              placeholder="Say something nice..."
              className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-frog-green transition-colors"
              autoFocus
            />
            <button 
              type="submit"
              className="w-9 h-9 rounded-full bg-frog-green text-white flex items-center justify-center hover:bg-frog-greenDark transition-colors shadow-sm"
            >
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </Modal>

    </div>
  );
};

export default App;
