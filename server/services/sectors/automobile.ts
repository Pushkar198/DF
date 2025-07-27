import { pwcGeminiClient } from "../pwc-gemini-client";
import { fetchComprehensiveRegionData } from "../external-data";

export interface AutomobileForecastInput {
  region: string;
  timeframe: string;
}

export interface AutomobilePrediction {
  itemName: string;
  department: string;
  category: string;
  subcategory: string;
  currentDemand: number;
  predictedDemand: number;
  demandUnit: string; // vehicles/month, units/month, etc.
  demandChange: number; // Required for main interface compatibility
  demandChangePercentage: number;
  demandTrend: string; // "increase", "decrease", "no change"
  confidence: number;
  peakPeriod: string;
  reasoning: string;
  detailedSources: string[]; // Specific data sources used
  marketFactors: string[];
  recommendations: string[];
  newsImpact: string;
  seasonalFactor: string;
  riskLevel: string;
}

async function fetchRealTimeData(region: string) {
  try {
    console.log(`Fetching real-time automobile data for ${region}...`);
    
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

export async function generateAutomobilePredictions(
  region: string, 
  timeframe: string, 
  department?: string, 
  category?: string
): Promise<AutomobilePrediction[]> {
  try {
    console.log(`🤖 Generating AI-driven automobile demand forecast for ${region}...`);
    
    const realTimeData = await fetchRealTimeData(region);
    
    // Convert timeframe to standardized periods
    const standardizedTimeframe = timeframe.includes('15') ? '15 days' : 
                                 timeframe.includes('30') ? '30 days' : 
                                 timeframe.includes('60') ? '60 days' : '30 days';

    const departmentFilter = department && department !== "all" ? `
SPECIFIC DEPARTMENT FOCUS: ${department}
- Focus predictions specifically on items managed by or relevant to the ${department}
- Consider department-specific operational requirements and workflows
- Prioritize department-specific demand patterns and business needs` : "";

    const categoryFilter = category && category !== "all" ? `
SPECIFIC CATEGORY FOCUS: ${category}
- Limit predictions to items in the "${category}" category only
- Focus on category-specific market dynamics and consumer preferences
- Consider category-specific regulatory and technological factors` : "";

    const prompt = `
You are an expert automotive industry analyst with deep knowledge of Indian automobile market trends, manufacturing data, and consumer behavior patterns.

Generate professional demand predictions for automobile sector in ${region}, India for the next ${standardizedTimeframe}.
${departmentFilter}
${categoryFilter}

Real-time Market Context:
${JSON.stringify(realTimeData, null, 2)}

AUTOMOBILE SUBCATEGORIES FOR FORECASTING:

1. TWO-WHEELERS:
   - Scooters: Honda Activa, TVS Jupiter, Suzuki Access, Hero Pleasure
   - Motorcycles (100-125cc): Hero Splendor, Bajaj Platina, Honda Shine, TVS Star City
   - Motorcycles (150-200cc): Bajaj Pulsar, Yamaha FZ, Honda CB Hornet, TVS Apache
   - Premium Motorcycles (250cc+): Royal Enfield Classic, KTM Duke, Bajaj Dominar
   - Electric Two-wheelers: Ola Electric, TVS iQube, Bajaj Chetak, Hero Electric

2. PASSENGER VEHICLES:
   - Hatchbacks: Maruti Swift, Hyundai i20, Tata Altroz, Honda Jazz
   - Compact Sedans: Maruti Dzire, Hyundai Aura, Honda Amaze, Tata Tigor
   - SUVs (Compact): Maruti Brezza, Hyundai Venue, Tata Nexon, Kia Sonet
   - SUVs (Mid-size): Hyundai Creta, Kia Seltos, MG Hector, Tata Harrier
   - Luxury Cars: BMW 3 Series, Audi A4, Mercedes C-Class, Jaguar XE

3. COMMERCIAL VEHICLES:
   - Light Commercial Vehicles: Tata Ace, Mahindra Bolero Pickup, Ashok Leyland Dost
   - Medium Commercial Vehicles: Tata LPT, Ashok Leyland Partner, Eicher Pro
   - Heavy Commercial Vehicles: Tata Prima, Ashok Leyland U-Truck, BharatBenz
   - Buses: Tata Starbus, Ashok Leyland Lynx, Force Traveller

4. ELECTRIC VEHICLES:
   - Electric Cars: Tata Nexon EV, MG ZS EV, Hyundai Kona, Mahindra eVerito
   - Electric Commercial: Tata Ace EV, Mahindra Treo, Piaggio Porter Electric
   - Charging Infrastructure: AC chargers, DC fast chargers, Home charging units

5. AUTOMOBILE PARTS & ACCESSORIES:
   - Engine Components: Pistons, Valves, Gaskets, Filters (Oil, Air, Fuel)
   - Electrical Parts: Batteries, Alternators, Starters, LED lights, ECUs
   - Suspension & Braking: Shock absorbers, Brake pads, Disc brakes, Tyres
   - Body Parts: Bumpers, Headlights, Mirrors, Door handles, Seat covers
   - Performance Parts: Alloy wheels, Exhaust systems, Turbochargers

6. AUTOMOTIVE LUBRICANTS & FLUIDS:
   - Engine Oils: Castrol GTX, Mobil 1, Shell Helix, Valvoline MaxLife
   - Gear Oils: Manual transmission fluids, Differential oils
   - Coolants: Radiator coolants, Brake fluids, Power steering fluids
   - Additives: Fuel additives, Engine cleaners, Rust preventives

7. AUTOMOTIVE SERVICES & AFTERMARKET:
   - Maintenance Services: Oil changes, Brake services, Tyre rotation
   - Repair Services: Engine diagnostics, Transmission repairs, AC services
   - Insurance Products: Vehicle insurance policies, Extended warranties
   - Financing: Auto loans, Lease options, EMI schemes

FORECASTING REQUIREMENTS:

1. NEWS & MARKET INTEGRATION:
   - Analyze recent automotive industry news affecting ${region}
   - Consider government policies (EV subsidies, emission norms, road taxes)
   - Factor in fuel price changes and their impact on vehicle preferences
   - Include impact of new model launches and recalls
   - Account for economic indicators affecting purchasing power

2. DEMAND VARIATION PATTERNS:
   - Increases: 5-35% for EVs, fuel-efficient vehicles, or policy-supported segments
   - Decreases: 5-30% due to high fuel costs, policy restrictions, or market saturation
   - Stable: ±5% for established models with consistent market share
   - Include specific rationale based on market dynamics

3. PROFESSIONAL FORECASTING CRITERIA:
   - Base predictions on automotive sales data and registration trends
   - Consider seasonal patterns (festival seasons, monsoon impact, wedding seasons)
   - Factor in demographic trends and urbanization rates
   - Account for infrastructure development (roads, charging stations)
   - Include supply chain considerations and semiconductor availability

4. TIMEFRAME SPECIFICATIONS:
   - 15 days: Focus on immediate inventory needs, spare parts, consumables
   - 30 days: Standard forecasting for vehicle sales and service demand
   - 60 days: Strategic planning for new launches and seasonal preparation

Generate exactly 10 diverse predictions covering multiple automotive segments with specific vehicle models and part specifications.

Respond with JSON array in this exact format:
[{
  "itemName": "string (specific vehicle model/part name with specifications)",
  "department": "string (e.g., 'Passenger Vehicle Department', 'Commercial Vehicle Department', 'Two-Wheeler Department', 'Parts & Service Department')",
  "category": "string (Two-Wheelers/Passenger Vehicles/Commercial Vehicles/Electric Vehicles/Parts & Accessories/Lubricants/Services)",
  "subcategory": "string (specific vehicle type or part category)", 
  "currentDemand": number (baseline units per month for region),
  "predictedDemand": number (forecasted units for timeframe),
  "demandChangePercentage": number (percentage change as number, e.g., 12.5 for 12.5% increase, -6.3 for 6.3% decrease),
  "demandTrend": "string (increase/decrease/no change)",
  "confidence": number (0.65-0.95 based on data quality),
  "peakPeriod": "${standardizedTimeframe}",
  "reasoning": "string (detailed market and economic rationale with percentage context)",
  "marketFactors": ["string (Factor → Reason → Source → Link format, e.g., 'Fuel Price Impact → Petrol prices increased 8% → Ministry of Petroleum → www.petroleum.nic.in')"],
  "recommendations": ["string (actionable business recommendations for dealers/manufacturers)"],
  "newsImpact": "string (specific automotive news or policy affecting this item)",
  "seasonalFactor": "string (seasonal influence like festivals, monsoon, wedding season)",
  "riskLevel": "Low/Medium/High"
}]
`;

    const rawJson = await pwcGeminiClient.generateContent(prompt);
    if (rawJson) {
      const predictions = JSON.parse(rawJson);
      // Add demandChange field for compatibility
      return predictions.map((p: any) => ({
        ...p,
        demandChange: p.predictedDemand - p.currentDemand
      }));
    } else {
      throw new Error("Empty response from Gemini AI");
    }
  } catch (error) {
    console.error('Error generating automobile predictions:', error);
    throw new Error(`Failed to generate automobile demand forecast: ${error}`);
  }
}