'use client';

import React from 'react';
import Image from 'next/image';
import {
  Phone, MapPin, Clock, Globe, Share2, Edit, User, Info, Calendar,
  Image as ImageIcon, Video, HelpCircle, FileText, MessageSquare,
  Star, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, Box,
  Mail, Mic, Plus, Download, Bell, Eye, Send, Check, X
} from 'lucide-react';
import { useContext } from 'react';
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
  const isMobile = useIsMobile();
  const [isCheckingStatus, setIsCheckingStatus] = React.useState(false);

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
    <div className="flex flex-col items-center px-6 sm:px-12 space-y-6 w-full h-full justify-center mt-4">
  <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-gray-300 to-gray-100 p-2 shadow-xl mb-6">
  
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

        <div className='flex flex-col items-center mx-4 mb-5 gap-1.5'>
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              cursor: isCheckingStatus ? 'not-allowed' : 'pointer',
              opacity: isCheckingStatus ? 0.7 : 1,
            }}
            onClick={async () => {
              if (isCheckingStatus) return;
              if (startFromHome) {
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
                  toast.error("This profile is currently inactive. Please contact admin.");
                }
              } catch (error) {
                toast.error("Unable to verify profile status. Please try again.");
              } finally {
                setIsCheckingStatus(false);
              }
            }}
          >
            <div style={{
              isolation: 'isolate',
              position: 'relative',
              height: '42px',
              width: '84px',
              borderRadius: '21px',
              overflow: 'hidden',
              boxShadow: '-8px -4px 8px 0px #ffffff, 8px 4px 12px 0px #d1d9e6, 4px 4px 4px 0px #d1d9e6 inset, -4px -4px 4px 0px #ffffff inset',
            }}>
              <div style={{
                height: '100%',
                width: '200%',
                background: startFromHome ? '#32CD32' : '#ecf0f3',
                borderRadius: '21px',
                transform: startFromHome ? 'translate3d(25%, 0, 0)' : 'translate3d(-75%, 0, 0)',
                transition: 'transform 0.4s cubic-bezier(0.85, 0.05, 0.18, 1.35), background 0.3s',
                boxShadow: '-8px -4px 8px 0px #ffffff, 8px 4px 12px 0px #d1d9e6',
              }} />
              {isCheckingStatus && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </label>
          <div className="flex w-[84px] justify-between px-1">
            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${startFromHome ? 'text-green-600' : 'text-gray-300'}`}>ON</span>
            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${!startFromHome ? 'text-red-500' : 'text-gray-300'}`}>OFF</span>
          </div>
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
          className="w-full bg-[#002D35] rounded-[32px] p-8 flex flex-col items-center justify-center text-white relative overflow-hidden border-[6px] border-[#E5ECEA] border-t-[20px] shadow-xl min-h-[160px] mt-2 cursor-pointer hover:shadow-2xl transition-all"
        >
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

      <div className="grid grid-cols-6 sm:grid-cols-6 gap-2 w-full px-2">
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
          <div key={i} onClick={item.action} className="flex justify-center cursor-pointer hover:scale-105 transition-transform">
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
            <div className="rounded-xl shadow-[0_2px_5px_rgba(0,0,0,0.1)] ">
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
        <button
          className="flex-1 flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
        >
          <Image
            src="/select1.png"
            alt="Select language"
            width={180}
            height={50}
            className="object-contain"
          />
        </button>
        <button
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
          className="flex-1 flex items-center justify-center cursor-pointer transition-transform hover:scale-105">

          <Image
            src="/selete2.png"
            alt="Save Contact"
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

export const AppointmentView = () => {
  const builderData = useContext(BuilderContext);
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
      <div className="bg-[#6B849E] text-white py-2.5 px-4 rounded-xl text-center font-black text-sm shadow-md border border-white/20 uppercase tracking-widest">Make an appointment</div>
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

export const PhotoGalleryView = () => {
  const builderData = useContext(BuilderContext);
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
      <div className="bg-[#6B849E] text-white py-2 px-4 rounded-md text-center font-bold text-sm shadow-sm border border-white/20">
        Photo Gallery
      </div>

      <div className="relative px-8">
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

export const VideoGalleryView = () => {
  const builderData = useContext(BuilderContext);
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
      <div className="bg-[#6B849E] text-white py-2 px-4 rounded-md text-center font-bold text-sm shadow-sm border border-white/20 uppercase tracking-widest">
        Video Gallery
      </div>

      <div className="relative px-6">
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[9/16] bg-black border-[6px] border-[#003B46]/10">
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

export const BrochureView = () => {
  const builderData = useContext(BuilderContext);
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
      <div className="bg-[#6B849E] text-white py-2 px-4 rounded-md text-center font-bold text-sm shadow-sm border border-white/20 uppercase tracking-widest">
        Brochures PDF File
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
                <div className="text-[8px] tracking-[0.3em] uppercase">{builderData?.companyName || "MK GROUP"}</div>
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
          <textarea placeholder="Text Message if any" className="w-full bg-white rounded-2xl py-3 px-4 text-sm border border-gray-200 outline-none h-24 resize-none shadow-sm" />
          <button className="w-full bg-[#003B46] py-3 rounded-md font-bold text-white shadow-lg uppercase tracking-widest text-sm">Send Inquiry</button>
        </div>
      )}
    </div>
  );
};

export const InquiryView = () => {
  const builderData = useContext(BuilderContext);
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
      <div className="bg-[#6B849E] text-white py-2 px-4 rounded-md text-center font-bold text-sm shadow-sm border border-white/20 uppercase tracking-widest">
        INQUIRY
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
      <div className="bg-white rounded-[40px] w-full max-w-[340px] relative shadow-2xl overflow-hidden border-4 border-white animate-in zoom-in-95 duration-300">
        <button 
          onClick={(e) => { e.stopPropagation(); setView('dashboard'); }}
          className="absolute top-4 right-4 p-2 bg-black/10 backdrop-blur-md rounded-full text-white hover:bg-black/20 transition-all z-50"
        >
          <X size={18} strokeWidth={3} />
        </button>

        {popup.type === 'image' ? (
          <div className="relative aspect-[4/5] w-full h-[400px]">
            <Image
              src={getImageUrl(popup.image)}
              alt="Promotion"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="p-10 space-y-6 flex flex-col items-center text-center">
             <div className="h-16 w-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mb-2">
                <Bell size={32} />
             </div>
             <p className="text-lg font-black text-gray-800 leading-tight">
               {popup.content}
             </p>
             <button 
              onClick={() => setView('dashboard')}
              className="mt-4 bg-[#003B46] text-white w-full py-4 rounded-2xl font-black shadow-lg hover:scale-[1.02] transition-all text-[11px] tracking-widest uppercase"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const AdvertisementView = () => {
  const builderData = useContext(BuilderContext);
  const [ads, setAds] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<"Upcoming" | "Running" | "Completed">("Upcoming");
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const fetchAds = async () => {
      if (!builderData?._id) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/advertisement/user/${builderData._id}`);
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
  }, [builderData?._id]);

  const getImageUrl = (imageName: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/v1/api";
    const baseUrl = apiUrl.split("/v1/api")[0];
    return `${baseUrl}/builder/${imageName}`;
  };

  const filteredAds = ads.filter((a) => a.type === activeTab);
  const currentAd = filteredAds[currentIndex];

  const handleTabChange = (tab: "Upcoming" | "Running" | "Completed") => {
    setActiveTab(tab);
    setCurrentIndex(0);
  };

  return (
    <div className="px-4 space-y-4 pt-4 pb-10">
      <div className="bg-[#6B849E] text-white py-2 px-4 rounded-md text-center font-bold text-sm shadow-sm border border-white/20">
        Advertisements
      </div>

      <div className="relative px-8">
        {currentAd?.note && (
          <div className="mb-3 flex justify-start">
            <span className="bg-white px-5 py-2 rounded-xl text-[12px] font-bold text-[#003B46] shadow-sm border border-gray-100/50">
              {currentAd.note}
            </span>
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
              
              {/* Dots / Pager */}
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
              <p className="text-xs font-bold mt-2 uppercase">No {activeTab} Projects</p>
            </div>
          )}
        </div>

        {/* Navigation Arrows Outside */}
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

      <div className="flex justify-center flex-wrap gap-2">
        {["Upcoming", "Running", "Completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab as any)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black shadow-md border transition-all uppercase tracking-wider ${activeTab === tab ? 'bg-[#003B46] text-white border-[#003B46]' : 'bg-white text-gray-600 border-gray-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};
