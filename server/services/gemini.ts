import { GoogleGenAI } from "@google/genai";
import { EnvironmentalData, Disease, Prediction } from "@shared/schema";
import { fetchRealEnvironmentalData, fetchRealDiseaseData, fetchRealHealthData } from "./real-data";
import { fetchComprehensiveRegionData } from "./external-data";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "AIzaSyD_fPFEGtS73QS4E1HqEcyAweGGa-qglZI"
});

export interface PredictionInput {
  region: string;
  historicalData: any[];
  environmentalData: EnvironmentalData;
  diseases: Disease[];
  socialMediaSentiment?: any;
}

export interface PredictionResult {
  disease: string;
  confidence: number;
  timeframe: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reasoning: string;
  preventiveMeasures: string[];
}

export async function generateDiseasePredictin(input: PredictionInput): Promise<PredictionResult[]> {
  try {
    // Fetch comprehensive real-time data for the region
    const [realEnvironmentalData, realDiseaseData, realHealthData, comprehensiveData] = await Promise.all([
      fetchRealEnvironmentalData(input.region),
      fetchRealDiseaseData(input.region),
      fetchRealHealthData(input.region),
      fetchComprehensiveRegionData(input.region)
    ]);

    const prompt = `
You are an expert epidemiologist with access to real-time global disease surveillance data. Based on the following authentic data, predict potential disease outbreaks in the specified region.

Region: ${input.region}

REAL-TIME ENVIRONMENTAL DATA:
- Temperature: ${realEnvironmentalData.temperature}°F
- Humidity: ${realEnvironmentalData.humidity}%
- Air Quality: ${realEnvironmentalData.airQuality}
- Population Density: ${realEnvironmentalData.populationDensity}
- Wind Speed: ${realEnvironmentalData.windSpeed} mph
- Precipitation: ${realEnvironmentalData.precipitation} inches
- UV Index: ${realEnvironmentalData.uvIndex}
- Atmospheric Pressure: ${realEnvironmentalData.pressure} inHg
- Visibility: ${realEnvironmentalData.visibility} miles
- Dew Point: ${realEnvironmentalData.dewPoint}°F

REAL-TIME DISEASE SURVEILLANCE DATA:
${realDiseaseData.map(d => `
- ${d.disease}:
  Current Outbreaks: ${d.currentOutbreaks.join(', ')}
  Seasonal Pattern: ${d.seasonalPattern}
  Transmission: ${d.transmissionType}
  Incubation: ${d.incubationPeriod}
  Symptoms: ${d.symptoms.join(', ')}
  Risk Factors: ${d.riskFactors.join(', ')}
  Mortality: ${d.mortality}
  Affected Demographics: ${d.affectedDemographics.join(', ')}
`).join('\n')}

REAL-TIME HEALTH SYSTEM DATA:
- Healthcare Capacity: ${realHealthData.healthcareCapacity}
- Recent Disease Reports: ${realHealthData.recentDiseaseReports.join(', ')}
- Hospital Occupancy: ${realHealthData.hospitalOccupancy}%
- Vaccination Coverage: COVID-19: ${realHealthData.vaccinationRates['COVID-19']}%, Influenza: ${realHealthData.vaccinationRates['Influenza']}%, Measles: ${realHealthData.vaccinationRates['Measles']}%
- Medical Supply Levels: ${Object.entries(realHealthData.medicalSupplies).map(([key, value]) => `${key}: ${value}`).join(', ')}
- Public Health Measures: ${realHealthData.publicHealthMeasures.join(', ')}

REAL-TIME NEWS AND SOCIAL MEDIA DATA:
- Current News Headlines: ${comprehensiveData.news.headlines.join(', ')}
- Health-Related News: ${comprehensiveData.news.healthRelated.join(', ')}
- Disease Outbreak Reports: ${comprehensiveData.news.diseaseOutbreaks.join(', ')}
- Social Media Health Trends: ${comprehensiveData.socialMedia.healthTrends.join(', ')}
- Disease Keywords Trending: ${comprehensiveData.socialMedia.diseaseKeywords.join(', ')}
- Public Health Sentiment: ${comprehensiveData.socialMedia.publicSentiment}
- Viral Health Topics: ${comprehensiveData.socialMedia.viralHealthTopics.join(', ')}

REAL-TIME WEATHER DATA:
- Current Conditions: ${comprehensiveData.weather.conditions}
- Temperature: ${comprehensiveData.weather.temperature}°F
- Humidity: ${comprehensiveData.weather.humidity}%
- Air Quality: ${comprehensiveData.weather.airQuality}
- UV Index: ${comprehensiveData.weather.uvIndex}
- Precipitation: ${comprehensiveData.weather.precipitation} inches

HOSPITAL AND HEALTHCARE DATA:
${comprehensiveData.hospitals.map(h => `
- ${h.hospitalName}: ${h.occupancy}% occupancy, ${h.availableBeds} beds available, ${h.emergencyWait} wait time
  Specialties: ${h.specialties.join(', ')}
`).join('')}

DEMOGRAPHIC DATA:
- Population: ${comprehensiveData.demographics.population.toLocaleString()}
- Age Distribution: 0-18: ${comprehensiveData.demographics.ageDistribution['0-18']}%, 19-35: ${comprehensiveData.demographics.ageDistribution['19-35']}%, 36-55: ${comprehensiveData.demographics.ageDistribution['36-55']}%, 56-70: ${comprehensiveData.demographics.ageDistribution['56-70']}%, 70+: ${comprehensiveData.demographics.ageDistribution['70+']}%
- Economic Status: ${comprehensiveData.demographics.economicStatus}
- Healthcare Access: ${comprehensiveData.demographics.healthcareAccess}
- Urbanization: ${comprehensiveData.demographics.urbanization}

HISTORICAL CONTEXT:
${input.historicalData.length > 0 ? `Recent predictions: ${JSON.stringify(input.historicalData.slice(0, 3))}` : 'No historical data available'}

Based on this comprehensive real-time data from multiple authentic sources, predict the top 3 most likely disease outbreaks in this region. Consider:
1. Current environmental conditions and their impact on disease transmission
2. Seasonal patterns and current outbreak trends
3. Population density and healthcare capacity
4. Disease transmission characteristics and incubation periods
5. Current vaccination coverage and medical supply levels
6. Recent disease surveillance reports

Respond with JSON array in this exact format:
[
  {
    "disease": "Disease Name",
    "confidence": 0.85,
    "timeframe": "Next 7-14 days",
    "riskLevel": "high",
    "reasoning": "Detailed explanation based on real-time data why this outbreak is predicted",
    "preventiveMeasures": ["measure1", "measure2", "measure3"]
  }
]
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              disease: { type: "string" },
              confidence: { type: "number" },
              timeframe: { type: "string" },
              riskLevel: { type: "string", enum: ["low", "medium", "high", "critical"] },
              reasoning: { type: "string" },
              preventiveMeasures: { type: "array", items: { type: "string" } }
            },
            required: ["disease", "confidence", "timeframe", "riskLevel", "reasoning", "preventiveMeasures"]
          }
        }
      },
      contents: prompt,
    });

    const rawJson = response.text;
    if (rawJson) {
      const predictions: PredictionResult[] = JSON.parse(rawJson);
      return predictions;
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error) {
    console.error('Gemini prediction error:', error);
    throw new Error(`Failed to generate disease predictions: ${error}`);
  }
}

export async function analyzeMedicineRecommendations(diseaseNames: string[], region: string): Promise<any[]> {
  try {
    // Fetch real-time health data for the region
    const realHealthData = await fetchRealHealthData(region);

    const prompt = `
As a medical expert with access to real-time health system data, recommend appropriate medicines and treatments for the following predicted disease outbreaks in ${region}:

Diseases: ${diseaseNames.join(', ')}

REAL-TIME HEALTH SYSTEM DATA:
- Healthcare Capacity: ${realHealthData.healthcareCapacity}
- Hospital Occupancy: ${realHealthData.hospitalOccupancy}%
- Current Medical Supply Levels: ${Object.entries(realHealthData.medicalSupplies).map(([key, value]) => `${key}: ${value}`).join(', ')}
- Vaccination Coverage: COVID-19: ${realHealthData.vaccinationRates['COVID-19']}%, Influenza: ${realHealthData.vaccinationRates['Influenza']}%, Measles: ${realHealthData.vaccinationRates['Measles']}%
- Recent Disease Reports: ${realHealthData.recentDiseaseReports.join(', ')}
- Active Public Health Measures: ${realHealthData.publicHealthMeasures.join(', ')}

Based on this real-time health system data, for each disease provide:
1. Primary medicine recommendations prioritized by current stock levels
2. Dosage guidelines appropriate for regional demographics
3. Stock priority level considering current supply chain status
4. Alternative treatments available in the region
5. Special considerations based on healthcare capacity and current conditions

Respond with JSON array format:
[
  {
    "disease": "Disease Name",
    "medicines": [
      {
        "name": "Medicine Name",
        "dosage": "Dosage info",
        "stockPriority": "high/medium/low",
        "indication": "Specific use case",
        "contraindications": ["contraindication1", "contraindication2"],
        "availability": "Based on current supply levels"
      }
    ],
    "alternatives": ["alternative1", "alternative2"],
    "regionalConsiderations": "Region-specific notes based on real health data",
    "supplyChainImpact": "How current supply levels affect recommendations"
  }
]
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              disease: { type: "string" },
              medicines: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    dosage: { type: "string" },
                    stockPriority: { type: "string" },
                    indication: { type: "string" },
                    contraindications: { type: "array", items: { type: "string" } },
                    availability: { type: "string" }
                  },
                  required: ["name", "dosage", "stockPriority", "indication", "contraindications", "availability"]
                }
              },
              alternatives: { type: "array", items: { type: "string" } },
              regionalConsiderations: { type: "string" },
              supplyChainImpact: { type: "string" }
            },
            required: ["disease", "medicines", "alternatives", "regionalConsiderations", "supplyChainImpact"]
          }
        }
      },
      contents: prompt,
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error) {
    console.error('Medicine recommendation error:', error);
    throw new Error(`Failed to analyze medicine recommendations: ${error}`);
  }
}

export async function generateInsights(predictions: Prediction[], environmentalData: EnvironmentalData): Promise<string> {
  try {
    const region = environmentalData.region;
    
    // Fetch real-time data for more comprehensive insights
    const [realEnvironmentalData, realHealthData] = await Promise.all([
      fetchRealEnvironmentalData(region),
      fetchRealHealthData(region)
    ]);

    const prompt = `
As a public health expert with access to real-time surveillance data, provide key insights and actionable recommendations for healthcare professionals based on the following comprehensive data:

DISEASE PREDICTIONS:
${predictions.map(p => `- ${p.demandLevel.toUpperCase()} demand prediction with ${p.confidence}% confidence`).join('\n')}

REAL-TIME ENVIRONMENTAL CONDITIONS:
- Temperature: ${realEnvironmentalData.temperature}°F
- Humidity: ${realEnvironmentalData.humidity}%
- Air Quality: ${realEnvironmentalData.airQuality}
- Population Density: ${realEnvironmentalData.populationDensity}
- Wind Speed: ${realEnvironmentalData.windSpeed} mph
- UV Index: ${realEnvironmentalData.uvIndex}
- Atmospheric Pressure: ${realEnvironmentalData.pressure} inHg

REAL-TIME HEALTH SYSTEM STATUS:
- Healthcare Capacity: ${realHealthData.healthcareCapacity}
- Hospital Occupancy: ${realHealthData.hospitalOccupancy}%
- Medical Supply Levels: ${Object.entries(realHealthData.medicalSupplies).map(([key, value]) => `${key}: ${value}`).join(', ')}
- Recent Disease Reports: ${realHealthData.recentDiseaseReports.join(', ')}
- Current Public Health Measures: ${realHealthData.publicHealthMeasures.join(', ')}

Based on this real-time data, provide:
1. Key insights connecting environmental conditions to disease risk
2. Specific recommendations for healthcare preparedness
3. Priority actions based on current health system capacity
4. Risk mitigation strategies considering current conditions

Provide a comprehensive but concise summary (4-5 sentences) with actionable insights for healthcare professionals.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    return response.text || "No insights available at this time.";
  } catch (error) {
    console.error('Insights generation error:', error);
    return "Unable to generate insights due to AI service error.";
  }
}
