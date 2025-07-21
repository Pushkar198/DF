import { storage } from "../storage";
import { generateDiseasePredictin, analyzeMedicineRecommendations, generateInsights } from "./gemini";
import { InsertPrediction, InsertAlert, InsertEnvironmentalData } from "@shared/schema";
import { fetchRealEnvironmentalData } from "./real-data";

export interface PredictionMetrics {
  activePredictions: number;
  highRiskAlerts: number;
  avgConfidence: number;
  medicinesRecommended: number;
}

export async function generatePredictionsForRegion(region: string): Promise<any> {
  try {
    // Get real-time environmental data for the region
    const realEnvironmentalData = await fetchRealEnvironmentalData(region);
    
    // Store in database for caching
    let environmentalData = await storage.getEnvironmentalData(region);
    if (!environmentalData) {
      const environmentalDataRecord: InsertEnvironmentalData = {
        region,
        temperature: realEnvironmentalData.temperature,
        humidity: realEnvironmentalData.humidity,
        airQuality: realEnvironmentalData.airQuality,
        populationDensity: realEnvironmentalData.populationDensity,
        data: {
          windSpeed: realEnvironmentalData.windSpeed,
          precipitation: realEnvironmentalData.precipitation,
          uvIndex: realEnvironmentalData.uvIndex,
          pressure: realEnvironmentalData.pressure,
          visibility: realEnvironmentalData.visibility,
          dewPoint: realEnvironmentalData.dewPoint
        }
      };
      environmentalData = await storage.createEnvironmentalData(environmentalDataRecord);
    }

    // Get available diseases and historical data
    const diseases = await storage.getDiseases();
    const historicalPredictions = await storage.getRecentPredictions(region, 5);

    // Generate AI predictions
    const aiPredictions = await generateDiseasePredictin({
      region,
      historicalData: historicalPredictions,
      environmentalData,
      diseases,
    });

    // Save predictions to database
    const savedPredictions = [];
    for (const aiPrediction of aiPredictions) {
      // Find the disease in our database
      const disease = diseases.find(d => d.name.toLowerCase().includes(aiPrediction.disease.toLowerCase()));
      
      if (disease) {
        const predictionData: InsertPrediction = {
          diseaseId: disease.id,
          region,
          confidence: aiPrediction.confidence,
          timeframe: aiPrediction.timeframe,
          riskLevel: aiPrediction.riskLevel,
          environmentalFactors: {
            temperature: realEnvironmentalData.temperature,
            humidity: realEnvironmentalData.humidity,
            airQuality: realEnvironmentalData.airQuality,
            populationDensity: realEnvironmentalData.populationDensity,
            windSpeed: realEnvironmentalData.windSpeed,
            precipitation: realEnvironmentalData.precipitation,
            uvIndex: realEnvironmentalData.uvIndex,
            pressure: realEnvironmentalData.pressure,
            visibility: realEnvironmentalData.visibility,
            dewPoint: realEnvironmentalData.dewPoint
          },
          aiAnalysis: aiPrediction.reasoning,
        };

        const savedPrediction = await storage.createPrediction(predictionData);
        savedPredictions.push(savedPrediction);

        // Create alert for high-risk predictions
        if (aiPrediction.riskLevel === 'high' || aiPrediction.riskLevel === 'critical') {
          const alertData: InsertAlert = {
            userId: null,
            predictionId: savedPrediction.id,
            title: `${aiPrediction.riskLevel.toUpperCase()} Risk ${aiPrediction.disease} Outbreak Predicted`,
            description: `AI model indicates ${(aiPrediction.confidence * 100).toFixed(0)}% probability of ${aiPrediction.disease} outbreak in ${region} within the ${aiPrediction.timeframe.toLowerCase()}. ${aiPrediction.reasoning}`,
            severity: aiPrediction.riskLevel === 'critical' ? 'critical' : 'warning',
          };

          await storage.createAlert(alertData);
        }
      }
    }

    return {
      predictions: savedPredictions,
      environmentalData: realEnvironmentalData,
      aiInsights: await generateInsights(savedPredictions, environmentalData),
    };
  } catch (error) {
    console.error('Error generating predictions:', error);
    throw error;
  }
}

export async function getPredictionMetrics(region?: string): Promise<PredictionMetrics> {
  try {
    const predictions = await storage.getPredictions(region);
    const alerts = await storage.getAlerts();
    const medicines = await storage.getMedicines();

    const highRiskAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'warning').length;
    const activePredictions = predictions.length;
    const avgConfidence = predictions.length > 0 
      ? predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length 
      : 0;
    const medicinesRecommended = medicines.length;

    return {
      activePredictions,
      highRiskAlerts,
      avgConfidence: Math.round(avgConfidence * 100),
      medicinesRecommended,
    };
  } catch (error) {
    console.error('Error getting prediction metrics:', error);
    throw error;
  }
}

export async function seedInitialData(): Promise<void> {
  try {
    // Check if we already have diseases
    const existingDiseases = await storage.getDiseases();
    if (existingDiseases.length === 0) {
      // Seed diseases
      const diseaseData = [
        {
          name: "Influenza A",
          description: "Seasonal flu virus causing respiratory illness",
          symptoms: ["fever", "cough", "body aches", "fatigue"],
          seasonalPattern: "Fall/Winter",
          transmissionType: "Airborne",
          incubationPeriod: "1-4 days",
        },
        {
          name: "Respiratory Syncytial Virus",
          description: "Common respiratory virus affecting lungs and breathing passages",
          symptoms: ["runny nose", "cough", "fever", "decreased appetite"],
          seasonalPattern: "Fall/Winter/Spring",
          transmissionType: "Airborne/Contact",
          incubationPeriod: "4-6 days",
        },
        {
          name: "Norovirus",
          description: "Highly contagious virus causing gastroenteritis",
          symptoms: ["nausea", "vomiting", "diarrhea", "stomach cramps"],
          seasonalPattern: "Winter",
          transmissionType: "Contact/Food",
          incubationPeriod: "12-48 hours",
        },
      ];

      for (const disease of diseaseData) {
        await storage.createDisease(disease);
      }

      // Seed medicines
      const medicines = [
        {
          name: "Oseltamivir (Tamiflu)",
          description: "Antiviral medication for influenza treatment and prevention",
          dosage: "75mg capsules, twice daily for 5 days",
          contraindications: ["severe kidney disease", "allergic reactions"],
          stockLevel: "high",
          diseaseId: 1, // Influenza A
        },
        {
          name: "Palivizumab",
          description: "Monoclonal antibody for RSV prevention in high-risk infants",
          dosage: "15mg/kg intramuscular injection monthly",
          contraindications: ["hypersensitivity", "severe illness"],
          stockLevel: "low",
          diseaseId: 2, // RSV
        },
        {
          name: "Oral Rehydration Salts",
          description: "Electrolyte replacement for dehydration treatment",
          dosage: "1 packet dissolved in 1 liter of clean water",
          contraindications: ["severe vomiting", "intestinal blockage"],
          stockLevel: "high",
          diseaseId: 3, // Norovirus
        },
      ];

      for (const medicine of medicines) {
        await storage.createMedicine(medicine);
      }

      console.log('Initial data seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
}
