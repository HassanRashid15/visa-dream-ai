import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
}

const defaultSEOData: SEOData = {
  title: 'TravelAI — Your Intelligent Travel Agent Assistant',
  description: 'Plan your perfect journey with AI-powered travel guidance. Get destination insights, visa information, and personalized travel planning for Canada, UK, and Australia.',
  keywords: 'AI travel agent, travel planning, destination guide, travel assistance, Canada travel, UK travel, Australia travel, intelligent travel advisor',
  ogImage: 'https://lovable.dev/opengraph-image-p98pqg.png',
  ogUrl: 'https://travelai.com'
};

export const useSEO = (seoData?: Partial<SEOData>) => {
  const location = useLocation();
  
  useEffect(() => {
    const finalSEOData = { ...defaultSEOData, ...seoData };
    
    // Update title
    document.title = finalSEOData.title;
    
    // Update or create meta description
    updateMetaTag('description', finalSEOData.description);
    
    // Update or create meta keywords
    if (finalSEOData.keywords) {
      updateMetaTag('keywords', finalSEOData.keywords);
    }
    
    // Update Open Graph tags
    updateMetaProperty('og:title', finalSEOData.title);
    updateMetaProperty('og:description', finalSEOData.description);
    updateMetaProperty('og:type', 'website');
    
    if (finalSEOData.ogImage) {
      updateMetaProperty('og:image', finalSEOData.ogImage);
    }
    
    if (finalSEOData.ogUrl) {
      updateMetaProperty('og:url', finalSEOData.ogUrl);
    }
    
    // Update Twitter Card tags
    updateMetaName('twitter:card', 'summary_large_image');
    updateMetaName('twitter:site', '@TravelAI');
    updateMetaName('twitter:title', finalSEOData.title);
    updateMetaName('twitter:description', finalSEOData.description);
    
    if (finalSEOData.ogImage) {
      updateMetaName('twitter:image', finalSEOData.ogImage);
    }
    
    // Update canonical URL
    updateCanonicalLink(finalSEOData.ogUrl || `https://travelai.com${location.pathname}`);
    
  }, [location.pathname, seoData]);
};

const updateMetaTag = (name: string, content: string) => {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
};

const updateMetaProperty = (property: string, content: string) => {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.content = content;
};

const updateMetaName = (name: string, content: string) => {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
};

const updateCanonicalLink = (href: string) => {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = href;
};
