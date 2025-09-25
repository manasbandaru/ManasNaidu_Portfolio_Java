import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { navigationItems } from './Navigation';
import { SmartBackground } from '../3d/SmartBackground';

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface LayoutProps {
  children: React.ReactNode;
  socialLinks?: SocialLink[];
  email?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  socialLinks = [], 
  email = 'developer@example.com' 
}) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Smart Background - WebGL with Framer Motion fallback */}
      <SmartBackground />
      
      <Header navigationItems={navigationItems} />
      
      {/* Main content with padding for fixed header */}
      <main className="pt-16 relative z-10">
        {children}
      </main>
      
      <Footer socialLinks={socialLinks} email={email} />
    </div>
  );
};