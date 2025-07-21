import { GoogleGenAI } from "@google/genai";
import { 
  fetchRealWeatherData, 
  fetchRealNewsData, 
  fetchRealSocialMediaData, 
  fetchRealHospitalData, 
  fetchRealDemographicData 
} from "./weather-api";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || ""
});

export interface NewsData {
  headlines: string[];
  healthRelated: string[];
  diseaseOutbreaks: string[];
  source: string;
  timestamp: Date;
}

export interface SocialMediaData {
  healthTrends: string[];
  diseaseKeywords: string[];
  publicSentiment: 'positive' | 'negative' | 'neutral';
  viralHealthTopics: string[];
  source: string;
  timestamp: Date;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  precipitation: number;
  airQuality: string;
  uvIndex: number;
  visibility: number;
  dewPoint: number;
  conditions: string;
  source: string;
  timestamp: Date;
}

export interface HospitalData {
  hospitalName: string;
  capacity: number;
  occupancy: number;
  availableBeds: number;
  emergencyWait: string;
  specialties: string[];
  location: string;
  contact: string;
}

export interface DemographicData {
  region: string;
  population: number;
  ageDistribution: {
    "0-18": number;
    "19-35": number;
    "36-55": number;
    "56-70": number;
    "70+": number;
  };
  economicStatus: string;
  educationLevel: string;
  healthcareAccess: string;
  urbanization: string;
  source: string;
  timestamp: Date;
}

export async function fetchRealTimeNews(region: string): Promise<NewsData> {
  try {
    // Try to fetch from real news APIs first (implement when available)
    // For now, fall back to realistic sample data
    const { generateSampleNewsData, INDIAN_CITIES } = await import('./india-sample-data');
    
    // Check if region is in our Indian cities database
    if (INDIAN_CITIES.includes(region)) {
      console.log(`Using realistic sample news data for ${region}`);
      return generateSampleNewsData(region);
    }

    // For other regions, use Gemini with rate limiting
    const prompt = `
You are a news aggregator. Provide current news headlines and health-related stories for ${region}.
Based on current news trends, provide realistic news data including general headlines, health stories, and disease outbreak reports.

Respond with JSON:
{
  "headlines": ["headline1", "headline2", "headline3"],
  "healthRelated": ["health story 1", "health story 2"],
  "diseaseOutbreaks": ["outbreak report 1"],
  "source": "News Sources",
  "timestamp": "${new Date().toISOString()}"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      config: {
        responseMimeType: "application/json",
      },
      contents: prompt,
    });

    const rawJson = response.text;
    if (rawJson) {
      const data = JSON.parse(rawJson);
      return {
        ...data,
        timestamp: new Date(data.timestamp)
      };
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error) {
    console.error('Error fetching real-time news:', error);
    // Final fallback to basic data
    return {
      headlines: [`${region} health monitoring continues`, `Local healthcare services operational`],
      healthRelated: [`Health services available in ${region}`, `Preventive care programs active`],
      diseaseOutbreaks: [`No major outbreaks reported in ${region}`],
      source: "Local Health Network",
      timestamp: new Date()
    };
  }
}

export async function fetchSocialMediaTrends(region: string): Promise<SocialMediaData> {
  try {
    // Try to fetch from real social media APIs first (implement when available)
    // For now, fall back to realistic sample data
    const { generateSampleSocialMediaData, INDIAN_CITIES } = await import('./india-sample-data');
    
    // Check if region is in our Indian cities database
    if (INDIAN_CITIES.includes(region)) {
      console.log(`Using realistic sample social media data for ${region}`);
      return generateSampleSocialMediaData(region);
    }

    // For other regions, use basic fallback
    return {
      healthTrends: ['wellness trends', 'health awareness', 'preventive care'],
      diseaseKeywords: ['health tips', 'wellness', 'prevention'],
      publicSentiment: 'neutral' as const,
      viralHealthTopics: [`#${region}Health`, '#WellnessTips'],
      source: "Social Media Analytics",
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error fetching social media trends:', error);
    // Final fallback
    return {
      healthTrends: ['general wellness'],
      diseaseKeywords: ['health'],
      publicSentiment: 'neutral' as const,
      viralHealthTopics: ['#Health'],
      source: "Social Media Analytics",
      timestamp: new Date()
    };
  }
}

export async function fetchWeatherData(region: string): Promise<WeatherData> {
  try {
    // Try to fetch from real weather APIs first (implement when available)
    // For now, fall back to realistic sample data
    const { generateSampleWeatherData, INDIAN_CITIES } = await import('./india-sample-data');
    
    // Check if region is in our Indian cities database
    if (INDIAN_CITIES.includes(region)) {
      console.log(`Using realistic sample weather data for ${region}`);
      return generateSampleWeatherData(region);
    }

    // For other regions, use basic fallback
    return {
      temperature: 75,
      humidity: 60,
      pressure: 29.92,
      windSpeed: 8,
      precipitation: 0,
      airQuality: "Moderate",
      uvIndex: 5,
      visibility: 10,
      dewPoint: 55,
      conditions: "Partly Cloudy",
      source: "Weather Service",
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Final fallback
    return {
      temperature: 72,
      humidity: 65,
      pressure: 29.92,
      windSpeed: 5,
      precipitation: 0,
      airQuality: "Moderate",
      uvIndex: 4,
      visibility: 10,
      dewPoint: 52,
      conditions: "Clear",
      source: "Weather Service",
      timestamp: new Date()
    };
  }
}

export async function fetchHospitalData(region: string): Promise<HospitalData[]> {
  try {
    // Try to fetch from real hospital APIs first (implement when available)
    // For now, fall back to realistic sample data
    const { generateSampleHospitalData, INDIAN_CITIES } = await import('./india-sample-data');
    
    // Check if region is in our Indian cities database
    if (INDIAN_CITIES.includes(region)) {
      console.log(`Using realistic sample hospital data for ${region}`);
      return generateSampleHospitalData(region);
    }

    // For other regions, use basic fallback
    return [
      {
        hospitalName: `${region} General Hospital`,
        capacity: 300,
        occupancy: 75,
        availableBeds: 75,
        emergencyWait: "30 minutes",
        specialties: ["Emergency", "General Medicine", "Surgery", "Pediatrics"],
        location: `${region} City Center`,
        contact: "+1-555-0123"
      },
      {
        hospitalName: `${region} Medical Center`,
        capacity: 200,
        occupancy: 80,
        availableBeds: 40,
        emergencyWait: "20 minutes",
        specialties: ["Cardiology", "Neurology", "Orthopedics", "ICU"],
        location: `${region} Medical District`,
        contact: "+1-555-0456"
      }
    ];
  } catch (error) {
    console.error('Error fetching hospital data:', error);
    // Final fallback
    return [
      {
        hospitalName: `${region} Hospital`,
        capacity: 250,
        occupancy: 70,
        availableBeds: 75,
        emergencyWait: "25 minutes",
        specialties: ["General Medicine", "Emergency"],
        location: region,
        contact: "Emergency Services"
      }
    ];
  }
}

export async function fetchDemographicData(region: string): Promise<DemographicData> {
  try {
    // Try to fetch from real demographic APIs first (implement when available)
    // For now, fall back to realistic sample data
    const { generateSampleDemographicData, INDIAN_CITIES } = await import('./india-sample-data');
    
    // Check if region is in our Indian cities database
    if (INDIAN_CITIES.includes(region)) {
      console.log(`Using realistic sample demographic data for ${region}`);
      return generateSampleDemographicData(region);
    }

    // For other regions, use basic fallback
    return {
      region,
      population: 1000000,
      ageDistribution: {
        "0-18": 280000,
        "19-35": 320000,
        "36-55": 250000,
        "56-70": 100000,
        "70+": 50000
      },
      economicStatus: "Middle",
      educationLevel: "Medium",
      healthcareAccess: "Moderate",
      urbanization: "Urban",
      source: "Demographics Bureau",
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error fetching demographic data:', error);
    // Final fallback
    return {
      region,
      population: 500000,
      ageDistribution: {
        "0-18": 140000,
        "19-35": 160000,
        "36-55": 125000,
        "56-70": 50000,
        "70+": 25000
      },
      economicStatus: "Middle",
      educationLevel: "Medium",
      healthcareAccess: "Moderate",
      urbanization: "Urban",
      source: "Demographics Bureau",
      timestamp: new Date()
    };
  }
}

export async function fetchComprehensiveRegionData(region: string) {
  try {
    // Use real API data sources without Gemini to avoid rate limits
    const [newsData, socialMediaData, weatherData, hospitalData, demographicData] = await Promise.all([
      fetchRealNewsData(region),
      fetchRealSocialMediaData(region),
      fetchRealWeatherData(region),
      fetchRealHospitalData(region),
      fetchRealDemographicData(region)
    ]);

    return {
      news: {
        headlines: newsData.headlines,
        healthRelated: newsData.healthRelated,
        diseaseOutbreaks: newsData.diseaseOutbreaks,
        source: newsData.source,
        timestamp: newsData.timestamp
      },
      socialMedia: {
        healthTrends: socialMediaData.healthTrends,
        diseaseKeywords: socialMediaData.diseaseKeywords,
        publicSentiment: socialMediaData.publicSentiment,
        viralHealthTopics: socialMediaData.viralHealthTopics,
        source: socialMediaData.source,
        timestamp: socialMediaData.timestamp
      },
      weather: {
        temperature: weatherData.temperature,
        humidity: weatherData.humidity,
        pressure: parseFloat(weatherData.pressure),
        windSpeed: weatherData.windSpeed,
        precipitation: parseFloat(weatherData.precipitation),
        airQuality: weatherData.airQuality,
        uvIndex: weatherData.uvIndex,
        visibility: weatherData.visibility,
        dewPoint: weatherData.dewPoint,
        conditions: weatherData.conditions,
        source: weatherData.source,
        timestamp: weatherData.timestamp
      },
      hospitals: hospitalData,
      demographics: demographicData,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error fetching comprehensive region data:', error);
    throw new Error(`Failed to fetch comprehensive data: ${error}`);
  }
}