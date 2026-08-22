import { supabase } from "@/integrations/supabase/client";
import type { CountryDetail, VisaTypeInfo, University, CostBreakdown } from "./countryData";

export interface AICountryInfo {
  id: string;
  name: string;
  flag: string;
  description: string;
}

export interface AICountryDetail extends CountryDetail {}

/**
 * Fetch list of countries from AI
 */
export async function fetchAICountries(): Promise<AICountryInfo[]> {
  try {
    const { data, error } = await supabase.functions.invoke("visa-chat", {
      body: {
        action: "fetch_countries",
        question: "Generate a list of popular destination countries for immigration and study visas"
      },
    });

    if (error) throw error;
    if (data?.error) throw new Error(data.error);

    // If AI returns data, use it; otherwise fall back to default countries
    if (data?.countries && Array.isArray(data.countries)) {
      return data.countries;
    }

    // Fallback to default countries
    return [
      { id: "uk", name: "United Kingdom", flag: "🇬🇧", description: "Rich history & vibrant culture" },
      { id: "canada", name: "Canada", flag: "🇨🇦", description: "Amazing nature & multicultural cities" },
      { id: "australia", name: "Australia", flag: "🇦🇺", description: "Beautiful beaches & unique wildlife" },
    ];
  } catch (error) {
    console.error("Error fetching AI countries:", error);
    // Return fallback countries on error
    return [
      { id: "uk", name: "United Kingdom", flag: "🇬🇧", description: "Rich history & vibrant culture" },
      { id: "canada", name: "Canada", flag: "🇨🇦", description: "Amazing nature & multicultural cities" },
      { id: "australia", name: "Australia", flag: "🇦🇺", description: "Beautiful beaches & unique wildlife" },
    ];
  }
}

/**
 * Fetch detailed country information from AI
 */
export async function fetchAICountryDetail(countryId: string): Promise<AICountryDetail | null> {
  try {
    const { data, error } = await supabase.functions.invoke("visa-chat", {
      body: {
        action: "fetch_country_detail",
        countryId,
        question: `Generate comprehensive visa and immigration details for ${countryId} including visa types, universities, costs, and highlights`
      },
    });

    if (error) throw error;
    if (data?.error) throw new Error(data.error);

    // If AI returns detailed data, use it
    if (data?.countryDetail) {
      return data.countryDetail as AICountryDetail;
    }

    return null;
  } catch (error) {
    console.error("Error fetching AI country detail:", error);
    return null;
  }
}

/**
 * Generate visa type information for a specific country and visa type
 */
export async function fetchAIVisaTypeInfo(countryId: string, visaType: string): Promise<VisaTypeInfo | null> {
  try {
    const { data, error } = await supabase.functions.invoke("visa-chat", {
      body: {
        action: "fetch_visa_type",
        countryId,
        visaType,
        question: `Generate detailed visa information for ${visaType} visa in ${countryId} including requirements, documents, processing time, and costs`
      },
    });

    if (error) throw error;
    if (data?.error) throw new Error(data.error);

    if (data?.visaInfo) {
      return data.visaInfo as VisaTypeInfo;
    }

    return null;
  } catch (error) {
    console.error("Error fetching AI visa info:", error);
    return null;
  }
}

/**
 * Generate university list for a country
 */
export async function fetchAIUniversities(countryId: string): Promise<University[]> {
  try {
    const { data, error } = await supabase.functions.invoke("visa-chat", {
      body: {
        action: "fetch_universities",
        countryId,
        question: `Generate a list of top universities in ${countryId} with rankings, locations, tuition ranges, and popular courses`
      },
    });

    if (error) throw error;
    if (data?.error) throw new Error(data.error);

    if (data?.universities && Array.isArray(data.universities)) {
      return data.universities as University[];
    }

    return [];
  } catch (error) {
    console.error("Error fetching AI universities:", error);
    return [];
  }
}
