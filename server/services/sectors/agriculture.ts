import { GoogleGenAI } from "@google/genai";
import { fetchComprehensiveRegionData } from "../external-data";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || ""
});

export interface AgricultureForecastInput {
  region: string;
  timeframe: string;
}

export interface AgriculturePrediction {
  itemName: string;
  department: string;
  category: string;
  subcategory: string;
  currentDemand: number;
  predictedDemand: number;
  demandChangePercentage: number;
  demandTrend: string; // "increase", "decrease", "no change"
  confidence: number;
  peakPeriod: string;
  reasoning: string;
  marketFactors: string[];
  recommendations: string[];
  newsImpact: string;
  seasonalFactor: string;
  riskLevel: string;
}

async function fetchRealTimeData(region: string) {
  try {
    console.log(`Fetching real-time agriculture data for ${region}...`);
    
    const comprehensiveData = await fetchComprehensiveRegionData(region);

    return {
      comprehensive: comprehensiveData,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.warn(`Warning: Could not fetch all real-time data for ${region}:`, error);
    return {
      comprehensive: { 
        weather: { conditions: "Variable", temperature: 75, humidity: 60, airQuality: "Moderate" }, 
        news: { headlines: [], healthRelated: [], diseaseOutbreaks: [] }, 
        socialMedia: { healthTrends: [], publicSentiment: "neutral" } 
      },
      timestamp: new Date().toISOString()
    };
  }
}

export async function generateAgriculturePredictions(region: string, timeframe: string): Promise<AgriculturePrediction[]> {
  try {
    console.log(`🤖 Generating AI-driven agriculture demand forecast for ${region}...`);
    
    const realTimeData = await fetchRealTimeData(region);
    
    // Convert timeframe to standardized periods
    const standardizedTimeframe = timeframe.includes('15') ? '15 days' : 
                                 timeframe.includes('30') ? '30 days' : 
                                 timeframe.includes('60') ? '60 days' : '30 days';

    const prompt = `
You are an expert agricultural economist and crop specialist with deep knowledge of Indian farming practices, seasonal patterns, and agri-commodity markets.

Generate professional demand predictions for agriculture sector in ${region}, India for the next ${standardizedTimeframe}.

Real-time Market Context:
${JSON.stringify(realTimeData, null, 2)}

AGRICULTURE SUBCATEGORIES FOR FORECASTING:

1. SEEDS & PLANTING MATERIALS:
   - Cereal Seeds: Wheat (HD-2967, PBW-343), Rice (Basmati, IR-64), Maize (NK-6240, DKC-9108)
   - Pulses Seeds: Chickpea (Kabuli, Desi), Lentil (Masoor), Pigeon pea (Arhar)
   - Oilseed Seeds: Mustard (Pusa Bold), Sunflower (DRSH-1), Soybean (JS-335)
   - Vegetable Seeds: Tomato (Arka Rakshak), Onion (Agrifound Dark Red), Potato (Kufri Jyoti)
   - Cotton Seeds: Bt Cotton (Bollgard-II), Hybrid Cotton varieties

2. FERTILIZERS & NUTRIENTS:
   - Nitrogen Fertilizers: Urea (46-0-0), Ammonium Sulphate, Calcium Ammonium Nitrate
   - Phosphate Fertilizers: DAP (18-46-0), SSP (16% P2O5), Triple Super Phosphate
   - Potash Fertilizers: Muriate of Potash (60% K2O), Sulphate of Potash
   - Complex Fertilizers: NPK (10-26-26), NPK (12-32-16), NPK (20-20-0)
   - Micronutrients: Zinc Sulphate, Boron, Iron Chelates, Manganese Sulphate

3. CROP PROTECTION CHEMICALS:
   - Insecticides: Cypermethrin, Chlorpyrifos, Imidacloprid, Thiamethoxam
   - Fungicides: Mancozeb, Propiconazole, Azoxystrobin, Carbendazim
   - Herbicides: Glyphosate, 2,4-D, Atrazine, Pendimethalin
   - Biological Control: Trichoderma, Pseudomonas, NPV (Nuclear Polyhedrosis Virus)
   - Plant Growth Regulators: Gibberellic Acid, Cytokinin, Auxins

4. FARM MACHINERY & EQUIPMENT:
   - Tractors: Mahindra 575 DI, TAFE 42 DI, Sonalika DI-730, John Deere 5042D
   - Harvesters: Combine harvesters, Paddy transplanters, Sugarcane harvesters
   - Tillage Equipment: Cultivators, Harrows, Ploughs, Rotavators
   - Irrigation Equipment: Drip irrigation systems, Sprinklers, Pumps
   - Threshing Equipment: Threshers, Winnowing fans, Chaff cutters

5. IRRIGATION & WATER MANAGEMENT:
   - Drip Irrigation: Drippers, Laterals, Main lines, Filters
   - Sprinkler Systems: Impact sprinklers, Micro sprinklers, Rain guns
   - Water Pumps: Submersible pumps, Centrifugal pumps, Solar pumps
   - Storage Systems: Water tanks, Check dams, Farm ponds
   - Water Treatment: Filters, pH controllers, Fertigation systems

6. LIVESTOCK & DAIRY:
   - Cattle Feed: Protein concentrate, Mineral mixture, Silage
   - Poultry Feed: Broiler starter, Layer feed, Chick feed
   - Veterinary Medicines: Antibiotics, Vaccines, Dewormers, Growth promoters
   - Dairy Equipment: Milking machines, Milk coolers, Butter churns
   - Animal Housing: Cattle sheds, Poultry cages, Ventilation systems

7. POST-HARVEST & STORAGE:
   - Storage Structures: Silos, Warehouses, Cold storage units
   - Processing Equipment: Rice mills, Oil expellers, Flour mills
   - Packaging Materials: Gunny bags, HDPE bags, Vacuum packing
   - Preservation: Fumigants, Moisture absorbers, Pest control
   - Transportation: Farm trailers, Refrigerated vehicles

8. ORGANIC & SUSTAINABLE FARMING:
   - Organic Fertilizers: Vermicompost, FYM, Compost, Biofertilizers
   - Organic Pesticides: Neem oil, Pheromone traps, Sticky traps
   - Sustainable Practices: Cover crops, Crop rotation, Green manuring
   - Certification: Organic certification, Good Agricultural Practices (GAP)

FORECASTING REQUIREMENTS:

1. NEWS & MARKET INTEGRATION:
   - Analyze recent agricultural policy announcements and MSP changes
   - Consider monsoon forecasts and weather pattern impacts
   - Factor in international commodity price fluctuations
   - Include impact of government subsidies and farmer schemes
   - Account for crop insurance and risk management programs

2. DEMAND VARIATION PATTERNS:
   - Increases: 5-40% for climate-resilient varieties, government-promoted crops, or drought-resistant seeds
   - Decreases: 5-25% due to weather uncertainty, market price volatility, or policy changes
   - Stable: ±5% for traditional crops with established farming practices
   - Include specific rationale based on cropping patterns and agricultural cycles

3. PROFESSIONAL FORECASTING CRITERIA:
   - Base predictions on crop calendar and seasonal requirements
   - Consider regional soil types and water availability
   - Factor in farmer income levels and credit accessibility
   - Account for technology adoption rates and extension services
   - Include supply chain logistics and market connectivity

4. TIMEFRAME SPECIFICATIONS:
   - 15 days: Focus on immediate seasonal needs, emergency supplies, pest outbreaks
   - 30 days: Standard forecasting for seasonal crop inputs and equipment
   - 60 days: Strategic planning for next season preparation and bulk procurement

Generate exactly 10 diverse predictions covering multiple agricultural segments with specific product names and specifications.

Respond with JSON array in this exact format:
[{
  "itemName": "string (specific product name with variety/brand specifications)",
  "department": "string (e.g., 'Crop Production Department', 'Horticulture Department', 'Animal Husbandry Department', 'Farm Mechanization Department')",
  "category": "string (Seeds/Fertilizers/Crop Protection/Farm Machinery/Irrigation/Livestock/Post-Harvest/Organic)",
  "subcategory": "string (specific agricultural category)", 
  "currentDemand": number (baseline units per month for region),
  "predictedDemand": number (forecasted units for timeframe),
  "demandChangePercentage": number (percentage change as number, e.g., 18.2 for 18.2% increase, -11.5 for 11.5% decrease),
  "demandTrend": "string (increase/decrease/no change)",
  "confidence": number (0.65-0.95 based on data quality),
  "peakPeriod": "${standardizedTimeframe}",
  "reasoning": "string (detailed agricultural and market rationale with percentage context)",
  "marketFactors": ["string (specific agricultural drivers like weather, MSP, subsidies, crop cycles)"],
  "recommendations": ["string (actionable recommendations for farmers/dealers/manufacturers)"],
  "newsImpact": "string (specific agricultural news or policy affecting this item)",
  "seasonalFactor": "string (seasonal agricultural influence like sowing, harvesting, monsoon)",
  "riskLevel": "Low/Medium/High"
}]
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });

    const rawJson = response.text;
    if (rawJson) {
      const predictions = JSON.parse(rawJson);
      return predictions;
    } else {
      throw new Error("Empty response from Gemini AI");
    }
  } catch (error) {
    console.error('Error generating agriculture predictions:', error);
    throw new Error(`Failed to generate agriculture demand forecast: ${error}`);
  }
}