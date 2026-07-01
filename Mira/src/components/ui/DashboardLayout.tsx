import React from 'react';
import { cn } from '@/lib/utils';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
  titile?: string;
  variant?: string;
}

export function DashboardLayout({
  children,
  header,
  sidebar,
  className
}: DashboardLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {header && (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {header}
        </header>
      )}
      
      <div className="flex">
        {sidebar && (
          <aside className="sticky top-0 h-screen w-64 shrink-0 border-r border-border/40 bg-background/95">
            {sidebar}
          </aside>
        )}
        
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}