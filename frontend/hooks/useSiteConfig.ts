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
        const response = await fetch('http://localhost:5000/api/site-config');
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement de la configuration');
        }
        
        const data = await response.json();
        setConfig(data);
      } catch (error) {
        setError(error as Error);
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, isLoading, error };
}
