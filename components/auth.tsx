
import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, MapPin, ChevronRight, ChevronLeft, 
  Briefcase, Heart, ShoppingBag, Home, Search, Shield, 
  Settings, LogOut, Edit3, X, SkipForward, User as UserIcon, Lock, Bell, Sliders, Eye, EyeOff, Trash2, Bookmark, Activity,
  Fingerprint, Mail, ArrowLeft, Check, Smartphone, Command, Sun, Moon
} from 'lucide-react';
import { Button, Card, Modal, Switch, Slider, Badge } from './ui';
import { User as UserType, UserPreferences } from '../types';
import { MOCK_LISTINGS } from '../constants';
import { PhoneConfig } from './sms';

// --- CONSTANTS ---
const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 2010 - 1940 + 1 }, (_, i) => 2010 - i);

// --- SUB-COMPONENTS ---

const InputField = ({ label, type = "text", value, onChange, placeholder, error, rightIcon, onRightIconClick, ...props }: any) => (
  <div className="mb-4">
    {label && <label className="block text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">{label}</label>}
    <div className="relative">
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        className={`
          w-full h-[52px] px-4 
          bg-gray-50 dark:bg-[#1a1a1a] 
          border border-gray-200 dark:border-[#333]
          rounded-xl 
          text-gray-900 dark:text-white 
          placeholder-gray-400 dark:placeholder-gray-600
          focus:outline-none focus:border-frog-green dark:focus:border-frog-green focus:ring-1 focus:ring-frog-green
          transition-all duration-200
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          ${rightIcon ? 'pr-12' : ''}
        `}
        placeholder={placeholder}
        {...props}
      />
      {rightIcon && (
        <button 
          type="button"
          onClick={onRightIconClick}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {rightIcon}
        </button>
      )}
    </div>
    {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
  </div>
);

const Chip: React.FC<{ label: string, selected: boolean, onClick: () => void }> = ({ label, selected, onClick }) => (
  <button 
    type="button"
    onClick={onClick}
    className={`
      h-10 px-6 rounded-full text-sm font-medium transition-all duration-200 
      ${selected 
        ? 'bg-gradient-to-r from-frog-green to-frog-greenDark text-black shadow-lg shadow-frog-green/20 scale-105' 
        : 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#252525]'
      }
    `}
  >
    {label}
  </button>
);

const ToggleCard = ({ icon: Icon, title, selected, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`
      cursor-pointer p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-3 h-36
      ${selected 
        ? 'bg-frog-green/10 border-frog-green dark:border-frog-green shadow-lg shadow-frog-green/10' 
        : 'bg-white dark:bg-[#111] border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 hover:-translate-y-1'
      }
    `}
  >
    <Icon size={28} className={selected ? 'text-frog-greenDark dark:text-frog-green' : 'text-gray-400'} />
    <span className={`font-semibold text-sm ${selected ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>{title}</span>
  </div>
);

// --- AUTH SCREEN (NEW REDESIGN) ---
export const AuthScreen: React.FC<{ 
  onLogin: (u: UserType) => void; 
  onClose?: () => void;
  initialMode?: 'LOGIN' | 'SIGNUP';
  isModal?: boolean;
}> = ({ onLogin, onClose, initialMode = 'LOGIN', isModal = false }) => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>(initialMode);
  const [view, setView] = useState<'MAIN' | 'MAGIC_EMAIL' | 'MAGIC_CODE' | 'FORGOT'>('MAIN');
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const [toast, setToast] = useState<{ msg: string, type: 'success' | 'info' } | null>(null);

  // Sync internal state if prop changes (e.g. reopening modal via different button)
  useEffect(() => {
    setAuthMode(initialMode);
  }, [initialMode]);

  // Form State
  const [formData, setFormData] = useState({
    email: '', password: '', firstName: '', lastName: '', 
    dob: { month: '', day: '', year: '' }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [magicEmail, setMagicEmail] = useState('');
  const [magicCode, setMagicCode] = useState(['', '', '', '', '', '']);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Helpers
  const showToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleMockLogin = (overrideName?: string) => {
    // MOCK AUTH DATA
    const mockUser: UserType = {
      id: 'u_' + Date.now(),
      email: formData.email || magicEmail || 'user@example.com',
      firstName: overrideName || (authMode === 'SIGNUP' ? formData.firstName : 'James'),
      lastName: authMode === 'SIGNUP' ? formData.lastName : 'Burchetta',
      dob: authMode === 'SIGNUP' ? `${formData.dob.month} ${formData.dob.day}, ${formData.dob.year}` : '01/01/1980',
      username: '@nicefrogger',
      bio: '', gender: '', location: '', joinedDate: new Date().toLocaleDateString(),
      onboardingComplete: authMode === 'LOGIN', // If logging in, skip onboarding. If signup, go to onboarding.
      avatar: authMode === 'LOGIN' ? 'https://picsum.photos/200' : '',
      coverPhoto: authMode === 'LOGIN' ? 'https://picsum.photos/800/300' : '',
      stats: { listings: 0, connections: 0, reviews: 0 },
      preferences: {
        intents: [], marketplaceCategories: [], priceRange: [0, 1000], maxDistance: 100,
        datingLookingFor: 'EVERYONE', datingAgeRange: [18, 50], datingDistance: 50, relationshipType: [], datingInterests: [],
        jobIndustries: [], jobType: [], salaryRange: [0, 0], remotePreference: 'HYBRID',
        privacy: 'EVERYONE', showLocation: true, allowDiscovery: true, showOnlineStatus: true, ephemeralMode: false, bleVisibility: true, fontSize: 'NORMAL',
        notifications: { messages: true, listings: true, matches: true, priceDrops: true }
      }
    };
    onLogin(mockUser);
  };

  // Magic Code Auto-fill Mock
  useEffect(() => {
    if (view === 'MAGIC_CODE') {
      const timer = setTimeout(() => {
        setMagicCode(['1', '2', '3', '4', '5', '6']);
        showToast('Code sent!', 'info');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [view]);

  // Handle Code Input
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...magicCode];
    newCode[index] = value;
    setMagicCode(newCode);
    if (value && index < 5) {
      codeRefs.current[index + 1]?.focus();
    }
  };

  const passwordStrength = (pass: string) => {
    if (!pass) return 0;
    if (pass.length < 6) return 1;
    if (pass.length < 10) return 2;
    return 3;
  };
  const strength = passwordStrength(formData.password);

  return (
    <div className={`
       flex items-center justify-center p-4 transition-colors duration-500 relative overflow-hidden
       ${isModal ? 'fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm h-screen' : 'min-h-screen bg-gray-50 dark:bg-black'}
    `}>
      {/* Background Blobs (Only if not modal, or make them simpler) */}
      {!isModal && (
         <>
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-frog-green/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
         </>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-full bg-white dark:bg-[#222] text-gray-900 dark:text-white shadow-2xl border border-frog-green flex items-center gap-2 animate-in slide-in-from-top-4">
          <Check size={16} className="text-frog-green" />
          <span className="font-medium text-sm">{toast.msg}</span>
        </div>
      )}

      {/* PASSKEY MODAL */}
      {showPasskeyModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center transform scale-100 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 text-3xl">
              <Fingerprint size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Authenticate</h3>
            <p className="text-gray-500 mb-8 text-sm">Use Face ID, Touch ID, or device PIN to sign in to NiceFrog.</p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => { setShowPasskeyModal(false); showToast('Signed in with Passkey! 🔑'); setTimeout(() => handleMockLogin(), 1000); }}>
                Use Passkey
              </Button>
              <Button variant="ghost" onClick={() => setShowPasskeyModal(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CARD */}
      <div className={`
        relative w-full max-w-[420px] 
        bg-white dark:bg-[#111111] 
        border border-gray-100 dark:border-[#2a2a2a] 
        shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.5)]
        rounded-3xl p-8 md:p-10
        transition-all duration-300
        animate-in zoom-in-95 fade-in duration-200
        ${isModal ? 'shadow-2xl' : ''}
      `}>
        {onClose && (
           <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-all">
              <X size={20} />
           </button>
        )}

        {/* LOGO */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🐸</div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            nice<span className="text-frog-greenDark dark:text-frog-green">frog</span>
          </h1>
        </div>

        {view === 'MAIN' && (
          <>
            {/* TABS */}
            <div className="flex mb-8 border-b border-gray-100 dark:border-[#2a2a2a]">
              {['LOGIN', 'SIGNUP'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setAuthMode(mode as any)}
                  className={`flex-1 pb-4 text-sm font-bold tracking-wide transition-all relative ${
                    authMode === mode 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  {mode === 'LOGIN' ? 'Log In' : 'Sign Up'}
                  {authMode === mode && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-frog-green shadow-[0_-2px_8px_rgba(0,230,118,0.5)]" />
                  )}
                </button>
              ))}
            </div>

            {authMode === 'LOGIN' ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* PASSKEY */}
                <button 
                  onClick={() => setShowPasskeyModal(true)}
                  className="w-full h-[52px] rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-frog-green/50 hover:border-frog-green text-frog-greenDark dark:text-frog-green font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-frog-green/10"
                >
                  <Fingerprint size={18} /> Sign in with Passkey
                </button>

                {/* MAGIC LINK */}
                <button 
                  onClick={() => setView('MAGIC_EMAIL')}
                  className="w-full h-[52px] rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-transparent hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Mail size={18} /> Send me a login code
                </button>

                {/* SOCIAL */}
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => showToast('Google Sign-In coming soon!', 'info')} className="h-[52px] rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-900 font-semibold flex items-center justify-center gap-2 transition-all">
                    <span className="text-lg">G</span> Google
                  </button>
                  <button onClick={() => showToast('Apple Sign-In coming soon!', 'info')} className="h-[52px] rounded-xl bg-black hover:bg-gray-900 text-white font-semibold flex items-center justify-center gap-2 transition-all">
                    <span className="text-lg"></span> Apple
                  </button>
                </div>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-[#2a2a2a]"></div></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-[#111] px-2 text-gray-400">or continue with email</span></div>
                </div>

                {/* EMAIL FORM */}
                <form onSubmit={(e) => { e.preventDefault(); handleMockLogin(); }}>
                  <InputField 
                    placeholder="Email Address" 
                    value={formData.email} 
                    onChange={(e:any) => setFormData({...formData, email: e.target.value})} 
                  />
                  <InputField 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    value={formData.password}
                    onChange={(e:any) => setFormData({...formData, password: e.target.value})}
                    rightIcon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    onRightIconClick={() => setShowPassword(!showPassword)}
                  />
                  
                  <div className="flex justify-between items-center text-xs mb-6">
                    <label className="flex items-center gap-2 cursor-pointer text-gray-500">
                      <input type="checkbox" className="rounded border-gray-300 text-frog-green focus:ring-frog-green" />
                      Remember me
                    </label>
                    <button type="button" onClick={() => setView('FORGOT')} className="text-gray-500 hover:text-frog-greenDark dark:hover:text-frog-green transition-colors font-medium">
                      Forgot Password?
                    </button>
                  </div>

                  <Button type="submit" size="lg" className="w-full">Log In</Button>
                </form>

                <div className="text-center pt-2">
                  <p className="text-sm text-gray-500">
                    Don't have an account? <button onClick={() => setAuthMode('SIGNUP')} className="text-frog-greenDark dark:text-frog-green font-bold hover:underline">Sign Up</button>
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                {/* SIGN UP PASSKEY */}
                <button 
                  onClick={() => setShowPasskeyModal(true)}
                  className="w-full h-[52px] rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-frog-green/50 hover:border-frog-green text-frog-greenDark dark:text-frog-green font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-frog-green/10 mb-6"
                >
                  <Fingerprint size={18} /> Sign up with Passkey
                </button>

                <form onSubmit={(e) => { 
                   e.preventDefault(); 
                   showToast(`Welcome to NiceFrog, ${formData.firstName}! 🐸`);
                   setTimeout(() => handleMockLogin(), 1500);
                }}>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <InputField 
                      placeholder="First Name" 
                      value={formData.firstName} 
                      onChange={(e:any) => setFormData({...formData, firstName: e.target.value})} 
                    />
                    <InputField 
                      placeholder="Last Name" 
                      value={formData.lastName} 
                      onChange={(e:any) => setFormData({...formData, lastName: e.target.value})} 
                    />
                  </div>
                  
                  <InputField 
                    placeholder="Email Address" 
                    value={formData.email} 
                    onChange={(e:any) => setFormData({...formData, email: e.target.value})} 
                  />

                  <div className="mb-4">
                    <InputField 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Create Password" 
                      value={formData.password}
                      onChange={(e:any) => setFormData({...formData, password: e.target.value})}
                      rightIcon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      onRightIconClick={() => setShowPassword(!showPassword)}
                    />
                    {/* Strength Bar */}
                    <div className="flex gap-1 h-1 mt-1 px-1">
                      <div className={`flex-1 rounded-full transition-colors ${strength >= 1 ? (strength === 1 ? 'bg-red-500' : strength === 2 ? 'bg-orange-500' : 'bg-frog-green') : 'bg-gray-200 dark:bg-gray-800'}`}></div>
                      <div className={`flex-1 rounded-full transition-colors ${strength >= 2 ? (strength === 2 ? 'bg-orange-500' : 'bg-frog-green') : 'bg-gray-200 dark:bg-gray-800'}`}></div>
                      <div className={`flex-1 rounded-full transition-colors ${strength >= 3 ? 'bg-frog-green' : 'bg-gray-200 dark:bg-gray-800'}`}></div>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-6">
                    <select className="flex-1 h-[52px] bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl px-3 text-sm dark:text-white outline-none focus:border-frog-green" 
                      value={formData.dob.month} onChange={e => setFormData({...formData, dob: {...formData.dob, month: e.target.value}})}>
                      <option value="">Month</option>{MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select className="w-20 h-[52px] bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl px-3 text-sm dark:text-white outline-none focus:border-frog-green"
                      value={formData.dob.day} onChange={e => setFormData({...formData, dob: {...formData.dob, day: e.target.value}})}>
                      <option value="">Day</option>{DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select className="w-24 h-[52px] bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl px-3 text-sm dark:text-white outline-none focus:border-frog-green"
                      value={formData.dob.year} onChange={e => setFormData({...formData, dob: {...formData.dob, year: e.target.value}})}>
                      <option value="">Year</option>{YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>

                  <Button type="submit" size="lg" className="w-full">Join NiceFrog</Button>
                </form>

                <div className="text-center pt-2">
                  <p className="text-sm text-gray-500">
                    Don't have an account? <button onClick={() => setAuthMode('SIGNUP')} className="text-frog-greenDark dark:text-frog-green font-bold hover:underline">Sign Up</button>
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* MAGIC LINK EMAIL VIEW */}
        {view === 'MAGIC_EMAIL' && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            <button onClick={() => setView('MAIN')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6">
              <ArrowLeft size={16} /> Back
            </button>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Login without password</h2>
            <p className="text-gray-500 mb-8">Enter your email and we'll send you a code.</p>
            
            <InputField 
               placeholder="Enter your email address"
               value={magicEmail}
               onChange={(e:any) => setMagicEmail(e.target.value)}
            />
            
            <Button size="lg" className="w-full" onClick={() => setView('MAGIC_CODE')}>Send Code</Button>
          </div>
        )}

        {/* MAGIC LINK CODE VIEW */}
        {view === 'MAGIC_CODE' && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            <button onClick={() => setView('MAGIC_EMAIL')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6">
              <ArrowLeft size={16} /> Back
            </button>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Check your email</h2>
            <p className="text-gray-500 mb-8">We sent a code to <span className="font-bold text-gray-900 dark:text-white">{magicEmail || 'your email'}</span>.</p>
            
            <div className="flex justify-between gap-2 mb-4">
              {magicCode.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { codeRefs.current[idx] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(idx, e.target.value)}
                  className="w-12 h-14 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#1a1a1a] text-center text-xl font-bold text-gray-900 dark:text-white focus:border-frog-green focus:outline-none focus:ring-1 focus:ring-frog-green"
                />
              ))}
            </div>
            <p className="text-center text-xs text-gray-400 mb-8">Code expires in 10 minutes.</p>

            <Button size="lg" className="w-full" onClick={() => { showToast('Logged in! Welcome back 🐸'); setTimeout(() => handleMockLogin(), 1000); }}>Verify Code</Button>
          </div>
        )}

        {/* FORGOT PASSWORD VIEW */}
        {view === 'FORGOT' && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300">
             <button onClick={() => setView('MAIN')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6">
              <ArrowLeft size={16} /> Back
            </button>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Reset your password</h2>
            <p className="text-gray-500 mb-8">Enter your email to receive reset instructions.</p>
            
            <InputField placeholder="Email Address" value={formData.email} onChange={(e:any) => setFormData({...formData, email: e.target.value})} />
            
            <Button size="lg" className="w-full" onClick={() => showToast('Reset link sent! Check your email.')}>Send Reset Link</Button>
          </div>
        )}

      </div>
    </div>
  );
};

// --- ONBOARDING WIZARD ---

export const OnboardingWizard: React.FC<{ user: UserType, onComplete: (u: UserType) => void }> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<UserType>(user);

  const updatePref = (key: keyof UserPreferences, val: any) => {
    setData({ ...data, preferences: { ...data.preferences, [key]: val } });
  };

  const handleNext = () => {
    if (step === 1 && (!data.username || !data.location)) return alert("Required fields missing.");
    if (step === 5) onComplete({...data, onboardingComplete: true});
    else setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-frog-light dark:bg-frog-dark flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[560px] animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        {/* Progress */}
        <div className="mb-10 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 dark:text-gray-400 mb-4">
            Step {step} of 5 • {step === 1 ? 'Profile' : step === 2 ? 'Intent' : step === 3 ? 'Marketplace' : step === 4 ? 'Dating' : 'Jobs'}
          </p>
          <div className="h-[3px] bg-gray-200 dark:bg-white/10 rounded-full w-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-frog-green to-frog-greenDark transition-all duration-500 ease-out" 
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* STEP 1: PROFILE */}
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white tracking-tight">Setup Profile</h2>
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-[#111] flex items-center justify-center relative overflow-hidden group cursor-pointer border-2 border-dashed border-gray-300 dark:border-frog-green hover:border-solid hover:scale-105 transition-all">
                {data.avatar ? <img src={data.avatar} className="w-full h-full object-cover" /> : <Camera size={32} className="text-gray-400" />}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-white font-bold">Upload</span>
                </div>
              </div>
            </div>
            <InputField label="Display Name" value={data.username} onChange={(e: any) => setData({...data, username: e.target.value})} placeholder="@username" />
            <InputField label="Location" value={data.location} onChange={(e: any) => setData({...data, location: e.target.value})} placeholder="City, State" />
            <div className="mb-6">
               <label className="block text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 ml-1">Gender</label>
               <div className="flex gap-2 flex-wrap">
                 {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map(g => (
                   <Chip key={g} label={g} selected={data.gender === g} onClick={() => setData({...data, gender: g})} />
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* STEP 2: INTENT */}
        {step === 2 && (
          <div>
             <h2 className="text-3xl font-bold mb-2 text-center text-gray-900 dark:text-white tracking-tight">Your Goals</h2>
             <p className="text-gray-500 text-center mb-8">What brings you to NiceFrog?</p>
             <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'BUY_SELL', icon: ShoppingBag, title: 'Buy & Sell' },
                  { id: 'REAL_ESTATE', icon: Home, title: 'Real Estate' },
                  { id: 'JOBS', icon: Briefcase, title: 'Jobs' },
                  { id: 'DATING', icon: Heart, title: 'Dating' },
                ].map(item => (
                  <ToggleCard 
                    key={item.id}
                    icon={item.icon} 
                    title={item.title} 
                    selected={data.preferences.intents.includes(item.id)} 
                    onClick={() => {
                      const intents = data.preferences.intents.includes(item.id) 
                        ? data.preferences.intents.filter(i => i !== item.id)
                        : [...data.preferences.intents, item.id];
                      updatePref('intents', intents);
                    }} 
                  />
                ))}
             </div>
          </div>
        )}

        {/* STEP 3: MARKETPLACE */}
        {step === 3 && (
           <div>
             <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white tracking-tight">Marketplace Filters</h2>
             <div className="mb-8">
               <label className="block text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-3 ml-1">Categories</label>
               <div className="flex flex-wrap gap-3 justify-center">
                 {['Electronics', 'Furniture', 'Clothing', 'Vehicles', 'Music', 'Sports', 'Books', 'Art', 'Home', 'Jewelry', 'Pets'].map(c => (
                   <Chip key={c} label={c} selected={data.preferences.marketplaceCategories.includes(c)} 
                     onClick={() => {
                       const cats = data.preferences.marketplaceCategories.includes(c)
                        ? data.preferences.marketplaceCategories.filter(x => x !== c)
                        : [...data.preferences.marketplaceCategories, c];
                       updatePref('marketplaceCategories', cats);
                     }} 
                   />
                 ))}
               </div>
             </div>
             <div className="mb-6 px-4">
                <label className="block text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-3 ml-1">Max Distance: {data.preferences.maxDistance}m</label>
                <Slider 
                  min={1} 
                  max={500} 
                  value={data.preferences.maxDistance} 
                  onChange={(val) => updatePref('maxDistance', val)} 
                />
             </div>
           </div>
        )}

        {/* STEP 4: DATING */}
        {step === 4 && (
          <div>
             <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white tracking-tight">Dating Preferences</h2>
             <div className="mb-8">
                <label className="block text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-3 ml-1">Looking For</label>
                <div className="flex gap-3 justify-center">
                   {['MEN', 'WOMEN', 'EVERYONE'].map(o => (
                     <Chip key={o} label={o} selected={data.preferences.datingLookingFor === o} onClick={() => updatePref('datingLookingFor', o)} />
                   ))}
                </div>
             </div>
             <div>
                <label className="block text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-3 ml-1">Passions</label>
                <div className="flex flex-wrap gap-2 justify-center">
                   {['Music', 'Sports', 'Art', 'Cooking', 'Travel', 'Fitness', 'Gaming', 'Outdoors', 'Foodie', 'Tech'].map(i => (
                     <Chip key={i} label={i} selected={data.preferences.datingInterests.includes(i)} 
                       onClick={() => {
                         const ints = data.preferences.datingInterests.includes(i)
                           ? data.preferences.datingInterests.filter(x => x !== i)
                           : [...data.preferences.datingInterests, i];
                         updatePref('datingInterests', ints);
                       }} 
                     />
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* STEP 5: JOBS */}
        {step === 5 && (
           <div>
              <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white tracking-tight">Job Filters</h2>
              <div className="mb-8">
                 <label className="block text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-3 ml-1">Industries</label>
                 <div className="flex flex-wrap gap-2 justify-center">
                   {['Tech', 'Healthcare', 'Hospitality', 'Retail', 'Finance', 'Creative', 'Legal', 'Marketing'].map(ind => (
                      <Chip key={ind} label={ind} selected={data.preferences.jobIndustries.includes(ind)}
                        onClick={() => {
                           const inds = data.preferences.jobIndustries.includes(ind)
                             ? data.preferences.jobIndustries.filter(x => x !== ind)
                             : [...data.preferences.jobIndustries, ind];
                           updatePref('jobIndustries', inds);
                        }}
                      />
                   ))}
                 </div>
              </div>
              <div className="mb-6">
                 <label className="block text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-3 ml-1">Job Type</label>
                 <div className="flex flex-wrap gap-2 justify-center">
                    {['Full-time', 'Part-time', 'Freelance', 'Remote'].map(t => (
                      <Chip key={t} label={t} selected={data.preferences.jobType.includes(t)}
                         onClick={() => {
                           const types = data.preferences.jobType.includes(t)
                             ? data.preferences.jobType.filter(x => x !== t)
                             : [...data.preferences.jobType, t];
                           updatePref('jobType', types);
                         }}
                      />
                    ))}
                 </div>
              </div>
           </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-200 dark:border-white/10">
           <div className="flex items-center gap-4">
              {step > 1 && (
                <Button variant="ghost" onClick={handleBack} size="sm">
                  Back
                </Button>
              )}
           </div>
           
           <Button onClick={handleNext} className="min-w-[120px]">
             {step === 5 ? 'Finish' : 'Next'} <ChevronRight size={16} />
           </Button>
        </div>
      </div>
    </div>
  );
};

// --- PROFILE PAGE ---

export const ProfilePage: React.FC<{ user: UserType, onEdit: () => void, phoneConfig: PhoneConfig | null, onConnectPhone: () => void }> = ({ user, onEdit, phoneConfig, onConnectPhone }) => {
  const [activeTab, setActiveTab] = useState('listings');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(user.bio || "No bio yet.");
  
  // Settings Toggles State
  const [settings, setSettings] = useState({
    visible: user.preferences.showLocation,
    datingMode: user.preferences.intents.includes('DATING'),
    notifications: user.preferences.notifications.messages
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveBio = () => {
    // In a real app, this would update the user object via API
    setIsEditingBio(false);
  };

  const mockListings = MOCK_LISTINGS.slice(0, 3); 

  return (
    <div className="pt-24 pb-12 min-h-screen">
       <div className="container mx-auto px-4 max-w-5xl">
          <Card className="mb-6 relative overflow-hidden">
             {/* Cover Photo */}
             <div className="h-[180px] bg-gradient-to-r from-frog-green/20 to-[#0a0a0a] relative group cursor-pointer">
                {user.coverPhoto ? (
                   <img src={user.coverPhoto} className="w-full h-full object-cover opacity-80" />
                ) : (
                   <div className="w-full h-full bg-gradient-to-br from-frog-green/10 to-blue-500/10"></div>
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <Button variant="secondary" size="sm"><Camera size={14} /> Edit Cover</Button>
                </div>
             </div>
             
             <div className="px-8 pb-8">
                {/* Avatar */}
                <div className="relative -mt-12 mb-6 inline-block">
                   <div className="w-24 h-24 rounded-full border-4 border-white dark:border-[#111] bg-gray-100 dark:bg-[#222] overflow-hidden shadow-lg p-0.5">
                      {user.avatar ? (
                        <img src={user.avatar} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-[#333] text-gray-500 font-bold text-2xl">
                          {user.firstName?.[0]}
                        </div>
                      )}
                   </div>
                   <div className="absolute bottom-1 right-1 w-5 h-5 bg-frog-green border-4 border-white dark:border-[#111] rounded-full"></div>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                   <div className="flex-1 w-full">
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">{user.firstName} {user.lastName}</h1>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                         <span className="font-medium text-frog-greenDark dark:text-frog-green">{user.username}</span>
                         <span className="flex items-center gap-1"><MapPin size={12} /> {user.location}</span>
                         <span>Joined {user.joinedDate}</span>
                      </div>
                      
                      {/* Editable Bio */}
                      <div className="relative group max-w-2xl">
                        {isEditingBio ? (
                          <div className="flex gap-2 items-start">
                            <textarea 
                              value={bioText}
                              onChange={(e) => setBioText(e.target.value)}
                              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-[#111] border border-frog-green focus:outline-none text-sm resize-none"
                              rows={3}
                              autoFocus
                            />
                            <button onClick={handleSaveBio} className="p-2 bg-frog-green text-white rounded-lg hover:bg-frog-greenDark transition-colors">
                              <Check size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{bioText}</p>
                            <button onClick={() => setIsEditingBio(true)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-frog-green transition-all">
                              <Edit3 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                   </div>
                   <Button variant="outline" onClick={onEdit} size="sm">
                      <Settings size={14} className="mr-2" /> Edit Profile
                   </Button>
                </div>
                
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 dark:border-white/5">
                   {[
                      { label: 'Listings', val: user.stats.listings || 12, icon: ShoppingBag },
                      { label: 'NFC Points', val: 847, icon: Activity },
                      { label: 'Matches', val: user.stats.connections || 23, icon: Heart },
                   ].map((stat, i) => (
                      <div key={i} className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/5 hover:border-frog-green/30 transition-colors cursor-pointer group">
                         <stat.icon size={20} className="text-gray-400 group-hover:text-frog-green mb-2 transition-colors" />
                         <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.val}</div>
                         <div className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{stat.label}</div>
                      </div>
                   ))}
                </div>

                {/* Settings Toggles */}
                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Quick Settings</h3>
                  <div className="grid sm:grid-cols-3 gap-6">
                    {[
                      { key: 'visible', label: 'Visible to Nearby', icon: Eye },
                      { key: 'datingMode', label: 'Dating Mode', icon: Heart },
                      { key: 'notifications', label: 'Notifications', icon: Bell },
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-3">
                          <setting.icon size={16} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{setting.label}</span>
                        </div>
                        <button 
                          // @ts-ignore
                          onClick={() => toggleSetting(setting.key)}
                          // @ts-ignore
                          className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${settings[setting.key] ? 'bg-frog-green' : 'bg-gray-200 dark:bg-gray-700'}`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${
                            // @ts-ignore
                            settings[setting.key] ? 'translate-x-5' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
          </Card>

          {/* SMS Notifications Card */}
          <Card className="p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <Smartphone size={18} className="text-frog-green" /> SMS Notifications
              </h3>
              {phoneConfig?.verified && (
                <span className="text-xs bg-frog-green/10 text-frog-green px-2 py-1 rounded-full font-medium border border-frog-green/20">
                  ✓ Connected
                </span>
              )}
            </div>
            {phoneConfig?.verified ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Connected: <span className="font-medium text-gray-900 dark:text-white">{phoneConfig.phoneNumber}</span></p>
                <button onClick={onConnectPhone} className="text-sm text-frog-green font-medium hover:underline">
                  Change number →
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-3">
                  Get real SMS texts when matches walk by or when you receive messages.
                </p>
                <button
                  onClick={onConnectPhone}
                  className="w-full py-2.5 bg-frog-green hover:bg-frog-greenDark text-white rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-frog-green/20"
                >
                  <Smartphone size={16} /> Connect Phone Number
                </button>
              </div>
            )}
          </Card>
          
          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-gray-200 dark:border-white/10 overflow-x-auto hide-scrollbar">
             {[
               { id: 'listings', label: 'My Listings', icon: ShoppingBag },
               { id: 'saved', label: 'Saved', icon: Bookmark },
               { id: 'activity', label: 'Activity', icon: Activity },
             ].map(tab => (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`
                   px-6 py-4 text-sm font-bold flex items-center gap-2 transition-all border-b-2 whitespace-nowrap
                   ${activeTab === tab.id 
                     ? 'text-frog-greenDark dark:text-frog-green border-frog-greenDark dark:border-frog-green' 
                     : 'text-gray-500 border-transparent hover:text-gray-900 dark:hover:text-white'
                   }
                 `}
               >
                 <tab.icon size={16} /> {tab.label}
               </button>
             ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
             {activeTab === 'listings' && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                   {mockListings.map(item => (
                      <Card key={item.id} className="group cursor-pointer">
                        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#222] dark:to-[#333]">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-200 dark:bg-[#333]" />
                          )}
                          <div className="absolute top-4 right-4">
                             {item.bleActive && <Badge icon>BLE Live</Badge>}
                          </div>
                        </div>
                        <div className="p-4">
                           <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{item.title}</h3>
                           <p className="text-frog-greenDark dark:text-frog-green font-bold text-sm">{item.price}</p>
                           <div className="mt-3 text-xs text-gray-400 flex justify-between">
                              <span>{item.type.replace('_', ' ')}</span>
                              <span>{item.distance}</span>
                           </div>
                        </div>
                      </Card>
                   ))}
                   <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl text-gray-400 hover:border-frog-green hover:text-frog-green cursor-pointer transition-all">
                      <div className="text-center">
                         <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                            <ShoppingBag size={20} />
                         </div>
                         <span className="font-bold text-sm">Create New Listing</span>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'saved' && (
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl">
                   <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4 text-gray-400">
                      <Bookmark size={32} />
                   </div>
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No saved items</h3>
                   <p className="text-gray-500">Items you bookmark will appear here.</p>
                </div>
             )}

             {activeTab === 'activity' && (
                <div className="space-y-4">
                   {[
                      { text: "You listed 'Vintage Chair'", time: "2 days ago" },
                      { text: "You connected with @neighbor", time: "1 week ago" },
                      { text: "Your listing received 3 views", time: "3 days ago" }
                   ].map((act, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-xl">
                         <div className="w-10 h-10 rounded-full bg-frog-green/10 flex items-center justify-center text-frog-greenDark dark:text-frog-green">
                            <Activity size={18} />
                         </div>
                         <div>
                            <p className="font-medium text-gray-900 dark:text-white">{act.text}</p>
                            <p className="text-xs text-gray-500">{act.time}</p>
                         </div>
                      </div>
                   ))}
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

// --- SETTINGS MODAL ---

export const SettingsModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  user: UserType; 
  onSave: (u: UserType) => void;
  onLogout: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}> = ({ isOpen, onClose, user, onSave, onLogout, onToggleTheme, isDarkMode }) => {
  const [prefs, setPrefs] = useState(user.preferences);

  const handleToggle = (key: keyof UserPreferences, subKey?: keyof UserPreferences['notifications']) => {
    if (subKey && key === 'notifications') {
      setPrefs({ ...prefs, notifications: { ...prefs.notifications, [subKey]: !prefs.notifications[subKey] } });
    } else {
       // @ts-ignore
      setPrefs({ ...prefs, [key]: !prefs[key] });
    }
  };

  const handleSave = () => {
    onSave({ ...user, preferences: prefs });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
       <div className="space-y-6">
          {/* Appearance */}
          <section>
             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Appearance</h3>
             <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#111] rounded-xl border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                   {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                   <div>
                      <p className="font-bold text-gray-900 dark:text-white">Dark Mode</p>
                      <p className="text-xs text-gray-500">Adjust the appearance of the app</p>
                   </div>
                </div>
                <Switch checked={isDarkMode} onChange={onToggleTheme} />
             </div>
          </section>

          {/* Privacy */}
          <section>
             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Privacy</h3>
             <div className="space-y-3">
                {[
                   { key: 'showLocation', label: 'Share Location', desc: 'Allow others to see your approximate location' },
                   { key: 'allowDiscovery', label: 'Discoverable', desc: 'Let others find you in search results' },
                   { key: 'showOnlineStatus', label: 'Online Status', desc: 'Show when you are active' }
                ].map((item) => (
                   <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#111] rounded-xl border border-gray-100 dark:border-white/5">
                      <div>
                         <p className="font-bold text-gray-900 dark:text-white">{item.label}</p>
                         <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      {/* @ts-ignore */}
                      <Switch checked={prefs[item.key]} onChange={() => handleToggle(item.key)} />
                   </div>
                ))}
             </div>
          </section>

          {/* Notifications */}
          <section>
             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Notifications</h3>
             <div className="space-y-3">
                {[
                   { key: 'messages', label: 'Messages', desc: 'Get notified when you receive a message' },
                   { key: 'listings', label: 'New Listings', desc: 'Get notified about new listings near you' },
                   { key: 'matches', label: 'New Matches', desc: 'Get notified when you get a match' },
                ].map((item) => (
                   <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#111] rounded-xl border border-gray-100 dark:border-white/5">
                      <div>
                         <p className="font-bold text-gray-900 dark:text-white">{item.label}</p>
                         <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      {/* @ts-ignore */}
                      <Switch checked={prefs.notifications[item.key]} onChange={() => handleToggle('notifications', item.key)} />
                   </div>
                ))}
             </div>
          </section>

          <div className="pt-6 flex flex-col gap-4">
             <Button onClick={handleSave} className="w-full">Save Changes</Button>
             <Button variant="danger" onClick={onLogout} className="w-full">Log Out</Button>
          </div>
       </div>
    </Modal>
  );
};

// --- EDIT PROFILE MODAL ---

export const EditProfileModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  onSave: (u: UserType) => void;
}> = ({ isOpen, onClose, user, onSave }) => {
   const [formData, setFormData] = useState(user);

   const handleChange = (field: keyof UserType, value: any) => {
      setFormData({ ...formData, [field]: value });
   };

   const handleSave = () => {
      onSave(formData);
      onClose();
   };

   return (
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
         <div className="space-y-6">
            <div className="flex justify-center mb-6">
               <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-white/10 group cursor-pointer bg-gray-100 dark:bg-[#222]">
                  {formData.avatar ? (
                    <img src={formData.avatar} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserIcon size={32} className="text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <Camera size={20} className="text-white" />
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">First Name</label>
                  <input 
                     type="text" 
                     value={formData.firstName}
                     onChange={(e) => handleChange('firstName', e.target.value)}
                     className="w-full h-12 px-4 bg-gray-50 dark:bg-[#111] border border-transparent rounded-xl focus:border-frog-green outline-none"
                  />
               </div>
               <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Last Name</label>
                  <input 
                     type="text" 
                     value={formData.lastName}
                     onChange={(e) => handleChange('lastName', e.target.value)}
                     className="w-full h-12 px-4 bg-gray-50 dark:bg-[#111] border border-transparent rounded-xl focus:border-frog-green outline-none"
                  />
               </div>
            </div>

            <div>
               <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Username</label>
               <input 
                  type="text" 
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  className="w-full h-12 px-4 bg-gray-50 dark:bg-[#111] border border-transparent rounded-xl focus:border-frog-green outline-none"
               />
            </div>

            <div>
               <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Bio</label>
               <textarea 
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  className="w-full p-4 h-32 bg-gray-50 dark:bg-[#111] border border-transparent rounded-xl focus:border-frog-green outline-none resize-none"
                  maxLength={200}
               />
               <p className="text-right text-xs text-gray-500 mt-1">{formData.bio?.length || 0}/200</p>
            </div>
            
            <div>
               <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Location</label>
               <div className="relative">
                  <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                     type="text" 
                     value={formData.location}
                     onChange={(e) => handleChange('location', e.target.value)}
                     className="w-full h-12 pl-10 pr-4 bg-gray-50 dark:bg-[#111] border border-transparent rounded-xl focus:border-frog-green outline-none"
                  />
               </div>
            </div>

            <div className="pt-4 flex gap-3">
               <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
               <Button onClick={handleSave} className="flex-1">Save Changes</Button>
            </div>
         </div>
      </Modal>
   );
};
