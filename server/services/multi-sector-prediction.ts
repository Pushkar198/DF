import { generateHealthcareDemandForecast, HealthcareDemandInput } from "./sectors/healthcare";
import { generateAutomobileDemandForecast, AutomobileDemandInput } from "./sectors/automobile";
import { generateAgricultureDemandForecast, AgricultureDemandInput } from "./sectors/agriculture";
import { storage } from "../storage";
import { InsertPrediction, InsertAlert } from "@shared/schema";

export interface SectorForecastInput {
  sector: 'healthcare' | 'automobile' | 'agriculture';
  region: string;
  timeframe: string;
  sectorSpecificData?: any;
}

export async function generateSectorDemandForecast(input: SectorForecastInput) {
  try {
    let predictions: any[] = [];

    switch (input.sector) {
      case 'healthcare':
        const healthcareInput: HealthcareDemandInput = {
          region: input.region,
          timeframe: input.timeframe,
          demographics: input.sectorSpecificData?.demographics || {
            children: 25000,
            adults: 60000,
            elderly: 15000
          }
        };
        predictions = await generateHealthcareDemandForecast(healthcareInput);
        break;

      case 'automobile':
        const automobileInput: AutomobileDemandInput = {
          region: input.region,
          timeframe: input.timeframe,
          demographics: input.sectorSpecificData?.demographics || {
            urbanPopulation: 70000,
            ruralPopulation: 30000,
            averageIncome: 50000
          }
        };
        predictions = await generateAutomobileDemandForecast(automobileInput);
        break;

      case 'agriculture':
        const agricultureInput = {
          region: input.region,
          timeframe: input.timeframe,
          cropCycle: input.sectorSpecificData?.cropCycle || 'kharif' as 'kharif' | 'rabi' | 'zaid',
          farmingType: input.sectorSpecificData?.farmingType || 'smallholder' as 'smallholder' | 'commercial' | 'organic'
        };
        predictions = await generateAgricultureDemandForecast(agricultureInput);
        break;

      default:
        throw new Error(`Unsupported sector: ${input.sector}`);
    }

    // Save predictions to database
    const savedPredictions = [];
    for (const prediction of predictions) {
      // Find the demand item
      const demandItems = await storage.getDemandItems(input.sector);
      const demandItem = demandItems.find(item => 
        item.name.toLowerCase().includes(prediction.medicine?.toLowerCase() || 
                                        prediction.vehicle?.toLowerCase() || 
                                        prediction.product?.toLowerCase() || '')
      );

      const predictionData: InsertPrediction = {
        sector: input.sector,
        itemId: demandItem?.id,
        region: input.region,
        confidence: prediction.confidence,
        timeframe: input.timeframe,
        demandLevel: prediction.demandLevel || 
                    (prediction.confidence > 0.8 ? 'high' : 
                     prediction.confidence > 0.6 ? 'medium' : 'low'),
        demandQuantity: prediction.demandQuantity,
        environmentalFactors: {},
        marketFactors: {},
        aiAnalysis: prediction.reasoning || prediction.epidemicImpact || prediction.policyImpact
      };

      const savedPrediction = await storage.createPrediction(predictionData);
      savedPredictions.push(savedPrediction);

      // Create alert for high-confidence or critical predictions
      if (prediction.confidence > 0.8 || prediction.demandLevel === 'critical') {
        const alertData: InsertAlert = {
          predictionId: savedPrediction.id,
          sector: input.sector,
          title: `High Demand Alert: ${prediction.medicine || prediction.vehicle || prediction.product}`,
          description: `${prediction.reasoning || prediction.epidemicImpact || prediction.policyImpact}`,
          severity: prediction.confidence > 0.9 ? 'critical' : 'warning'
        };

        await storage.createAlert(alertData);
      }
    }

    return savedPredictions;
  } catch (error) {
    console.error('Error generating sector demand forecast:', error);
    throw error;
  }
}