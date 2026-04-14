'use client';

import React from 'react';
import { Home, Box, Share2, ChevronLeft, FileText } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

type View =
  | 'home'
  | 'dashboard'
  | 'contact-person'
  | 'about-us'
  | 'appointment'
  | 'location'
  | 'photo-gallery'
  | 'video-gallery'
  | 'brochure'
  | 'inquiry'
  | 'dropbox'
  | 'advertisement'
  | 'popup';

interface MobileFrameProps {
  children: React.ReactNode;
  currentView: View;
  setView: (v: View) => void;
  setStartFromHome?: (v: boolean) => void;
}

const VIEW_LABELS: Record<string, string> = {
  'contact-person': 'Contact Person',
  'about-us': 'About Us',
  'appointment': 'Appointment',
  'location': 'Location',
  'photo-gallery': 'Photo Gallery',
  'video-gallery': 'Video Gallery',
  'brochure': 'Brochure',
  'inquiry': 'Inquiry',
  'dropbox': 'Dropbox',
  'advertisement': 'Advertisement',
  'popup': 'Popup',
};

export const MobileFrame = ({ children, currentView, setView, setStartFromHome }: MobileFrameProps) => {
  const isHome = currentView === 'home';
  const isDashboard = currentView === 'dashboard';
  const isPopup = currentView === 'popup';
  const isSubView = !isHome && !isDashboard && !isPopup;
  const isMobile = useIsMobile();

  return (
    <div className={`min-h-screen ${isMobile ? 'bg-white' : 'bg-gray-50 flex items-center justify-center p-4'} font-sans`}>
      {/* Phone Shell */}
      <div className={`${isMobile ? 'w-full h-full' : 'relative w-[400px] flex-shrink-0 bg-[#B0CADA] rounded-[60px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-[12px] border-[8px] border-white/30'}`}>
        {/* Screen — fixed height on desktop, full height on mobile */}
        <div
          className={`relative bg-[#B3D0E2] overflow-hidden flex flex-col ${isMobile ? 'min-h-screen' : 'rounded-[48px] shadow-inner'}`}
          style={isMobile ? {} : { height: '820px', minHeight: '820px', maxHeight: '820px' }}
        >

          {/* Header for Subviews */}
          {isSubView && (
            <div className="flex items-center gap-3 px-6 pt-10 pb-4 bg-[#6B849E] text-white flex-shrink-0 shadow-md">
              <button
                onClick={() => setView('dashboard')}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors shadow-sm"
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>
              <span className="font-black text-sm tracking-widest uppercase">{VIEW_LABELS[currentView] ?? currentView}</span>
            </div>
          )}

          {/* Scrollable Content */}
          <div className={`flex-1 ${isMobile ? 'overflow-hidden' : 'overflow-y-auto scrollbar-hide'} flex flex-col ${isHome ? 'justify-center py-4' : 'py-6 px-2'}`}>
            {children}
          </div>

          {/* Bottom Nav — Dashboard */}
          {isDashboard && !isPopup && (
            <div className={`flex-shrink-0 bg-[#004A7C] border-t border-white/10 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] ${isMobile ? 'fixed bottom-0 w-full left-0 right-4  overflow-hidden z-40' : ''}`}>
              <div className="flex items-center justify-around py-3 px-2">
                {[
                  { icon: Home, label: 'home', action: () => {
                    setView('home');
                    if (setStartFromHome) setStartFromHome(false);
                  } },
                  { icon: Box, label: 'dropbox', action: () => setView('dropbox') },
                  { icon: FileText, label: 'correction', action: () => setView('brochure') },
                  { icon: Share2, label: 'share', action: () => {} },
                ].map(({ icon: Icon, label, action }) => (
                  <button key={label} onClick={action} className="flex flex-col items-center gap-1 py-1 px-3 text-white/90 hover:text-white transition-all group">
                    <Icon size={22} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-bold uppercase tracking-tighter">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Bottom Nav — Subviews (just back button or similar) */}
          {isSubView && (
            <div className={`flex-shrink-0 bg-[#6B849E] py-3 flex items-center justify-around shadow-[0_-4px_10px_rgba(0,0,0,0.1)] ${isMobile ? 'fixed bottom-12 left-4 right-4 rounded-3xl overflow-hidden z-40' : ''}`}>
               <button
                onClick={() => setView('dashboard')}
                className="p-1.5 rounded-full bg-white/20 text-white"
              >
                <ChevronLeft size={24} strokeWidth={3} />
              </button>
              <div className="bg-white/20 px-4 py-1.5 rounded-lg border border-white/30">
                <span className="text-white text-[10px] font-black uppercase tracking-widest">{VIEW_LABELS[currentView] ?? currentView}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
