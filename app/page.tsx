'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MobileFrame } from '@/components/MobileFrame';
import { 
  HomeView, 
  DashboardView, 
  AboutUsView, 
  AppointmentView, 
  PhotoGalleryView, 
  PopupView,
  ContactPersonView,
  LocationView,
  VideoGalleryView,
  BrochureView,
  InquiryView,
  DropboxView
} from '@/components/Views';

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

export default function MKGroupApp() {
  const [startFromHome, setStartFromHome] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('mkgroup:startFromHome');
      return stored == null ? false : stored === '1';
    } catch {
      return false;
    }
  });

  const [view, setView] = useState<View>(() => {
    try {
      const storedStart = localStorage.getItem('mkgroup:startFromHome');
      const nextStartFromHome = storedStart == null ? false : storedStart === '1';
      if (nextStartFromHome) return 'home';
      const lastView = localStorage.getItem('mkgroup:lastView') as View | null;
      return lastView ?? 'home';
    } catch {
      return 'home';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mkgroup:startFromHome', startFromHome ? '1' : '0');
    } catch {
      // ignore storage issues
    }
  }, [startFromHome]);

  useEffect(() => {
    if (startFromHome) return;
    try {
      localStorage.setItem('mkgroup:lastView', view);
    } catch {
      // ignore storage issues
    }
  }, [view, startFromHome]);

  const renderView = () => {
    switch (view) {
      case 'home':
        return (
          <HomeView
            setView={setView}
            startFromHome={startFromHome}
            setStartFromHome={setStartFromHome}
          />
        );
      case 'dashboard': return <DashboardView setView={setView} />;
      case 'contact-person': return <ContactPersonView />;
      case 'about-us': return <AboutUsView />;
      case 'appointment': return <AppointmentView />;
      case 'location': return <LocationView />;
      case 'photo-gallery': return <PhotoGalleryView />;
      case 'video-gallery': return <VideoGalleryView />;
      case 'brochure': return <BrochureView />;
      case 'inquiry': return <InquiryView />;
      case 'dropbox': return <DropboxView />;
      case 'popup': return <PopupView />;
      default:
        return (
          <HomeView
            setView={setView}
            startFromHome={startFromHome}
            setStartFromHome={setStartFromHome}
          />
        );
    }
  };

  return (
    <MobileFrame currentView={view} setView={setView}>
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={false}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </MobileFrame>
  );
}
