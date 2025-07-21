// Fallback data service with realistic static data for reliable predictions
import type { RealTimeDataSources } from "./real-time-data";

// Comprehensive fallback data for Indian cities
export function generateFallbackRealTimeData(sector: string, region: string): RealTimeDataSources {
  const cityData = getCitySpecificData(region);
  const seasonalData = getSeasonalData();
  
  return {
    weather: {
      temperature: cityData.avgTemp,
      humidity: cityData.humidity,
      precipitation: seasonalData.precipitation,
      windSpeed: 12,
      conditions: seasonalData.conditions,
      source: 'static' as const
    },
    marketTrends: {
      indices: [
        { name: "Sensex", value: 82500, change: 1.2 },
        { name: "Nifty 50", value: 25200, change: 0.8 },
        { name: "Bank Nifty", value: 54800, change: -0.5 }
      ],
      commodityPrices: getCommodityPrices(sector),
      currency: { usd: 84.2, eur: 88.5, gbp: 106.3 },
      source: 'static' as const
    },
    newsData: {
      headlines: getNewsHeadlines(sector, region),
      sectorNews: getSectorNews(sector, region),
      sentiment: 'positive' as const,
      source: 'static' as const
    },
    economicIndicators: {
      gdpGrowth: 7.2,
      inflation: 4.1,
      interestRate: 6.5,
      unemploymentRate: 3.8,
      source: 'static' as const
    },
    socialSentiment: {
      trendingTopics: getTrendingTopics(sector),
      sectorSentiment: {
        healthcare: 0.75,
        automobile: 0.62,
        agriculture: 0.68
      },
      viralKeywords: getViralKeywords(sector),
      source: 'static' as const
    }
  };
}

function getCitySpecificData(region: string) {
  const cityWeatherMap: { [key: string]: { avgTemp: number; humidity: number } } = {
    'Mumbai': { avgTemp: 29, humidity: 78 },
    'Delhi': { avgTemp: 27, humidity: 62 },
    'Bangalore': { avgTemp: 24, humidity: 68 },
    'Chennai': { avgTemp: 31, humidity: 75 },
    'Kolkata': { avgTemp: 28, humidity: 82 },
    'Hyderabad': { avgTemp: 26, humidity: 65 },
    'Pune': { avgTemp: 25, humidity: 70 },
    'Ahmedabad': { avgTemp: 30, humidity: 58 },
    'Jaipur': { avgTemp: 28, humidity: 55 },
    'Lucknow': { avgTemp: 26, humidity: 68 }
  };
  
  return cityWeatherMap[region] || { avgTemp: 27, humidity: 65 };
}

function getSeasonalData() {
  const month = new Date().getMonth();
  // Winter (Dec-Feb), Summer (Mar-May), Monsoon (Jun-Sep), Post-Monsoon (Oct-Nov)
  if (month >= 11 || month <= 1) {
    return { precipitation: 15, conditions: "Clear skies" };
  } else if (month >= 2 && month <= 4) {
    return { precipitation: 5, conditions: "Hot and dry" };
  } else if (month >= 5 && month <= 8) {
    return { precipitation: 120, conditions: "Monsoon rains" };
  } else {
    return { precipitation: 35, conditions: "Partly cloudy" };
  }
}

function getCommodityPrices(sector: string) {
  const basePrices = [
    { commodity: "Gold", price: 72800, change: 0.5 },
    { commodity: "Silver", price: 91200, change: -0.3 },
    { commodity: "Crude Oil", price: 7200, change: 1.8 }
  ];
  
  if (sector === 'agriculture') {
    basePrices.push(
      { commodity: "Wheat", price: 2850, change: 2.1 },
      { commodity: "Rice", price: 3200, change: 1.5 },
      { commodity: "Cotton", price: 7800, change: -1.2 }
    );
  } else if (sector === 'automobile') {
    basePrices.push(
      { commodity: "Steel", price: 58500, change: 0.8 },
      { commodity: "Aluminum", price: 245000, change: 1.2 },
      { commodity: "Copper", price: 820000, change: -0.5 }
    );
  }
  
  return basePrices;
}

function getNewsHeadlines(sector: string, region: string): string[] {
  const sectorNews = {
    healthcare: [
      `${region} hospitals report increased demand for preventive care`,
      "Government announces new healthcare infrastructure investments",
      "Digital health adoption accelerates across urban centers",
      "Medical device manufacturing sees growth in domestic market"
    ],
    automobile: [
      `Electric vehicle sales surge in ${region} metropolitan area`,
      "Government incentives boost two-wheeler demand",
      "Automotive sector shows strong recovery post-pandemic",
      "EV charging infrastructure expansion planned for major cities"
    ],
    agriculture: [
      `${region} farmers adopt precision agriculture technologies`,
      "Monsoon forecast indicates favorable crop conditions",
      "Government announces increased MSP for key crops",
      "Agricultural exports show positive growth trends"
    ]
  };
  
  return sectorNews[sector as keyof typeof sectorNews] || [
    `${region} market shows stable growth trends`,
    "Economic indicators point to positive outlook",
    "Industry experts forecast continued demand growth"
  ];
}

function getSectorNews(sector: string, region: string) {
  const headlines = getNewsHeadlines(sector, region);
  return {
    [sector]: headlines,
    general: [`${region} economic growth maintains steady pace`]
  };
}

function getTrendingTopics(sector: string): string[] {
  const topics = {
    healthcare: ["telemedicine adoption", "preventive health", "health insurance", "medical tourism"],
    automobile: ["electric vehicles", "smart mobility", "sustainable transport", "autonomous driving"],
    agriculture: ["precision farming", "organic agriculture", "climate-smart farming", "agri-tech innovation"]
  };
  
  return topics[sector as keyof typeof topics] || ["market growth", "digital transformation"];
}

function getViralKeywords(sector: string): string[] {
  const keywords = {
    healthcare: ["health awareness", "vaccination drive", "wellness programs", "medical checkups"],
    automobile: ["EV revolution", "fuel efficiency", "smart cars", "green mobility"],
    agriculture: ["crop yield", "sustainable farming", "farmer income", "food security"]
  };
  
  return keywords[sector as keyof typeof keywords] || ["demand forecast", "market analysis"];
}