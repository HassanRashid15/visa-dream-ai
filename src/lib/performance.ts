import React from 'react';

// Performance optimization utilities for UK VisaDreams

// Cache configuration
export const CACHE_CONFIG = {
  visaDetails: {
    ttl: 1000 * 60 * 60, // 1 hour
    maxSize: 50, // max cached items
  },
  eligibilityResults: {
    ttl: 1000 * 60 * 30, // 30 minutes
    maxSize: 100,
  },
  costCalculations: {
    ttl: 1000 * 60 * 15, // 15 minutes
    maxSize: 200,
  },
  apiResponses: {
    ttl: 1000 * 60 * 5, // 5 minutes
    maxSize: 500,
  },
};

// Simple in-memory cache implementation
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const memoryCache = new MemoryCache();

// Cleanup cache every 5 minutes
setInterval(() => memoryCache.cleanup(), 1000 * 60 * 5);

// Performance monitoring
export class PerformanceMonitor {
  private static metrics = new Map<string, {
    count: number;
    totalTime: number;
    averageTime: number;
    minTime: number;
    maxTime: number;
  }>();

  static startTimer(operation: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      this.recordMetric(operation, duration);
    };
  }

  private static recordMetric(operation: string, duration: number): void {
    const existing = this.metrics.get(operation) || {
      count: 0,
      totalTime: 0,
      averageTime: 0,
      minTime: Infinity,
      maxTime: 0,
    };

    existing.count++;
    existing.totalTime += duration;
    existing.averageTime = existing.totalTime / existing.count;
    existing.minTime = Math.min(existing.minTime, duration);
    existing.maxTime = Math.max(existing.maxTime, duration);

    this.metrics.set(operation, existing);
  }

  static getMetrics(): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [operation, metrics] of this.metrics.entries()) {
      result[operation] = {
        ...metrics,
        totalTime: Math.round(metrics.totalTime * 100) / 100,
        averageTime: Math.round(metrics.averageTime * 100) / 100,
        minTime: Math.round(metrics.minTime * 100) / 100,
        maxTime: Math.round(metrics.maxTime * 100) / 100,
      };
    }
    return result;
  }

  static reset(): void {
    this.metrics.clear();
  }
}

// Image optimization utilities
export const imageOptimization = {
  // Lazy loading with Intersection Observer
  lazyLoad: (imageSelector: string = 'img[data-lazy]') => {
    const images = document.querySelectorAll(imageSelector);
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  },

  // Generate responsive image URLs
  getResponsiveUrl: (baseUrl: string, width: number, quality: number = 80): string => {
    // This would integrate with a CDN like Cloudinary or similar
    // For now, return the original URL
    return baseUrl;
  },

  // Preload critical images
  preloadImage: (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  },
};

// Bundle size optimization
export const bundleOptimization = {
  // Dynamic imports for code splitting
  loadComponent: async (componentName: string) => {
    try {
      const module = await import(/* @vite-ignore */ `@/components/${componentName}`);
      return module.default;
    } catch (error) {
      console.error(`Failed to load component: ${componentName}`, error);
      return null;
    }
  },

  // Lazy load heavy components
  lazyLoadComponent: (componentName: string) => {
    return React.lazy(() => import(/* @vite-ignore */ `@/components/${componentName}`));
  },
};

// Network optimization
export const networkOptimization = {
  // Debounce function for API calls
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle function for scroll events
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Batch API requests
  batchRequests: async <T>(requests: Array<() => Promise<T>>): Promise<T[]> => {
    try {
      const results = await Promise.all(requests.map(req => req()));
      return results;
    } catch (error) {
      console.error('Batch request failed:', error);
      throw error;
    }
  },
};

// SEO optimization
export const seoOptimization = {
  // Generate structured data for visa information
  generateVisaStructuredData: (visaType: string, visaDetails: any) => {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": `UK ${visaType} Visa Information`,
      "description": visaDetails.summary,
      "provider": {
        "@type": "Organization",
        "name": "VisaDreams",
        "url": "https://visa-dream-ai.com",
      },
      "serviceType": "Immigration Consultancy",
      "areaServed": {
        "@type": "Country",
        "name": "United Kingdom",
      },
    };
  },

  // Generate meta tags dynamically
  generateMetaTags: (title: string, description: string, url: string) => {
    return {
      title,
      description,
      canonical: url,
      openGraph: {
        title,
        description,
        url,
        type: "website",
        images: [
          {
            url: "/og-image.jpg",
            width: 1200,
            height: 630,
            alt: "UK Visa Information",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/og-image.jpg"],
      },
    };
  },
};

// Performance monitoring hooks
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = React.useState(() => PerformanceMonitor.getMetrics());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(PerformanceMonitor.getMetrics());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
};

// Critical resource preloading
export const preloadCriticalResources = async () => {
  const criticalResources = [
    '/api/uk-visa-details',
    '/api/eligibility-check',
    '/images/uk-flag.svg',
    '/images/visa-hero.jpg',
  ];

  const preloadPromises = criticalResources.map(resource => {
    if (resource.startsWith('/images/')) {
      return imageOptimization.preloadImage(resource);
    } else {
      // Preload API responses (would need actual implementation)
      return Promise.resolve();
    }
  });

  try {
    await Promise.all(preloadPromises);
  } catch (error) {
    console.warn('Some critical resources failed to preload:', error);
  }
};

// Service Worker registration for offline support
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Performance budget monitoring
export const checkPerformanceBudget = () => {
  const budget = {
    firstContentfulPaint: 1500, // 1.5s
    largestContentfulPaint: 2500, // 2.5s
    cumulativeLayoutShift: 0.1,
    totalBlockingTime: 200, // 200ms
  };

  // Check if performance API is available
  if ('performance' in window && 'getEntriesByType' in performance) {
    const navigationEntries = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    const metrics = {
      firstContentfulPaint: navigationEntries.loadEventEnd - navigationEntries.loadEventStart,
      largestContentfulPaint: navigationEntries.loadEventEnd - navigationEntries.fetchStart,
      cumulativeLayoutShift: 0, // Would need LayoutShift API
      totalBlockingTime: 0, // Would need Long Tasks API
    };

    const budgetViolations = [];
    for (const [metric, value] of Object.entries(metrics)) {
      if (value > (budget as any)[metric]) {
        budgetViolations.push(metric);
      }
    }

    return {
      metrics,
      budgetViolations,
      withinBudget: budgetViolations.length === 0,
    };
  }

  return { withinBudget: true, metrics: {}, budgetViolations: [] };
};
