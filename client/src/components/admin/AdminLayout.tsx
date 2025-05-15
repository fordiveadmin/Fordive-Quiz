import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, BarChart3, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: <Home className="w-4 h-4 mr-2" /> },
    { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 className="w-4 h-4 mr-2" /> },
  ];
  
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        toast({
          title: "Logout berhasil",
          description: "Anda telah keluar dari panel admin"
        });
        setLocation('/admin/login');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal logout. Silakan coba lagi."
      });
    }
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-card border-r">
        <div className="flex h-16 items-center border-b px-6">
          <span className="font-playfair text-xl font-bold cursor-pointer" onClick={() => window.location.href = '/'}>
            FORDIVE ADMIN
          </span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => (
            <div key={item.href} className="w-full">
              <div 
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium cursor-pointer",
                  location === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => window.location.href = item.href}
              >
                {item.icon}
                {item.label}
              </div>
            </div>
          ))}
        </nav>
        
        <div className="border-t p-4">
          <div 
            className="flex items-center text-sm text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => window.location.href = "/"}
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Site
          </div>
        </div>
      </div>
      
      {/* Mobile header */}
      <div className="md:hidden flex items-center h-16 px-4 border-b w-full sticky top-0 bg-background z-10">
        <div 
          className="font-playfair text-lg font-bold cursor-pointer"
          onClick={() => window.location.href = "/admin"}
        >
          FORDIVE ADMIN
        </div>
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