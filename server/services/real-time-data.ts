import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "AIzaSyD_fPFEGtS73QS4E1HqEcyAweGGa-qglZI"
});

export interface RealTimeDataSources {
  weather: WeatherData;
  marketTrends: MarketData;
  newsData: NewsData;
  economicIndicators: EconomicData;
  socialSentiment: SocialData;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  conditions: string;
  source: 'api' | 'gemini' | 'static';
}

export interface MarketData {
  indices: { name: string; value: number; change: number }[];
  commodityPrices: { commodity: string; price: number; change: number }[];
  currency: { usd: number; eur: number; gbp: number };
  source: 'api' | 'gemini' | 'static';
}

export interface NewsData {
  headlines: string[];
  sectorNews: { [sector: string]: string[] };
  sentiment: 'positive' | 'negative' | 'neutral';
  source: 'api' | 'gemini' | 'static';
}

export interface EconomicData {
  gdpGrowth: number;
  inflation: number;
  interestRate: number;
  unemploymentRate: number;
  source: 'api' | 'gemini' | 'static';
}

export interface SocialData {
  trendingTopics: string[];
  sectorSentiment: { [sector: string]: number };
  viralKeywords: string[];
  source: 'api' | 'gemini' | 'static';
}

// Real-time API data fetching (simulated - replace with actual APIs)
async function fetchRealTimeWeather(region: string): Promise<WeatherData | null> {
  try {
    // This would connect to OpenWeatherMap, WeatherAPI, or similar
    // For demo, we'll return null to trigger Gemini fallback
    return null;
  } catch (error) {
    console.log('Weather API unavailable, falling back to Gemini');
    return null;
  }
}

async function fetchRealTimeMarket(): Promise<MarketData | null> {
  try {
    // This would connect to Alpha Vantage, Yahoo Finance, or similar
    // For demo, we'll return null to trigger Gemini fallback
    return null;
  } catch (error) {
    console.log('Market API unavailable, falling back to Gemini');
    return null;
  }
}

async function fetchRealTimeNews(sector: string): Promise<NewsData | null> {
  try {
    // This would connect to NewsAPI, Google News API, or similar
    // For demo, we'll return null to trigger Gemini fallback
    return null;
  } catch (error) {
    console.log('News API unavailable, falling back to Gemini');
    return null;
  }
}

// Gemini AI data generation
async function generateWeatherDataWithGemini(region: string): Promise<WeatherData> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Generate realistic current weather data for ${region}, India. 
      Consider seasonal patterns, regional climate, and current month.
      Return JSON: {"temperature": number, "humidity": number, "precipitation": number, "windSpeed": number, "conditions": "string"}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            temperature: { type: "number" },
            humidity: { type: "number" },
            precipitation: { type: "number" },
            windSpeed: { type: "number" },
            conditions: { type: "string" }
          },
          required: ["temperature", "humidity", "precipitation", "windSpeed", "conditions"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return { ...data, source: 'gemini' as const };
  } catch (error) {
    console.error('Gemini weather generation failed:', error);
    return getStaticWeatherData(region);
  }
}

async function generateMarketDataWithGemini(): Promise<MarketData> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Generate realistic current Indian market data including:
      - Major indices (Sensex, Nifty, Bank Nifty) with realistic values and daily changes
      - Commodity prices (Gold, Silver, Crude Oil, Rice, Wheat) in INR
      - Currency rates (USD, EUR, GBP to INR)
      Make values realistic for current economic conditions.
      Return JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            indices: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  value: { type: "number" },
                  change: { type: "number" }
                }
              }
            },
            commodityPrices: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  commodity: { type: "string" },
                  price: { type: "number" },
                  change: { type: "number" }
                }
              }
            },
            currency: {
              type: "object",
              properties: {
                usd: { type: "number" },
                eur: { type: "number" },
                gbp: { type: "number" }
              }
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return { ...data, source: 'gemini' as const };
  } catch (error) {
    console.error('Gemini market generation failed:', error);
    return getStaticMarketData();
  }
}

async function generateNewsDataWithGemini(sector: string): Promise<NewsData> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Generate realistic current news headlines and trends for ${sector} sector in India.
      Include:
      - 5 realistic current headlines
      - Sector-specific news for healthcare, automobile, agriculture
      - Overall sentiment analysis
      - Make content relevant to current Indian market conditions
      Return JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            headlines: {
              type: "array",
              items: { type: "string" }
            },
            sectorNews: {
              type: "object",
              properties: {
                healthcare: { type: "array", items: { type: "string" } },
                automobile: { type: "array", items: { type: "string" } },
                agriculture: { type: "array", items: { type: "string" } }
              }
            },
            sentiment: { type: "string", enum: ["positive", "negative", "neutral"] }
          }
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return { ...data, source: 'gemini' as const };
  } catch (error) {
    console.error('Gemini news generation failed:', error);
    return getStaticNewsData(sector);
  }
}

// Static fallback data
function getStaticWeatherData(region: string): WeatherData {
  const weatherMap: { [key: string]: WeatherData } = {
    Mumbai: { temperature: 28, humidity: 75, precipitation: 5, windSpeed: 12, conditions: "Partly Cloudy", source: 'static' },
    Delhi: { temperature: 32, humidity: 65, precipitation: 0, windSpeed: 8, conditions: "Clear", source: 'static' },
    Bangalore: { temperature: 25, humidity: 70, precipitation: 2, windSpeed: 10, conditions: "Overcast", source: 'static' },
    Chennai: { temperature: 30, humidity: 80, precipitation: 8, windSpeed: 15, conditions: "Humid", source: 'static' },
    Kolkata: { temperature: 29, humidity: 85, precipitation: 12, windSpeed: 6, conditions: "Rainy", source: 'static' }
  };
  
  return weatherMap[region] || weatherMap['Mumbai'];
}

function getStaticMarketData(): MarketData {
  return {
    indices: [
      { name: "Sensex", value: 73845, change: 1.2 },
      { name: "Nifty 50", value: 22378, change: 0.8 },
      { name: "Bank Nifty", value: 48950, change: -0.5 }
    ],
    commodityPrices: [
      { commodity: "Gold (10g)", price: 62500, change: 0.3 },
      { commodity: "Silver (1kg)", price: 78900, change: -1.2 },
      { commodity: "Crude Oil", price: 6890, change: 2.1 },
      { commodity: "Rice (1kg)", price: 45, change: 0.1 },
      { commodity: "Wheat (1kg)", price: 28, change: -0.2 }
    ],
    currency: { usd: 83.25, eur: 90.15, gbp: 105.80 },
    source: 'static'
  };
}

function getStaticNewsData(sector: string): NewsData {
  return {
    headlines: [
      "Indian economy shows resilient growth in Q3",
      "Tech sector leads market rally with strong earnings",
      "Monsoon predictions favorable for agriculture sector",
      "Infrastructure spending boosts automobile demand",
      "Healthcare sector expands with new policy initiatives"
    ],
    sectorNews: {
      healthcare: [
        "New pharmaceutical manufacturing hubs announced",
        "Digital health platforms see 40% growth",
        "Generic drug exports reach record high"
      ],
      automobile: [
        "Electric vehicle sales surge 60% year-on-year",
        "Two-wheeler demand rebounds in rural markets",
        "Luxury car segment shows strong recovery"
      ],
      agriculture: [
        "Kharif crop production exceeds expectations",
        "Agricultural technology adoption increases",
        "Food processing sector attracts investment"
      ]
    },
    sentiment: 'positive',
    source: 'static'
  };
}

// Main function to get comprehensive real-time data
export async function getRealTimeData(sector: string, region: string): Promise<RealTimeDataSources> {
  console.log(`Fetching real-time data for ${sector} in ${region}...`);

  // Try real-time APIs first, then Gemini, then reliable fallback
  try {
    const [weather, market, news] = await Promise.all([
      fetchRealTimeWeather(region).catch(() => generateWeatherDataWithGemini(region)),
      fetchRealTimeMarket().catch(() => generateMarketDataWithGemini()),
      fetchRealTimeNews(sector).catch(() => generateNewsDataWithGemini(sector))
    ]);

    // Generate economic and social data with Gemini
    const [economic, social] = await Promise.all([
      generateEconomicDataWithGemini(),
      generateSocialDataWithGemini(sector)
    ]);

    return {
      weather,
      marketTrends: market,
      newsData: news,
      economicIndicators: economic,
      socialSentiment: social
    };
  } catch (error) {
    console.log(`Using fallback data for ${sector} in ${region} due to API unavailability`);
    const { generateFallbackRealTimeData } = await import('./fallback-data');
    return generateFallbackRealTimeData(sector, region);
  }
}

async function generateEconomicDataWithGemini(): Promise<EconomicData> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Generate realistic current Indian economic indicators:
      - GDP growth rate (quarterly, realistic for current conditions)
      - Inflation rate (current CPI)
      - Interest rate (current repo rate)
      - Unemployment rate
      Make values realistic for current Indian economy.
      Return JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            gdpGrowth: { type: "number" },
            inflation: { type: "number" },
            interestRate: { type: "number" },
            unemploymentRate: { type: "number" }
          },
          required: ["gdpGrowth", "inflation", "interestRate", "unemploymentRate"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return { ...data, source: 'gemini' as const };
  } catch (error) {
    return { gdpGrowth: 6.8, inflation: 4.2, interestRate: 6.5, unemploymentRate: 3.9, source: 'static' };
  }
}

async function generateSocialDataWithGemini(sector: string): Promise<SocialData> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Generate realistic social media trends and sentiment data for ${sector} sector in India:
      - Trending topics related to the sector
      - Sentiment scores (-1 to 1) for each sector
      - Viral keywords related to demand patterns
      Return JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            trendingTopics: {
              type: "array",
              items: { type: "string" }
            },
            sectorSentiment: {
              type: "object",
              properties: {
                healthcare: { type: "number" },
                automobile: { type: "number" },
                agriculture: { type: "number" }
              }
            },
            viralKeywords: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return { ...data, source: 'gemini' as const };
  } catch (error) {
    return {
      trendingTopics: ["digital transformation", "sustainability", "innovation"],
      sectorSentiment: { healthcare: 0.7, automobile: 0.5, agriculture: 0.6 },
      viralKeywords: ["demand surge", "supply chain", "market growth"],
      source: 'static'
    };
  }
}