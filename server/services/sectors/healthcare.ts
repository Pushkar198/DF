import { GoogleGenAI } from "@google/genai";
import { DemandItem, ContextualData, InsertPrediction } from "@shared/schema";
import { fetchComprehensiveRegionData } from "../external-data";
import { fetchRealHealthData, fetchRealDiseaseData } from "../real-data";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GOOGLE_API_KEY || ""
});

export interface HealthcareDemandInput {
  region: string;
  timeframe: string;
  demographics: {
    children: number;
    adults: number;
    elderly: number;
  };
}

export interface MedicineDemandResult {
  medicine: string;
  ageGroup: 'children' | 'adults' | 'elderly';
  dosageForm: 'tablet' | 'syrup' | 'injection';
  severityLevel: 'mild' | 'moderate' | 'severe';
  demandQuantity: number;
  confidence: number;
  seasonalFactors: string[];
  epidemicImpact: string;
  reasoning: string;
}

export async function generateHealthcareDemandForecast(input: HealthcareDemandInput): Promise<MedicineDemandResult[]> {
  try {
    // Fetch real-time data
    const [comprehensiveData, healthData, diseaseData] = await Promise.all([
      fetchComprehensiveRegionData(input.region),
      fetchRealHealthData(input.region),
      fetchRealDiseaseData(input.region)
    ]);

    const prompt = `
You are an expert healthcare demand forecaster with access to real-time global health surveillance data. Predict medicine demand for the specified region based on authentic data.

Region: ${input.region}
Timeframe: ${input.timeframe}
Demographics: ${JSON.stringify(input.demographics)}

REAL-TIME HEALTH SYSTEM DATA:
- Healthcare Capacity: ${healthData.healthcareCapacity}
- Recent Disease Reports: ${healthData.recentDiseaseReports.join(', ')}
- Hospital Occupancy: ${healthData.hospitalOccupancy}%
- Vaccination Coverage: COVID-19: ${healthData.vaccinationRates['COVID-19']}%, Influenza: ${healthData.vaccinationRates['Influenza']}%, Measles: ${healthData.vaccinationRates['Measles']}%
- Medical Supply Levels: ${Object.entries(healthData.medicalSupplies).map(([key, value]) => `${key}: ${value}`).join(', ')}

DISEASE SURVEILLANCE DATA:
${diseaseData.map(d => `
- ${d.disease}:
  Current Outbreaks: ${d.currentOutbreaks.join(', ')}
  Seasonal Pattern: ${d.seasonalPattern}
  Transmission: ${d.transmissionType}
  Symptoms: ${d.symptoms.join(', ')}
  Affected Demographics: ${d.affectedDemographics.join(', ')}
`).join('\n')}

ENVIRONMENTAL & NEWS DATA:
- Weather Conditions: ${comprehensiveData.weather.conditions}
- Temperature: ${comprehensiveData.weather.temperature}°F
- Humidity: ${comprehensiveData.weather.humidity}%
- Air Quality: ${comprehensiveData.weather.airQuality}
- Health News: ${comprehensiveData.news.healthRelated.join(', ')}
- Disease Outbreak Reports: ${comprehensiveData.news.diseaseOutbreaks.join(', ')}

SOCIAL MEDIA HEALTH TRENDS:
- Health Keywords: ${comprehensiveData.socialMedia.diseaseKeywords.join(', ')}
- Public Sentiment: ${comprehensiveData.socialMedia.publicSentiment}

Based on this authentic data, predict medicine demand broken down by:

1. Age Groups: children (0-12), adults (13-64), elderly (65+)
2. Dosage Forms: tablet, syrup, injection
3. Severity Levels: mild, moderate, severe
4. Consider seasonal illnesses, regional health events, epidemic impact

For each medicine prediction, provide:
- Medicine name and category
- Target age group
- Recommended dosage form
- Condition severity level
- Estimated demand quantity (units needed)
- Confidence level (0-1)
- Seasonal factors affecting demand
- Epidemic/outbreak impact assessment
- Detailed reasoning based on the data

Respond with JSON array:
[{
  "medicine": "string",
  "ageGroup": "children|adults|elderly",
  "dosageForm": "tablet|syrup|injection", 
  "severityLevel": "mild|moderate|severe",
  "demandQuantity": number,
  "confidence": number,
  "seasonalFactors": ["factor1", "factor2"],
  "epidemicImpact": "string",
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
    console.error('Error generating healthcare demand forecast:', error);
    // Fallback to basic predictions
    return [
      {
        medicine: "Paracetamol",
        ageGroup: "adults",
        dosageForm: "tablet",
        severityLevel: "mild",
        demandQuantity: 1000,
        confidence: 0.75,
        seasonalFactors: ["Winter season increase", "Flu activity"],
        epidemicImpact: "Moderate increase due to seasonal patterns",
        reasoning: "Basic fallback prediction for common medicine"
      }
    ];
  }
}

export const healthcareItems = [
  // Pediatric medicines
  { name: "Paracetamol Syrup", category: "medicine", subcategory: "syrup", specifications: { ageGroup: "children", severityLevel: "mild" }},
  { name: "Amoxicillin Syrup", category: "medicine", subcategory: "syrup", specifications: { ageGroup: "children", severityLevel: "moderate" }},
  { name: "ORS Sachets", category: "medicine", subcategory: "powder", specifications: { ageGroup: "children", severityLevel: "mild" }},
  
  // Adult medicines
  { name: "Paracetamol Tablets", category: "medicine", subcategory: "tablet", specifications: { ageGroup: "adults", severityLevel: "mild" }},
  { name: "Ibuprofen Tablets", category: "medicine", subcategory: "tablet", specifications: { ageGroup: "adults", severityLevel: "moderate" }},
  { name: "Insulin Injection", category: "medicine", subcategory: "injection", specifications: { ageGroup: "adults", severityLevel: "severe" }},
  { name: "Blood Pressure Medication", category: "medicine", subcategory: "tablet", specifications: { ageGroup: "adults", severityLevel: "moderate" }},
  
  // Elderly medicines
  { name: "Aspirin Low Dose", category: "medicine", subcategory: "tablet", specifications: { ageGroup: "elderly", severityLevel: "mild" }},
  { name: "Calcium Supplements", category: "medicine", subcategory: "tablet", specifications: { ageGroup: "elderly", severityLevel: "mild" }},
  { name: "Heart Medication", category: "medicine", subcategory: "tablet", specifications: { ageGroup: "elderly", severityLevel: "severe" }},
  
  // Seasonal medicines
  { name: "Flu Vaccine", category: "vaccine", subcategory: "injection", specifications: { seasonal: "winter" }},
  { name: "Dengue Test Kits", category: "diagnostic", subcategory: "kit", specifications: { seasonal: "monsoon" }},
  { name: "Malaria Medication", category: "medicine", subcategory: "tablet", specifications: { seasonal: "monsoon" }},
];