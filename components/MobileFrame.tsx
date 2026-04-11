'use client';

import React from 'react';
import { Home, Box, Share2, ChevronLeft, FileText } from 'lucide-react';

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
  | 'popup';

interface MobileFrameProps {
  children: React.ReactNode;
  currentView: View;
  setView: (v: View) => void;
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
  'popup': 'Popup',
};

export const MobileFrame = ({ children, currentView, setView }: MobileFrameProps) => {
  const isHome = currentView === 'home';
  const isDashboard = currentView === 'dashboard';
  const isSubView = !isHome && !isDashboard;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      {/* Phone Shell */}
      <div className="relative w-[400px] flex-shrink-0 bg-[#B0CADA] rounded-[60px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-[12px] border-[8px] border-white/30">
        {/* Screen — fixed height, never grows */}
        <div
          className="relative bg-[#B3D0E2] rounded-[48px] overflow-hidden flex flex-col shadow-inner"
          style={{ height: '820px', minHeight: '820px', maxHeight: '820px' }}
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
          <div className={`flex-1 overflow-y-auto scrollbar-hide flex flex-col ${isHome ? 'justify-center py-4' : 'py-6 px-2'}`}>
            {children}
          </div>

          {/* Bottom Nav — Dashboard */}
          {isDashboard && (
            <div className="flex-shrink-0 bg-[#004A7C] border-t border-white/10 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] ">
              <div className="flex items-center justify-around py-3 px-2">
                {[
                  { icon: Home, label: 'home', action: () => setView('home') },
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
            <div className="flex-shrink-0 bg-[#6B849E] py-3 flex items-center justify-around shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
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
