"use client";

import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

interface SocialLink {
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  hoverColor: string;
  bgColor: string;
}

const socialLinks: SocialLink[] = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/scalptra/",
    icon: Facebook,
    color: "text-blue-400",
    hoverColor: "group-hover:text-blue-300",
    bgColor: "bg-blue-400"
  },
  // เพิ่ม social media อื่นๆ ในอนาคต
  // {
  //   name: "Twitter",
  //   url: "https://twitter.com/scalptra",
  //   icon: Twitter,
  //   color: "text-sky-400",
  //   hoverColor: "group-hover:text-sky-300",
  //   bgColor: "bg-sky-400"
  // },
  // {
  //   name: "Instagram",
  //   url: "https://instagram.com/scalptra",
  //   icon: Instagram,
  //   color: "text-pink-400",
  //   hoverColor: "group-hover:text-pink-300",
  //   bgColor: "bg-pink-400"
  // },
  // {
  //   name: "LinkedIn",
  //   url: "https://linkedin.com/company/scalptra",
  //   icon: Linkedin,
  //   color: "text-blue-500",
  //   hoverColor: "group-hover:text-blue-400",
  //   bgColor: "bg-blue-500"
  // },
  // {
  //   name: "YouTube",
  //   url: "https://youtube.com/@scalptra",
  //   icon: Youtube,
  //   color: "text-red-400",
  //   hoverColor: "group-hover:text-red-300",
  //   bgColor: "bg-red-400"
  // }
];

interface SocialMediaLinksProps {
  className?: string;
  showText?: boolean;
  layout?: 'horizontal' | 'vertical';
}

export default function SocialMediaLinks({ 
  className = "", 
  showText = true, 
  layout = 'horizontal' 
}: SocialMediaLinksProps) {
  return (
    <div className={`flex ${layout === 'vertical' ? 'flex-col' : 'flex-row'} ${layout === 'horizontal' ? 'justify-center gap-3 md:gap-4' : 'gap-3'} ${className}`}>
      {socialLinks.map((social, index) => {
        const Icon = social.icon;
        return (
          <motion.a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center ${layout === 'horizontal' ? 'gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3' : 'gap-2 px-4 py-2'} rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-500/50 transition-all duration-300 min-h-[44px] touch-manipulation`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            aria-label={`Follow SCALPTRA on ${social.name}`}
          >
            <div className="relative">
              <Icon className={`h-4 w-4 md:h-5 md:w-5 ${social.color} ${social.hoverColor} transition-colors duration-300`} />
              <div className={`absolute inset-0 ${social.bgColor} rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
            </div>
            {showText && (
              <span className="text-gray-300 group-hover:text-white text-xs md:text-sm font-medium transition-colors duration-300">
                {social.name}
              </span>
            )}
            <div className={`w-1 h-1 ${social.bgColor} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          </motion.a>
        );
      })}
    </div>
  );
}