'use client';

import React from 'react';
import Image from 'next/image';
import {
  Phone, MapPin, Clock, Globe, Share2, Edit, User, Info, Calendar,
  Image as ImageIcon, Video, HelpCircle, FileText, MessageSquare,
  Star, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, Box,
  Mail, Mic, Plus, Download, Bell, Eye, Send, Check, X
} from 'lucide-react';
import { useContext, useState } from 'react';
import { BuilderContext } from '@/app/page';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

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

interface ViewProps {
  setView: (v: View) => void;
  changeLanguage?: (lang: string) => void;
}

interface DashboardViewProps extends ViewProps {
  openPopup?: () => void;
}

interface HomeViewProps extends ViewProps {
  startFromHome: boolean;
  setStartFromHome: (v: boolean) => void;
  builderData?: any;
}

const ContactItem = ({ icon: Icon, text, isName = false, isAddress = false }: { icon: any, text: string | React.ReactNode, isName?: boolean, isAddress?: boolean }) => (
  <div className="bg-white rounded-2xl flex items-stretch shadow-sm border border-gray-200 overflow-hidden h-11 sm:h-12 w-full">
    <div className="w-10 sm:w-12 flex items-center justify-center text-gray-700 flex-shrink-0">
      <Icon size={isName ? 20 : 18} strokeWidth={2.5} className={Icon === Send ? 'rotate-0' : ''} />
    </div>
    <div className="w-[1.5px] bg-gray-200 my-1.5" />
    <div className={`flex-1 flex items-center px-4 ${isAddress ? 'py-1' : ''}`}>
      <span className={`${isName ? 'font-black text-sm sm:text-base' : 'font-bold text-xs sm:text-sm'} text-gray-800 tracking-tight leading-none`}>
        {text}
      </span>
    </div>
  </div>
);
const SkeuomorphicToggle = ({ checked, onChange, disabled, isLoading }: { checked: boolean, onChange: (val: boolean) => void, disabled?: boolean, isLoading?: boolean }) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [currentX, setCurrentX] = React.useState(0);

  const switchWidth = 100;
  const knobWidth = 46;
  const padding = 2;
  const maxDrag = switchWidth - knobWidth - padding * 2;

  const getPos = () => {
    if (isDragging) {
      let pos = (checked ? 0 : maxDrag) + currentX - startX;
      return Math.max(0, Math.min(maxDrag, pos));
    }
    return checked ? 0 : maxDrag;
  };

  const handleStart = (clientX: number) => {
    if (disabled || isLoading) return;
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    setCurrentX(clientX);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const pos = getPos();
    if (checked && pos > maxDrag / 2) {
      onChange(false);
    } else if (!checked && pos < maxDrag / 2) {
      onChange(true);
    } else {
      if (Math.abs(currentX - startX) < 5) {
        onChange(!checked);
      }
    }
  };

  React.useEffect(() => {
    const handleMouseUp = () => handleEnd();
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, currentX, startX, checked]);

  return (
    <div
      style={{
        width: switchWidth,
        height: '42px',
        borderRadius: '37px',
        background: 'linear-gradient(180deg, #d3d3d3 0%, #ffffff 100%)',
        padding: `${padding}px`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1), inset 0px 1px 1px rgba(255,255,255,1)',
        position: 'relative',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1,
        touchAction: 'none'
      }}
      onClick={(e) => {
        if (!isDragging && !disabled && !isLoading) {
          onChange(!checked);
        }
      }}
    >
      <div style={{
        width: '100%',
        height: '100%',
        borderRadius: '27px',
        background: checked ? '#3CAF4E' : '#ed1c24',
        boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.4)',
        transition: isDragging ? 'none' : 'background 0.3s',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', right: '16px', top: 0, bottom: 0,
          display: 'flex', alignItems: 'center', color: '#fff',
          fontWeight: '500', fontSize: '14px', letterSpacing: '0.5px',
          fontFamily: 'sans-serif',
          opacity: checked ? 1 : 0, transition: 'opacity 0.2s',
          pointerEvents: 'none'
        }}>ON</div>

        <div style={{
          position: 'absolute', left: '16px', top: 0, bottom: 0,
          display: 'flex', alignItems: 'center', color: '#fff',
          fontWeight: '500', fontSize: '14px', letterSpacing: '0.5px',
          fontFamily: 'sans-serif',
          opacity: checked ? 0 : 1, transition: 'opacity 0.2s',
          pointerEvents: 'none'
        }}>OFF</div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: padding,
          left: padding,
          height: `calc(100% - ${padding * 2}px)`,
          width: knobWidth,
          borderRadius: '27px',
          background: 'linear-gradient(180deg, #ffffff 0%, #e8e8e8 100%)',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2), inset 0 1px 1px #fff, inset 0 -1px 1px #d0d0d0',
          transform: `translateX(${getPos()}px)`,
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2
        }}
        onMouseDown={(e) => { e.stopPropagation(); handleStart(e.clientX); }}
        onTouchStart={(e) => { e.stopPropagation(); handleStart(e.touches[0].clientX); }}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'linear-gradient(180deg, #dadada 0%, #ffffff 100%)',
          boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.15)'
        }} />
      </div>

      {isLoading && (
        <div style={{ position: 'absolute', zIndex: 10, inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.1)', borderRadius: '21px' }}>
          <div className="w-5 h-5 border-2 border-[#fff] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export const HomeView = ({ setView, startFromHome, setStartFromHome }: HomeViewProps) => {
  const builderData = useContext(BuilderContext);
  const isMobile = useIsMobile();
  const [isCheckingStatus, setIsCheckingStatus] = React.useState(false);
  const [showInactiveDialog, setShowInactiveDialog] = React.useState(false);
  const [dialogMessage, setDialogMessage] = React.useState('');
  const [statusError, setStatusError] = React.useState<string | null>(null);

  const name = builderData?.name?.trim() ? builderData.name.trim() : "-";
  const number = builderData?.number?.trim() ? builderData.number.trim() : "-";
  const email = builderData?.email?.trim() ? builderData.email.trim() : "-";
  const location = builderData?.location?.trim() ? builderData.location.trim() : "-";
  const timing = builderData?.timing?.trim() ? builderData.timing.trim() : "-";
  const website = builderData?.website?.trim() ? builderData.website.trim() : "-";
  const companyName = builderData?.companyName?.trim() ? builderData.companyName.trim() : "-";

  const getProfileImage = () => {
    if (builderData?.profileImage) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/v1/api";
      const baseUrl = apiUrl.split("/v1/api")[0];
      return `${baseUrl}/builder/${builderData.profileImage}`;
    }
    return "/profile.png";
  };

  const getLogoImage = () => {
    if (builderData?.logo) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/v1/api";
      const baseUrl = apiUrl.split("/v1/api")[0];
      return `${baseUrl}/builder/${builderData.logo}`;
    }
    return null;
  };

  const logoUrl = getLogoImage();

  return (
    <div className="flex flex-col items-center px-6 sm:px-8 space-y-6 w-full h-full justify-start pt-10 pb-20">
      <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-gray-300 to-gray-100 p-2 shadow-xl mb-6">

        <div className="relative w-full h-full rounded-full overflow-hidden bg-white">

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 z-10 rounded-full" />

          {/* Image */}
          <Image
            src={getProfileImage()}
            alt={name}
            fill
            className="object-cover rounded-full"
            priority
            unoptimized
          />

        </div>
      </div>

      <div className="w-full space-y-2.5">
        <ContactItem icon={User} text={name} isName />
        <ContactItem icon={Phone} text={number} />
        <div className="bg-white rounded-2xl flex items-stretch shadow-sm border border-gray-200 overflow-hidden h-16 sm:h-20 w-full">
          <div className="w-10 sm:w-12 flex items-center justify-center text-gray-700 flex-shrink-0">
            <MapPin size={18} strokeWidth={2.5} />
          </div>
          <div className="w-[1.5px] bg-gray-200 my-2" />
          <div className="flex-1 flex items-center px-4 py-1">
            <span className="font-bold text-gray-800 text-[11px] sm:text-xs leading-snug tracking-tight">
              {location}
            </span>
          </div>
        </div>
        <ContactItem icon={Clock} text={timing} />
        <ContactItem icon={Send} text={website} />
      </div>

      <div className="w-full text-center mt-2 px-4">
        <h1 className="text-[20px] sm:text-[26px] font-black tracking-[0.1em] leading-tight uppercase text-gray-900 break-words">
          {companyName}
        </h1>
      </div>

      <div
        className="w-full bg-[#003B46] rounded-2xl p-4 flex flex-col items-center justify-center text-white cursor-pointer hover:opacity-95 transition-all shadow-xl border-2 border-white/30 h-32 sm:h-40 mt-1"
      >
        {logoUrl ? (
          <div className="relative w-full h-full">
            <Image
              src={logoUrl}
              alt="Logo"
              fill
              className="object-contain drop-shadow-md"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <div className="w-[4px] h-6 bg-white rounded-full opacity-50" />
              <div className="text-xl font-black tracking-[0.2em] leading-tight uppercase text-white/50">
                LOGO
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full flex justify-between items-center px-2 pt-4">
        <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
          <div>
            <Image
              src="/icons/share1.png"
              alt="Share"
              width={50}
              height={50}
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xs font-black text-gray-700">Share</span>
        </div>

        <div className='flex flex-col items-center mx-4 mb-5 gap-1.5'>
          <SkeuomorphicToggle
            checked={startFromHome}
            disabled={isCheckingStatus}
            isLoading={isCheckingStatus}
            onChange={async (newCheckedState) => {
              if (isCheckingStatus) return;
              if (!newCheckedState) {
                setStartFromHome(false);
                return;
              }
              try {
                setIsCheckingStatus(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/status/${builderData?._id}`);
                const result = await response.json();
                if (result.status === "Success" && result.data.isActive) {
                  setStartFromHome(true);
                  setTimeout(() => { setView('popup'); }, 500);
                } else {
                  setDialogMessage("This profile is currently inactive. Please contact admin.");
                  setShowInactiveDialog(true);
                }
              } catch (error) {
                setDialogMessage("Unable to verify profile status. Please try again.");
                setShowInactiveDialog(true);
              } finally {
                setIsCheckingStatus(false);
              }
            }}
          />
        </div>

        <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
          <div >
            <Image
              src="/icons/share2.png"
              alt="Edit"
              width={50}
              height={50}
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xs font-black text-gray-700">Edit</span>
        </div>
      </div>

      {/* Inactive Dialog */}
      {showInactiveDialog && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowInactiveDialog(false)}
          />
          {/* Dialog */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-[300px] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Top accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-red-400 to-red-600" />
            <button
              onClick={() => setShowInactiveDialog(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all z-10"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
            <div className="p-6 flex flex-col items-center text-center gap-4 pt-10">
              {/* Icon */}
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-1">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" />
                  <path d="M12 7v5" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="12" cy="16" r="1.2" fill="#ef4444" />
                </svg>
              </div>
              <div className="mb-2">
                <p className="text-sm font-black text-gray-900 mb-1">Profile Inactive</p>
                <p className="text-xs font-medium text-gray-500 leading-relaxed max-w-[200px] mx-auto">{dialogMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const DashboardView = ({ setView, changeLanguage }: DashboardViewProps) => {
  const builderData = useContext(BuilderContext);

  const getLogoImage = () => {
    if (builderData?.logo) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/v1/api";
      const baseUrl = apiUrl.split("/v1/api")[0];
      return `${baseUrl}/builder/${builderData.logo}`;
    }
    return null;
  };

  const logoUrl = getLogoImage();

  return (
    <div className="flex flex-col items-center px-4 space-y-4 pt-4">
      <div className="relative flex flex-col items-center w-full mt-12">
        <div className="absolute -top-2 z-20 flex items-center bg-[#E5ECEA] rounded-full border border-gray-300 shadow-sm pl-2  pr-1 py-1">
          <div className="mr-2">
            <Image
              src="/icons/eyes.png"
              alt="Eye"
              width={22}
              height={22}
              className="object-contain"
            />
          </div>
          <div className="w-[1px] h-4 bg-[#E5ECEA] mr-2" />
          <div className="flex space-x-[1px]">
            {String(builderData?.viewCount || 0).padStart(6, '0').split('').map((n, i) => (
              <div key={i} className=" w-4 h-6 flex items-center justify-center font-mono font-bold text-sm text-gray-800">{n}</div>
            ))}
          </div>
        </div>

        <div
          onClick={() => setView('advertisement')}
          className={`w-full bg-[#002D35] rounded-[32px] text-white relative overflow-hidden border-[6px] border-[#E5ECEA] border-t-[20px] min-h-[160px] mt-2 cursor-pointer transition-all ${logoUrl ? 'p-0' : 'p-4 flex flex-col items-center justify-center'}`}
          style={{
            boxShadow: '0 4px 0px #001a1f, 0 6px 10px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
            transform: 'perspective(600px) rotateX(2deg)',
            transformOrigin: 'top center',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'perspective(600px) rotateX(0deg)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'perspective(600px) rotateX(2deg)')}
        >
          {logoUrl ? (
            <div className="relative w-full h-full min-h-[160px]">
              <Image
                src={logoUrl}
                alt="Logo"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          ) : (
            <>
              <div className="mb-2">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 5L25 15L35 15L27 22L30 32L20 25L10 32L13 22L5 15L15 15L20 5Z" stroke="#FFD700" strokeWidth="2" strokeLinejoin="round" />
                  <circle cx="20" cy="20" r="5" stroke="#FFD700" strokeWidth="2" />
                </svg>
              </div>
              <div className="text-3xl font-serif tracking-[0.4em] font-bold text-[#FFD700]">ANANTA</div>
              <div className="text-sm tracking-[0.6em] font-bold text-[#FFD700] mt-1">HEIGHTS</div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-6 gap-2 w-full px-2 mt-4">
        {[
          {
            img: '/icons/phone.png',
            color: 'bg-[#FF0000]',
            action: () => {
              const num = builderData?.secondaryNumber || builderData?.number;
              if (num) window.open(`tel:${num}`, '_self');
            }
          },
          {
            img: '/icons/messageSquare.png',
            color: 'bg-[#25D366]',
            action: () => {
              if (builderData?.whatsappNumber) window.open(`https://wa.me/${builderData.whatsappNumber}`, '_blank');
            }
          },
          {
            img: '/icons/share3.png',
            color: 'bg-[#3B5998]',
            action: () => {
              if (builderData?.facebookLink) window.open(builderData.facebookLink, '_blank');
            }
          },
          {
            img: '/icons/mail.png',
            color: 'bg-[#FFCC00]',
            action: () => {
              if (builderData?.email) window.open(`mailto:${builderData.email}`, '_self');
            }
          },
          {
            img: '/icons/instaa.png',
            color: 'bg-[#E1306C]',
            action: () => {
              if (builderData?.instagramLink) window.open(builderData.instagramLink, '_blank');
            }
          },
          {
            img: '/icons/globe.png',
            color: 'bg-[#00BFFF]',
            action: () => {
              const site = builderData?.website;
              if (site) window.open(site.startsWith('http') ? site : `https://${site}`, '_blank');
            }
          },
        ].map((item, i) => (
          <div key={i} onClick={item.action} className="flex justify-center cursor-pointer hover:translate-y-0.5 hover:drop-shadow-none transition-all">
            <Image
              src={item.img}
              alt="icon"
              width={55}
              height={55}
              className="object-contain drop-shadow-[0_5px_4px_rgba(0,0,0,0.35)]"
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-x-2 gap-y-4 w-full px-1 py-2">
        {[
          { id: 'contact-person', label: 'Person', img: '/icons/IconPerson-01.png' },
          { id: 'about-us', label: 'About us', img: '/icons/IconAboutus.png' },
          { id: 'appointment', label: 'Appointment', img: '/icons/appointment-01.png' },
          { id: 'location', label: 'Location', img: '/icons/IconLocation.png' },
          { id: 'photo-gallery', label: 'Photo', img: '/icons/IconPhoto-01.png' },
          { id: 'video-gallery', label: 'Videos', img: '/icons/IconVideos-01.png' },
          { id: 'inquiry', label: 'Inquiry', img: '/icons/IconInquiry.png' },
          { id: 'brochure', label: 'Brochure', img: '/icons/brochure-01.png' },
        ].map((item) => (
          <button key={item.id} onClick={() => setView(item.id as View)} className="flex flex-col items-center group cursor-pointer hover:translate-y-0.5 transition-all">
            <div className="drop-shadow-[0_5px_4px_rgba(0,0,0,0.35)] group-hover:drop-shadow-none transition-all">
              <Image
                src={item.img}
                alt={item.label}
                width={45}
                height={45}
                className="object-contain"
              />
            </div>
            <span className="text-[11px] font-bold text-gray-700 mt-1.5">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="flex space-x-2 w-full px-2 mt-2">
        <button
          className="flex-1 flex items-center justify-center cursor-pointer hover:translate-y-0.5 transition-all drop-shadow-[0_5px_4px_rgba(0,0,0,0.35)] hover:drop-shadow-none"
        >
          <Image
            src="/selete2.png"
            alt="Select language"
            width={180}
            height={50}
            className="object-contain"
          />
        </button>
        {/* <button
          onClick={() => {
            const n = builderData?.name || "MK GROUP";
            const tel = builderData?.number || "";
            const org = builderData?.companyName || "";
            const vcf = `BEGIN:VCARD\nVERSION:3.0\nFN:${n}\nN:${n};;;;\nTEL;TYPE=CELL:${tel}\nORG:${org}\nEND:VCARD`;
            const blob = new Blob([vcf], { type: "text/vcard" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${n.replace(/\s+/g, "_")}.vcf`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="flex-1 flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
        >
          <Image
            src="/select1.png"
            alt="Save Contact"
            width={180}
            height={50}
            className="object-contain"
          />
        </button> */}

        {/* Select Language - Now on Right, using Native Select Overlay */}
        <div className="flex-1 relative group hover:translate-y-0.5 transition-all drop-shadow-[0_5px_4px_rgba(0,0,0,0.35)] hover:drop-shadow-none">
          <select
            onChange={(e) => changeLanguage && changeLanguage(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 appearance-none"
            defaultValue=""
          >
            <option value="" disabled>Select Language</option>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="gu">Gujarati</option>
          </select>
          <div className="flex items-center justify-center transition-transform">
            <Image
              src="/select1.png"
              alt="Select language"
              width={180}
              height={50}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 w-full pt-2 pb-4">
        {[
          { label: 'Testimonials', img: '/icons/t1.png' },
          { label: 'Rating', img: '/icons/t2.png' },
          { label: 'Popup', img: '/icons/t3.png', action: () => setView('popup') },
          { label: 'Feedback', img: '/icons/t4.png' },
          { label: 'Like', img: '/icons/t5.png' },
        ].map((item, i) => (
          <button key={i} onClick={item.action} className="flex flex-col items-center space-y-1.5 group cursor-pointer hover:translate-y-0.5 transition-all">
            <div className="drop-shadow-[0_5px_4px_rgba(0,0,0,0.35)] group-hover:drop-shadow-none transition-all">
              <Image
                src={item.img}
                alt={item.label}
                width={45}
                height={45}
                className="object-contain"
              />
            </div>
            <span className="text-[9px] font-black text-gray-600 uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const AboutUsView = ({ setView }: ViewProps) => {
  const builderData = useContext(BuilderContext);
  const companyName = builderData?.companyName?.trim() ? builderData.companyName.trim() : "-";
  const [sections, setSections] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSections = async () => {
      if (!builderData?._id) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/about-section/user/${builderData._id}`);
        const result = await response.json();
        if (result.status === "Success") {
          setSections(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch about sections:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, [builderData?._id]);

  const getSectionImage = (imageName: string) => {
    if (imageName) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/v1/api";
      const baseUrl = apiUrl.split("/v1/api")[0];
      return `${baseUrl}/builder/${imageName}`;
    }
    return "";
  };

  return (
    <div className="px-6 space-y-4 text-gray-800 pb-10 pt-4">
      <div className="flex items-center justify-center bg-[#6B849E] py-3 px-4 rounded-t-xl rounded-b-none font-black shadow-md border border-white/20 border-b-0 mb-4">
        <span className="text-white font-black text-sm">{companyName}</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent animate-spin rounded-full" />
        </div>
      ) : sections.length > 0 ? (
        <div className="space-y-8 pt-2 overflow-hidden">
          {sections.map((section) => (
            <div key={section._id} className="space-y-4 break-words overflow-hidden">
              <div className="border-b-2 border-gray-200 pb-1.5 flex items-center justify-between">
                <h2 className="text-xl font-black text-[#333333] uppercase">{section.title}</h2>
              </div>

              {section.image && (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                  <Image
                    src={getSectionImage(section.image)}
                    alt={section.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              <div
                className="text-sm font-medium leading-relaxed text-gray-700 text-left rich-content"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 font-bold">No about information added yet</div>
      )}
    </div>
  );
};

export const AppointmentView = ({ setView }: ViewProps) => {
  const builderData = useContext(BuilderContext);
  const companyName = builderData?.companyName?.trim() ? builderData.companyName.trim() : "-";
  const [form, setForm] = React.useState({ name: "", mobile: "", person: "", category: "", date: "", time: "", message: "" });
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleTimeSelect = (slot: string) => setForm((p) => ({ ...p, time: p.time === slot ? "" : slot }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.mobile || !form.date) return;
    try {
      setLoading(true);
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointment/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId: builderData?._id }),
      });
      setSubmitted(true);
      setForm({ name: "", mobile: "", person: "", category: "", date: "", time: "", message: "" });
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      console.error("Appointment error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div className="px-6 pt-4 pb-10 flex flex-col items-center justify-center h-full gap-4">
      <div className="text-center text-emerald-600 font-black text-sm">✓ Appointment submitted!<br /><span className="text-gray-500 font-bold text-xs">Wait for confirmation of appointment</span></div>
    </div>
  );

  return (
    <div className="px-6 space-y-4 pb-10 pt-4">
      <div className="flex items-center justify-center bg-[#6B849E] py-3 px-4 rounded-t-xl rounded-b-none font-black shadow-md border border-white/20 border-b-0 mb-4">
        <span className="text-white font-black text-sm">{companyName}</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
        <div className="space-y-1">
          <input type="text" placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-white rounded-full py-3 px-6 text-sm font-bold border border-gray-200 outline-none shadow-sm focus:border-blue-300 transition-colors" />
        </div>
        <div className="space-y-1">
          <input type="text" placeholder="Mobile" required value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="w-full bg-white rounded-full py-3 px-6 text-sm font-bold border border-gray-200 outline-none shadow-sm focus:border-blue-300 transition-colors" />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-black text-red-500 ml-5 uppercase tracking-tighter">Optional</label>
          <div className="relative">
            <select value={form.person} onChange={(e) => setForm({ ...form, person: e.target.value })} className="w-full bg-white rounded-full py-3 px-6 text-sm font-bold border border-gray-200 outline-none shadow-sm appearance-none text-gray-500">
              <option value="">Select Person</option>
            </select>
            <ChevronRight className="absolute right-5 top-3.5 text-blue-900 rotate-90" size={18} />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-black text-red-500 ml-5 uppercase tracking-tighter">Optional</label>
          <div className="relative">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-white rounded-full py-3 px-6 text-sm font-bold border border-gray-200 outline-none shadow-sm appearance-none text-gray-500">
              <option value="">Select category</option>
              {/* <option>Consultation</option>
              <option>Follow-up</option>
              <option>Emergency</option>
              <option>Routine Checkup</option> */}
            </select>
            <ChevronRight className="absolute right-5 top-3.5 text-blue-900 rotate-90" size={18} />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-black text-gray-500 ml-5 uppercase tracking-tighter">Date</label>
          <div className="relative">
            <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-white rounded-full py-3 px-6 text-sm font-bold border border-gray-200 outline-none shadow-sm text-gray-700" />
            <Calendar className="absolute right-5 top-3 text-[#A855F7] pointer-events-none" size={20} />
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <p className="text-[11px] font-black text-red-500 uppercase tracking-tighter">First Half Meeting Time Hours - <span className="text-gray-900">Select</span></p>
          <div className="grid grid-cols-4 gap-2">
            {['10:00 - 11:00', '11:00 - 12:00', '12:00 - 01:00', '01:00 - 02:00'].map((slot) => (
              <div key={slot} onClick={() => handleTimeSelect(slot)} className={`text-[9px] font-bold py-2 text-center rounded-lg border shadow-sm cursor-pointer transition-colors whitespace-nowrap ${form.time === slot ? 'bg-[#003B46] text-white border-[#003B46]' : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50'}`}>{slot}</div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-black text-red-500 uppercase tracking-tighter">Second Half Meeting Time Hours - <span className="text-gray-900">Select</span></p>
          <div className="grid grid-cols-4 gap-2">
            {['04:00 - 05:00', '05:00 - 06:00', '06:00 - 07:00', '07:00 - 08:00'].map((slot) => (
              <div key={slot} onClick={() => handleTimeSelect(slot)} className={`text-[9px] font-bold py-2 text-center rounded-lg border shadow-sm cursor-pointer transition-colors whitespace-nowrap ${form.time === slot ? 'bg-[#003B46] text-white border-[#003B46]' : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50'}`}>{slot}</div>
            ))}
          </div>
        </div>

        <textarea placeholder="Text Massage if any" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full bg-white rounded-2xl py-4 px-6 text-sm font-bold border border-gray-200 outline-none h-28 resize-none shadow-sm placeholder:text-gray-400" />

        <div className="flex flex-col items-center gap-4 pt-2">
          <p className="text-sm font-black text-[#333333]">Wait for confirmation of appointment</p>
          <button type="submit" disabled={loading} className="w-1/3 bg-[#e8f0f7] py-2.5 rounded-lg font-black text-[#333333] shadow-md border border-gray-300 hover:bg-white transition-all uppercase tracking-widest text-sm">
            {loading ? <div className="h-4 w-4 border-2 border-gray-600 border-t-transparent animate-spin rounded-full mx-auto" /> : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export const PhotoGalleryView = ({ setView }: ViewProps) => {
  const builderData = useContext(BuilderContext);
  const companyName = builderData?.companyName?.trim() ? builderData.companyName.trim() : "-";
  const [photos, setPhotos] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<"General" | "Awarded">("General");
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const fetchPhotos = async () => {
      if (!builderData?._id) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery-image/user/${builderData._id}`);
        const result = await response.json();
        if (result.status === "Success") {
          setPhotos(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch photos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [builderData?._id]);

  const getImageUrl = (imageName: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/v1/api";
    const baseUrl = apiUrl.split("/v1/api")[0];
    return `${baseUrl}/builder/${imageName}`;
  };

  const filteredPhotos = photos.filter((p) => p.category === activeTab);
  const currentPhoto = filteredPhotos[currentIndex];

  const handleTabChange = (tab: "General" | "Awarded") => {
    setActiveTab(tab);
    setCurrentIndex(0);
  };

  return (
    <div className="px-4 space-y-4 pt-4 pb-10">
      <div className="flex items-center justify-center bg-[#6B849E] py-3 px-4 rounded-t-xl rounded-b-none font-black shadow-md border border-white/20 border-b-0 mb-4">
        <span className="text-white font-black text-sm">{companyName}</span>
      </div>

      <div className="relative">
        {currentPhoto?.title && (
          <div className="mb-3 flex justify-start">
            <span className="bg-white px-5 py-2 rounded-xl text-[12px] font-bold text-[#003B46] shadow-sm border border-gray-100/50">
              {currentPhoto.title}
            </span>
          </div>
        )}
        <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[3/4] bg-gray-100 border border-gray-200">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent animate-spin rounded-full" />
            </div>
          ) : currentPhoto ? (
            <>
              <Image
                src={getImageUrl(currentPhoto.image)}
                alt="Gallery"
                fill
                className="object-cover"
                unoptimized
              />

              {/* Dots / Pager */}
              {filteredPhotos.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 px-4 z-10">
                  {filteredPhotos.slice(0, 5).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${currentIndex === idx ? "w-6 bg-white shadow-sm" : "w-1.5 bg-white/40"}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <ImageIcon size={48} />
              <p className="text-xs font-bold mt-2 uppercase">No {activeTab} Photos</p>
            </div>
          )}
        </div>

        {/* Navigation Arrows Outside */}
        {filteredPhotos.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredPhotos.length - 1))}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev < filteredPhotos.length - 1 ? prev + 1 : 0))}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => handleTabChange("General")}
          className={`px-8 py-2 rounded-xl text-xs font-black shadow-md border transition-all ${activeTab === 'General' ? 'bg-[#003B46] text-white border-[#003B46]' : 'bg-white text-gray-600 border-gray-200'}`}
        >
          General
        </button>
        <button
          onClick={() => handleTabChange("Awarded")}
          className={`px-8 py-2 rounded-xl text-xs font-black shadow-md border transition-all ${activeTab === 'Awarded' ? 'bg-[#003B46] text-white border-[#003B46]' : 'bg-white text-gray-600 border-gray-200'}`}
        >
          Awarded
        </button>
      </div>
    </div>
  );
};

export const ContactPersonView = ({ setView }: ViewProps) => {
  const builderData = useContext(BuilderContext);
  const companyName = builderData?.companyName?.trim() ? builderData.companyName.trim() : "-";
  const [persons, setPersons] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPersons = async () => {
      if (!builderData?._id) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact-person/user/${builderData._id}`);
        const result = await response.json();
        if (result.status === "Success") {
          setPersons(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch contact persons:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPersons();
  }, [builderData?._id]);

  const getPersonImage = (imageName: string) => {
    if (imageName) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/v1/api";
      const baseUrl = apiUrl.split("/v1/api")[0];
      return `${baseUrl}/builder/${imageName}`;
    }
    return "/profile.png";
  };

  return (
    <div className="px-6 space-y-4 pb-10 pt-4">
      <div className="flex items-center justify-center bg-[#6B849E] py-3 px-4 rounded-t-xl rounded-b-none font-black shadow-md border border-white/20 border-b-0 mb-4">
        <span className="text-white font-black text-sm">{companyName}</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent animate-spin rounded-full" />
        </div>
      ) : persons.length > 0 ? (
        persons.map((person) => (
          <div key={person._id} className="bg-white/40 rounded-2xl p-3 flex space-x-4 border border-white/60 shadow-sm backdrop-blur-sm group hover:bg-white/60 transition-all">
            <div className="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 border-2 border-black/80 shadow-md">
              <Image
                src={getPersonImage(person.image)}
                alt={person.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex flex-col justify-start pt-1 space-y-1">
              <h3 className="font-black text-[#333333] text-lg leading-tight tracking-tight">{person.name}</h3>
              <p className="text-xs font-bold text-gray-600">{person.designation}</p>
              <p className="text-xs font-bold text-gray-600">{person.role}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-10 text-gray-500 font-bold">No contact persons added yet</div>
      )}
    </div>
  );
};

export const LocationView = ({ setView }: ViewProps) => {
  const builderData = useContext(BuilderContext);
  const companyName = builderData?.companyName?.trim() ? builderData.companyName.trim() : "-";
  const [locations, setLocations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchLocations = async () => {
      if (!builderData?._id) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/location/user/${builderData._id}`);
        const result = await response.json();
        if (result.status === "Success") {
          setLocations(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, [builderData?._id]);

  return (
    <div className="px-4 space-y-6 pt-4 pb-10">
      <div className="flex items-center justify-center bg-[#6B849E] py-3 px-4 rounded-t-xl rounded-b-none font-black shadow-md border border-white/20 border-b-0 mb-4">
        <span className="text-white font-black text-sm">{companyName}</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent animate-spin rounded-full" />
        </div>
      ) : locations.length > 0 ? (
        locations.map((loc, i) => (
          <div key={loc._id} className="space-y-3 bg-white/40 p-4 rounded-2xl border border-white/60 backdrop-blur-sm">
            <h3 className="font-black text-lg text-[#003B46] uppercase border-b border-gray-100 pb-1">{loc.title}</h3>
            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex items-start space-x-2">
                <MapPin size={14} className="mt-0.5 flex-shrink-0 text-blue-600" />
                <span className="font-bold">{loc.address}</span>
              </div>
              {loc.whatsappNumber && (
                <div className="flex items-center space-x-2">
                  <Phone size={14} className="text-emerald-600" />
                  <span className="font-bold">{loc.whatsappNumber}</span>
                </div>
              )}
              {loc.email && (
                <div className="flex items-center space-x-2">
                  <Mail size={14} className="text-rose-500" />
                  <span className="font-bold">{loc.email}</span>
                </div>
              )}
              {loc.website && (
                <div className="flex items-center space-x-2">
                  <Globe size={14} className="text-blue-500" />
                  <span className="font-bold">{loc.website}</span>
                </div>
              )}
            </div>

            {loc.googleMapLink && (
              <a
                href={loc.googleMapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-32 bg-gray-200 rounded-xl overflow-hidden relative border border-gray-300 mt-2 hover:opacity-90 transition-opacity"
              >
                <Image
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=400&h=200&auto=format&fit=crop"
                  alt="Map"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <div className="bg-white px-4 py-1.5 rounded-full flex items-center space-x-2 shadow-lg">
                    <div className="bg-red-500 text-white p-1 rounded-full"><MapPin size={12} /></div>
                    <span className="text-xs font-bold">Google Map</span>
                  </div>
                </div>
              </a>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-10 text-gray-500 font-bold">No locations added yet</div>
      )}
    </div>
  );
};

export const VideoGalleryView = ({ setView }: ViewProps) => {
  const builderData = useContext(BuilderContext);
  const companyName = builderData?.companyName?.trim() ? builderData.companyName.trim() : "-";
  const [videos, setVideos] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const fetchVideos = async () => {
      if (!builderData?._id) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery-video/user/${builderData._id}`);
        const result = await response.json();
        if (result.status === "Success") {
          setVideos(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [builderData?._id]);

  const getVideoUrl = (videoName: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/v1/api";
    const baseUrl = apiUrl.split("/v1/api")[0];
    return `${baseUrl}/builder/${videoName}`;
  };

  const currentVideo = videos[currentIndex];

  return (
    <div className="px-4 space-y-4 pt-4 pb-10">
      <div className="flex items-center justify-center bg-[#6B849E] py-3 px-4 rounded-t-xl rounded-b-none font-black shadow-md border border-white/20 border-b-0 mb-4">
        <span className="text-white font-black text-sm">{companyName}</span>
      </div>

      <div className="relative">
        <div className="relative rounded-[2 rem] overflow-hidden shadow-2xl aspect-[9/16] bg-black border-[6px] border-[#003B46]/10">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent animate-spin rounded-full" />
            </div>
          ) : currentVideo ? (
            <video
              key={currentVideo._id}
              src={getVideoUrl(currentVideo.video)}
              controls
              className="w-full h-full object-cover"
              autoPlay={false}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
              <Video size={48} />
              <p className="text-xs font-bold mt-2 uppercase">No Videos Available</p>
            </div>
          )}
        </div>

        {/* Navigation Arrows Outside */}
        {videos.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : videos.length - 1))}
              className="absolute left-[-10px] top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft size={36} />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev < videos.length - 1 ? prev + 1 : 0))}
              className="absolute right-[-10px] top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <ChevronRight size={36} />
            </button>
          </>
        )}
      </div>

      {videos.length > 0 && (
        <div className="text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
            Video {currentIndex + 1} of {videos.length}
          </p>
        </div>
      )}
    </div>
  );
};

export const BrochureView = ({ setView }: ViewProps) => {
  const builderData = useContext(BuilderContext);
  const companyName = builderData?.companyName?.trim() ? builderData.companyName.trim() : "-";
  const [brochures, setBrochures] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBrochures = async () => {
      if (!builderData?._id) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brochure/user/${builderData._id}`);
        const result = await response.json();
        if (result.status === "Success") {
          setBrochures(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch brochures:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrochures();
  }, [builderData?._id]);

  const getFileUrl = (fileName: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/v1/api";
    const baseUrl = apiUrl.split("/v1/api")[0];
    return `${baseUrl}/builder/${fileName}`;
  };

  return (
    <div className="px-6 space-y-6 pt-4 pb-10">
      <div className="flex items-center justify-center bg-[#6B849E] py-3 px-4 rounded-t-xl rounded-b-none font-black shadow-md border border-white/20 border-b-0 mb-4">
        <span className="text-white font-black text-sm">{companyName}</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent animate-spin rounded-full" />
        </div>
      ) : brochures.length > 0 ? (
        brochures.map((item) => (
          <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 mb-4">
            <div className="bg-[#003B46] p-4 flex items-center justify-between">
              <div className="text-white">
                <div className="text-xs font-serif tracking-widest uppercase truncate max-w-[150px]">{item.title}</div>
                <div className="text-[8px] tracking-[0.3em] uppercase">{builderData?.companyName || "-"}</div>
              </div>
              <div className="relative w-12 h-12 rounded-md overflow-hidden bg-white/10 flex items-center justify-center">
                <FileText className="text-white/50" />
              </div>
            </div>
            <div className="p-4 flex items-center space-x-4">
              <div className="bg-red-500 p-2 rounded-lg text-white">
                <FileText size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-gray-800 truncate">{item.title}</p>
                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">PDF • {item.fileSize}</p>
              </div>
              <button
                onClick={() => window.open(getFileUrl(item.file), '_blank')}
                className="bg-gray-100 p-2.5 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Download size={20} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <FileText className="mx-auto text-gray-300 mb-2" size={40} />
          <p className="text-gray-400 font-bold text-xs uppercase">No Brochures Available</p>
        </div>
      )}

      {brochures.length > 0 && (
        <div className="space-y-4">

          <button className="w-full bg-[#003B46] py-3 rounded-md font-bold text-white shadow-lg uppercase tracking-widest text-sm">Send Inquiry</button>
        </div>
      )}
    </div>
  );
};

export const InquiryView = ({ setView }: ViewProps) => {
  const builderData = useContext(BuilderContext);
  const companyName = builderData?.companyName?.trim() ? builderData.companyName.trim() : "-";
  const [formData, setFormData] = React.useState({
    name: "",
    mobile: "",
    email: "",
    message: ""
  });
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!builderData?._id) return;
    if (!formData.name || !formData.mobile || !formData.message) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inquiry/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId: builderData._id }),
      });
      const result = await response.json();
      if (result.status === "Success") {
        setSubmitted(true);
        setFormData({ name: "", mobile: "", email: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        alert(result.message || "Failed to submit inquiry");
      }
    } catch (error) {
      console.error("Inquiry error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 space-y-4 pt-4 pb-10">
      <div className="flex items-center justify-center bg-[#6B849E] py-3 px-4 rounded-t-xl rounded-b-none font-black shadow-md border border-white/20 border-b-0 mb-4">
        <span className="text-white font-black text-sm">{companyName}</span>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl text-center space-y-3 animate-in fade-in zoom-in duration-300">
          <div className="h-16 w-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Check size={32} />
          </div>
          <h3 className="text-emerald-900 font-black uppercase text-sm">Thank You!</h3>
          <p className="text-emerald-600 text-[10px] font-bold">Your inquiry has been submitted successfully. Our team will contact you soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-white rounded-full py-2.5 px-4 text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-bold"
          />
          <input
            type="text"
            placeholder="Mobile"
            required
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            className="w-full bg-white rounded-full py-2.5 px-4 text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-bold"
          />
          <input
            type="email"
            placeholder="Email (Optional)"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-white rounded-full py-2.5 px-4 text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-bold"
          />
          <textarea
            placeholder="Inquiry Details"
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-white rounded-2xl py-3 px-4 text-sm border border-gray-200 outline-none h-32 resize-none shadow-sm focus:ring-2 focus:ring-blue-500/10 transition-all font-bold"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#003B46] py-3.5 rounded-full font-black text-white shadow-xl shadow-[#003B46]/20 flex items-center justify-center gap-2 transition-all active:scale-95 uppercase tracking-widest text-xs"
          >
            {loading ? <div className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full" /> : "Submit Inquiry"}
          </button>
        </form>
      )}
    </div>
  );
};

export const DropboxView = ({ setView }: ViewProps) => {
  const builderData = useContext(BuilderContext);
  const companyName = builderData?.companyName?.trim() ? builderData.companyName.trim() : "-";
  return (
    <div className="px-6 space-y-4 pt-4 pb-10">
      <div className="flex items-center justify-between bg-[#6B849E] py-2.5 px-4 rounded-xl font-black shadow-md border border-white/20">
        <button onClick={() => setView('dashboard')} className="flex-shrink-0 text-white hover:opacity-80 transition-opacity">
          <ChevronLeft size={24} />
        </button>
        <span className="flex-1 text-center text-white font-black text-sm">{companyName}</span>
        <div className="w-6" />
      </div>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-gray-700 whitespace-nowrap">Name :</span>
          <input type="text" className="flex-1 bg-white rounded-full py-1.5 px-4 text-sm border border-gray-200 outline-none" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-gray-700 whitespace-nowrap">Mobile :</span>
          <input type="text" className="flex-1 bg-white rounded-full py-1.5 px-4 text-sm border border-gray-200 outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700 ml-1">Company Name</label>
          <input type="text" className="w-full bg-white rounded-xl py-2 px-4 text-sm border border-gray-200 outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700 ml-1">Mention Changes</label>
          <textarea className="w-full bg-white rounded-xl py-2 px-4 text-sm border border-gray-200 outline-none h-24 resize-none" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 ml-1">Images</label>
          <div className="flex space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-20 h-20 bg-white rounded-xl border border-gray-200"></div>
            ))}
            <button className="w-10 h-20 flex items-center justify-center text-red-500"><Plus size={32} /></button>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700 ml-1">Video link</label>
          <div className="flex items-center space-x-2">
            <input type="text" className="flex-1 bg-white rounded-md py-1.5 px-4 text-sm border border-gray-200 outline-none" />
            <button className="text-red-500"><Plus size={24} /></button>
          </div>
        </div>
        <p className="text-[10px] text-gray-600 text-center pt-2">updates as son as possible from my side, <span className="font-bold">Thanks</span></p>
        <button className="w-full bg-white py-2 rounded-md font-bold text-gray-800 shadow-sm border border-gray-200">Submit</button>
      </div>
    </div>
  );
};

export const PopupView = ({ setView }: ViewProps) => {
  const builderData = useContext(BuilderContext);
  const [popup, setPopup] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchActivePopup = async () => {
      if (!builderData?._id) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/popup/active/${builderData._id}`);
        const result = await response.json();
        if (result.status === "Success") {
          setPopup(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch active popup:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivePopup();
  }, [builderData?._id]);

  const getImageUrl = (imageName: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/v1/api";
    const baseUrl = apiUrl.split("/v1/api")[0];
    return `${baseUrl}/builder/${imageName}`;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent animate-spin rounded-full" /></div>;
  }

  if (!popup) {
    // If no active popup, skip directly to dashboard
    setView('dashboard');
    return null;
  }

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] w-full max-w-[340px] relative shadow-2xl overflow-hidden border-4 border-white animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
        <button
          onClick={(e) => { e.stopPropagation(); setView('dashboard'); }}
          className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/30 transition-all z-50 shadow-md"
        >
          <X size={18} strokeWidth={3} />
        </button>

        {popup.image && (
          <div className={`relative w-full shrink-0 overflow-hidden rounded-b-[40px] ${popup.content ? 'h-[280px]' : 'h-[360px]'}`}>
            <Image
              src={getImageUrl(popup.image)}
              alt="Promotion"
              fill
              className="object-contain bg-gray-100"
              unoptimized
            />
          </div>
        )}

        {popup.content && (
          <div className={`px-6 pt-8 pb-4 flex flex-col items-center text-center overflow-y-auto`}>
            {!popup.image && (
              <div className="h-16 w-16 bg-blue-50 shrink-0 rounded-3xl flex items-center justify-center text-blue-600 mb-4">
                <Bell size={32} />
              </div>
            )}
            <p className="text-[14px] font-black text-gray-800 leading-relaxed break-words whitespace-pre-wrap w-full text-center">
              {popup.content}
            </p>
          </div>
        )}

        <div className="p-5 pt-2 mt-auto w-full">
          <button
            onClick={() => setView('dashboard')}
            className="w-full bg-[#003B46] text-white py-3.5 rounded-2xl font-black shadow-lg hover:bg-opacity-90 transition-all text-xs tracking-widest uppercase"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdvertisementView = ({ setView, adTab = 'Upcoming' }: { setView: (v: View) => void; adTab?: 'Upcoming' | 'Running' | 'Completed' }) => {
  const builderData = useContext(BuilderContext);
  const [ads, setAds] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const companyName = builderData?.companyName?.trim() ? builderData.companyName.trim() : "MK GROUP";

  React.useEffect(() => {
    setCurrentIndex(0);
  }, [adTab]);

  React.useEffect(() => {
    const fetchAds = async () => {
      const userId = builderData?.userId || builderData?._id;
      if (!userId) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/advertisement/user/${userId}`);
        const result = await response.json();
        if (result.status === "Success") {
          setAds(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch ads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, [builderData?.userId, builderData?._id]);

  const getImageUrl = (imageName: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/v1/api";
    const baseUrl = apiUrl.split("/v1/api")[0];
    return `${baseUrl}/builder/${imageName}`;
  };

  const filteredAds = ads.filter((a) => a.type === adTab);
  const currentAd = filteredAds[currentIndex];

  return (
    <div className="px-4 space-y-4 pt-4 pb-6">
      <div className="flex items-center justify-between bg-[#6B849E] py-2.5 px-4 rounded-xl font-black shadow-md border border-white/20">
        <button onClick={() => setView('dashboard')} className="flex-shrink-0 text-white hover:opacity-80 transition-opacity">
          <ChevronLeft size={24} />
        </button>
        <span className="flex-1 text-center text-white font-black text-sm">{companyName}</span>
        <div className="w-6" />
      </div>

      <div className="relative ">
        {currentAd?.note && (
          <div className="mb-3 flex justify-start">
            <div className="w-full">
              <span className="inline-block bg-white px-5 py-2.5 rounded-2xl text-[12px] font-bold text-[#003B46] shadow-sm border border-gray-100/50 break-words max-w-full">
                {currentAd.note}
              </span>
            </div>
          </div>
        )}
        <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[3/4] bg-gray-100 border border-gray-200">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent animate-spin rounded-full" />
            </div>
          ) : currentAd ? (
            <>
              <Image
                src={getImageUrl(currentAd.image)}
                alt="Advertisement"
                fill
                className="object-cover"
                unoptimized
              />
              {filteredAds.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 px-4 z-10">
                  {filteredAds.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${currentIndex === idx ? "w-6 bg-white shadow-sm" : "w-1.5 bg-white/40"}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <ImageIcon size={48} />
              <p className="text-xs font-bold mt-2 uppercase">No {adTab} Projects</p>
            </div>
          )}
        </div>

        {filteredAds.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredAds.length - 1))}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev < filteredAds.length - 1 ? prev + 1 : 0))}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
