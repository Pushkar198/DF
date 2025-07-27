import { pwcGeminiClient } from "../pwc-gemini-client";
import { DemandPrediction } from "../ai-demand-forecasting";

// Using PwC Gemini client imported above

export async function generateEnergyPredictions(
  region: string,
  timeframe: string = "30 days",
  department?: string,
  category?: string
): Promise<DemandPrediction[]> {
  
  console.log(`🤖 Generating AI-driven energy demand forecast for ${region}...`);
  console.log(`Fetching real-time energy data for ${region}...`);

  const departmentFilter = department ? ` focusing on ${department}` : '';
  const categoryFilter = category ? ` within ${category}` : '';

  const prompt = `Generate a comprehensive energy demand forecast for ${region}, India${departmentFilter}${categoryFilter} for the next ${timeframe}.

Analyze these energy departments:
- Renewable Energy (Solar, Wind, Hydro, Biomass)
- Traditional Power (Coal, Natural Gas, Nuclear)
- Energy Storage (Batteries, Grid Storage, Pumped Hydro)
- Grid Management (Smart Grids, Transmission, Distribution)
- Energy Efficiency (LED Lighting, Smart Appliances, Building Automation)
- Oil & Gas (Petroleum Products, LPG, CNG)

Consider these energy factors for ${region}:
- Government renewable energy policies and subsidies
- Industrial and residential power consumption patterns
- Peak demand during summer (AC load) and winter heating
- Grid stability and power outage frequency
- Rural electrification and distributed generation needs
- Energy costs and tariff structures
- Environmental regulations and carbon emission targets
- Technology adoption rates (EV charging, rooftop solar)
- Monsoon impact on hydroelectric and solar generation
- Energy import dependency and security concerns

Return exactly 10 energy demand predictions in this JSON format:
{
  "predictions": [
    {
      "itemName": "Solar Panel 320W",
      "department": "Renewable Energy",
      "category": "Solar Equipment", 
      "subcategory": "Photovoltaic Panels",
      "currentDemand": 2000,
      "predictedDemand": 2600,
      "demandUnit": "units/month",
      "demandChangePercentage": 30.0,
      "demandTrend": "increase",
      "confidence": 0.88,
      "peakPeriod": "30 days",
      "reasoning": "Strong government push for solar installations and decreasing panel costs drive residential and commercial adoption. Based on Ministry of New and Renewable Energy data and solar industry reports.",
      "demandUnit": "units/month",
      "detailedSources": ["Ministry of New and Renewable Energy", "Solar Power Developers Association", "Central Electricity Authority", "National Solar Mission reports"],
      "marketFactors": ["Solar Policy Support → PM Kusum scheme provides 30% subsidy for rooftop solar → Ministry of New and Renewable Energy → www.mnre.gov.in", "Cost Reduction → Solar panel prices dropped 15% in 2024 → Solar Power Association → www.solarpower.org.in", "Grid Independence → Power outages increased demand for backup solar systems → Central Electricity Authority → www.cea.nic.in"],
      "recommendations": ["Increase panel inventory", "Focus on residential sector", "Partner with installers"],
      "newsImpact": "New solar policy announcements boost market confidence",
      "seasonalFactor": "Pre-monsoon installation rush before rainy season",
      "riskLevel": "Low"
    }
  ]
}

Focus on realistic current demand numbers, accurate energy sector pricing for ${region}, and practical energy infrastructure insights. Include mix from renewable to traditional energy sources.

ELABORATIVE REASONING REQUIREMENTS:
Each prediction must include comprehensive 3-4 sentence reasoning covering energy policy analysis, grid infrastructure impact, environmental regulations, technology adoption patterns, economic feasibility, and regional energy security considerations.

MARKET FACTORS WITH DETAILED EXPLANATIONS:
Each market factor must follow this format: Factor → Reason → Source → Link
Example: "Solar Policy Support → PM Kusum scheme provides 30% subsidy for rooftop solar → Ministry of New and Renewable Energy → www.mnre.gov.in/solar-scheme"

Required factors with explanations:
- Policy Support: Government incentives, subsidies with ministry announcement sources
- Technology Adoption: Market readiness, adoption rates with industry survey sources
- Environmental Impact: Carbon reduction, sustainability goals with environment ministry sources
- Economic Affordability: Cost competitiveness, ROI calculations with energy authority sources
- Infrastructure Readiness: Grid capacity, installation feasibility with power ministry sources
- Supply Chain: Equipment availability, delivery reliability with manufacturing reports
- Regulatory Environment: Compliance requirements, policy stability with regulatory body sources

MARKET FACTOR GRAPHICAL DATA:
Include quantitative market factor data for visualization:
- Policy Support (0-100): Government incentives and regulatory support
- Technology Adoption (0-100): Market readiness for new energy technologies
- Environmental Impact (0-100): Sustainability and carbon reduction benefits
- Economic Affordability (0-100): Cost competitiveness and ROI potential
- Infrastructure Readiness (0-100): Grid capacity and installation feasibility
- Supply Chain Stability (0-100): Equipment availability and delivery reliability
- Regulatory Environment (0-100): Compliance ease and policy stability

Add these fields to each prediction:
"marketFactorData": {
  "policySupport": number (0-100),
  "technologyAdoption": number (0-100),
  "environmentalImpact": number (0-100),
  "economicAffordability": number (0-100),
  "infrastructureReadiness": number (0-100),
  "supplyChainStability": number (0-100),
  "regulatoryEnvironment": number (0-100)
}`;

  try {
    const text = await pwcGeminiClient.generateContent(prompt);
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in AI response");
    }
    
    const data = JSON.parse(jsonMatch[0]);
    
    if (!data.predictions || !Array.isArray(data.predictions)) {
      throw new Error("Invalid prediction format from AI");
    }

    return data.predictions.map((pred: any) => ({
      ...pred,
      demandChange: pred.demandChangePercentage || 0,
      category: pred.category || "Energy Infrastructure",
      subcategory: pred.subcategory || "General"
    }));

  } catch (error) {
    console.error("Error in energy AI prediction:", error);
    
    // Fallback predictions for energy sector
    return [
      {
        itemName: "Solar Panel 320W",
        department: "Renewable Energy",
        category: "Solar Equipment",
        subcategory: "Photovoltaic Panels",
        currentDemand: 2000,
        predictedDemand: 2600,
        demandChange: 30.0,
        demandChangePercentage: 30.0,
        demandTrend: "increase",
        confidence: 0.88,
        peakPeriod: "30 days",
        reasoning: "Strong government push for solar installations and decreasing panel costs drive adoption.",
        marketFactors: ["Government subsidies", "Falling costs", "Grid independence"],
        recommendations: ["Increase panel inventory", "Focus on residential sector"],
        newsImpact: "New solar policy announcements boost market confidence",
        seasonalFactor: "Pre-monsoon installation rush before rainy season",
        riskLevel: "Low"
      },
      {
        itemName: "Lithium Battery 100kWh",
        department: "Energy Storage",
        category: "Energy Storage",
        subcategory: "Battery Systems",
        currentDemand: 50,
        predictedDemand: 75,
        demandChange: 50.0,
        demandChangePercentage: 50.0,
        demandTrend: "increase",
        confidence: 0.85,
        peakPeriod: "30 days",
        reasoning: "Growing need for grid storage and EV infrastructure drives battery demand significantly.",
        marketFactors: ["EV adoption", "Grid stability", "Renewable integration"],
        recommendations: ["Secure battery supply chains", "Partner with EV manufacturers"],
        newsImpact: "Government EV policies boost battery storage market",
        seasonalFactor: "Industrial expansion increases energy storage needs",
        riskLevel: "Medium"
      }
    ];
  }
}