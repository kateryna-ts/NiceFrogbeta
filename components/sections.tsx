
import React, { useEffect, useRef, useState } from 'react';
import { 
  Radar, MapPin, Tag, Check, X, Heart, Star, Filter, ArrowRight,
  Home, ShoppingBag, Car, Utensils, Briefcase, MessageCircle, 
  Wallet, Plus, Minus, ShoppingCart, Package, HelpCircle, Lock, Shield,
  Search, Bluetooth, User, EyeOff, Zap, ChevronDown, Bell,
  CreditCard, Smartphone, Bitcoin, CheckCircle, Layout, Eye
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Listing, ListingType } from '../types';
import { DATING_PROFILES, TEAM, TOKEN_DISTRIBUTION, STICKER_PRODUCTS, MOCK_LISTINGS } from '../constants';
import { Button, Card, Badge, SectionHeader, Slider, Switch, Modal } from './ui';
import { PhoneConfig, notifyNewMessage } from './sms';

// --- ANIMATION HOOK ---
const useIntersectionObserver = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

const FadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const { ref, isVisible } = useIntersectionObserver();
  return (
    <div 
      ref={ref} 
      className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- HERO SECTION ---
const HeroSection: React.FC<{ onSignUp: () => void }> = ({ onSignUp }) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-frog-dark overflow-hidden pt-20">
      {/* Animated Background Radar */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="w-[600px] h-[600px] border border-frog-green rounded-full animate-ping-slow"></div>
        <div className="absolute w-[400px] h-[400px] border border-frog-green rounded-full animate-ping-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-[200px] h-[200px] border border-frog-green rounded-full animate-ping-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Orbiting Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 animate-float text-frog-green/40"><Home size={32} /></div>
        <div className="absolute top-1/3 right-1/4 animate-float text-frog-green/40" style={{ animationDelay: '1s' }}><Car size={32} /></div>
        <div className="absolute bottom-1/3 left-1/3 animate-float text-frog-green/40" style={{ animationDelay: '2s' }}><Briefcase size={32} /></div>
        <div className="absolute bottom-1/4 right-1/3 animate-float text-frog-green/40" style={{ animationDelay: '3s' }}><Heart size={32} /></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-[-50px]">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-frog-green/10 border border-frog-green/20 text-frog-green text-sm font-bold uppercase tracking-widest mb-8 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-frog-green animate-pulse"></span>
          Now in Beta - Real-Time BLE Marketplace
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-tight mb-8 leading-[1.1] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          Your World.<br />
          Right Here.<br />
          <span className="text-frog-green">Right Now.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          NiceFrog connects you to the people, places, and deals within 100 meters — without tracking you globally.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <Button size="lg" onClick={onSignUp} className="min-w-[200px] text-lg h-16">
            Get Early Access
          </Button>
          <Button size="lg" variant="outline" className="min-w-[200px] text-lg h-16 border-white/20 text-white hover:bg-white/10">
            See How It Works
          </Button>
        </div>
      </div>

      {/* Live Ticker */}
      <div className="absolute bottom-0 w-full bg-black/20 backdrop-blur-sm border-t border-white/5 py-3 overflow-hidden">
        <div className="whitespace-nowrap animate-marquee flex gap-12 items-center text-sm font-medium text-frog-green">
          <span>🛋️ Sarah listed a 2BR apartment 43m away</span>
          <span>🚗 Mike is selling a Tesla Model 3 12m away</span>
          <span>☕ Cafe Lux posted a 'Free Coffee' alert 85m away</span>
          <span>💼 New Job: Barista at Joe's (50m)</span>
          <span>❤️ 3 people matched nearby</span>
        </div>
        <style>{`
          .animate-marquee { animation: marquee 40s linear infinite; }
          @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        `}</style>
      </div>
    </section>
  );
};

// --- EMPATHY SECTION ---
const EmpathySection: React.FC = () => (
  <section className="py-32 bg-frog-bg" id="problem">
    <div className="container mx-auto px-6 max-w-7xl">
      <SectionHeader title="The World Has Never Been More Connected — Or More Alone." subtitle="THE PROBLEM" />
      
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { quote: "I sat 20 feet from someone I felt drawn to. I opened Hinge instead.", name: "Marcus", role: "Urban Professional, 29", type: "Problem Aware" },
          { quote: "My app pinged my GPS 84 times today. While it was closed.", name: "Chloe", role: "UX Designer, 31", type: "Solution Aware" },
          { quote: "The perfect renter walked past my listing. Neither of us knew.", name: "Julian", role: "Real Estate Agent, 34", type: "Product Aware" }
        ].map((card, i) => (
          <FadeIn key={i} delay={i * 100}>
            <div className="bg-white p-10 rounded-2xl shadow-sm border-l-4 border-frog-green h-full flex flex-col justify-between hover:shadow-md transition-shadow">
              <p className="text-2xl font-serif italic text-gray-700 mb-8 leading-relaxed">"{card.quote}"</p>
              <div>
                <p className="font-bold text-frog-dark text-lg">{card.name}</p>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">{card.role}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

// --- HOW IT WORKS ---
const HowItWorksSection: React.FC = () => (
  <section className="py-32 bg-frog-dark relative overflow-hidden" id="how-it-works">
    <div className="container mx-auto px-6 max-w-7xl relative z-10">
      <SectionHeader title="Three Steps. One Hundred Meters. Infinite Possibilities." subtitle="SEAMLESS FLOW" dark />
      
      <div className="grid md:grid-cols-3 gap-12 relative">
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-white/10 z-0"></div>

        {[
          { icon: Tag, title: "Tag It", desc: "Attach a BLE Beacon or QRL Code to any object — a car, an apartment, a storefront." },
          { icon: Radar, title: "Walk By", desc: "Nearby users receive silent, encrypted alerts on their phone. No account needed to browse." },
          { icon: MessageCircle, title: "Connect", desc: "Negotiate and meet face-to-face. Profiles vanish when you leave. Your data stays yours." }
        ].map((step, i) => (
          <FadeIn key={i} delay={i * 200}>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-frog-dark border border-frog-green/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                <step.icon size={32} className="text-frog-green" />
              </div>
              <div className="absolute top-0 right-10 md:right-20 text-8xl font-bold text-white/5 -z-10 select-none">0{i + 1}</div>
              <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed text-lg">{step.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

// --- USE CASES ---
const UseCasesSection: React.FC = () => (
  <section className="py-32 bg-white" id="use-cases">
    <div className="container mx-auto px-6 max-w-7xl">
      <SectionHeader title="One Platform. Every Corner of Your City." subtitle="WHERE NICEFROG LEAPS" />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: Home, title: "Real Estate", desc: "Walk past a listing and instantly see virtual tour, price, and agent contact. No cold calls." },
          { icon: Heart, title: "Dating", desc: "Meet people who are actually near you, right now. Profiles appear only when you are close." },
          { icon: ShoppingBag, title: "Retail & Shopping", desc: "Flash sales broadcast to pedestrians within 100 meters in real time. No algorithms." },
          { icon: Car, title: "Vehicles", desc: "Park it. Tag it. Buyers come to you. Sell your car without a single Craigslist scammer." },
          { icon: Briefcase, title: "Jobs", desc: "A restaurant posts a vacancy. You walk by. You get the alert. Local hiring, frictionless." },
          { icon: User, title: "Events", desc: "Walk into a venue. See who shares your interests in the same room. No awkward cold approaches." }
        ].map((item, i) => (
          <FadeIn key={i} delay={i * 50}>
            <div className="group p-8 rounded-2xl bg-frog-bg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
              <div className="w-12 h-12 rounded-xl bg-frog-green/10 flex items-center justify-center text-frog-forest mb-6 group-hover:scale-110 transition-transform">
                <item.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-frog-dark mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

// --- PRIVACY SECTION ---
const PrivacySection: React.FC = () => (
  <section className="py-32 bg-[#f0fdf4]" id="privacy">
    <div className="container mx-auto px-6 max-w-7xl">
      <SectionHeader title="Your Data Is Not Our Product." subtitle="PRIVACY FIRST" />
      
      <div className="text-center max-w-3xl mx-auto mb-16">
        <p className="text-xl text-gray-600">
          In a world where your GPS is pinged 84 times a day while your apps are closed, NiceFrog is different by design.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {[
          { icon: Shield, title: "End-to-End Encrypted", desc: "All communications are encrypted. No one — including us — can read your messages." },
          { icon: EyeOff, title: "Ephemeral Profiles", desc: "Profiles exist only in proximity. When you leave, they vanish. No permanent footprint." },
          { icon: Lock, title: "No Global GPS Tracking", desc: "We use BLE, not GPS. Your phone pings locally — not a data center across the country." },
          { icon: User, title: "You Own Your Data", desc: "We do not sell, share, or monetize your personal data to third parties. Ever." }
        ].map((item, i) => (
          <FadeIn key={i} delay={i * 100}>
            <div className="flex gap-6 p-8 bg-white rounded-2xl shadow-sm border border-frog-green/10">
              <div className="shrink-0 w-14 h-14 rounded-full bg-frog-green/10 flex items-center justify-center text-frog-green">
                <item.icon size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-frog-dark mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={400}>
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-serif italic text-frog-forest font-medium">
            "NiceFrog is the only local marketplace that treats your data as your sovereign property."
          </h3>
        </div>
      </FadeIn>
    </div>
  </section>
);

// --- MARKET SECTION ---
const MarketSection: React.FC = () => (
  <section className="py-32 bg-frog-dark" id="market">
    <div className="container mx-auto px-6 max-w-7xl">
      <SectionHeader title="A $126.69 Billion Market. And No One Is Doing This." subtitle="THE OPPORTUNITY" dark />
      
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {[
          { val: "$126.69B", label: "Global Location-Based Services Market by 2028" },
          { val: "21.6%", label: "Projected CAGR 2025–2034" },
          { val: "79%", label: "Americans concerned about how companies use their data" }
        ].map((stat, i) => (
          <FadeIn key={i} delay={i * 100}>
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="text-4xl md:text-5xl font-bold text-frog-green mb-4">{stat.val}</div>
              <div className="text-gray-400 font-medium">{stat.label}</div>
            </div>
          </FadeIn>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {[
          { name: "Shopkick", desc: "Acquired for $200M after 4 years. 8M users. Similar BLE/QR technology." },
          { name: "Zenly", desc: "Acquired by Snapchat for $250-350M after 2.5 years. 4M downloads." }
        ].map((comp, i) => (
          <FadeIn key={i} delay={300 + (i * 100)}>
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <h4 className="text-xl font-bold text-white mb-2">{comp.name}</h4>
              <p className="text-gray-400">{comp.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
      
      <div className="text-center mt-8 text-frog-green font-bold uppercase tracking-widest text-sm animate-pulse">
        NiceFrog believes it is positioned leagues ahead of both.
      </div>
    </div>
  </section>
);

// --- INVESTOR CTA ---
const InvestorSection: React.FC = () => (
  <section className="py-32 bg-white" id="investors">
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="bg-frog-bg rounded-[3rem] p-12 md:p-24 border border-gray-200 text-center">
        <div className="inline-block px-4 py-1 rounded-full bg-frog-dark text-white text-xs font-bold uppercase tracking-widest mb-8">Seed Round</div>
        <h2 className="text-5xl md:text-7xl font-bold text-frog-dark mb-6 tracking-tight">We Are Raising $1,000,000.</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
          Join the last-mile financing round for a proximity platform that bridges the physical and digital worlds — with ironclad privacy at its core.
        </p>

        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-12">
          <h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-6 text-left">Use of Funds</h4>
          <div className="space-y-4">
            {[
              { label: "Product Development", pct: "40%" },
              { label: "Sales & Marketing", pct: "30%" },
              { label: "Operations", pct: "20%" },
              { label: "Privacy & Encryption", pct: "10%" }
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-frog-green h-full rounded-full" style={{ width: row.pct }}></div>
                </div>
                <span className="font-bold text-frog-dark w-12 text-right">{row.pct}</span>
                <span className="text-sm text-gray-500 w-40 text-left">{row.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button size="lg" className="text-lg h-16 px-10">Request Investment Deck</Button>
          <Button size="lg" variant="outline" className="text-lg h-16 px-10 border-gray-300 text-gray-700 hover:bg-gray-50">Schedule a Call</Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          {TEAM.map((founder, i) => (
            <div key={i} className="flex gap-4 items-center">
              <img src={founder.image} className="w-16 h-16 rounded-full object-cover border border-gray-200" />
              <div>
                <h5 className="font-bold text-frog-dark">{founder.name}</h5>
                <p className="text-sm text-gray-500 line-clamp-2">{founder.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// --- FOOTER ---
const Footer: React.FC = () => (
  <footer className="bg-frog-dark py-20 border-t border-white/5">
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="grid md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🐸</span>
            <span className="text-xl font-bold text-white">nicefrog</span>
          </div>
          <p className="text-gray-500 text-sm">Where Your World and the Internet Collide.</p>
        </div>
        
        {[
          { head: "Product", links: ["Features", "Pricing", "Hardware", "Download"] },
          { head: "Use Cases", links: ["Real Estate", "Retail", "Events", "Dating"] },
          { head: "Company", links: ["About", "Careers", "Blog", "Contact"] }
        ].map((col, i) => (
          <div key={i}>
            <h4 className="font-bold text-white mb-6">{col.head}</h4>
            <ul className="space-y-4">
              {col.links.map(l => (
                <li key={l}><a href="#" className="text-gray-500 hover:text-frog-green transition-colors text-sm">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-600 text-sm">© 2025 NiceFrog Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="text-gray-600 hover:text-white text-sm">Privacy Policy</a>
          <a href="#" className="text-gray-600 hover:text-white text-sm">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

// --- MAIN PUBLIC PAGE COMPONENT ---
export const PublicLandingPage: React.FC<{ onSignUp: () => void; onLogin: () => void }> = ({ onSignUp, onLogin }) => {
  return (
    <div className="font-sans bg-white text-frog-dark selection:bg-frog-green/30">
      <HeroSection onSignUp={onSignUp} />
      <EmpathySection />
      <HowItWorksSection />
      <UseCasesSection />
      <PrivacySection />
      <MarketSection />
      <InvestorSection />
      <Footer />
    </div>
  );
};

// --- AUTHENTICATED VIEWS (Placeholder / Minimal Update) ---
// Keeping these simple but compatible with new types to avoid breaking the app
export const AuthenticatedHomeFeed: React.FC<{ user: any; onNavigate: any; onSell: any; showProximityNudge?: boolean; onSetupAlerts?: () => void }> = ({ user, onNavigate, onSell, showProximityNudge, onSetupAlerts }) => {
  const [dismissed, setDismissed] = useState(false);

  return (
    <div className="pt-32 pb-12 container mx-auto px-6 max-w-7xl min-h-screen">
      <SectionHeader title={`Welcome back, ${user.firstName}`} subtitle="Your local feed is active." />
      
      {showProximityNudge && !dismissed && (
        <div className="mb-12 bg-frog-green/5 border border-frog-green/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-frog-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-full bg-frog-green/10 flex items-center justify-center text-frog-green shrink-0 relative">
              <Bell size={32} />
              <span className="absolute top-3 right-4 w-3 h-3 bg-frog-green rounded-full animate-ping" />
              <span className="absolute top-3 right-4 w-3 h-3 bg-frog-green rounded-full border-2 border-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-frog-dark mb-1">Set Up Proximity Alerts</h3>
              <p className="text-gray-600 max-w-lg">Get notified when someone you'd want to meet or buy from walks by. Customize your radius and interests.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
             <Button onClick={onSetupAlerts} className="w-full md:w-auto whitespace-nowrap">Set Alerts</Button>
             <button 
               onClick={() => setDismissed(true)} 
               className="p-2 hover:bg-frog-green/10 rounded-full text-gray-400 hover:text-frog-forest transition-colors"
               aria-label="Dismiss"
             >
               <X size={20} />
             </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover:border-frog-green cursor-pointer group transition-all" onClick={() => onNavigate('MARKETPLACE')}>
          <div className="w-12 h-12 rounded-xl bg-frog-green/10 flex items-center justify-center text-frog-forest mb-4 group-hover:scale-110 transition-transform">
            <ShoppingBag size={24} />
          </div>
          <h3 className="font-bold text-lg mb-1 group-hover:text-frog-green transition-colors">Marketplace</h3>
          <p className="text-gray-500 text-sm">Browse items nearby</p>
        </Card>
        
        <Card className="p-6 hover:border-frog-green cursor-pointer group transition-all" onClick={() => onNavigate('DATING')}>
          <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 mb-4 group-hover:scale-110 transition-transform">
            <Heart size={24} />
          </div>
          <h3 className="font-bold text-lg mb-1 group-hover:text-pink-500 transition-colors">Dating</h3>
          <p className="text-gray-500 text-sm">Meet people nearby</p>
        </Card>
        
        <Card className="p-6 hover:border-frog-green cursor-pointer group transition-all" onClick={onSell}>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
            <Plus size={24} />
          </div>
          <h3 className="font-bold text-lg mb-1 group-hover:text-blue-500 transition-colors">Sell Item</h3>
          <p className="text-gray-500 text-sm">List something for sale</p>
        </Card>

        <Card className="p-6 hover:border-frog-green cursor-pointer group transition-all" onClick={onSetupAlerts}>
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 mb-4 group-hover:scale-110 transition-transform">
            <Bell size={24} />
          </div>
          <h3 className="font-bold text-lg mb-1 group-hover:text-orange-500 transition-colors">Alerts</h3>
          <p className="text-gray-500 text-sm">Manage notifications</p>
        </Card>
      </div>
    </div>
  );
};

export const MarketplaceView: React.FC<{ listings: Listing[]; openDetail: any; onPostListing: any }> = ({ listings, openDetail, onPostListing }) => (
  <div className="pt-32 pb-12 container mx-auto px-6 max-w-7xl min-h-screen">
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-bold">Marketplace</h2>
      <Button onClick={onPostListing}><Plus size={18} /> Post Listing</Button>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {listings.map(l => (
        <Card key={l.id} onClick={() => openDetail(l)} className="group cursor-pointer">
          <div className="aspect-video bg-gray-100 relative overflow-hidden">
            {l.image ? <img src={l.image} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200" />}
            <div className="absolute top-4 right-4"><Badge>{l.distance}</Badge></div>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg line-clamp-1">{l.title}</h3>
              <span className="font-bold text-frog-green">{l.price}</span>
            </div>
            <p className="text-gray-500 text-sm line-clamp-2">{l.description}</p>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export const DatingView: React.FC<{ phoneConfig?: PhoneConfig }> = ({ phoneConfig }) => {
  const [profileIndex, setProfileIndex] = useState(0);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<{id: number, sender: string, text: string, time: string}[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const PROFILES = [
    { id: 1, name: 'Sarah', age: 28, role: 'Startup Founder', location: 'Same Room', quote: '"Looking for someone to discuss startups with."', gradient: 'from-pink-500 to-purple-600', interests: ['Startups', 'Coffee', 'Yoga', 'Tech'] },
    { id: 2, name: 'Marcus', age: 31, role: 'Architect', location: '12m away', quote: '"Love great design, coffee, and deep conversations."', gradient: 'from-blue-500 to-teal-600', interests: ['Design', 'Architecture', 'Coffee', 'Travel'] },
    { id: 3, name: 'Priya', age: 26, role: 'UX Designer', location: 'Same Room', quote: '"Here for networking and maybe more."', gradient: 'from-orange-400 to-pink-500', interests: ['UX', 'Figma', 'Pilates', 'Startups'] },
    { id: 4, name: 'James', age: 34, role: 'Real Estate', location: '45m away', quote: '"Just listed a property. Also single."', gradient: 'from-green-500 to-emerald-600', interests: ['Real Estate', 'Tennis', 'Wine', 'Travel'] },
  ];

  const currentProfile = PROFILES[profileIndex];

  // Reset chat when profile changes
  useEffect(() => {
    const initialMsg = `Hey! I'm ${currentProfile.name}. Nice to meet you 👋`;
    setChatMessages([{ id: 1, sender: 'them', text: initialMsg, time: 'now' }]);
    
    // Simulate receiving a message (which triggers SMS if configured)
    // We only trigger this if it's a "new" interaction for demo purposes
    if (phoneConfig?.notifyOnMessage) {
      // In a real app, this would be triggered by a socket event
      // notifyNewMessage(phoneConfig, currentProfile.name, initialMsg);
    }
  }, [profileIndex, phoneConfig]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, showChatModal]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowChatModal(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setChatMessages(prev => [...prev, { id: Date.now(), sender: 'me', text: newMessage.trim(), time: 'now' }]);
    setNewMessage('');
    
    // Simulate a reply after 3 seconds
    setTimeout(() => {
      const replyText = "That's interesting! Tell me more.";
      setChatMessages(prev => [...prev, { id: Date.now(), sender: 'them', text: replyText, time: 'now' }]);
      if (phoneConfig) {
        notifyNewMessage(phoneConfig, currentProfile.name, replyText);
      }
    }, 3000);
  };

  return (
    <div className="pt-32 pb-12 container mx-auto px-6 max-w-md min-h-screen">
      <SectionHeader title="Nearby" subtitle="Profiles vanish when you leave." />
      
      <div className="relative h-[560px] w-full mb-8">
        <Card className="absolute inset-0 flex flex-col overflow-hidden shadow-2xl border-0 rounded-3xl">
          {/* Profile Card Content */}
          <div className={`h-full w-full bg-gradient-to-br ${currentProfile.gradient} relative p-8 flex flex-col justify-end text-white`}>
            
            {/* Header / Counter */}
            <div className="absolute top-6 left-0 w-full text-center">
              <span className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                {profileIndex + 1} of {PROFILES.length} nearby
              </span>
            </div>

            {/* Navigation Arrows */}
            <button 
              onClick={() => setProfileIndex((prev) => (prev - 1 + PROFILES.length) % PROFILES.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all"
            >
              <ArrowRight className="rotate-180" size={24} />
            </button>
            <button 
              onClick={() => setProfileIndex((prev) => (prev + 1) % PROFILES.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all"
            >
              <ArrowRight size={24} />
            </button>

            {/* Initial Letter */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[180px] font-bold opacity-20 select-none">
              {currentProfile.name[0]}
            </div>

            {/* Profile Info */}
            <div className="relative z-10">
              <div className="flex items-end gap-3 mb-2">
                <h2 className="text-4xl font-bold">{currentProfile.name}</h2>
                <span className="text-2xl font-medium opacity-90 mb-1">{currentProfile.age}</span>
              </div>
              <p className="text-lg font-medium opacity-90 mb-4 flex items-center gap-2">
                <Briefcase size={18} /> {currentProfile.role}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {currentProfile.interests.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="bg-black/20 backdrop-blur-md p-4 rounded-xl border border-white/10">
                <p className="font-serif italic text-lg leading-relaxed opacity-90">{currentProfile.quote}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-6 mt-6">
        {/* Pass */}
        <button 
          onClick={() => setProfileIndex((profileIndex + 1) % PROFILES.length)} 
          className="w-16 h-16 rounded-full border-2 border-red-100 bg-white flex items-center justify-center shadow-lg hover:shadow-xl hover:border-red-400 hover:scale-110 transition-all group"
        >
          <X className="text-red-400 group-hover:text-red-500" size={32} />
        </button>
        
        {/* Message - primary */}
        <button 
          onClick={() => setShowChatModal(true)} 
          className="w-20 h-20 rounded-full bg-gradient-to-br from-frog-green to-frog-greenDark flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all group"
        >
          <MessageCircle className="text-white group-hover:scale-110 transition-transform" size={36} />
        </button>
        
        {/* Super Like */}
        <button className="w-16 h-16 rounded-full border-2 border-yellow-100 bg-white flex items-center justify-center shadow-lg hover:shadow-xl hover:border-yellow-400 hover:scale-110 transition-all group">
          <Star className="text-yellow-400 group-hover:text-yellow-500" size={32} />
        </button>
      </div>
      <p className="text-center text-gray-400 text-xs mt-4 font-medium">2 NFC to message • 5 NFC to Super Like</p>

      {/* Chat Modal */}
      <Modal isOpen={showChatModal} onClose={() => setShowChatModal(false)} title={currentProfile.name}>
        <div className="flex flex-col h-[500px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white rounded-xl border border-gray-100 mb-4">
            {chatMessages.map(msg => (
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
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex gap-2 items-center border-t pt-3"
          >
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Say something nice..."
              className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-frog-green transition-colors"
              autoFocus
            />
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="w-9 h-9 rounded-full bg-frog-green text-white flex items-center justify-center hover:bg-frog-greenDark disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

// --- TOKENS VIEW ---
interface TokenPackage {
  id: string;
  name: string;
  tokens: number;
  price: number;
  tag?: string;
  badge?: string;
  popular?: boolean;
}

const TOKEN_PACKAGES: TokenPackage[] = [
  { id: 'starter', name: 'Starter', tokens: 100, price: 0.99 },
  { id: 'popular', name: 'Popular', tokens: 500, price: 3.99, tag: 'Most Popular', popular: true },
  { id: 'pro', name: 'Pro', tokens: 1200, price: 7.99, tag: 'Best Value', badge: 'Save 33%' },
  { id: 'elite', name: 'Elite', tokens: 3000, price: 17.99, tag: 'Power User' }
];

const TOKEN_BENEFITS = [
  { icon: Zap, label: 'Boost Profile', cost: '50', desc: 'Show at top of feed for 24h' },
  { icon: Star, label: 'Super Like', cost: '10', desc: 'Stand out with gold highlight' },
  { icon: Layout, label: 'Feature Listing', cost: '30', desc: 'Pin item to top of market' },
  { icon: Eye, label: 'See Visitors', cost: '25', desc: 'Unlock profile visitors' }
];

export const BuyTokensView: React.FC = () => {
  const [tokenBalance, setTokenBalance] = useState(847);
  const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState<'summary' | 'payment' | 'success'>('summary');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'crypto'>('card');

  const handleBuyClick = () => {
    if (selectedPackage) {
      setPurchaseStep('summary');
      setShowBuyModal(true);
    }
  };

  const handleCompletePurchase = () => {
    // Simulate processing
    setTimeout(() => {
      setPurchaseStep('success');
      if (selectedPackage) {
        setTokenBalance(prev => prev + selectedPackage.tokens);
      }
    }, 1500);
  };

  const handleCloseModal = () => {
    setShowBuyModal(false);
    setSelectedPackage(null);
    setPurchaseStep('summary');
  };

  return (
    <div className="pt-32 pb-12 container mx-auto px-6 max-w-6xl min-h-screen">
      {/* Confetti Styles */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-100%) rotate(0deg); opacity: 1; }
          100% { transform: translateY(600px) rotate(720deg); opacity: 0; }
        }
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          background: #22c55e;
          animation: fall 3s linear forwards;
        }
      `}</style>

      {/* Hero Header */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-4 animate-bounce-slow">🐸</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-frog-dark mb-4">NiceFrog Tokens</h1>
        <p className="text-xl text-gray-500">Power up your presence in the local mesh.</p>
      </div>

      {/* Balance Card */}
      <div className="max-w-md mx-auto mb-16">
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <p className="text-emerald-100 font-medium mb-2 uppercase tracking-wider text-sm">Current Balance</p>
          <div className="text-5xl font-bold flex items-center gap-3">
            <span className="text-3xl opacity-80">🐸</span>
            {tokenBalance.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Benefits Row */}
      <div className="mb-16">
        <h3 className="text-lg font-bold text-gray-900 mb-6 px-2">What can you do?</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
          {TOKEN_BENEFITS.map((b, i) => (
            <div key={i} className="min-w-[200px] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3 snap-center">
              <div className="w-10 h-10 rounded-full bg-frog-green/10 flex items-center justify-center text-frog-green">
                <b.icon size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{b.label}</h4>
                <p className="text-xs text-gray-500 leading-tight mt-1">{b.desc}</p>
              </div>
              <div className="mt-auto pt-3 border-t border-gray-50 text-sm font-bold text-frog-green">
                {b.cost} Tokens
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {TOKEN_PACKAGES.map((pkg) => {
          const isSelected = selectedPackage?.id === pkg.id;
          return (
            <div 
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg)}
              className={`relative bg-white rounded-2xl p-6 cursor-pointer transition-all duration-200 border-2 flex flex-col items-center text-center ${
                isSelected 
                  ? 'border-frog-green shadow-lg scale-105 z-10' 
                  : 'border-transparent hover:border-gray-200 shadow-sm'
              }`}
            >
              {pkg.tag && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide text-white shadow-sm ${
                  pkg.popular ? 'bg-frog-green' : 'bg-gray-800'
                }`}>
                  {pkg.tag}
                </div>
              )}
              {pkg.badge && (
                <div className="absolute top-2 right-2 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {pkg.badge}
                </div>
              )}
              
              <div className="mt-4 mb-2 text-3xl font-black text-gray-900 flex items-center gap-1">
                <span className="text-xl">🐸</span>{pkg.tokens}
              </div>
              <h3 className="font-bold text-gray-500 text-sm mb-4">{pkg.name}</h3>
              <div className="mt-auto text-xl font-bold text-frog-dark">
                ${pkg.price}
              </div>
              
              {isSelected && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-frog-green rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm">
                  <Check size={14} strokeWidth={3} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Buy Action */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 md:static md:bg-transparent md:border-0 md:p-0 mt-8">
        <div className="max-w-md mx-auto md:max-w-none md:flex md:justify-center">
          <Button 
            size="lg" 
            onClick={handleBuyClick}
            disabled={!selectedPackage}
            className={`w-full md:w-auto md:min-w-[300px] h-14 text-lg shadow-xl transition-all ${
              selectedPackage ? 'bg-frog-green hover:bg-frog-greenDark text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {selectedPackage ? `Buy ${selectedPackage.tokens} Tokens - $${selectedPackage.price}` : 'Select a Package'}
          </Button>
        </div>
      </div>

      {/* PURCHASE MODAL */}
      {showBuyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* Header / Steps */}
            <div className="bg-gray-50 p-6 border-b border-gray-100">
              <div className="flex justify-center gap-2 mb-4">
                {['summary', 'payment', 'success'].map((s, i) => {
                  const stepIdx = ['summary', 'payment', 'success'].indexOf(s);
                  const currentIdx = ['summary', 'payment', 'success'].indexOf(purchaseStep);
                  return (
                    <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${
                      stepIdx <= currentIdx ? 'w-8 bg-frog-green' : 'w-2 bg-gray-200'
                    }`} />
                  );
                })}
              </div>
              <h3 className="text-center font-bold text-xl text-gray-900">
                {purchaseStep === 'summary' && 'Order Summary'}
                {purchaseStep === 'payment' && 'Payment Method'}
                {purchaseStep === 'success' && 'Purchase Complete'}
              </h3>
            </div>

            <div className="p-6">
              {/* STEP 1: SUMMARY */}
              {purchaseStep === 'summary' && selectedPackage && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-frog-green/5 rounded-2xl border border-frog-green/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">🐸</div>
                      <div>
                        <p className="font-bold text-gray-900">{selectedPackage.name} Package</p>
                        <p className="text-sm text-gray-500">{selectedPackage.tokens} Tokens</p>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-frog-dark">${selectedPackage.price}</div>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Subtotal</span>
                      <span>${selectedPackage.price}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Tax</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                      <span>Total</span>
                      <span>${selectedPackage.price}</span>
                    </div>
                  </div>

                  <Button onClick={() => setPurchaseStep('payment')} className="w-full h-12 text-lg">
                    Continue to Payment
                  </Button>
                </div>
              )}

              {/* STEP 2: PAYMENT */}
              {purchaseStep === 'payment' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'card', icon: CreditCard, label: 'Card' },
                      { id: 'apple', icon: Smartphone, label: 'Apple Pay' },
                      { id: 'crypto', icon: Bitcoin, label: 'Crypto' }
                    ].map(m => (
                      <button
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                          paymentMethod === m.id 
                            ? 'border-frog-green bg-frog-green/5 text-frog-green' 
                            : 'border-gray-100 hover:border-gray-200 text-gray-400'
                        }`}
                      >
                        <m.icon size={24} />
                        <span className="text-xs font-bold">{m.label}</span>
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                        <input type="text" placeholder="4242 4242 4242 4242" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono" readOnly />
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" placeholder="MM/YY" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm" readOnly />
                          <input type="text" placeholder="CVV" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm" readOnly />
                        </div>
                        <input type="text" placeholder="Name on Card" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm" readOnly />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'apple' && (
                    <div className="py-8 animate-in fade-in slide-in-from-bottom-2">
                      <button className="w-full h-12 bg-black text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                        <Smartphone size={20} /> Pay with Apple Pay
                      </button>
                    </div>
                  )}

                  {paymentMethod === 'crypto' && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center animate-in fade-in slide-in-from-bottom-2">
                      <p className="text-xs text-gray-500 mb-2">Send ETH to:</p>
                      <p className="font-mono text-xs bg-white p-2 rounded border border-gray-200 break-all">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</p>
                    </div>
                  )}

                  <Button onClick={handleCompletePurchase} className="w-full h-12 text-lg bg-frog-green hover:bg-frog-greenDark">
                    Complete Purchase
                  </Button>
                </div>
              )}

              {/* STEP 3: SUCCESS */}
              {purchaseStep === 'success' && (
                <div className="text-center py-8 animate-in zoom-in-95">
                  <div className="relative inline-block mb-6">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-frog-green mx-auto">
                      <CheckCircle size={48} />
                    </div>
                    {/* Confetti Elements */}
                    {[...Array(20)].map((_, i) => (
                      <div 
                        key={i} 
                        className="confetti"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          backgroundColor: ['#22c55e', '#3b82f6', '#eab308', '#ec4899'][Math.floor(Math.random() * 4)],
                          animationDelay: `${Math.random() * 0.5}s`,
                          animationDuration: `${1 + Math.random() * 2}s`
                        }}
                      />
                    ))}
                  </div>
                  
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Purchase Complete!</h2>
                  <p className="text-gray-500 mb-8">You've added <span className="font-bold text-frog-dark">{selectedPackage?.tokens} tokens</span> to your wallet.</p>
                  
                  <div className="bg-gray-50 rounded-2xl p-4 mb-8">
                    <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">New Balance</p>
                    <div className="text-3xl font-bold text-frog-green flex items-center justify-center gap-2">
                      <span>🐸</span> {tokenBalance.toLocaleString()}
                    </div>
                  </div>

                  <Button onClick={handleCloseModal} className="w-full h-12 text-lg">
                    Done
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const BuyStickersView: React.FC = () => (
  <div className="pt-32 pb-12 container mx-auto px-6 max-w-6xl min-h-screen">
    <SectionHeader title="Get Beacons" subtitle="Hardware to power your listings." />
    <div className="grid md:grid-cols-3 gap-8">
      {STICKER_PRODUCTS.map(p => (
        <Card key={p.id} className="p-8 flex flex-col">
          <h3 className="text-xl font-bold mb-2">{p.name}</h3>
          <div className="text-3xl font-bold text-frog-green mb-6">${p.price}</div>
          <ul className="space-y-3 mb-8 flex-1">
            {p.features.map(f => <li key={f} className="flex gap-2 text-sm"><Check size={16} className="text-frog-green" /> {f}</li>)}
          </ul>
          <Button>Add to Cart</Button>
        </Card>
      ))}
    </div>
  </div>
);
