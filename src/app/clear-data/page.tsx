'use client';

import { Button } from '@/components/ui/button';
import { clearAllAppData, clearAllLocalStorage } from '@/lib/clearData';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ClearDataPage() {
  const router = useRouter();
  const [isClearing, setIsClearing] = useState(false);

  const handleClearAppData = () => {
    setIsClearing(true);
    try {
      clearAllAppData();
      toast.success('Application data cleared successfully!');
    } catch (error) {
      toast.error('Error clearing data: ' + (error as Error).message);
    } finally {
      setIsClearing(false);
    }
  };

  const handleClearAllData = () => {
    setIsClearing(true);
    try {
      clearAllLocalStorage();
      // Reload the page to ensure all state is reset
      window.location.reload();
    } catch (error) {
      toast.error('Error clearing data: ' + (error as Error).message);
    } finally {
      setIsClearing(false);
    }
  };

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="glass-card border-border/30 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-destructive/10 mb-6">
            <svg
              className="h-8 w-8 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-label="Clear data icon"
              role="img"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Clear Application Data
          </h1>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            This page allows you to clear all application data for a fresh start.
            This is useful for backend developers who want to start with a clean slate.
          </p>
          
          <div className="space-y-4">
            <Button
              onClick={handleClearAppData}
              disabled={isClearing}
              className="w-full bg-gradient-to-r from-destructive to-destructive/90 hover:from-destructive/90 hover:to-destructive shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isClearing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Clearing...
                </>
              ) : (
                'Clear Application Data Only'
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleClearAllData}
              disabled={isClearing}
              className="w-full hover:scale-105 transition-transform duration-200"
            >
              {isClearing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Clearing...
                </>
              ) : (
                'Clear All LocalStorage Data'
              )}
            </Button>
            
            <Button
              onClick={handleGoBack}
              disabled={isClearing}
              className="w-full hover:scale-105 transition-transform duration-200"
              variant="secondary"
            >
              Go Back to Dashboard
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-lg text-left">
            <h3 className="font-semibold text-foreground mb-2">What this does:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <span className="font-medium">Clear Application Data</span> - Removes only app-related data</li>
              <li>• <span className="font-medium">Clear All Data</span> - Removes everything from localStorage</li>
              <li>• <span className="font-medium">After clearing</span> - The page will refresh to apply changes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}