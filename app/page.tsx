'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MobileFrame } from '@/components/MobileFrame';
import Link from 'next/link';
import { ShieldCheck, User } from 'lucide-react';
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

type MKGroupAppProps = {
  showAccessPanel?: boolean;
  builderId?: string;
};

export const BuilderContext = React.createContext<any>(null);

export default function MKGroupApp({ showAccessPanel = true, builderId }: MKGroupAppProps) {
  const [isLocalhostBooting, setIsLocalhostBooting] = useState<boolean>(true);
  const [builderData, setBuilderData] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  useEffect(() => {
    if (builderId) {
      const loadBuilder = async () => {
        setIsDataLoading(true);
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/builder/${builderId}`);
          const result = await response.json();
          if (result.status === "Success") {
            setBuilderData(result.data);
          }
        } catch (error) {
          console.error("Failed to fetch builder data:", error);
        } finally {
          setIsDataLoading(false);
        }
      };
      loadBuilder();
    }
  }, [builderId]);

  useEffect(() => {
    const isLocalhost =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    if (!isLocalhost) {
      setIsLocalhostBooting(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setIsLocalhostBooting(false);
    }, 900);

    return () => window.clearTimeout(timer);
  }, []);

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
            builderData={builderData}
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
            builderData={builderData}
          />
        );
    }
  };

  if (isLocalhostBooting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
          <p className="text-xs font-black tracking-[0.2em] text-gray-600 uppercase">Loading demo</p>
        </div>
      </div>
    );
  }

  return (
    <BuilderContext.Provider value={builderData}>
    <div className="relative min-h-screen bg-gray-50 flex items-center justify-center py-10">
      {showAccessPanel && (
        <div className="fixed top-8 left-8 z-50 flex flex-col gap-4">
          <div className="bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-white/50 shadow-xl flex flex-col gap-2">
            <Link
              href="/user/login"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-blue-50 text-blue-700 transition-all group"
            >
              <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200">
                <User size={18} />
              </div>
              <span className="text-sm font-bold">User Login</span>
            </Link>
            <Link
              href="/admin/login"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-purple-50 text-purple-700 transition-all group"
            >
              <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200">
                <ShieldCheck size={18} />
              </div>
              <span className="text-sm font-bold">Admin Login</span>
            </Link>
          </div>
        </div>
      )}

      <MobileFrame currentView={view} setView={setView}>
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={false}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="h-full w-full"
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
      </MobileFrame>
    </div>
    </BuilderContext.Provider>
  );
}
