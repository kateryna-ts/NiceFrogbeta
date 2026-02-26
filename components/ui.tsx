
import React from 'react';
import { Bluetooth, X } from 'lucide-react';

export const Badge: React.FC<{ children: React.ReactNode; color?: string; icon?: boolean }> = ({ children, color, icon = false }) => {
  const baseClass = "px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-bold flex items-center gap-1.5 w-fit transition-all duration-300";
  const colorClass = color || "bg-frog-green/10 text-frog-forest border border-frog-green/20";
  
  return (
    <span className={`${baseClass} ${colorClass}`}>
      {icon && <Bluetooth size={12} className="animate-pulse" />}
      {children}
    </span>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyle = "rounded-xl font-semibold transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base h-[56px]"
  };

  const variants = {
    primary: "bg-frog-green text-white shadow-lg shadow-frog-green/20 hover:shadow-frog-green/30 hover:bg-[#1eb053] border-0",
    secondary: "bg-white text-frog-dark border border-gray-200 hover:bg-gray-50 shadow-sm",
    outline: "bg-transparent border border-white/20 text-white hover:bg-white/10",
    ghost: "bg-transparent text-gray-600 hover:text-frog-forest hover:bg-frog-green/5",
    danger: "bg-transparent border border-red-200 text-red-500 hover:bg-red-50"
  };

  return (
    <button className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`
      bg-white 
      rounded-2xl 
      overflow-hidden 
      transition-all duration-500 
      border border-gray-100
      shadow-[0_4px_20px_rgba(0,0,0,0.02)]
      hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1
      ${className}
      ${onClick ? 'cursor-pointer' : ''}
    `}
  >
    {children}
  </div>
);

export const Switch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
  <button 
    onClick={() => onChange(!checked)}
    className={`w-12 h-7 rounded-full transition-colors duration-300 relative ${checked ? 'bg-frog-green' : 'bg-gray-200'}`}
  >
    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${checked ? 'left-6' : 'left-1'}`} />
  </button>
);

export const Slider: React.FC<{ value: number; min: number; max: number; onChange: (val: number) => void; className?: string }> = ({ value, min, max, onChange, className }) => (
  <input 
    type="range" 
    min={min} 
    max={max} 
    value={value} 
    onChange={(e) => onChange(Number(e.target.value))}
    className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-frog-green ${className}`}
  />
);

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string; fullScreen?: boolean }> = ({ isOpen, onClose, children, title, fullScreen = false }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-frog-dark/60 backdrop-blur-md animate-fade-in-up">
      <div className={`
        bg-white rounded-2xl w-full relative shadow-2xl flex flex-col
        ${fullScreen ? 'max-w-5xl h-[85vh]' : 'max-w-lg max-h-[90vh]'}
      `}>
        <div className="sticky top-0 bg-white/90 backdrop-blur-xl p-6 border-b border-gray-100 flex justify-between items-center z-10 shrink-0 rounded-t-2xl">
          <h3 className="text-xl font-bold text-frog-dark tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>
        <div className={`p-6 overflow-y-auto flex-1 ${fullScreen ? 'p-0' : ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export const SectionHeader: React.FC<{ title: string; subtitle: string; dark?: boolean }> = ({ title, subtitle, dark = false }) => (
  <div className="text-center mb-20 animate-fade-in-up">
    <h2 className={`text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.1] ${dark ? 'text-white' : 'text-frog-dark'}`}>
      {title}
    </h2>
    <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
      {subtitle}
    </p>
  </div>
);
