import { GoogleGenAI } from "@google/genai";
import { DemandItem, ContextualData, InsertPrediction } from "@shared/schema";
import { fetchComprehensiveRegionData } from "../external-data";
import { fetchRealEnvironmentalData } from "../real-data";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GOOGLE_API_KEY || ""
});

export interface AgricultureDemandInput {
  region: string;
  timeframe: string;
  cropCycle: 'kharif' | 'rabi' | 'zaid';
  farmingType: 'smallholder' | 'commercial' | 'organic';
}

export interface AgricultureDemandResult {
  product: string;
  category: 'seeds' | 'fertilizers' | 'machinery' | 'pesticides';
  cropType: string;
  seasonality: string;
  demandQuantity: number;
  confidence: number;
  weatherFactors: string[];
  policyImpact: string;
  marketPrices: string;
  soilConditions: string;
  reasoning: string;
}

export async function generateAgricultureDemandForecast(input: AgricultureDemandInput): Promise<AgricultureDemandResult[]> {
  try {
    // Fetch real-time data
    const [comprehensiveData, environmentalData] = await Promise.all([
      fetchComprehensiveRegionData(input.region),
      fetchRealEnvironmentalData(input.region)
    ]);

    const prompt = `
You are an expert agricultural economist with access to real-time global agricultural data. Predict agricultural input demand for the specified region based on authentic data.

Region: ${input.region}
Timeframe: ${input.timeframe}
Crop Cycle: ${input.cropCycle}
Farming Type: ${input.farmingType}

REAL-TIME WEATHER DATA:
- Temperature: ${environmentalData.temperature}°F
- Humidity: ${environmentalData.humidity}%
- Precipitation: ${environmentalData.precipitation} inches
- Wind Speed: ${environmentalData.windSpeed} mph
- UV Index: ${environmentalData.uvIndex}
- Conditions: Weather patterns affecting crops

ENVIRONMENTAL CONDITIONS:
- Air Quality: ${environmentalData.airQuality}
- Pressure: ${environmentalData.pressure} inHg
- Visibility: ${environmentalData.visibility} miles
- Dew Point: ${environmentalData.dewPoint}°F

MARKET & POLICY DATA:
- News Headlines: ${comprehensiveData.news.headlines.join(', ')}
- Social Media Trends: ${comprehensiveData.socialMedia.healthTrends.join(', ')}
- Public Sentiment: ${comprehensiveData.socialMedia.publicSentiment}

SEASONAL CONSIDERATIONS:
- Current Season: Based on weather patterns
- Monsoon Predictions: Derived from weather data
- Crop Calendar: ${input.cropCycle} season requirements

Based on this authentic data, predict agricultural demand for:

1. Seeds: Based on crop cycles and weather patterns
2. Fertilizers: Based on soil conditions and crop requirements  
3. Machinery: Based on farm size and season
4. Pesticides: Based on weather conditions and pest patterns

For each agricultural product prediction, provide:
- Product name and specifications
- Category (seeds/fertilizers/machinery/pesticides)
- Target crop type
- Seasonal timing requirements
- Estimated demand quantity (units/tons)
- Confidence level (0-1)
- Weather factors affecting demand
- Government policy/subsidy impact
- Current market price trends
- Soil and environmental conditions
- Detailed reasoning

Respond with JSON array:
[{
  "product": "string",
  "category": "seeds|fertilizers|machinery|pesticides",
  "cropType": "string",
  "seasonality": "string",
  "demandQuantity": number,
  "confidence": number,
  "weatherFactors": ["factor1", "factor2"],
  "policyImpact": "string", 
  "marketPrices": "string",
  "soilConditions": "string",
  "reasoning": "string"
}]
`;

    const response = await ai.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const rawJson = response.response.text();
    if (rawJson) {
      const predictions = JSON.parse(rawJson);
      return predictions;
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error) {
    console.error('Error generating agriculture demand forecast:', error);
    // Fallback to basic predictions
    return [
      {
        product: "Rice Seeds",
        category: "seeds",
        cropType: "Rice",
        seasonality: "Kharif season",
        demandQuantity: 100,
        confidence: 0.75,
        weatherFactors: ["Monsoon timing", "Temperature patterns"],
        policyImpact: "Government seed subsidies available",
        marketPrices: "Stable pricing expected",
        soilConditions: "Suitable moisture levels",
        reasoning: "Basic fallback prediction for common crop"
      }
    ];
  }
}

export const agricultureItems = [
  // Seeds
  { name: "Rice Seeds (Basmati)", category: "seeds", subcategory: "cereal", specifications: { cropCycle: "kharif", soilType: "clay" }},
  { name: "Wheat Seeds", category: "seeds", subcategory: "cereal", specifications: { cropCycle: "rabi", soilType: "loam" }},
  { name: "Cotton Seeds", category: "seeds", subcategory: "cash_crop", specifications: { cropCycle: "kharif", soilType: "black" }},
  { name: "Soybean Seeds", category: "seeds", subcategory: "oilseed", specifications: { cropCycle: "kharif", soilType: "well_drained" }},
  
  // Fertilizers
  { name: "Urea Fertilizer", category: "fertilizers", subcategory: "nitrogen", specifications: { nutrient: "N", application: "pre_sowing" }},
  { name: "DAP Fertilizer", category: "fertilizers", subcategory: "phosphorus", specifications: { nutrient: "P", application: "basal" }},
  { name: "Potash Fertilizer", category: "fertilizers", subcategory: "potassium", specifications: { nutrient: "K", application: "flowering" }},
  { name: "Organic Compost", category: "fertilizers", subcategory: "organic", specifications: { type: "organic", application: "soil_health" }},
  
  // Machinery
  { name: "Tractor (Small)", category: "machinery", subcategory: "power", specifications: { farmSize: "small", power: "25-35HP" }},
  { name: "Combine Harvester", category: "machinery", subcategory: "harvesting", specifications: { farmSize: "large", crop: "cereal" }},
  { name: "Seed Drill", category: "machinery", subcategory: "sowing", specifications: { farmSize: "medium", precision: "high" }},
  { name: "Irrigation Pump", category: "machinery", subcategory: "irrigation", specifications: { waterSource: "borewell", capacity: "medium" }},
  
  // Pesticides
  { name: "Insecticide (Chlorpyrifos)", category: "pesticides", subcategory: "insecticide", specifications: { target: "bollworm", crop: "cotton" }},
  { name: "Fungicide (Mancozeb)", category: "pesticides", subcategory: "fungicide", specifications: { target: "blight", crop: "potato" }},
  { name: "Herbicide (Glyphosate)", category: "pesticides", subcategory: "herbicide", specifications: { target: "weeds", application: "pre_emergence" }},
  { name: "Bio-Pesticide", category: "pesticides", subcategory: "organic", specifications: { type: "neem_based", target: "aphids" }},
];