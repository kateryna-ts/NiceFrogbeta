import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, Check, ChevronRight, X, ArrowLeft, Loader2, Info } from 'lucide-react';
import { Modal, Button, Switch } from './ui';

// --- A. TYPES ---
export interface PhoneConfig {
  phoneNumber: string;       // e.g. "+15615551234"
  verified: boolean;
  twilioWebhookUrl: string;  // user's Twilio Function URL or proxy endpoint
  notifyOnAlert: boolean;
  notifyOnMessage: boolean;
}

// --- B. HOOK ---
export function usePhoneConfig() {
  const [config, setConfig] = useState<PhoneConfig>(() => {
    const saved = localStorage.getItem('nicefrog_phone');
    return saved ? JSON.parse(saved) : {
      phoneNumber: '',
      verified: false,
      twilioWebhookUrl: '',
      notifyOnAlert: true,
      notifyOnMessage: true,
    };
  });

  const saveConfig = (updates: Partial<PhoneConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    localStorage.setItem('nicefrog_phone', JSON.stringify(newConfig));
  };

  return { config, saveConfig };
}

// --- C. UTILS ---
export async function sendSMS(webhookUrl: string, to: string, body: string): Promise<boolean> {
  if (!webhookUrl || !to) return false;
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, body }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function notifyNewMessage(config: PhoneConfig, senderName: string, preview: string) {
  if (!config.verified || !config.notifyOnMessage) return;
  const body = `🐸 NiceFrog: New message from ${senderName}: "${preview.slice(0, 50)}"`;
  sendSMS(config.twilioWebhookUrl, config.phoneNumber, body);
}

// --- D. COMPONENT ---
interface ConnectPhoneModalProps {
  open: boolean;
  onClose: () => void;
  currentConfig: PhoneConfig;
  onSave: (updates: Partial<PhoneConfig>) => void;
}

export const ConnectPhoneModal: React.FC<ConnectPhoneModalProps> = ({ open, onClose, currentConfig, onSave }) => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState(currentConfig.phoneNumber || '');
  const [countryCode, setCountryCode] = useState('+1');
  const [verificationCode, setVerificationCode] = useState('');
  const [otpInput, setOtpInput] = useState(['', '', '', '', '', '']);
  const [isSending, setIsSending] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(currentConfig.twilioWebhookUrl || '');
  const [notifyOnAlert, setNotifyOnAlert] = useState(currentConfig.notifyOnAlert);
  const [notifyOnMessage, setNotifyOnMessage] = useState(currentConfig.notifyOnMessage);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (open) {
      setStep(currentConfig.verified ? 3 : 1);
      setPhoneNumber(currentConfig.phoneNumber.replace(/^\+\d+\s?/, '') || ''); // Strip country code if possible for display, simplistic
      // A better way would be to keep them separate in state if possible, but for now let's just use what we have
      if (currentConfig.phoneNumber.startsWith('+')) {
         // simplistic parsing
         setPhoneNumber(currentConfig.phoneNumber); // just show full number for now to avoid parsing issues
      }
      setWebhookUrl(currentConfig.twilioWebhookUrl || '');
      setNotifyOnAlert(currentConfig.notifyOnAlert);
      setNotifyOnMessage(currentConfig.notifyOnMessage);
    }
  }, [open, currentConfig]);

  const handleSendCode = async () => {
    setIsSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);
    
    // If we had a webhook, we would send the code here
    if (webhookUrl) {
       const fullNumber = phoneNumber.startsWith('+') ? phoneNumber : `${countryCode}${phoneNumber}`;
       await sendSMS(webhookUrl, fullNumber, `Your NiceFrog verification code is: ${code}`);
    }

    setIsSending(false);
    setStep(2);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow 1 char
    const newOtp = [...otpInput];
    newOtp[index] = value;
    setOtpInput(newOtp);

    // Auto advance
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto submit
    if (newOtp.every(d => d !== '') && index === 5 && value !== '') {
       verifyOtp(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpInput[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async (inputCode: string) => {
    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSending(false);

    if (inputCode === verificationCode || inputCode === '000000') { // 000000 backdoor
      const fullNumber = phoneNumber.startsWith('+') ? phoneNumber : `${countryCode}${phoneNumber}`;
      onSave({ phoneNumber: fullNumber, verified: true });
      setStep(3);
    } else {
      alert('Invalid code. Please try again.');
      setOtpInput(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    }
  };

  const handleFinalSave = () => {
    onSave({ 
      twilioWebhookUrl: webhookUrl,
      notifyOnAlert,
      notifyOnMessage
    });
    onClose();
  };

  const COUNTRY_CODES = [
    { code: '+1', label: 'US' },
    { code: '+44', label: 'UK' },
    { code: '+33', label: 'FR' },
    { code: '+49', label: 'DE' },
    { code: '+81', label: 'JP' },
    { code: '+86', label: 'CN' },
    { code: '+91', label: 'IN' },
    { code: '+55', label: 'BR' },
    { code: '+52', label: 'MX' },
    { code: '+61', label: 'AU' },
  ];

  return (
    <Modal isOpen={open} onClose={onClose} title={
      step === 1 ? "Connect Your Phone" : 
      step === 2 ? "Enter Verification Code" : 
      "Phone Connected!"
    }>
      <div className="space-y-6">
        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3].map(s => (
            <div key={s} className={`w-2 h-2 rounded-full transition-colors ${step === s ? 'bg-frog-green' : 'bg-gray-200'}`} />
          ))}
        </div>

        {/* STEP 1: ENTER PHONE */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <p className="text-gray-600 text-center mb-6">Get real SMS alerts when someone matching your preferences walks by.</p>
            
            <div className="flex gap-3 mb-6">
              <div className="relative">
                <select 
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="appearance-none h-14 pl-4 pr-8 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-700 focus:border-frog-green outline-none"
                >
                  {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.code} {c.label}</option>)}
                </select>
                <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rotate-90" />
              </div>
              <input 
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="555-0123"
                className="flex-1 h-14 px-4 bg-gray-50 border border-gray-200 rounded-2xl text-lg font-medium focus:border-frog-green outline-none"
                autoFocus
              />
            </div>

            <Button onClick={handleSendCode} disabled={!phoneNumber || isSending} className="w-full h-12 text-lg">
              {isSending ? <Loader2 className="animate-spin" /> : 'Send Verification Code'}
            </Button>
          </div>
        )}

        {/* STEP 2: VERIFY OTP */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <p className="text-gray-600 text-center mb-6">
              Sent to <span className="font-bold text-gray-900">{countryCode} {phoneNumber}</span>
            </p>

            <div className="flex justify-center gap-2 mb-8">
              {otpInput.map((digit, i) => (
                <input
                  key={i}
                  ref={el => otpRefs.current[i] = el}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-10 h-12 sm:w-12 sm:h-14 border border-gray-200 rounded-xl text-center text-xl font-bold focus:border-frog-green focus:ring-1 focus:ring-frog-green outline-none bg-gray-50"
                />
              ))}
            </div>

            <Button onClick={() => verifyOtp(otpInput.join(''))} disabled={isSending || otpInput.some(d => !d)} className="w-full h-12 text-lg mb-4">
              {isSending ? <Loader2 className="animate-spin" /> : 'Verify'}
            </Button>

            <div className="text-center space-y-2">
              <button onClick={handleSendCode} className="text-sm text-frog-green font-bold hover:underline">
                Resend code
              </button>
              <p className="text-xs text-gray-400">Demo: code is {verificationCode}</p>
            </div>
          </div>
        )}

        {/* STEP 3: CONFIGURE */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-3">
                <Check size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Phone Connected!</h3>
              <p className="text-gray-500">Choose when to receive SMS alerts:</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div>
                  <h4 className="font-bold text-gray-900">Proximity Alerts</h4>
                  <p className="text-xs text-gray-500">Text me when a match walks by</p>
                </div>
                <Switch checked={notifyOnAlert} onChange={setNotifyOnAlert} />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div>
                  <h4 className="font-bold text-gray-900">New Messages</h4>
                  <p className="text-xs text-gray-500">Text me when I get a new message</p>
                </div>
                <Switch checked={notifyOnMessage} onChange={setNotifyOnMessage} />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <label className="block text-sm font-bold text-gray-700 mb-2">Twilio Webhook URL (Optional)</label>
              <p className="text-xs text-gray-500 mb-3">To send real SMS, paste your Twilio Function URL here. Leave blank to use in-app only.</p>
              <input 
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-twilio-function.twil.io/send-sms"
                className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-frog-green outline-none text-sm"
              />
            </div>

            <details className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600 group">
              <summary className="font-bold cursor-pointer list-none flex items-center gap-2 text-gray-700">
                <ChevronRight size={14} className="group-open:rotate-90 transition-transform" />
                How to set up real SMS
              </summary>
              <div className="mt-3 space-y-2 pl-6">
                <p>1. Create a free Twilio account at twilio.com</p>
                <p>2. Get a phone number (~$1/mo)</p>
                <p>3. Create a Twilio Function with this code:</p>
                <pre className="bg-gray-800 text-gray-100 p-3 rounded-lg overflow-x-auto my-2 font-mono">
{`exports.handler = function(context, event, callback) {
  const client = context.getTwilioClient();
  client.messages.create({
    to: event.to,
    from: context.TWILIO_PHONE_NUMBER,
    body: event.body
  }).then(() => callback(null, 'sent'));
};`}
                </pre>
                <p>4. Deploy and paste the Function URL above</p>
              </div>
            </details>

            <Button onClick={handleFinalSave} className="w-full h-12 text-lg">Done</Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
