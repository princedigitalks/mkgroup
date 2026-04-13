'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Phone, MapPin, Clock, Globe, Share2, Edit, User, Info, Calendar, 
  Image as ImageIcon, Video, HelpCircle, FileText, MessageSquare, 
  Star, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, Box, 
  Mail, Mic, Plus, Download, Bell, Eye, Send
} from 'lucide-react';
import { useContext } from 'react';
import { BuilderContext } from '@/app/page';

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

interface ViewProps {
  setView: (v: View) => void;
}

interface HomeViewProps extends ViewProps {
  startFromHome: boolean;
  setStartFromHome: (v: boolean) => void;
}

const ContactItem = ({ icon: Icon, text, isName = false, isAddress = false }: { icon: any, text: string | React.ReactNode, isName?: boolean, isAddress?: boolean }) => (
  <div className="bg-white rounded-2xl flex items-stretch shadow-sm border border-gray-200 overflow-hidden h-10 w-full">
    <div className="w-10 flex items-center justify-center text-gray-700 flex-shrink-0">
      <Icon size={18} strokeWidth={2.5} className={Icon === Send ? 'rotate-0' : ''} />
    </div>
    <div className="w-[1.5px] bg-gray-200 my-1.5" />
    <div className={`flex-1 flex items-center px-4 ${isAddress ? 'py-1' : ''}`}>
      <span className={`${isName ? 'font-black text-sm' : 'font-bold text-xs'} text-gray-800 tracking-tight leading-none`}>
        {text}
      </span>
    </div>
  </div>
);

export const HomeView = ({ setView, startFromHome, setStartFromHome }: HomeViewProps) => {
  const builderData = useContext(BuilderContext);
  const name = builderData?.name || "HIRENBHAI K. PATEL";
  const number = builderData?.number || "9825222223";
  const location = builderData?.location || "B-86 Trikam Nagar Society, Near V-1 Bombay Market, L.H Road, Surat -395003";
  const timing = builderData?.timing || "10 am to 2 pm & 5 pm to 7 pm";
  const website = builderData?.website || "www.mkgroup.com";
  
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
    <div className="flex flex-col items-center px-12 space-y-6 w-full h-full justify-center mt-4">
      <div className="relative w-44 h-44 rounded-full  shadow-lg mb-2 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 z-10" />
        <Image 
          src={getProfileImage()} 
          alt={name} 
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </div>

      <div className="w-full space-y-2.5">
        <ContactItem icon={User} text={name} isName />
        <ContactItem icon={Phone} text={number} />
        <div className="bg-white rounded-2xl flex items-stretch shadow-sm border border-gray-200 overflow-hidden h-14 w-full">
          <div className="w-10 flex items-center justify-center text-gray-700 flex-shrink-0">
            <MapPin size={18} strokeWidth={2.5} />
          </div>
          <div className="w-[1.5px] bg-gray-200 my-2" />
          <div className="flex-1 flex items-center px-4 py-1">
            <span className="font-bold text-gray-800 text-[11px] leading-snug tracking-tight">
              {location}
            </span>
          </div>
        </div>
        <ContactItem icon={Clock} text={timing} />
        <ContactItem icon={Send} text={website} />
      </div>

      <div 
        className="w-full bg-[#003B46] rounded-2xl p-5 flex flex-col items-center justify-center text-white cursor-pointer hover:opacity-95 transition-all shadow-xl border-2 border-white/30 h-28 mt-2"
      >
        {logoUrl ? (
          <div className="flex flex-col items-center gap-2 w-full h-full">
            <div className="relative w-20 h-10">
              <Image 
                src={logoUrl} 
                alt="Logo" 
                fill 
                className="object-contain" 
                unoptimized
              />
            </div>
            <div className="text-xl font-black tracking-[0.2em] leading-tight uppercase truncate max-w-full">
              {builderData?.companyName || "MK GROUP"}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-[4px] h-5 bg-white rounded-full" />
              <div className="relative w-4.5 h-4.5 bg-white rounded-sm flex items-center justify-center">
                 <div className="text-[#003B46] font-black text-[9px]">H</div>
              </div>
            </div>
            <div className="text-2xl font-black tracking-[0.2em] leading-tight uppercase">
              {builderData?.companyName || "MK GROUP"}
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

        <div className='flex items-center mx-4 mb-5'>
          <button
            type="button"
            aria-pressed={startFromHome}
            onClick={() => {
              const next = !startFromHome;
              setStartFromHome(next);
              if (next) {
                // Delay the navigation to dashboard to let the "ON" state be visible
                setTimeout(() => {
                  setView('dashboard');
                }, 500);
              }
            }}
            className="relative w-36 h-11 flex items-center group"
          >
            <div 
              className={`absolute inset-0 rounded-full transition-colors duration-300 border-[3.5px] border-white shadow-lg ${
                startFromHome ? 'bg-[#32CD32]' : 'bg-red-600'
              }`} 
            />
            <div
              className={`absolute w-[60px] h-8 bg-white rounded-full shadow-md border border-gray-100 transition-transform duration-300 z-10 ${
                startFromHome ? 'translate-x-1.5' : 'translate-x-[68px]'
              }`}
            />
            <div className="absolute inset-0 flex items-center justify-around px-4 z-0">
              <span className={`text-[10px] font-black transition-opacity duration-300 ${startFromHome ? 'opacity-0' : 'text-white opacity-100 ml-[-20px]'}`}>OFF</span>
              <span className={`text-xs font-black transition-opacity duration-300 ${startFromHome ? 'text-white opacity-100 ml-[40px]' : 'opacity-0'}`}>ON</span>
            </div>
          </button>
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
    </div>
  );
};

export const DashboardView = ({ setView }: ViewProps) => {
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
    <div className="relative flex flex-col items-center w-full">
      <div className="absolute -top-2 z-20 flex items-center bg-[#E5ECEA] rounded-full border border-gray-300 shadow-sm pl-2 pr-1 py-1">
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

      <div className="w-full bg-[#002D35] rounded-[32px] p-8 flex flex-col items-center justify-center text-white relative overflow-hidden border-[6px] border-[#E5ECEA] border-t-[20px] shadow-xl min-h-[160px] mt-2">
        <div className="relative z-10 flex flex-col items-center w-full h-full">
          {logoUrl ? (
            <div className="relative w-40 h-24">
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
    </div>

    <div className="grid grid-cols-6 gap-2 w-full px-2">
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
            if (builderData?.messageNumber) window.open(`sms:${builderData.messageNumber}`, '_self');
          }
        },
        { 
          img: '/icons/insta.png', 
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
        <div key={i} onClick={item.action} className="cursor-pointer hover:scale-105 transition-transform">
          <Image 
            src={item.img} 
            alt="icon" 
            width={55} 
            height={55} 
            className="object-contain"
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
        <button key={item.id} onClick={() => setView(item.id as View)} className="flex flex-col items-center group">
          <div className="ounded-xl shadow-[0_2px_5px_rgba(0,0,0,0.1)] ">
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

    <div className="flex space-x-2 w-full px-2">
      <button className="flex-1 flex items-center justify-center cursor-pointer transition-transform hover:scale-105">
        <Image 
          src="/select1.png" 
          alt="Save Contact" 
          width={180} 
          height={50} 
          className="object-contain"
        />
      </button>
      <button className="flex-1 flex items-center justify-center cursor-pointer transition-transform hover:scale-105">
        <Image 
          src="/selete2.png" 
          alt="Select Languages" 
          width={180} 
          height={50} 
          className="object-contain"
        />
      </button>
    </div>

    <div className="grid grid-cols-5 gap-2 w-full pt-2 pb-4">
      {[
        { label: 'Testimonials', img: '/icons/t1.png' },
        { label: 'Rating', img: '/icons/t2.png' },
        { label: 'Popup', img: '/icons/t3.png', action: () => setView('popup') },
        { label: 'Feedback', img: '/icons/t4.png' },
        { label: 'Like', img: '/icons/t5.png' },
      ].map((item, i) => (
        <button key={i} onClick={item.action} className="flex flex-col items-center space-y-1.5">
          <div>
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

export const AboutUsView = () => {
  const builderData = useContext(BuilderContext);
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
      <div className="bg-[#6B849E] text-white py-2.5 px-4 rounded-xl text-center font-black text-sm shadow-md border border-white/20 uppercase tracking-widest">
        {builderData?.companyName || "M K GROUP"}
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

export const AppointmentView = () => (
  <div className="px-6 space-y-4 pb-10 pt-4">
    <div className="bg-[#6B849E] text-white py-2.5 px-4 rounded-xl text-center font-black text-sm shadow-md border border-white/20 uppercase tracking-widest">Make an appointment</div>
    <div className="space-y-3.5 mt-4">
      <div className="space-y-1">
        <input type="text" placeholder="Name" className="w-full bg-white rounded-full py-3 px-6 text-sm font-bold border border-gray-200 outline-none shadow-sm focus:border-blue-300 transition-colors" />
      </div>
      <div className="space-y-1">
        <input type="text" placeholder="Mobile" className="w-full bg-white rounded-full py-3 px-6 text-sm font-bold border border-gray-200 outline-none shadow-sm focus:border-blue-300 transition-colors" />
      </div>
      
      <div className="space-y-1">
        <label className="text-[11px] font-black text-red-500 ml-5 uppercase tracking-tighter">Optional</label>
        <div className="relative">
          <select className="w-full bg-white rounded-full py-3 px-6 text-sm font-bold border border-gray-200 outline-none shadow-sm appearance-none text-gray-500">
            <option>Select Person</option>
          </select>
          <ChevronRight className="absolute right-5 top-3.5 text-blue-900 rotate-90" size={18} />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-black text-red-500 ml-5 uppercase tracking-tighter">Optional</label>
        <div className="relative">
          <select className="w-full bg-white rounded-full py-3 px-6 text-sm font-bold border border-gray-200 outline-none shadow-sm appearance-none text-gray-500">
            <option>Select category</option>
          </select>
          <ChevronRight className="absolute right-5 top-3.5 text-blue-900 rotate-90" size={18} />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-black text-gray-500 ml-5 uppercase tracking-tighter">Date</label>
        <div className="relative">
          <input type="text" value="8 May, 2025" readOnly className="w-full bg-white rounded-full py-3 px-6 text-sm font-bold border border-gray-200 outline-none shadow-sm text-gray-700" />
          <Calendar className="absolute right-5 top-3 text-[#A855F7]" size={20} />
        </div>
      </div>

      <div className="space-y-2 pt-1">
        <p className="text-[11px] font-black text-red-500 uppercase tracking-tighter">First Half Meeting Time Hours - <span className="text-gray-900">Select</span></p>
        <div className="grid grid-cols-4 gap-2">
          {['10:00 - 11:00', '11:00 - 12:00', '12:00 - 01:00', '01:00 - 02:00'].map((time) => (
            <div key={time} className="bg-white text-[9px] font-bold py-2 text-center rounded-lg border border-gray-200 shadow-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors whitespace-nowrap">{time}</div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[11px] font-black text-red-500 uppercase tracking-tighter">Second Half Meeting Time Hours - <span className="text-gray-900">Select</span></p>
        <div className="grid grid-cols-4 gap-2">
          {['04:00 - 05:00', '05:00 - 06:00', '06:00 - 07:00', '07:00 - 08:00'].map((time) => (
            <div key={time} className="bg-white text-[9px] font-bold py-2 text-center rounded-lg border border-gray-200 shadow-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors whitespace-nowrap">{time}</div>
          ))}
        </div>
      </div>

      <textarea placeholder="Text Massage if any" className="w-full bg-white rounded-2xl py-4 px-6 text-sm font-bold border border-gray-200 outline-none h-28 resize-none shadow-sm placeholder:text-gray-400" />
      
      <div className="flex flex-col items-center gap-4 pt-2">
        <p className="text-sm font-black text-[#333333]">Wait for confirmation of appointment</p>
        <button className="w-1/3 bg-[#e8f0f7] py-2.5 rounded-lg font-black text-[#333333] shadow-md border border-gray-300 hover:bg-white transition-all uppercase tracking-widest text-sm">Submit</button>
      </div>
    </div>
  </div>
);

export const PhotoGalleryView = () => (
  <div className="px-4 space-y-4 pt-4 pb-10">
    <div className="bg-[#6B849E] text-white py-2 px-4 rounded-md text-center font-bold text-sm shadow-sm border border-white/20">Photo Gallery</div>
    <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[3/4]">
      <Image 
        src="https://picsum.photos/seed/building/600/800" 
        alt="Ananta Heights" 
        fill
        className="object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
    <div className="flex justify-center space-x-4">
      <button className="bg-white px-6 py-1.5 rounded-md text-xs font-bold shadow-sm border border-gray-200">General</button>
      <button className="bg-white px-6 py-1.5 rounded-md text-xs font-bold shadow-sm border border-gray-200">Awarded</button>
    </div>
  </div>
);

export const ContactPersonView = () => {
  const builderData = useContext(BuilderContext);
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
    <div className="bg-[#6B849E] text-white py-2.5 px-4 rounded-xl text-center font-black text-sm shadow-md border border-white/20 uppercase tracking-widest mb-4">
      {builderData?.companyName || "M K GROUP"}
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
          <div className="flex flex-col justify-center space-y-1">
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

export const LocationView = () => {
  const builderData = useContext(BuilderContext);
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
      <div className="bg-[#6B849E] text-white py-2 px-4 rounded-md text-center font-bold text-sm shadow-sm border border-white/20">Location and Address</div>
      
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

export const VideoGalleryView = () => (
  <div className="px-4 space-y-4 pt-4 pb-10">
    <div className="bg-[#6B849E] text-white py-2 px-4 rounded-md text-center font-bold text-sm shadow-sm border border-white/20">Video Gallery</div>
    <div className="relative aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl">
      <Image src="https://picsum.photos/seed/video/600/1000" alt="Video Placeholder" fill className="object-cover opacity-80" referrerPolicy="no-referrer" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/50">
          <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
        </div>
      </div>
      <div className="absolute bottom-10 left-6 right-6 text-white space-y-2">
        <div className="bg-orange-500/90 px-4 py-1 rounded-md inline-block text-sm font-bold">નવી અને શાનદાર જીવનશૈલી!</div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-full"></div>
          <span className="text-sm font-bold">Ananta Heights</span>
        </div>
      </div>
    </div>
    <div className="bg-[#6B849E] text-white py-2 px-4 rounded-md text-center font-bold text-sm flex items-center justify-between">
      <ChevronLeft /><span className="text-xs">Select and Play</span><ChevronRight />
    </div>
  </div>
);

export const BrochureView = () => (
  <div className="px-6 space-y-6 pt-4 pb-10">
    <div className="bg-[#6B849E] text-white py-2 px-4 rounded-md text-center font-bold text-sm shadow-sm border border-white/20">Brochures PDF File</div>
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
      <div className="bg-[#003B46] p-4 flex items-center justify-between">
        <div className="text-white">
          <div className="text-xs font-serif tracking-widest">ANANTA</div>
          <div className="text-[8px] tracking-[0.3em]">HEIGHTS</div>
        </div>
        <div className="relative w-12 h-12 rounded-md overflow-hidden">
          <Image src="https://picsum.photos/seed/mini/100/100" alt="Mini" fill className="object-cover" referrerPolicy="no-referrer" />
        </div>
      </div>
      <div className="p-4 flex items-center space-x-4">
        <div className="bg-red-500 p-2 rounded-lg text-white"><FileText size={24} /></div>
        <div className="flex-1">
          <p className="text-[10px] text-gray-600 leading-tight">Ananta Heights offers a beautifully designed space that you&apos;ll love to call home.</p>
          <p className="text-[10px] font-bold text-gray-400 mt-1">40 pages • PDF • 18 MB</p>
        </div>
        <button className="bg-gray-100 p-2 rounded-full text-gray-400"><Download size={20} /></button>
      </div>
      <div className="px-4 pb-2 text-right text-[10px] text-gray-400">4:33 pm</div>
    </div>
    <textarea placeholder="Text Message if any" className="w-full bg-white rounded-2xl py-3 px-4 text-sm border border-gray-200 outline-none h-24 resize-none" />
    <button className="w-full bg-[#6B849E] py-3 rounded-md font-bold text-white shadow-md">Download Brochure</button>
  </div>
);

export const InquiryView = () => (
  <div className="px-6 space-y-4 pt-4 pb-10">
    <div className="bg-[#6B849E] text-white py-2 px-4 rounded-md text-center font-bold text-sm shadow-sm border border-white/20">INQUIRY</div>
    <div className="space-y-3">
      <input type="text" placeholder="Name" className="w-full bg-white rounded-full py-2.5 px-4 text-sm border border-gray-200 outline-none" />
      <input type="text" placeholder="Mobile" className="w-full bg-white rounded-full py-2.5 px-4 text-sm border border-gray-200 outline-none" />
      <input type="email" placeholder="Email" className="w-full bg-white rounded-full py-2.5 px-4 text-sm border border-gray-200 outline-none" />
      <textarea placeholder="Text Massage" className="w-full bg-white rounded-2xl py-3 px-4 text-sm border border-gray-200 outline-none h-32 resize-none" />
      <div className="bg-[#6B849E]/30 rounded-full p-2 flex items-center space-x-4">
        <button className="bg-blue-600 text-white p-2 rounded-full"><Video size={16} fill="currentColor" /></button>
        <div className="flex-1 h-8 flex items-center space-x-0.5">
          {[10, 40, 60, 30, 80, 20, 50, 90, 40, 70, 30, 60, 20, 50, 80, 40, 60, 30, 70, 20].map((h, i) => (
            <div key={i} className="bg-white w-0.5" style={{ height: `${h}%` }}></div>
          ))}
        </div>
        <span className="text-[10px] text-white font-bold pr-2">01:35</span>
      </div>
      <div className="flex justify-center py-4">
        <button className="bg-gradient-to-b from-pink-500 to-purple-600 text-white p-6 rounded-full shadow-xl"><Mic size={40} /></button>
      </div>
      <button className="w-full bg-white py-2 rounded-md font-bold text-gray-800 shadow-sm border border-gray-200">Submit</button>
    </div>
  </div>
);

export const DropboxView = () => (
  <div className="px-6 space-y-4 pt-4 pb-10">
    <div className="bg-[#6B849E] text-white py-2 px-4 rounded-md text-center font-bold text-sm shadow-sm border border-white/20">Dropbox for correction</div>
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

export const PopupView = () => (
  <div className="px-6 space-y-4 pt-4 pb-10">
    <div className="bg-[#6B849E] text-white py-2 px-4 rounded-md text-center font-bold text-sm shadow-sm border border-white/20">Popup</div>
    <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
      <Image 
        src="https://picsum.photos/seed/diwali/600/800" 
        alt="Diwali" 
        fill
        className="object-cover"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-pink-900/40 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-white space-y-2">
          <div className="text-sm font-bold tracking-widest">HAPPY</div>
          <div className="text-4xl font-serif font-bold text-yellow-400">Diwali</div>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-2xl p-4 space-y-2 shadow-md border border-gray-100">
      <h4 className="text-xs font-bold text-gray-800">Important Message</h4>
      <p className="text-[10px] text-gray-600 leading-relaxed">Dear office is closed 12/11/2025 to 22/11/2025 during deepawali vocation.</p>
    </div>
  </div>
);
