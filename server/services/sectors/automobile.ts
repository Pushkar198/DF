import { GoogleGenAI } from "@google/genai";
import { DemandItem, ContextualData, InsertPrediction } from "@shared/schema";
import { fetchComprehensiveRegionData } from "../external-data";
import { fetchRealEnvironmentalData } from "../real-data";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GOOGLE_API_KEY || ""
});

export interface AutomobileDemandInput {
  region: string;
  timeframe: string;
  demographics: {
    urbanPopulation: number;
    ruralPopulation: number;
    averageIncome: number;
  };
}

export interface VehicleDemandResult {
  vehicle: string;
  regionType: 'urban' | 'rural';
  fuelType: 'EV' | 'petrol' | 'diesel' | 'hybrid';
  vehicleClass: '2-wheeler' | '4-wheeler' | 'commercial';
  demandQuantity: number;
  confidence: number;
  priceFactors: string[];
  policyImpact: string;
  marketTrends: string[];
  reasoning: string;
}

export async function generateAutomobileDemandForecast(input: AutomobileDemandInput): Promise<VehicleDemandResult[]> {
  try {
    // Fetch real-time data
    const [comprehensiveData, environmentalData] = await Promise.all([
      fetchComprehensiveRegionData(input.region),
      fetchRealEnvironmentalData(input.region)
    ]);

    const prompt = `
You are an expert automotive market analyst with access to real-time global market data. Predict vehicle demand for the specified region based on authentic data.

Region: ${input.region}
Timeframe: ${input.timeframe}
Demographics: ${JSON.stringify(input.demographics)}

REAL-TIME MARKET DATA:
- News Headlines: ${comprehensiveData.news.headlines.join(', ')}
- Economic Indicators: Available from news sentiment
- Public Sentiment: ${comprehensiveData.socialMedia.publicSentiment}

ENVIRONMENTAL FACTORS:
- Air Quality: ${environmentalData.airQuality}
- Population Density: ${environmentalData.populationDensity}
- Urban vs Rural: Based on population density and region type

POLICY & TRENDS:
- Social Media Trends: ${comprehensiveData.socialMedia.viralHealthTopics.join(', ')}
- Current Market Sentiment: ${comprehensiveData.socialMedia.publicSentiment}

Based on this authentic data, predict vehicle demand considering:

1. Region Types: urban (high density), rural (low density)
2. Fuel Types: EV (electric), petrol, diesel, hybrid
3. Vehicle Classes: 2-wheeler (bikes/scooters), 4-wheeler (cars/SUVs), commercial (trucks/buses)
4. Consider government policies, fuel prices, economic indicators, environmental concerns

For each vehicle prediction, provide:
- Vehicle type and specifications
- Target region type (urban/rural)
- Fuel type preference
- Vehicle class
- Estimated demand quantity (units)
- Confidence level (0-1)
- Price and economic factors
- Government policy impact
- Market trends affecting demand
- Detailed reasoning

Respond with JSON array:
[{
  "vehicle": "string",
  "regionType": "urban|rural",
  "fuelType": "EV|petrol|diesel|hybrid",
  "vehicleClass": "2-wheeler|4-wheeler|commercial",
  "demandQuantity": number,
  "confidence": number,
  "priceFactors": ["factor1", "factor2"],
  "policyImpact": "string",
  "marketTrends": ["trend1", "trend2"],
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
    console.error('Error generating automobile demand forecast:', error);
    // Fallback to basic predictions
    return [
      {
        vehicle: "Electric Scooter",
        regionType: "urban",
        fuelType: "EV",
        vehicleClass: "2-wheeler",
        demandQuantity: 500,
        confidence: 0.8,
        priceFactors: ["EV subsidies", "Fuel price increase"],
        policyImpact: "Government EV promotion increases demand",
        marketTrends: ["Urban mobility shift", "Environmental awareness"],
        reasoning: "Basic fallback prediction for electric vehicles"
      }
    ];
  }
}

export const automobileItems = [
  // 2-wheelers
  { name: "Electric Scooter", category: "vehicle", subcategory: "2-wheeler", specifications: { fuelType: "EV", regionType: "urban" }},
  { name: "Petrol Motorcycle", category: "vehicle", subcategory: "2-wheeler", specifications: { fuelType: "petrol", regionType: "rural" }},
  { name: "Electric Bicycle", category: "vehicle", subcategory: "2-wheeler", specifications: { fuelType: "EV", regionType: "urban" }},
  
  // 4-wheelers
  { name: "Electric Car", category: "vehicle", subcategory: "4-wheeler", specifications: { fuelType: "EV", regionType: "urban" }},
  { name: "Petrol Sedan", category: "vehicle", subcategory: "4-wheeler", specifications: { fuelType: "petrol", regionType: "urban" }},
  { name: "Diesel SUV", category: "vehicle", subcategory: "4-wheeler", specifications: { fuelType: "diesel", regionType: "rural" }},
  { name: "Hybrid Car", category: "vehicle", subcategory: "4-wheeler", specifications: { fuelType: "hybrid", regionType: "urban" }},
  
  // Commercial vehicles
  { name: "Electric Delivery Van", category: "vehicle", subcategory: "commercial", specifications: { fuelType: "EV", regionType: "urban" }},
  { name: "Diesel Truck", category: "vehicle", subcategory: "commercial", specifications: { fuelType: "diesel", regionType: "rural" }},
  { name: "CNG Bus", category: "vehicle", subcategory: "commercial", specifications: { fuelType: "CNG", regionType: "urban" }},
  
  // Parts and accessories
  { name: "EV Charging Station", category: "infrastructure", subcategory: "charging", specifications: { fuelType: "EV" }},
  { name: "Vehicle Insurance", category: "service", subcategory: "insurance", specifications: { vehicleClass: "all" }},
  { name: "Vehicle Batteries", category: "parts", subcategory: "battery", specifications: { fuelType: "EV" }},
];