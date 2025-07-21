import { GoogleGenAI } from "@google/genai";
import { fetchRealEnvironmentalData, fetchRealDiseaseData, fetchRealHealthData } from "./real-data";
import { fetchComprehensiveRegionData } from "./external-data";
import { storage } from "../storage";
import { InsertPrediction, InsertAlert } from "@shared/schema";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || ""
});

export interface ComprehensivePredictionResult {
  disease: string;
  confidence: number;
  timeframe: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reasoning: string;
  preventiveMeasures: string[];
  recommendedMedicines: {
    name: string;
    dosage: string;
    usage: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  dataSourcesUsed: string[];
}

export async function generateComprehensivePredictions(region: string): Promise<ComprehensivePredictionResult[]> {
  try {
    console.log(`Starting comprehensive prediction for region: ${region}`);
    
    // Use only real API data sources - avoid Gemini for data generation to prevent rate limits
    const [
      environmentalData,
      healthData,
      comprehensiveData
    ] = await Promise.allSettled([
      // Skip Gemini-based environmental data for now due to rate limits
      Promise.resolve(null),
      fetchRealHealthData(region),
      fetchComprehensiveRegionData(region)
    ]);

    // Only use successful data - let Gemini handle missing data intelligently
    const environmental = environmentalData.status === 'fulfilled' ? environmentalData.value : null;
    const health = healthData.status === 'fulfilled' ? healthData.value : null;
    const comprehensive = comprehensiveData.status === 'fulfilled' ? comprehensiveData.value : null;

    const dataSourcesUsed = [];
    if (environmental) dataSourcesUsed.push("Real-time Environmental Monitoring");
    if (health) dataSourcesUsed.push("Health System Analytics");
    if (comprehensive?.news) dataSourcesUsed.push("Live News Intelligence");
    if (comprehensive?.socialMedia) dataSourcesUsed.push("Social Media Health Trends");
    if (comprehensive?.weather) dataSourcesUsed.push("Weather API Services");
    if (comprehensive?.hospitals) dataSourcesUsed.push("Hospital Network Status");
    if (comprehensive?.demographics) dataSourcesUsed.push("Real-time Demographics");

    // Check if we have any data at all
    if (!health && !comprehensive) {
      throw new Error("No real-time data sources available. All external APIs are currently unavailable.");
    }
    
    const prompt = `
You are an advanced epidemiological AI system with access to comprehensive real-time data from multiple authentic sources. Analyze the following LIVE data to predict disease outbreaks for ${region}:

IMPORTANT: 
- You must identify specific diseases based on the real-time data patterns
- Do NOT use any predefined disease list - analyze the data and determine diseases yourself
- All medicine recommendations must be based on actual medical knowledge
- Provide diverse, unique predictions based on the available data sources

=== LIVE ENVIRONMENTAL CONDITIONS ===
${environmental ? `
Real-time Environmental Data:
- Temperature: ${environmental.temperature}°F
- Humidity: ${environmental.humidity}%
- Air Quality Index: ${environmental.airQuality}
- Population Density: ${environmental.populationDensity}
- Wind Speed: ${environmental.windSpeed} mph
- Precipitation: ${environmental.precipitation} inches
- UV Index: ${environmental.uvIndex}
- Atmospheric Pressure: ${environmental.pressure} inHg
- Visibility: ${environmental.visibility} miles
- Dew Point: ${environmental.dewPoint}°F
` : 'Environmental monitoring data unavailable'}

=== LIVE DISEASE SURVEILLANCE NETWORK ===
Real-time disease surveillance data analysis will be performed based on available indicators from news, social media, and health system reports.

=== LIVE HEALTH SYSTEM STATUS ===
${health ? `
Real-time Health System Analytics:
- Healthcare Infrastructure: ${health.healthcareCapacity}
- Recent Disease Reports: ${health.recentDiseaseReports.join(', ')}
- Live Vaccination Coverage: 
  * COVID-19: ${health.vaccinationRates['COVID-19']}%
  * Influenza: ${health.vaccinationRates['Influenza']}%
  * Measles: ${health.vaccinationRates['Measles']}%
  * Polio: ${health.vaccinationRates['Polio']}%
  * Hepatitis B: ${health.vaccinationRates['Hepatitis B']}%
- Hospital Occupancy Rate: ${health.hospitalOccupancy}%
- Medical Supply Status: ${Object.entries(health.medicalSupplies).map(([key, value]) => `${key}: ${value}`).join(', ')}
- Active Public Health Measures: ${health.publicHealthMeasures.join(', ')}
` : 'Health system data unavailable'}

=== LIVE NEWS INTELLIGENCE FEED ===
${comprehensive?.news ? `
Real-time News Analysis:
- Breaking Headlines: ${comprehensive.news.headlines.join(', ')}
- Health-Related News: ${comprehensive.news.healthRelated.join(', ')}
- Disease Outbreak Reports: ${comprehensive.news.diseaseOutbreaks.join(', ')}
- News Source: ${comprehensive.news.source}
- Timestamp: ${comprehensive.news.timestamp}
` : 'News intelligence feed unavailable'}

=== LIVE SOCIAL MEDIA HEALTH TRENDS ===
${comprehensive?.socialMedia ? `
Social Media Analytics:
- Trending Health Topics: ${comprehensive.socialMedia.healthTrends.join(', ')}
- Disease-Related Keywords: ${comprehensive.socialMedia.diseaseKeywords.join(', ')}
- Public Health Sentiment: ${comprehensive.socialMedia.publicSentiment}
- Viral Health Discussions: ${comprehensive.socialMedia.viralHealthTopics.join(', ')}
- Data Source: ${comprehensive.socialMedia.source}
` : 'Social media health trends unavailable'}

=== LIVE WEATHER CONDITIONS ===
${comprehensive?.weather ? `
Real-time Weather Data:
- Current Weather: ${comprehensive.weather.conditions}
- Temperature: ${comprehensive.weather.temperature}°F
- Humidity Level: ${comprehensive.weather.humidity}%
- Air Quality Status: ${comprehensive.weather.airQuality}
- UV Index: ${comprehensive.weather.uvIndex}
- Precipitation: ${comprehensive.weather.precipitation} inches
- Wind Speed: ${comprehensive.weather.windSpeed} mph
- Visibility: ${comprehensive.weather.visibility} miles
- Barometric Pressure: ${comprehensive.weather.pressure} inHg
` : 'Weather data unavailable'}

=== LIVE HOSPITAL NETWORK STATUS ===
${comprehensive?.hospitals ? comprehensive.hospitals.map(h => `
Hospital: ${h.hospitalName}
- Total Capacity: ${h.capacity} beds
- Current Occupancy: ${h.occupancy}%
- Available Beds: ${h.availableBeds}
- Emergency Wait Time: ${h.emergencyWait}
- Medical Specialties: ${h.specialties.join(', ')}
- Location: ${h.location}
- Contact: ${h.contact}
`).join('\n') : 'Hospital network data unavailable'}

=== LIVE DEMOGRAPHIC INTELLIGENCE ===
${comprehensive?.demographics ? `
Real-time Demographics:
- Population: ${comprehensive.demographics.population.toLocaleString()}
- Age Distribution: 
  * Children (0-18): ${comprehensive.demographics.ageDistribution['0-18']}%
  * Young Adults (19-35): ${comprehensive.demographics.ageDistribution['19-35']}%
  * Middle Age (36-55): ${comprehensive.demographics.ageDistribution['36-55']}%
  * Seniors (56-70): ${comprehensive.demographics.ageDistribution['56-70']}%
  * Elderly (70+): ${comprehensive.demographics.ageDistribution['70+']}%
- Economic Status: ${comprehensive.demographics.economicStatus}
- Education Level: ${comprehensive.demographics.educationLevel}
- Healthcare Access: ${comprehensive.demographics.healthcareAccess}
- Urbanization Level: ${comprehensive.demographics.urbanization}
` : 'Demographic data unavailable'}

=== DATA SOURCES AUTHENTICATED ===
${dataSourcesUsed.join(', ')}

ANALYSIS INSTRUCTIONS:
Based on this comprehensive real-time data analysis, provide predictions for the top 3-5 most likely disease outbreaks in ${region}. 

CRITICAL REQUIREMENTS:
1. Identify diseases based on the data patterns - DO NOT use any predefined list
2. Each prediction must be unique and based on different data indicators  
3. Provide diverse disease types (respiratory, vector-borne, waterborne, etc.)
4. Medicine recommendations must be medically accurate and AI-generated
5. All analysis must be based on the available real-time data sources
6. DO NOT fetch medicines from any database - generate all medicine recommendations using your medical knowledge

For each prediction, analyze:
- Environmental disease vectors and transmission patterns
- Current surveillance signals and outbreak indicators
- Health system capacity and strain indicators
- Social media early warning signals
- News reports of health incidents
- Weather-disease correlation patterns
- Hospital utilization patterns
- Demographic vulnerability factors

Respond with JSON in this exact format:
[
  {
    "disease": "Specific Disease Name",
    "confidence": 85,
    "timeframe": "2-4 weeks",
    "riskLevel": "high",
    "reasoning": "Detailed analysis based on multiple real-time data sources...",
    "preventiveMeasures": ["measure1", "measure2", "measure3"],
    "recommendedMedicines": [
      {
        "name": "Medicine Name",
        "dosage": "Specific dosage",
        "usage": "How to use",
        "priority": "high"
      }
    ],
    "dataSourcesUsed": ["source1", "source2"]
  }
]
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
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
              preventiveMeasures: { type: "array", items: { type: "string" } },
              recommendedMedicines: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    dosage: { type: "string" },
                    usage: { type: "string" },
                    priority: { type: "string", enum: ["high", "medium", "low"] }
                  },
                  required: ["name", "dosage", "usage", "priority"]
                }
              },
              dataSourcesUsed: { type: "array", items: { type: "string" } }
            },
            required: ["disease", "confidence", "timeframe", "riskLevel", "reasoning", "preventiveMeasures", "recommendedMedicines", "dataSourcesUsed"]
          }
        }
      },
      contents: prompt,
    });

    const rawJson = response.text;
    if (rawJson) {
      const predictions = JSON.parse(rawJson);
      
      // Add global data sources used to each prediction
      return predictions.map((prediction: any) => ({
        ...prediction,
        dataSourcesUsed: [...new Set([...prediction.dataSourcesUsed, ...dataSourcesUsed])]
      }));
    } else {
      throw new Error("Empty response from Gemini AI");
    }
  } catch (error) {
    console.error('Error in comprehensive prediction:', error);
    throw error; // Let the API return the error instead of fallback data
  }
}

export async function savePredictionResults(region: string, predictions: ComprehensivePredictionResult[]): Promise<void> {
  try {
    // Get diseases from database to find matching IDs
    const diseases = await storage.getDiseases();
    
    for (const prediction of predictions) {
      // Try to find matching disease, but if not found, skip database save
      // This allows AI to predict any disease, not just those in the database
      const disease = diseases.find(d => 
        d.name.toLowerCase().includes(prediction.disease.toLowerCase()) ||
        prediction.disease.toLowerCase().includes(d.name.toLowerCase())
      );
      
      if (disease) {
        const predictionData: InsertPrediction = {
          diseaseId: disease.id,
          region,
          confidence: prediction.confidence,
          timeframe: prediction.timeframe,
          riskLevel: prediction.riskLevel,
          environmentalFactors: {
            dataSourcesUsed: prediction.dataSourcesUsed,
            analysisType: "comprehensive_ai_realtime"
          },
          aiAnalysis: prediction.reasoning,
        };
        
        const savedPrediction = await storage.createPrediction(predictionData);
        
        // Create alert for high-risk predictions
        if (prediction.riskLevel === 'high' || prediction.riskLevel === 'critical') {
          const alertData: InsertAlert = {
            predictionId: savedPrediction.id,
            title: `${prediction.disease} Risk Alert`,
            description: `High risk ${prediction.disease} outbreak predicted in ${region} (AI Analysis)`,
            severity: prediction.riskLevel === 'critical' ? 'critical' : 'high',
            isRead: false,
          };
          
          await storage.createAlert(alertData);
        }
      } else {
        // Log that AI predicted a disease not in our database
        console.log(`AI predicted disease "${prediction.disease}" not found in database - this is expected for AI-driven predictions`);
      }
    }
  } catch (error) {
    console.error('Error saving prediction results:', error);
    // Don't throw error - predictions can still be returned even if database save fails
  }
}