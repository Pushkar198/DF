import { GoogleGenAI } from "@google/genai";
import { fetchComprehensiveRegionData } from "../external-data";
import { fetchRealHealthData, fetchRealDiseaseData } from "../real-data";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || ""
});

export interface HealthcareForecastInput {
  region: string;
  timeframe: string;
}

export interface HealthcarePrediction {
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
    console.log(`Fetching real-time data for healthcare in ${region}...`);
    
    const [comprehensiveData, healthData, diseaseData] = await Promise.all([
      fetchComprehensiveRegionData(region),
      fetchRealHealthData(region),
      fetchRealDiseaseData(region)
    ]);

    return {
      comprehensive: comprehensiveData,
      health: healthData,
      diseases: diseaseData,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.warn(`Warning: Could not fetch all real-time data for ${region}:`, error);
    // Return basic fallback structure
    return {
      comprehensive: { weather: { conditions: "Variable", temperature: 75, humidity: 60, airQuality: "Moderate" }, news: { healthRelated: [], diseaseOutbreaks: [] }, socialMedia: { diseaseKeywords: [], publicSentiment: "neutral" } },
      health: { healthcareCapacity: "Adequate", recentDiseaseReports: [], vaccinationRates: {}, hospitalOccupancy: 70, medicalSupplies: {}, publicHealthMeasures: [] },
      diseases: [],
      timestamp: new Date().toISOString()
    };
  }
}

export async function generateHealthcarePredictions(region: string, timeframe: string): Promise<HealthcarePrediction[]> {
  try {
    console.log(`🤖 Generating AI-driven healthcare demand forecast for ${region}...`);
    
    // Get real-time data with news integration
    const realTimeData = await fetchRealTimeData(region);
    
    // Convert timeframe to standardized periods
    const standardizedTimeframe = timeframe.includes('15') ? '15 days' : 
                                 timeframe.includes('30') ? '30 days' : 
                                 timeframe.includes('60') ? '60 days' : '30 days';

    const prompt = `
You are an expert healthcare demand forecasting analyst with access to real-time market data, pharmaceutical intelligence, and medical sector expertise.

Generate professional demand predictions for healthcare/pharmaceutical sector in ${region}, India for the next ${standardizedTimeframe}.

Real-time Market Context:
${JSON.stringify(realTimeData, null, 2)}

HEALTHCARE SUBCATEGORIES FOR FORECASTING:

1. RESPIRATORY MEDICATIONS:
   - Bronchodilators: Salbutamol, Budesonide, Formoterol, Tiotropium
   - Inhaled Corticosteroids: Beclomethasone, Fluticasone, Mometasone
   - Cough Suppressants: Dextromethorphan, Codeine-based syrups
   - Mucolytics: Acetylcysteine, Ambroxol, Guaifenesin
   - Anti-histamines: Cetirizine, Loratadine, Montelukast, Fexofenadine

2. CARDIOVASCULAR PHARMACEUTICALS:
   - ACE Inhibitors: Enalapril, Lisinopril, Ramipril, Captopril
   - Beta Blockers: Metoprolol, Atenolol, Propranolol, Carvedilol
   - Statins: Atorvastatin, Rosuvastatin, Simvastatin, Pravastatin
   - Anticoagulants: Warfarin, Clopidogrel, Rivaroxaban, Dabigatran
   - Calcium Channel Blockers: Amlodipine, Nifedipine, Diltiazem

3. NEUROLOGICAL MEDICATIONS:
   - Antidepressants: Sertraline, Fluoxetine, Escitalopram, Venlafaxine
   - Anticonvulsants: Phenytoin, Carbamazepine, Levetiracetam, Lamotrigine
   - Pain Management: Tramadol, Gabapentin, Pregabalin, Morphine
   - Anti-anxiety: Alprazolam, Clonazepam, Lorazepam, Diazepam
   - Migraine Medications: Sumatriptan, Rizatriptan, Topiramate

4. ENDOCRINE & METABOLIC:
   - Diabetes Medications: Metformin, Glimepiride, Sitagliptin, Insulin variants
   - Thyroid Medications: Levothyroxine, Carbimazole, Methimazole
   - Hormone Replacement: Estradiol patches, Testosterone gels
   - Bone Health: Alendronate, Calcitriol, Calcium supplements

5. GASTROENTEROLOGY:
   - Proton Pump Inhibitors: Omeprazole, Pantoprazole, Esomeprazole
   - Antacids: Aluminum hydroxide, Magnesium hydroxide combinations
   - Digestive Enzymes: Pancreatin, Alpha-galactosidase
   - Anti-diarrheals: Loperamide, Racecadotril

6. MEDICAL EQUIPMENT & DEVICES:
   - Diagnostic Devices: Digital glucometers, BP monitors, Pulse oximeters, Thermometers
   - Surgical Instruments: Disposable scalpels, Laparoscopic tools, Suture materials
   - Emergency Equipment: Portable oxygen concentrators, Nebulizers, Defibrillators
   - Rehabilitation Aids: Prosthetics, Orthotics, Mobility aids, Physiotherapy equipment

7. MEDICAL SUPPLIES & CONSUMABLES:
   - PPE: N95 masks, Nitrile gloves, Face shields, Surgical gowns
   - Wound Care: Hydrocolloid dressings, Antiseptic solutions, Gauze bandages
   - Disposables: Sterile syringes, IV catheters, Blood collection tubes
   - Laboratory Supplies: Rapid test kits, Culture media, Reagents

FORECASTING REQUIREMENTS:

1. NEWS & MARKET INTEGRATION:
   - Analyze recent pharmaceutical news affecting ${region}
   - Consider government healthcare policies and budget changes
   - Factor in disease outbreak reports and public health alerts
   - Include impact of new drug approvals or recalls
   - Account for healthcare infrastructure developments

2. DEMAND VARIATION PATTERNS:
   - Increases: 5-30% for items with positive clinical evidence, policy support, or outbreak-related needs
   - Decreases: 5-25% due to policy restrictions, better alternatives, or reduced disease prevalence
   - Stable: ±3% for established medications with consistent demand patterns
   - Include specific rationale for each prediction

3. PROFESSIONAL FORECASTING CRITERIA:
   - Base predictions on epidemiological data and disease surveillance
   - Consider seasonal disease patterns (monsoon illnesses, winter respiratory issues)
   - Factor in demographic health trends and aging population
   - Account for healthcare accessibility and insurance coverage changes
   - Include supply chain considerations and manufacturer capacity

4. TIMEFRAME SPECIFICATIONS:
   - 15 days: Focus on immediate needs, emergency supplies, acute conditions
   - 30 days: Standard forecasting for chronic medications and routine supplies
   - 60 days: Strategic planning for seasonal preparation and bulk procurement

Generate exactly 10 diverse predictions covering multiple therapeutic areas with specific brand names or generic drug names.

Respond with JSON array in this exact format:
[{
  "itemName": "string (specific medication/device name with strength/specification)",
  "department": "string (e.g., 'Cardiology Department', 'Emergency Department', 'Respiratory Department')",
  "category": "string (Pharmaceuticals/Medical Equipment/Medical Supplies)",
  "subcategory": "string (specific therapeutic area)", 
  "currentDemand": number (baseline units per month for region),
  "predictedDemand": number (forecasted units for timeframe),
  "demandChangePercentage": number (percentage change as number, e.g., 15.5 for 15.5% increase, -8.2 for 8.2% decrease),
  "demandTrend": "string (increase/decrease/no change)",
  "confidence": number (0.65-0.95 based on data quality),
  "peakPeriod": "${standardizedTimeframe}",
  "reasoning": "string (detailed clinical and market rationale with percentage context)",
  "marketFactors": ["string (specific market drivers)"],
  "recommendations": ["string (actionable business and clinical recommendations)"],
  "newsImpact": "string (specific news or policy affecting this item)",
  "seasonalFactor": "string (seasonal disease or climate influence)",
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
    console.error('Error generating healthcare predictions:', error);
    throw new Error(`Failed to generate healthcare demand forecast: ${error}`);
  }
}