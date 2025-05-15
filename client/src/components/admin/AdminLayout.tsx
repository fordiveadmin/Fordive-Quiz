import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, FileQuestion, Droplets, Sparkles, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  
  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: <Home className="w-4 h-4 mr-2" /> },
    { label: 'Questions', href: '/admin/questions', icon: <FileQuestion className="w-4 h-4 mr-2" /> },
    { label: 'Scents', href: '/admin/scents', icon: <Droplets className="w-4 h-4 mr-2" /> },
    { label: 'Zodiac Mappings', href: '/admin/zodiac-mappings', icon: <Sparkles className="w-4 h-4 mr-2" /> },
    { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 className="w-4 h-4 mr-2" /> },
  ];
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-card border-r">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/">
            <a className="font-playfair text-xl font-bold">FORDIVE ADMIN</a>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a 
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium",
                  location === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {item.icon}
                {item.label}
              </a>
            </Link>
          ))}
        </nav>
        
        <div className="border-t p-4">
          <Link href="/">
            <a className="flex items-center text-sm text-muted-foreground hover:text-foreground">
              <Home className="w-4 h-4 mr-2" />
              Back to Site
            </a>
          </Link>
        </div>
      </div>
      
      {/* Mobile header */}
      <div className="md:hidden flex items-center h-16 px-4 border-b w-full sticky top-0 bg-background z-10">
        <Link href="/admin">
          <a className="font-playfair text-lg font-bold">FORDIVE ADMIN</a>
        </Link>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}