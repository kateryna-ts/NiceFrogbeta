import React, { useState, useEffect, useRef } from 'react';
import { Camera, ShoppingBag, Home, Briefcase, User as UserIcon, Heart, Check, X, Plus, ArrowRight } from 'lucide-react';
import { Button, Modal, Badge } from './ui';
import { Listing, ListingType, User } from '../types';
import { PhoneConfig, notifyNewMessage } from './sms';

interface PostListingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onPost: (listing: Listing) => void;
}

export const PostListingWizard: React.FC<PostListingWizardProps> = ({ isOpen, onClose, user, onPost }) => {
  const [step, setStep] = useState(1);
  const [localForm, setLocalForm] = useState({
    title: '', category: ListingType.FOR_SALE, price: '', isFree: false, description: '', image: ''
  });
  const [dragActive, setDragActive] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setLocalForm({ title: '', category: ListingType.FOR_SALE, price: '', isFree: false, description: '', image: '' });
    }
  }, [isOpen]);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const submit = () => {
    const newListing: Listing = {
       id: `new_${Date.now()}`,
       title: localForm.title,
       price: localForm.isFree ? 'FREE' : `$${localForm.price}`,
       description: localForm.description,
       distance: '0m',
       image: localForm.image || 'https://picsum.photos/400/300?random=100',
       type: localForm.category,
       bleActive: true,
       user: user?.username || 'Me'
     };
     onPost(newListing);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Post New Listing">
       <div className="space-y-6">
         {/* Progress Bar */}
         <div className="flex gap-2 mb-6">
           {[1, 2, 3].map(i => (
             <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-frog-green' : 'bg-gray-200'}`} />
           ))}
         </div>

         {/* STEP 1: CATEGORY */}
         {step === 1 && (
           <div className="animate-in fade-in slide-in-from-right-4">
             <h3 className="text-lg font-bold text-center mb-6">What are you listing?</h3>
             <div className="grid grid-cols-2 gap-4">
               {[
                 { id: ListingType.FOR_SALE, icon: ShoppingBag, label: 'Item for Sale' },
                 { id: ListingType.VEHICLES, icon: Camera, label: 'Vehicle' },
                 { id: ListingType.REAL_ESTATE, icon: Home, label: 'Real Estate' },
                 { id: ListingType.SERVICES, icon: Briefcase, label: 'Service' },
                 { id: ListingType.FOR_RENT, icon: UserIcon, label: 'For Rent' },
                 { id: ListingType.FOR_SALE, icon: Heart, label: 'Other' },
               ].map((cat, i) => (
                 <button
                   key={i}
                   onClick={() => { setLocalForm({...localForm, category: cat.id}); handleNext(); }}
                   className={`p-4 rounded-2xl border text-center hover:border-frog-green hover:bg-frog-green/5 transition-all flex flex-col items-center gap-3 ${localForm.category === cat.id ? 'border-frog-green bg-frog-green/10' : 'border-gray-200'}`}
                 >
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center ${localForm.category === cat.id ? 'bg-frog-green text-white' : 'bg-gray-100 text-gray-500'}`}>
                     <cat.icon size={20} />
                   </div>
                   <span className="font-bold text-sm">{cat.label}</span>
                 </button>
               ))}
             </div>
           </div>
         )}

         {/* STEP 2: DETAILS */}
         {step === 2 && (
           <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
             <h3 className="text-lg font-bold text-center mb-6">Tell us about it</h3>
             
             <div>
               <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Title</label>
               <input 
                  type="text" 
                  value={localForm.title}
                  onChange={(e) => setLocalForm({...localForm, title: e.target.value})}
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-frog-green outline-none"
                  placeholder="e.g. Vintage Lamp"
                  autoFocus
               />
             </div>

             <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input 
                      type="number" 
                      value={localForm.price}
                      onChange={(e) => setLocalForm({...localForm, price: e.target.value})}
                      disabled={localForm.isFree}
                      className="w-full h-12 pl-8 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-frog-green outline-none disabled:opacity-50"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="flex items-end pb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div 
                        className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${localForm.isFree ? 'bg-frog-green border-frog-green' : 'border-gray-400'}`}
                        onClick={() => setLocalForm({...localForm, isFree: !localForm.isFree})}
                     >
                        {localForm.isFree && <Check size={16} className="text-white" />}
                     </div>
                     <span className="text-sm font-medium">Free</span>
                  </label>
                </div>
             </div>

             <div>
               <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Description</label>
               <textarea 
                  value={localForm.description}
                  onChange={(e) => setLocalForm({...localForm, description: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-frog-green outline-none resize-none"
                  rows={4}
                  placeholder="Condition, pickup details, etc."
               />
             </div>

             <div className="flex gap-3 pt-4">
               <Button variant="secondary" onClick={handleBack} className="flex-1">Back</Button>
               <Button onClick={handleNext} disabled={!localForm.title} className="flex-1">Next</Button>
             </div>
           </div>
         )}

         {/* STEP 3: PHOTOS */}
         {step === 3 && (
           <div className="animate-in fade-in slide-in-from-right-4">
             <h3 className="text-lg font-bold text-center mb-6">Add Photos</h3>
             
             <div 
               className={`h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-colors ${dragActive ? 'border-frog-green bg-frog-green/5' : 'border-gray-300 hover:border-gray-400'}`}
               onDragEnter={() => setDragActive(true)}
               onDragLeave={() => setDragActive(false)}
               onDrop={(e) => { e.preventDefault(); setDragActive(false); alert("Photo upload simulated!"); }}
             >
               <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                 <Camera size={32} />
               </div>
               <div className="text-center">
                 <p className="font-bold text-gray-700">Drag & drop photos</p>
                 <p className="text-sm text-gray-500">or click to browse</p>
               </div>
               <Button variant="outline" size="sm">Choose Files</Button>
             </div>

             <div className="flex gap-3 pt-8">
               <Button variant="secondary" onClick={handleBack} className="flex-1">Back</Button>
               <Button onClick={submit} className="flex-1">Post Listing</Button>
             </div>
           </div>
         )}
       </div>
    </Modal>
  );
};

interface ListingDetailChatProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing | null;
  user: User | null;
  onAuth: () => void;
  phoneConfig?: PhoneConfig;
}

export const ListingDetailChat: React.FC<ListingDetailChatProps> = ({ isOpen, onClose, listing, user, onAuth, phoneConfig }) => {
  const [showChat, setShowChat] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [messages, setMessages] = useState<{sender: string, text: string}[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reset chat when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setShowChat(false);
      setMessages([
        { sender: 'them', text: 'Hi! Is this still available?' },
        { sender: 'me', text: 'Yes! Can you make an offer?' }
      ]);
    }
  }, [isOpen]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showChat]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowChat(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const sendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMsg.trim()) return;
    
    // Add my message
    const myMsg = chatMsg;
    setMessages(prev => [...prev, { sender: 'me', text: myMsg }]);
    setChatMsg('');
    
    // Simulate reply
    setTimeout(() => {
      const reply = "Thanks for the message! I'm interested.";
      setMessages(prev => [...prev, { sender: 'them', text: reply }]);
      
      if (phoneConfig) {
        notifyNewMessage(phoneConfig, listing?.user || 'Seller', reply);
      }
    }, 2000);
  };

  if (!listing) return null;

  return (
    <>
      {/* Detail Modal */}
      <Modal isOpen={isOpen && !showChat} onClose={onClose} title={listing.title || 'Details'}>
         <div>
            <div className="aspect-video rounded-xl bg-gray-100 mb-6 overflow-hidden">
               {listing.image ? (
                 <img src={listing.image} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                   <Camera size={48} />
                 </div>
               )}
            </div>
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-2xl font-bold text-gray-900">{listing.price}</h2>
               <Badge>{listing.distance}</Badge>
            </div>
            <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-xl">
               <div className="w-10 h-10 rounded-full bg-frog-green/20 flex items-center justify-center text-frog-forest font-bold">
                  {listing.user?.charAt(0) || 'U'}
               </div>
               <div>
                  <p className="text-sm font-bold text-gray-900">{listing.user || 'Unknown Seller'}</p>
                  <p className="text-xs text-gray-500">Member since 2024</p>
               </div>
            </div>
            <p className="text-gray-600 leading-relaxed mb-8">{listing.description}</p>
            <div className="flex gap-3">
               <Button className="flex-1" onClick={() => user ? setShowChat(true) : onAuth()}>Message Seller</Button>
               <Button variant="secondary" className="flex-1">Save Listing</Button>
            </div>
         </div>
      </Modal>

      {/* Chat Modal */}
      <Modal isOpen={showChat} onClose={() => setShowChat(false)} title={listing.user || 'Seller'}>
        <div className="flex flex-col h-[500px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white rounded-xl border border-gray-100 mb-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-2 text-sm shadow-sm ${
                  m.sender === 'me' 
                    ? 'bg-frog-green text-white rounded-2xl rounded-br-sm' 
                    : 'bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendChat} className="flex gap-2 items-center border-t pt-3">
            <input 
              className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-frog-green transition-colors"
              placeholder="Type a message..."
              value={chatMsg}
              onChange={e => setChatMsg(e.target.value)}
              autoFocus
            />
            <button 
              type="submit" 
              disabled={!chatMsg.trim()} 
              className="w-9 h-9 rounded-full bg-frog-green text-white flex items-center justify-center hover:bg-frog-greenDark disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
};
