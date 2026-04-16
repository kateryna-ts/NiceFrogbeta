import React, { useEffect, useRef, useState } from 'react';
import { 
  Smartphone, Shield, Zap, Lock, Users, Globe, 
  TrendingUp, Activity, Target, ArrowRight, ChevronRight, EyeOff,
  Heart, Utensils, ShoppingBag, MapPin
} from 'lucide-react';
import { Button, Card } from './ui';

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

const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => {
  const { ref, isVisible } = useIntersectionObserver();
  return (
    <div 
      ref={ref} 
      className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export const InvestorLanding: React.FC<{ onViewDemo: () => void }> = ({ onViewDemo }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="font-sans bg-white text-frog-dark selection:bg-frog-green/30 min-h-screen">
      
      {/* --- STICKY NAV --- */}
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 h-[80px] flex items-center border-b ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md border-gray-100 shadow-sm' 
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="container mx-auto px-6 max-w-7xl flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
            <span className="text-3xl group-hover:scale-110 transition-transform">🐸</span>
            <span className={`tracking-tight transition-colors ${!isScrolled ? 'text-white' : 'text-frog-forest'}`}>nicefrog</span>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {['Problem', 'Solution', 'AI', 'Traction', 'Market', '$NFT', 'Invest'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`text-sm font-medium transition-colors hover:text-frog-green ${!isScrolled ? 'text-white/80' : 'text-gray-600'}`}
              >
                {item}
              </button>
            ))}
            <a 
              href="mailto:katykiev@me.com?subject=NiceFrog%20Pitch%20Deck%20Request&body=Hi%2C%20I%20would%20like%20to%20request%20the%20NiceFrog%20pitch%20deck"
              className="inline-flex items-center justify-center rounded-full font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-frog-green disabled:opacity-50 disabled:pointer-events-none ring-offset-white bg-frog-green text-white hover:bg-[#1eb053] shadow-lg shadow-frog-green/20 border-0 h-11 px-6 text-base"
            >
              Request Deck
            </a>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center justify-center bg-[#0a1f12] overflow-x-hidden pt-20">
        {/* Animated Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-frog-green/20 rounded-full blur-[120px] opacity-60 animate-pulse"></div>
        
        <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-8 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-frog-green animate-pulse"></span>
              Raising $2.5M Seed
            </div>
          </FadeIn>
          
          <FadeIn delay={100}>
            <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              The Hyperlocal <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-frog-green to-[#4ade80]">
                Commerce Revolution
              </span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={200}>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 font-light">
              NiceFrog is a BLE-first proximity marketplace that connects people within 100 meters. Zero global tracking. Infinite local possibilities.
            </p>
          </FadeIn>
          
          <FadeIn delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-16 px-10 text-lg bg-frog-green hover:bg-[#1eb053] text-white border-0" onClick={onViewDemo}>
                View Live Demo
              </Button>
              <a 
                href="mailto:katykiev@me.com?subject=NiceFrog%20Pitch%20Deck%20Request&body=Hi%2C%20I%20would%20like%20to%20request%20the%20NiceFrog%20pitch%20deck"
                className="inline-flex items-center justify-center rounded-full font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-frog-green disabled:opacity-50 disabled:pointer-events-none ring-offset-white border-2 border-white/30 bg-transparent hover:bg-white/10 text-white h-16 px-10 text-lg"
              >
                Request Pitch Deck
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* --- PROBLEM SECTION --- */}
      <section id="problem" className="py-32 bg-frog-bg">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-20">
            <FadeIn>
              <h2 className="text-5xl font-extrabold tracking-tight text-frog-dark mb-6">3 problems. 1 solution.</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">The current state of local commerce is broken, fragmented, and invasive.</p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Globe size={32} className="text-red-500" />,
                title: "Discovery Gap",
                desc: "People miss incredible deals, connections, and events happening just 50 meters away because they aren't looking at the right app."
              },
              {
                icon: <EyeOff size={32} className="text-red-500" />,
                title: "Privacy Cost",
                desc: "Existing platforms harvest global GPS data, selling user locations to third parties. Users are demanding privacy-first alternatives."
              },
              {
                icon: <Smartphone size={32} className="text-red-500" />,
                title: "Friction Overload",
                desc: "Listing an item or finding a local service takes too many taps, forms, and verifications. The spontaneous economy is stifled."
              }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 100}>
                <Card className="p-8 h-full border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
                  <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* --- SOLUTION SECTION --- */}
      <section id="solution" className="py-32 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-20">
            <FadeIn>
              <h2 className="text-5xl font-extrabold tracking-tight text-frog-dark mb-6">NiceFrog's BLE-First Approach</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">We use Bluetooth Low Energy to create ephemeral, hyper-local networks that respect privacy and enable instant commerce.</p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Activity size={32} className="text-frog-green" />,
                title: "Real-Time Proximity",
                desc: "Connect instantly with users within a 100m radius. No global tracking, just immediate local relevance."
              },
              {
                icon: <Zap size={32} className="text-frog-green" />,
                title: "Instant Listings",
                desc: "Post items, services, or dating profiles in exactly 3 taps. Frictionless entry creates massive liquidity."
              },
              {
                icon: <Shield size={32} className="text-frog-green" />,
                title: "Community Trust",
                desc: "Verified local sellers and end-to-end encrypted messaging ensure safe, reliable, and private transactions."
              }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 100}>
                <Card className="p-8 h-full border-frog-green/20 shadow-lg hover:-translate-y-2 transition-transform duration-300 bg-white">
                  <div className="w-16 h-16 rounded-2xl bg-frog-green/10 flex items-center justify-center mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* --- AI INTELLIGENCE SECTION --- */}
      <section id="ai" className="py-32 bg-[#0a1f12] text-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-20">
            <FadeIn>
              <div className="text-frog-green font-bold uppercase tracking-widest text-sm mb-4">POWERED BY AI</div>
              <h2 className="text-5xl font-extrabold tracking-tight mb-6">
                Your City <span className="text-frog-green">Learns You.</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                NiceFrog's on-device AI builds a private preference profile — no data ever leaves your phone. The more you explore, the smarter your world gets.
              </p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {[
              {
                icon: <Heart size={28} className="text-white" />,
                title: "Dating Match Intelligence",
                desc: "Analyzes your interactions, timing, and proximity patterns to surface compatible people nearby. No swiping. They just appear."
              },
              {
                icon: <Utensils size={28} className="text-white" />,
                title: "Taste & Food Engine",
                desc: "Learns your flavor profiles, dietary habits, and meal timing to recommend the exact food stall 30 meters away you did not know you needed."
              },
              {
                icon: <ShoppingBag size={28} className="text-white" />,
                title: "Hyper-Personal Commerce",
                desc: "Tracks what you browse, save, and buy locally to predict the items and deals you will want before you know you want them."
              },
              {
                icon: <MapPin size={28} className="text-white" />,
                title: "Place & Vibe Matching",
                desc: "Understands your mood, pace, and location history to guide you to spots — cafes, parks, events — tuned to exactly who you are right now."
              }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="bg-[#0d2818] border border-frog-green/20 rounded-2xl p-8 h-full hover:border-frog-green/50 transition-colors group">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-frog-green to-frog-forest flex items-center justify-center mb-6 shadow-lg shadow-frog-green/20 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={400}>
            <div className="max-w-4xl mx-auto bg-white/5 border-l-4 border-frog-green p-8 rounded-r-2xl backdrop-blur-sm">
              <p className="text-lg text-gray-300 italic">
                "Privacy-first AI: all inference runs on-device. NiceFrog never sells, transmits, or stores your preference data on our servers."
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* --- TRACTION / METRICS --- */}
      <section id="traction" className="py-32 bg-[#0a1f12] text-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-16 text-center">By The Numbers</h2>
          </FadeIn>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { value: "2.4M+", label: "LISTINGS" },
              { value: "< 3min", label: "AVG. MATCH TIME" },
              { value: "98.7%", label: "SCAM-FREE RATE" },
              { value: "100m", label: "BLE RADIUS" },
              { value: "Beta Live", label: "STATUS" },
              { value: "$0", label: "DATA SOLD" },
              { value: "3 Taps", label: "TO LIST" }
            ].map((metric, i) => (
              <FadeIn key={i} delay={i * 100} className="h-full">
                <div className="bg-[#0d2818] border border-green-900 rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[120px] h-full">
                  <div className="text-2xl xl:text-3xl font-black tracking-tight text-green-400 whitespace-nowrap mb-2">{metric.value}</div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-green-200/60">{metric.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* --- MARKET OPPORTUNITY --- */}
      <section id="market" className="py-32 bg-frog-bg">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <FadeIn>
                <h2 className="text-5xl font-extrabold tracking-tight text-frog-dark mb-6">Massive Market Opportunity</h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  The local commerce market is vast, but the hyperlocal segment is vastly underserved. NiceFrog is perfectly positioned to capture the spontaneous, proximity-based economy.
                </p>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-frog-dark text-white flex items-center justify-center flex-shrink-0 mt-1">
                      <Globe size={16} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-frog-dark">TAM: $847B</h4>
                      <p className="text-gray-600">Total Addressable Market for Global Local Commerce.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-frog-forest text-white flex items-center justify-center flex-shrink-0 mt-1">
                      <Target size={16} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-frog-dark">SAM: $124B</h4>
                      <p className="text-gray-600">Serviceable Addressable Market for Hyperlocal Services & Goods.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-frog-green text-white flex items-center justify-center flex-shrink-0 mt-1">
                      <TrendingUp size={16} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-frog-dark">SOM: $2.1B</h4>
                      <p className="text-gray-600">Serviceable Obtainable Market (Year 5 Target).</p>
                    </div>
                  </li>
                </ul>
              </FadeIn>
            </div>
            
            <div className="lg:w-1/2 w-full">
              <FadeIn delay={200}>
                <div className="relative w-full aspect-square max-w-md mx-auto">
                  {/* Abstract Chart Representation */}
                  <div className="absolute inset-0 rounded-full border-[40px] border-frog-dark/10"></div>
                  <div className="absolute inset-[40px] rounded-full border-[40px] border-frog-forest/30"></div>
                  <div className="absolute inset-[80px] rounded-full border-[40px] border-frog-green shadow-2xl shadow-frog-green/40 flex items-center justify-center bg-white">
                    <div className="text-center">
                      <div className="text-3xl font-extrabold text-frog-dark">$2.1B</div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">SOM</div>
                    </div>
                  </div>
                  
                  {/* Labels */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full pb-4 text-center">
                    <div className="text-lg font-bold text-frog-dark">TAM $847B</div>
                  </div>
                  <div className="absolute top-[40px] right-0 translate-x-full pl-4 text-left">
                    <div className="text-lg font-bold text-frog-forest">SAM $124B</div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* --- BUSINESS MODEL --- */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-20">
            <FadeIn>
              <h2 className="text-5xl font-extrabold tracking-tight text-frog-dark mb-6">Clear Path to Profitability</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Diversified revenue streams designed for scale and high margins.</p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Transaction Fee",
                value: "2.5%",
                desc: "Taken on all successful marketplace transactions processed through the platform."
              },
              {
                title: "Premium Listings",
                value: "$9.99/mo",
                desc: "Subscription for power sellers: analytics, priority visibility, and unlimited BLE broadcasting."
              },
              {
                title: "Enterprise API",
                value: "Custom",
                desc: "Licensing our proprietary BLE proximity engine to retail and event partners."
              }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 100}>
                <Card className="p-10 h-full border-gray-100 shadow-sm text-center bg-frog-bg/50">
                  <h3 className="text-xl font-bold text-gray-500 mb-4">{item.title}</h3>
                  <div className="text-5xl font-extrabold text-frog-dark mb-6">{item.value}</div>
                  <p className="text-gray-600">{item.desc}</p>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* --- $NFT TOKEN SECTION --- */}
      <section id="$nft" className="py-32 bg-[#0a1f12] text-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-20">
            <FadeIn>
              <h2 className="text-5xl font-extrabold tracking-tight mb-6">The Currency of Smarter Commerce</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">NiceFrogToken ($NFT) powers every transaction, reward, and incentive on the platform.</p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Reduced Fees",
                desc: "Pay with $NFT and save up to 40% on transaction fees."
              },
              {
                title: "Earn by Participating",
                desc: "List items, verify identity, refer friends — every action earns $NFT rewards."
              },
              {
                title: "Premium Access",
                desc: "Hold $NFT to unlock priority listings, advanced analytics, and exclusive features."
              }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="bg-[#0d2818] border border-frog-green/20 rounded-2xl p-8 h-full hover:border-frog-green/50 transition-colors">
                  <h3 className="text-2xl font-bold mb-4 text-white">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* --- SEED ROUND --- */}
      <section id="invest" className="py-32 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <FadeIn>
            <div className="bg-[#0a1f12] rounded-[3rem] p-12 md:p-24 text-center relative overflow-x-hidden shadow-2xl">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-frog-green/20 rounded-full blur-[80px]"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-frog-forest/40 rounded-full blur-[80px]"></div>
              
              <div className="relative z-10">
                <div className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-8">
                  Investment Opportunity
                </div>
                <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">$2.5M Seed Round</h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-16 font-light">
                  We are raising $2.5M to scale our engineering team, launch in 3 major US cities, and reach 100k active users.
                </p>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-16 backdrop-blur-md">
                  <h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-8 text-left">Use of Funds</h4>
                  <div className="space-y-6">
                    {[
                      { label: "Engineering & Product", pct: "40%" },
                      { label: "Growth & Marketing", pct: "30%" },
                      { label: "Operations", pct: "20%" },
                      { label: "Legal & Compliance", pct: "10%" }
                    ].map((row, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                          <div className="bg-frog-green h-full rounded-full" style={{ width: row.pct }}></div>
                        </div>
                        <span className="font-bold text-white w-12 text-right">{row.pct}</span>
                        <span className="text-sm text-gray-400 w-48 text-left">{row.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a 
                  href="mailto:katykiev@me.com?subject=Investor%20Meeting%20Request%20-%20NiceFrog&body=Hi%2C%20I%20am%20interested%20in%20scheduling%20an%20investor%20meeting%20with%20NiceFrog"
                  className="inline-flex items-center justify-center rounded-full font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-frog-green disabled:opacity-50 disabled:pointer-events-none ring-offset-white bg-frog-green hover:bg-[#1eb053] text-white border-0 shadow-lg shadow-frog-green/20 h-16 px-12 text-lg"
                >
                  Schedule Investor Meeting
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-xl text-frog-dark">
            <span className="text-2xl">🐸</span>
            <span className="tracking-tight">nicefrog</span>
          </div>
          <div className="text-sm font-bold text-red-500 uppercase tracking-widest">
            Confidential - Not for Distribution
          </div>
          <div className="text-sm text-gray-400">
            &copy; 2025 NiceFrog Inc. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
};
