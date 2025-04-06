"use client";

import { useState, useEffect } from 'react';

interface SiteConfig {
  singlePropertyMode: boolean;
  mainPropertyId?: string;
}

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>({
    singlePropertyMode: false,
    mainPropertyId: undefined
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Add a timeout to the fetch request to avoid long waiting times if the server is down
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch('http://localhost:5000/api/site-config', {
          signal: controller.signal,
          // Prevent caching issues
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement de la configuration');
        }
        
        const data = await response.json();
        setConfig(data);
      } catch (error) {
        // Provide a fallback configuration when the backend is not available
        console.error('Erreur de connexion au backend:', error);
        setError(error as Error);
        
        // Use default configuration as fallback
        setConfig({
          singlePropertyMode: false,
          mainPropertyId: undefined
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, isLoading, error };
}
